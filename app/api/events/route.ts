import { NextResponse, connection } from 'next/server';
import { getPublicEventsData } from '@/lib/eventQueries';

export async function GET() {
  await connection();
  try {
    const data = await getPublicEventsData();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('Public fetch events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load events' },
      { status: 500 },
    );
  }
}

