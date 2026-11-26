import { NextResponse, connection } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogComments } from '@/lib/db/schema';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;

  try {
    const rows = await db
      .select({
        id: blogComments.id,
        authorName: blogComments.authorName,
        comment: blogComments.comment,
        adminReply: blogComments.adminReply,
        createdAt: blogComments.createdAt,
      })
      .from(blogComments)
      .where(and(eq(blogComments.blogSlug, slug), eq(blogComments.status, 'approved')))
      .orderBy(desc(blogComments.createdAt));

    return NextResponse.json({
      success: true,
      comments: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch public blog comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load comments' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
  }

  let body: {
    blogTitle?: unknown;
    authorName?: unknown;
    authorEmail?: unknown;
    comment?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const blogTitle =
    typeof body.blogTitle === 'string' && body.blogTitle.trim()
      ? body.blogTitle.trim()
      : slug;
  const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
  const authorEmail =
    typeof body.authorEmail === 'string' ? body.authorEmail.trim().toLowerCase() : '';
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

  if (!authorName || authorName.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!authorEmail || !isValidEmail(authorEmail)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address (kept private).' },
      { status: 400 },
    );
  }
  if (!comment || comment.length < 3) {
    return NextResponse.json(
      { error: 'Please write a comment (at least 3 characters).' },
      { status: 400 },
    );
  }

  try {
    const [inserted] = await db
      .insert(blogComments)
      .values({
        blogSlug: slug,
        blogTitle,
        authorName,
        authorEmail,
        comment,
        status: 'approved',
      })
      .returning({
        id: blogComments.id,
        authorName: blogComments.authorName,
        comment: blogComments.comment,
        adminReply: blogComments.adminReply,
        createdAt: blogComments.createdAt,
      });

    return NextResponse.json(
      {
        success: true,
        comment: {
          ...inserted,
          createdAt: inserted.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create blog comment error:', error);
    return NextResponse.json(
      { error: 'Unable to submit comment right now.' },
      { status: 500 },
    );
  }
}

