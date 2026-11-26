import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { estimateReadTime, slugifyBlogTitle } from '@/lib/blogConstants';

function parseOptionalDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id, 10);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const [blog] = await db.select().from(blogs).where(eq(blogs.id, blogId)).limit(1);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Fetch blog by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id, 10);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const [existing] = await db.select().from(blogs).where(eq(blogs.id, blogId)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const nextIsPublished =
      typeof body.isPublished === 'boolean' ? body.isPublished : existing.isPublished;
    const title =
      typeof body.title === 'string' && body.title.trim()
        ? body.title.trim()
        : existing.title;
    const content =
      typeof body.content === 'string' ? body.content.trim() : existing.content;
    if (nextIsPublished && !content) {
      return NextResponse.json(
        { success: false, error: 'Article content is required before publishing' },
        { status: 400 },
      );
    }
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim() : existing.slug;
    const finalSlug = slugifyBlogTitle(rawSlug || title) || existing.slug;

    const excerpt =
      typeof body.excerpt === 'string'
        ? body.excerpt.trim() || title.slice(0, 160)
        : existing.excerpt;
    const category =
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim()
        : existing.category;
    const author =
      typeof body.author === 'string' && body.author.trim()
        ? body.author.trim()
        : existing.author;
    const coverImage =
      body.coverImage === null
        ? null
        : typeof body.coverImage === 'string'
        ? body.coverImage.trim() || null
        : existing.coverImage;
    const readTime =
      typeof body.readTime === 'string' && body.readTime.trim()
        ? body.readTime.trim()
        : existing.readTime || estimateReadTime(content);

    const documentUrl =
      body.documentUrl === null
        ? null
        : typeof body.documentUrl === 'string'
        ? body.documentUrl.trim() || null
        : existing.documentUrl;
    const documentName = documentUrl
      ? body.documentName === null
        ? null
        : typeof body.documentName === 'string'
        ? body.documentName.trim() || 'Attachment.pdf'
        : existing.documentName || 'Attachment.pdf'
      : null;
    const documentSize = documentUrl
      ? body.documentSize === null
        ? null
        : typeof body.documentSize === 'string'
        ? body.documentSize.trim() || null
        : existing.documentSize
      : null;

    const requestedPublishedAt = parseOptionalDate(body.publishedAt);
    const nextPublishedAt = nextIsPublished
      ? requestedPublishedAt ?? existing.publishedAt ?? new Date()
      : null;

    const [updated] = await db
      .update(blogs)
      .set({
        title,
        slug: finalSlug,
        excerpt,
        content,
        category,
        author,
        coverImage,
        readTime,
        documentName,
        documentSize,
        documentUrl,
        isPublished: nextIsPublished,
        publishedAt: nextPublishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, blogId))
      .returning();

    revalidatePath('/blog');
    revalidatePath('/learn');
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath(`/blog/${updated.slug}`);

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: unknown) {
    console.error('Update blog error:', error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === '23505') {
      return NextResponse.json(
        { success: false, error: 'A blog with this slug already exists.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const blogId = parseInt(id, 10);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(blogs)
      .where(eq(blogs.id, blogId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    revalidatePath('/blog');
    revalidatePath('/learn');
    revalidatePath(`/blog/${deleted.slug}`);

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
