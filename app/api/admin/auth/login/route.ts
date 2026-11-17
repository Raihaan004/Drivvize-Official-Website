import { NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  signAdminToken,
  setAdminSessionCookie,
} from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 },
      );
    }

    const token = signAdminToken(email);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: {
        email: email.trim().toLowerCase(),
        role: 'superadmin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 },
    );
  }
}

