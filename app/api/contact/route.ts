import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  companyName?: unknown;
  message?: unknown;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || '465');
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const receiverEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() || smtpUser;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

  if (!smtpUser || !smtpPass || !receiverEmail) {
    return NextResponse.json(
      {
        error:
          'Email service is not configured yet. Please set SMTP_USER, SMTP_PASS, and CONTACT_RECEIVER_EMAIL in .env.local.',
      },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const subject = `New Contact Inquiry from ${fullName} — Drivvize`;

    const textBody = [
      'New Contact Us Submission (Drivvize Website)',
      '-------------------------------------------',
      `First Name:   ${firstName}`,
      `Last Name:    ${lastName}`,
      `Gmail ID:     ${email}`,
      `Phone No.:    ${phone}`,
      `Company Name: ${companyName || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #202B36; max-width: 640px; margin: 0 auto; border: 1px solid #DCE3EA; border-radius: 12px; overflow: hidden;">
        <div style="background: #0B2545; color: #FFFFFF; padding: 20px 24px;">
          <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #06B6D4; font-weight: 700;">Drivvize Website Inquiry</div>
          <h2 style="margin: 6px 0 0; font-size: 20px;">New Contact Us Submission</h2>
        </div>
        <div style="padding: 24px; background: #FFFFFF;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #315B7D; font-weight: 600; width: 140px;">First Name</td>
              <td style="padding: 8px 0; color: #0B2545;">${escapeHtml(firstName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #315B7D; font-weight: 600;">Last Name</td>
              <td style="padding: 8px 0; color: #0B2545;">${escapeHtml(lastName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #315B7D; font-weight: 600;">Gmail ID</td>
              <td style="padding: 8px 0; color: #2563EB;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #315B7D; font-weight: 600;">Phone No.</td>
              <td style="padding: 8px 0; color: #0B2545;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #315B7D; font-weight: 600;">Company Name</td>
              <td style="padding: 8px 0; color: #0B2545;">${companyName ? escapeHtml(companyName) : '<span style="color:#94A3B8;">Not provided</span>'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F8FAFC; border: 1px solid #DCE3EA; border-radius: 8px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #315B7D; font-weight: 700; margin-bottom: 8px;">Message</div>
            <div style="font-size: 14px; line-height: 1.6; color: #202B36; white-space: pre-wrap;">${escapeHtml(message)}</div>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Drivvize Contact Form" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      message: 'Thank you! Your message has been sent to our team.',
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return NextResponse.json(
      {
        error:
          'Unable to send your message right now. Please verify the SMTP settings or try again shortly.',
      },
      { status: 500 }
    );
  }
}

