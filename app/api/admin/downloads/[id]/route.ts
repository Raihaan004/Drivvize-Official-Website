import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pdfDownloads } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';


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
    const downloadId = parseInt(id, 10);

    if (isNaN(downloadId)) {
      return NextResponse.json({ error: 'Invalid record ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(pdfDownloads)
      .where(eq(pdfDownloads.id, downloadId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Delete download record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 },
    );
  }
}
