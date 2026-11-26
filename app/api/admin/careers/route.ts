import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { careerApplications } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const status = searchParams.get('status')?.trim();

    const conditions = [];
    if (query) {
      const pattern = `%${query}%`;
      conditions.push(
        or(
          ilike(careerApplications.name, pattern),
          ilike(careerApplications.email, pattern),
          ilike(careerApplications.phone, pattern),
          ilike(careerApplications.area, pattern),
          ilike(careerApplications.resumeFileName, pattern),
        ),
      );
    }

    if (status && status !== 'all') {
      conditions.push(eq(careerApplications.status, status));
    }

    const baseSelect = {
      id: careerApplications.id,
      name: careerApplications.name,
      phone: careerApplications.phone,
      email: careerApplications.email,
      area: careerApplications.area,
      yearsExperience: careerApplications.yearsExperience,
      resumeFileName: careerApplications.resumeFileName,
      resumeMimeType: careerApplications.resumeMimeType,
      resumeSizeBytes: careerApplications.resumeSizeBytes,
      consent: careerApplications.consent,
      status: careerApplications.status,
      notes: careerApplications.notes,
      createdAt: careerApplications.createdAt,
    };

    const applications =
      conditions.length > 0
        ? await db
            .select(baseSelect)
            .from(careerApplications)
            .where(conditions.length === 1 ? conditions[0] : and(...conditions))
            .orderBy(desc(careerApplications.createdAt))
            .limit(200)
        : await db
            .select(baseSelect)
            .from(careerApplications)
            .orderBy(desc(careerApplications.createdAt))
            .limit(200);

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Fetch career applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve career applications' },
      { status: 500 },
    );
  }
}

