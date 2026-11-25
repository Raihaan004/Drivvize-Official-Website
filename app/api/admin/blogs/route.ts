import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { estimateReadTime, slugifyBlogTitle } from '@/lib/blogConstants';

function parseOptionalDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    return NextResponse.json({ success: true, blogs: allBlogs });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve blogs' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    const coverImage = typeof body.coverImage === 'string' ? body.coverImage.trim() : '';
    const readTime = typeof body.readTime === 'string' ? body.readTime.trim() : '';
    const documentName = typeof body.documentName === 'string' ? body.documentName.trim() : '';
    const documentSize = typeof body.documentSize === 'string' ? body.documentSize.trim() : '';
    const documentUrl = typeof body.documentUrl === 'string' ? body.documentUrl.trim() : '';
    const isPublished = Boolean(body.isPublished);
    const customPublishedAt = parseOptionalDate(body.publishedAt);

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 },
      );
    }

    const finalSlug = slugifyBlogTitle(rawSlug || title);
    if (!finalSlug) {
      return NextResponse.json(
        { success: false, error: 'A valid URL slug is required' },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(blogs)
      .values({
        title,
        slug: finalSlug,
        excerpt: excerpt || title.slice(0, 160),
        content,
        category: category || 'Functional Safety',
        author: author || 'Drivvize Engineering',
        coverImage: coverImage || null,
        readTime: readTime || estimateReadTime(content),
        documentName: documentUrl ? documentName || 'Attachment.pdf' : null,
        documentSize: documentUrl ? documentSize || null : null,
        documentUrl: documentUrl || null,
        isPublished,
        publishedAt: isPublished ? customPublishedAt ?? new Date() : null,
      })
      .returning();

    revalidatePath('/blog');
    revalidatePath('/learn');
    revalidatePath(`/blog/${created.slug}`);

    return NextResponse.json({ success: true, blog: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create blog error:', error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: 'A blog with this slug already exists. Please choose a different title or slug.',
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 },
    );
  }
}
