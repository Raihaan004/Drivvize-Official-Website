import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/adminAuth';

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({
      success: true,
      message: 'Admin session terminated',
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 },
    );
  }
}

