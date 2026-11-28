import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contactReplies, contactSubmissions } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { sendContactReplyEmail } from '@/lib/mailer';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const inquiryId = parseInt(id, 10);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ error: 'Invalid inquiry ID' }, { status: 400 });
    }

    const body = (await req.json()) as {
      subject?: unknown;
      message?: unknown;
    };

    const subject =
      typeof body.subject === 'string' && body.subject.trim()
        ? body.subject.trim().slice(0, 255)
        : 'Drivvize sent you a new message';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message to send.' },
        { status: 400 },
      );
    }

    const [inquiry] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, inquiryId))
      .limit(1);

    if (!inquiry) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    const recipientName = `${inquiry.firstName} ${inquiry.lastName}`.trim();
    const mailResult = await sendContactReplyEmail({
      toEmail: inquiry.email,
      toName: recipientName,
      subject,
      message,
    });

    if (!mailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            mailResult.error ||
            'Failed to send email. Check SMTP_USER and SMTP_PASS in .env.local.',
        },
        { status: 500 },
      );
    }

    const [reply] = await db
      .insert(contactReplies)
      .values({
        inquiryId: inquiry.id,
        senderName: 'Drivvize Team',
        senderEmail: mailResult.senderEmail || session.email,
        recipientEmail: inquiry.email,
        subject,
        message,
        sentViaEmail: true,
      })
      .returning();

    const nextStatus = inquiry.status === 'archived' ? 'archived' : 'replied';
    if (inquiry.status !== nextStatus) {
      await db
        .update(contactSubmissions)
        .set({ status: nextStatus })
        .where(eq(contactSubmissions.id, inquiry.id));
    }

    return NextResponse.json({
      success: true,
      reply,
      inquiryStatus: nextStatus,
    });
  } catch (error) {
    console.error('Send inquiry reply error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reply email' },
      { status: 500 },
    );
  }
}

