import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Raw diagnostic query executing on Neon Postgres
    const rawResult = (await db.execute(
      sql`SELECT NOW() AS now, current_database() AS db, version() AS version`
    )) as unknown as { rows?: Array<{ now: string; db: string; version: string }> };

    const firstRow = rawResult?.rows?.[0] || (rawResult as unknown as Array<{ now: string; db: string; version: string }>)?.[0];

    // 2. ORM table select / count query
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactSubmissions);

    return NextResponse.json({
      status: 'healthy',
      service: 'Neon Lakebase Postgres',
      driver: '@neondatabase/serverless (HTTP)',
      orm: 'Drizzle ORM',
      branch: process.env.NEON_BRANCH || 'production',
      branchId: process.env.NEON_BRANCH_ID || null,
      database: firstRow?.db ?? 'neondb',
      serverTime: firstRow?.now,
      postgresVersion: firstRow?.version,
      tables: {
        contact_submissions: {
          exists: true,
          rowCount: countResult[0]?.count ?? 0,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        service: 'Neon Postgres',
        error: error instanceof Error ? error.message : 'Database error',
      },
      { status: 500 }
    );
  }
}

