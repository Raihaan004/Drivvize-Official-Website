import { NextResponse, connection } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogEngagements } from '@/lib/db/schema';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;

  try {
    const [row] = await db
      .select()
      .from(blogEngagements)
      .where(eq(blogEngagements.slug, slug))
      .limit(1);

    return NextResponse.json({
      success: true,
      likes: row?.likes ?? 0,
      ratingSum: row?.ratingSum ?? 0,
      ratingCount: row?.ratingCount ?? 0,
    });
  } catch (error) {
    console.error('Fetch blog engagement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load engagement data' },
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
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  let body: {
    type?: unknown;
    action?: unknown;
    rating?: unknown;
    previousRating?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  try {
    if (body.type === 'like') {
      const action = body.action === 'remove' ? 'remove' : 'add';

      const [updated] = await db
        .insert(blogEngagements)
        .values({
          slug,
          likes: action === 'add' ? 1 : 0,
          ratingSum: 0,
          ratingCount: 0,
        })
        .onConflictDoUpdate({
          target: blogEngagements.slug,
          set: {
            likes:
              action === 'add'
                ? sql`${blogEngagements.likes} + 1`
                : sql`GREATEST(${blogEngagements.likes} - 1, 0)`,
            updatedAt: new Date(),
          },
        })
        .returning();

      return NextResponse.json({
        success: true,
        likes: updated.likes,
        ratingSum: updated.ratingSum,
        ratingCount: updated.ratingCount,
      });
    }

    if (body.type === 'rate') {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be an integer between 1 and 5' },
          { status: 400 },
        );
      }

      const prevRaw = Number(body.previousRating);
      const hasPrev = Number.isInteger(prevRaw) && prevRaw >= 1 && prevRaw <= 5;

      const [updated] = await db
        .insert(blogEngagements)
        .values({
          slug,
          likes: 0,
          ratingSum: rating,
          ratingCount: 1,
        })
        .onConflictDoUpdate({
          target: blogEngagements.slug,
          set: hasPrev
            ? {
                ratingSum: sql`GREATEST(${blogEngagements.ratingSum} - ${prevRaw} + ${rating}, 0)`,
                ratingCount: sql`GREATEST(${blogEngagements.ratingCount}, 1)`,
                updatedAt: new Date(),
              }
            : {
                ratingSum: sql`${blogEngagements.ratingSum} + ${rating}`,
                ratingCount: sql`${blogEngagements.ratingCount} + 1`,
                updatedAt: new Date(),
              },
        })
        .returning();

      return NextResponse.json({
        success: true,
        likes: updated.likes,
        ratingSum: updated.ratingSum,
        ratingCount: updated.ratingCount,
      });
    }

    return NextResponse.json({ error: 'Unsupported engagement type' }, { status: 400 });
  } catch (error) {
    console.error('Update blog engagement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update engagement' },
      { status: 500 },
    );
  }
}

