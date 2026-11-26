import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { eventRegistrations } from '@/lib/db/schema';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  let body: {
    eventId?: unknown;
    eventSlug?: unknown;
    eventTitle?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    company?: unknown;
    notes?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
  }

  const eventId =
    typeof body.eventId === 'number' && Number.isInteger(body.eventId)
      ? body.eventId
      : null;
  const eventSlug = typeof body.eventSlug === 'string' ? body.eventSlug.trim() : '';
  const eventTitle = typeof body.eventTitle === 'string' ? body.eventTitle.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

  if (!eventSlug || !eventTitle) {
    return NextResponse.json({ error: 'Event details are required.' }, { status: 400 });
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  let registrationId: number | null = null;
  try {
    const [inserted] = await db
      .insert(eventRegistrations)
      .values({
        eventId,
        eventSlug,
        eventTitle,
        name,
        email,
        phone: phone || null,
        company: company || null,
        notes: notes || null,
      })
      .returning({ id: eventRegistrations.id });

    registrationId = inserted?.id ?? null;
  } catch (error) {
    console.error('Failed to save event registration:', error);
    return NextResponse.json(
      { error: 'Unable to save registration right now. Please try again.' },
      { status: 500 },
    );
  }

  // Optional SMTP notification to Drivvize team + confirmation to attendee
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim() || smtpUser;

  if (smtpUser && smtpPass && receiverEmail) {
    try {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = Number(process.env.SMTP_PORT || '465');
      const smtpSecure =
        process.env.SMTP_SECURE !== undefined
          ? process.env.SMTP_SECURE === 'true'
          : smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await Promise.allSettled([
        transporter.sendMail({
          from: `"Drivvize Events" <${smtpUser}>`,
          to: receiverEmail,
          replyTo: email,
          subject: `New Event Registration: ${eventTitle} — ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #0a1018; max-width: 600px;">
              <h2>New Event Registration</h2>
              <p><strong>Event:</strong> ${escapeHtml(eventTitle)}</p>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
              <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
              ${notes ? `<p><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ''}
            </div>
          `,
        }),
        transporter.sendMail({
          from: `"Drivvize Events" <${smtpUser}>`,
          to: email,
          subject: `Registration Confirmed: ${eventTitle} — Drivvize`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #0a1018; max-width: 600px;">
              <p>Hello ${escapeHtml(name)},</p>
              <p>Thank you for registering for <strong>${escapeHtml(eventTitle)}</strong>.</p>
              <p>Our team has received your registration and will share joining details with you ahead of the session.</p>
              <p>Best regards,<br />Drivvize Engineering Team</p>
            </div>
          `,
        }),
      ]);
    } catch (mailErr) {
      console.warn('Optional event registration email notification failed:', mailErr);
    }
  }

  return NextResponse.json({
    success: true,
    id: registrationId,
    message: `You're registered for "${eventTitle}". We've recorded your details for ${email}.`,
  });
}

