import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';


export async function GET() {
  try {
    const publishedBlogs = await db
      .select()
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.createdAt));

    return NextResponse.json({ success: true, blogs: publishedBlogs });
  } catch (error) {
    console.error('Public fetch blogs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 },
    );
  }
}
