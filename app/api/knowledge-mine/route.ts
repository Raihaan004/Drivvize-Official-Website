import { NextResponse } from 'next/server';
import { getCachedFsfArticles } from '@/lib/functionalsafetyfirst';

export async function GET() {
  const articles = await getCachedFsfArticles(4);

  return NextResponse.json({
    success: true,
    articles,
  });
}
