import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { db } from '@/lib/db';
import { pdfDownloads } from '@/lib/db/schema';
import { LEARN_RESOURCES } from '@/constants/learnResources';
import { sendResourcePdfEmail } from '@/lib/mailer';
import { desc } from 'drizzle-orm';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function resolvePdfFilePath(fileName: string): string | null {
  const privatePath = path.join(process.cwd(), 'private_documents', 'download_pdf', fileName);
  if (fs.existsSync(privatePath)) {
    return privatePath;
  }
  const publicPath = path.join(process.cwd(), 'public', 'download_pdf', fileName);
  if (fs.existsSync(publicPath)) {
    return publicPath;
  }
  return null;
}

export async function GET() {
  try {
    const records = await db
      .select()
      .from(pdfDownloads)
      .orderBy(desc(pdfDownloads.downloadedAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      service: 'Neon Lakebase Postgres',
      totalReturned: records.length,
      downloads: records,
    });
  } catch (error) {
    console.error('Failed to query pdfDownloads from Neon:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database query error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: { email?: unknown; fileId?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; fileId?: unknown };
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request payload.' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const fileId = typeof body.fileId === 'string' ? body.fileId.trim() : '';

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  const resource = LEARN_RESOURCES.find((item) => item.id === fileId);
  if (!resource) {
    return NextResponse.json(
      { error: 'The requested publication was not found.' },
      { status: 404 }
    );
  }

  const filePath = resolvePdfFilePath(resource.fileName);
  if (!filePath) {
    console.error(`PDF not found on server for: ${resource.fileName}`);
    return NextResponse.json(
      { error: 'The requested publication file is currently unavailable.' },
      { status: 404 }
    );
  }

  // 1. Instantly record the request in Neon Database via Drizzle ORM
  let recordId: number | null = null;
  let downloadedAtIso: string = new Date().toISOString();

  try {
    const [inserted] = await db
      .insert(pdfDownloads)
      .values({
        email,
        fileId: resource.id,
        fileName: resource.fileName,
        fileTitle: resource.title,
        field: resource.field,
      })
      .returning({ id: pdfDownloads.id, downloadedAt: pdfDownloads.downloadedAt });

    recordId = inserted?.id ?? null;
    if (inserted?.downloadedAt) {
      downloadedAtIso = new Date(inserted.downloadedAt).toISOString();
    }
  } catch (dbError) {
    console.error('Failed to record publication request in Neon Postgres:', dbError);
  }

  // 2. Dispatch email with the PDF attachment and verify delivery before confirming success
  const emailResult = await sendResourcePdfEmail({
    toEmail: email,
    resource,
    filePath,
  });

  if (!emailResult.success) {
    console.error('PDF email delivery failed:', emailResult.error);
    return NextResponse.json(
      {
        error:
          'Unable to send the email right now. Please try again in a moment or contact consult@drivvize.com.',
      },
      { status: 502 },
    );
  }

  // No direct download URL is returned to strictly enforce email-only delivery.
  return NextResponse.json({
    success: true,
    message: `We've sent "${resource.title}" directly to ${email}. Please check your inbox shortly.`,
    fileName: resource.fileName,
    recordId,
    downloadedAt: downloadedAtIso,
  });
}
