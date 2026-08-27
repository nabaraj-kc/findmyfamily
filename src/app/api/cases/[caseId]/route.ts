import { NextResponse } from 'next/server';
import { getCaseById, updateCase, deleteCase } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const caseData = await getCaseById(caseId);
    if (!caseData) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, case: caseData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}




