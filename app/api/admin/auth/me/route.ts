import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';


export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('Admin session check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to verify session' },
      { status: 500 },
    );
  }
}
