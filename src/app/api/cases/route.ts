import { NextResponse } from 'next/server';
import { getAllCases, getPublicCases } from '@/lib/db/database';

export async function GET(request: Request) {
  try {
    const cases = await getPublicCases();

    return NextResponse.json({
      success: true,
      count: cases.length,
      cases
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
