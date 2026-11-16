import nodemailer, { type Transporter } from 'nodemailer';
import type { LearnResource } from '@/constants/learnResources';

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpUser || !smtpPass) {
    return null;
  }

  if (!cachedTransporter) {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || '465');
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === 'true'
        : smtpPort === 465;

    cachedTransporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return cachedTransporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendResourcePdfEmail({
  toEmail,
  resource,
  filePath,
}: {
  toEmail: string;
  resource: LearnResource;
  filePath: string;
}): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();
  const smtpUser = process.env.SMTP_USER?.trim();

  if (!transporter || !smtpUser) {
    console.warn('SMTP credentials not configured. Skipping email delivery.');
    return { success: false, error: 'SMTP credentials not configured.' };
  }

  const subject = `Your Requested PDF: ${resource.title} — Drivvize`;

  const textBody = [
    `Hello,`,
    ``,
    `Thank you for requesting "${resource.title}".`,
    ``,
    `Field:    ${resource.field}`,
    `Document: ${resource.fileName} (${resource.fileSize})`,
    ``,
    `We have attached your official PDF copy directly to this email for offline reading.`,
    ``,
    `For engineering consultations, ISO 26262 functional safety, or cybersecurity assessments, feel free to reply to this email or visit https://www.drivvize.com.`,
    ``,
    `Best regards,`,
    `The Drivvize Engineering Team`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202B36; max-width: 620px; margin: 0 auto; border: 1px solid #DCE3EA; border-radius: 12px; overflow: hidden; background: #FFFFFF;">
      <div style="background: linear-gradient(135deg, #0B2545 0%, #163E6D 100%); color: #FFFFFF; padding: 28px 24px;">
        <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #06B6D4; font-weight: 700; margin-bottom: 6px;">
          Drivvize Technical Knowledge Center
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; line-height: 1.3;">
          Your Requested Publication
        </h1>
      </div>

      <div style="padding: 28px 24px;">
        <p style="margin-top: 0; font-size: 15px; line-height: 1.6; color: #334155;">
          Hello,
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          Thank you for your interest in Drivvize engineering publications. As requested, your official PDF copy is attached directly to this email.
        </p>

        <div style="margin: 24px 0; padding: 20px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px;">
          <div style="display: inline-block; padding: 3px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; border-radius: 6px; background: #EFF6FF; color: #1D4ED8; margin-bottom: 10px;">
            ${escapeHtml(resource.field)}
          </div>
          <h2 style="margin: 0 0 8px; font-size: 17px; font-weight: 700; color: #0B2545;">
            ${escapeHtml(resource.title)}
          </h2>
          <p style="margin: 0 0 14px; font-size: 13.5px; line-height: 1.55; color: #475569;">
            ${escapeHtml(resource.subtitle)}
          </p>
          <div style="font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 10px;">
            <strong>Attached PDF:</strong> ${escapeHtml(resource.fileName)} (${escapeHtml(resource.fileSize)})
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 8px;">
          <strong>Core Engineering Topics:</strong>
        </p>
        <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.7;">
          ${resource.topics.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #64748B; line-height: 1.6;">
          Have questions or looking for functional safety, V2X, or automotive cybersecurity advisory? Reach out to us at <a href="mailto:contact@drivvize.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">contact@drivvize.com</a>.
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748B;">
        © ${new Date().getFullYear()} Drivvize. All rights reserved. Delivered securely via email.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Drivvize Publications" <${smtpUser}>`,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: resource.fileName,
          path: filePath,
          contentType: 'application/pdf',
        },
      ],
    });

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send email';
    console.error('Error sending PDF email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
