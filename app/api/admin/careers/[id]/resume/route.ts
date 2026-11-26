import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { careerApplications } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    const [record] = await db
      .select({
        resumeFileName: careerApplications.resumeFileName,
        resumeMimeType: careerApplications.resumeMimeType,
        resumeData: careerApplications.resumeData,
      })
      .from(careerApplications)
      .where(eq(careerApplications.id, applicationId))
      .limit(1);

    if (!record) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const forceDownload = searchParams.get('download') === '1';
    const dispositionType = forceDownload ? 'attachment' : 'inline';
    const safeName = record.resumeFileName.replace(/["\r\n]/g, '_');
    const buffer = Buffer.from(record.resumeData, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': record.resumeMimeType || 'application/octet-stream',
        'Content-Length': String(buffer.byteLength),
        'Content-Disposition': `${dispositionType}; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Download career resume error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load resume file' },
      { status: 500 },
    );
  }
}

