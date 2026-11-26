import { NextResponse, after } from 'next/server';
import { db } from '@/lib/db';
import { careerApplications } from '@/lib/db/schema';
import { sendCareerResumeNotificationEmail } from '@/lib/mailer';

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function resolveMimeType(fileName: string, reportedType: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lower.endsWith('.doc')) return 'application/msword';
  return reportedType || 'application/octet-stream';
}

function sanitizeFileName(rawName: string): string {
  const base = rawName.split(/[/\\]/).pop() || 'resume.pdf';
  const cleaned = base.replace(/[^\w.\- ()]/g, '_').trim();
  return cleaned.slice(0, 200) || 'resume.pdf';
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid form submission.' },
      { status: 400 },
    );
  }

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const area = String(formData.get('area') ?? '').trim();
  const yearsRaw = String(formData.get('years') ?? '').trim();
  const consentRaw = String(formData.get('consent') ?? '').trim().toLowerCase();
  const resumeEntry = formData.get('resume');

  if (!name) {
    return NextResponse.json(
      { success: false, error: 'Please enter your full name.' },
      { status: 400 },
    );
  }

  if (!phone || phone.replace(/\D/g, '').length < 7 || !/^[+\d\s()-]+$/.test(phone)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid phone number.' },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  if (!area) {
    return NextResponse.json(
      { success: false, error: 'Please choose an area of interest.' },
      { status: 400 },
    );
  }

  if (consentRaw === 'false' || consentRaw === '0') {
    return NextResponse.json(
      { success: false, error: 'Consent is required to store your resume.' },
      { status: 400 },
    );
  }

  if (!(resumeEntry instanceof File) || resumeEntry.size === 0) {
    return NextResponse.json(
      { success: false, error: 'Please attach your resume (PDF, DOC or DOCX).' },
      { status: 400 },
    );
  }

  if (!/\.(pdf|docx?)$/i.test(resumeEntry.name)) {
    return NextResponse.json(
      { success: false, error: 'Please upload a PDF, DOC or DOCX file.' },
      { status: 400 },
    );
  }

  if (resumeEntry.size > MAX_RESUME_BYTES) {
    return NextResponse.json(
      { success: false, error: 'File is too large. Maximum size is 5 MB.' },
      { status: 400 },
    );
  }

  let yearsExperience: string | null = null;
  if (yearsRaw) {
    const parsedYears = Number(yearsRaw);
    if (Number.isNaN(parsedYears) || parsedYears < 0 || parsedYears > 60) {
      return NextResponse.json(
        { success: false, error: 'Years of experience must be between 0 and 60.' },
        { status: 400 },
      );
    }
    yearsExperience = String(Math.round(parsedYears * 10) / 10);
  }

  const fileName = sanitizeFileName(resumeEntry.name);
  const mimeType = resolveMimeType(fileName, resumeEntry.type);

  try {
    const arrayBuffer = await resumeEntry.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const resumeData = fileBuffer.toString('base64');

    const [inserted] = await db
      .insert(careerApplications)
      .values({
        name: name.slice(0, 255),
        phone: phone.slice(0, 60),
        email: email.slice(0, 255),
        area: area.slice(0, 120),
        yearsExperience,
        resumeFileName: fileName,
        resumeMimeType: mimeType,
        resumeSizeBytes: resumeEntry.size,
        resumeData,
        consent: true,
        status: 'new',
      })
      .returning({ id: careerApplications.id });

    after(async () => {
      try {
        await sendCareerResumeNotificationEmail({
          name,
          phone,
          email,
          area,
          yearsExperience,
          fileName,
          mimeType,
          fileBuffer,
        });
      } catch (mailError) {
        console.error('Background career notification email failed:', mailError);
      }
    });

    return NextResponse.json(
      {
        success: true,
        id: inserted?.id ?? null,
        message: 'Resume received and stored securely.',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to store career application:', error);
    return NextResponse.json(
      { success: false, error: 'We could not save your resume right now. Please try again.' },
      { status: 500 },
    );
  }
}

