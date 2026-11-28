import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { sendContactNotificationEmail } from '@/lib/mailer';
import { desc } from 'drizzle-orm';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  companyName?: unknown;
  message?: unknown;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function GET() {
  try {
    const submissions = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      service: 'Neon Postgres',
      totalReturned: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Failed to fetch contact submissions from Neon database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database fetch error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request payload.' },
      { status: 400 }
    );
  }

  const firstName =
    typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName =
    typeof body.lastName === 'string' ? body.lastName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const companyName =
    typeof body.companyName === 'string' ? body.companyName.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: 'Please provide both your first name and last name.' },
      { status: 400 }
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid Gmail ID / email address.' },
      { status: 400 }
    );
  }

  if (!phone || phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json(
      { error: 'Please enter a valid phone number.' },
      { status: 400 }
    );
  }

  if (!message || message.length < 5) {
    return NextResponse.json(
      { error: 'Please enter a message (at least 5 characters).' },
      { status: 400 }
    );
  }

  // 1. Persist submission into Neon Postgres via Drizzle ORM
  let insertedId: number | null = null;
  try {
    const [inserted] = await db
      .insert(contactSubmissions)
      .values({
        firstName,
        lastName,
        email,
        phone,
        companyName: companyName || null,
        message,
        status: 'new',
        source: 'Automated form',
      })
      .returning({ id: contactSubmissions.id });
    insertedId = inserted?.id ?? null;
  } catch (dbErr) {
    console.error('Failed to persist contact inquiry into Neon Postgres:', dbErr);
  }

  // 2. Attempt SMTP email delivery to CONTACT_RECEIVER_EMAIL (fallback to SMTP_USER)
  await sendContactNotificationEmail({
    firstName,
    lastName,
    email,
    phone,
    companyName,
    message,
  });

  // 3. Optional webhook notification
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: insertedId,
        firstName,
        lastName,
        email,
        phone,
        companyName: companyName || undefined,
        message,
        submittedAt: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.error('Optional contact webhook failed:', err);
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you! Your message has been received and saved.',
    id: insertedId,
  });
}
