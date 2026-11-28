import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactReplies, contactSubmissions } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { sendContactReplyEmail } from '@/lib/mailer';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      firstName?: unknown;
      lastName?: unknown;
      email?: unknown;
      companyName?: unknown;
      subject?: unknown;
      message?: unknown;
    };

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const firstName =
      typeof body.firstName === 'string' && body.firstName.trim()
        ? body.firstName.trim().slice(0, 255)
        : email.split('@')[0] || 'Contact';
    const lastName =
      typeof body.lastName === 'string' ? body.lastName.trim().slice(0, 255) : '';
    const companyName =
      typeof body.companyName === 'string' ? body.companyName.trim().slice(0, 255) || null : null;
    const subject =
      typeof body.subject === 'string' && body.subject.trim()
        ? body.subject.trim().slice(0, 255)
        : 'Drivvize sent you a new message';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid recipient email address.' },
        { status: 400 },
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message to send.' },
        { status: 400 },
      );
    }

    const toName = `${firstName} ${lastName}`.trim();
    const mailResult = await sendContactReplyEmail({
      toEmail: email,
      toName,
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

    const [createdInquiry] = await db
      .insert(contactSubmissions)
      .values({
        firstName,
        lastName: lastName || '-',
        email,
        phone: '—',
        companyName,
        message,
        status: 'replied',
        source: 'Outbound email',
      })
      .returning();

    const [reply] = await db
      .insert(contactReplies)
      .values({
        inquiryId: createdInquiry.id,
        senderName: 'Drivvize Team',
        senderEmail: mailResult.senderEmail || session.email,
        recipientEmail: email,
        subject,
        message,
        sentViaEmail: true,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        inquiry: {
          ...createdInquiry,
          replies: [reply],
          replyCount: 1,
          lastActivityAt: reply.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Compose outbound email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 },
    );
  }
}

