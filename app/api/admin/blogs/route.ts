import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';


// Helper to generate a URL-friendly slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      coverImage,
      readTime,
      isPublished,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 },
      );
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);

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
        readTime: readTime || '5 min read',
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, blog: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create blog error:', error);
    const code = typeof error === 'object' && error !== null && 'code' in error ? (error as { code?: string }).code : undefined;
    if (code === '23505') {
      return NextResponse.json(
        { success: false, error: 'A blog with this slug already exists. Please choose a different title or slug.' },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 },
    );
  }
}
