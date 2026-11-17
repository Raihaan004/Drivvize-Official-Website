import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'drivvize_admin_session';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'drivvize_secure_admin_jwt_secret_key_2026_production';

// Default Admin credentials (can be overridden in .env.local)
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@drivvize.com';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

interface AdminPayload {
  email: string;
  role: string;
  exp: number;
}

/**
 * Validate credentials against configured admin credentials.
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  const targetEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const targetPass = (process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();

  return email.trim().toLowerCase() === targetEmail && pass.trim() === targetPass;
}

/**
 * Generate a cryptographically signed HMAC token for the admin session.
 */
export function signAdminToken(email: string): string {
  const payload: AdminPayload = {
    email: email.trim().toLowerCase(),
    role: 'superadmin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an admin HMAC token.
 */
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload: AdminPayload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    );

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from incoming cookies (async in Next.js 15+).
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Set the admin session cookie on the response headers.
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the admin session cookie on logout.
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };

