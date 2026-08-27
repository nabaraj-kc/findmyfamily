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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = await request.json();
    const updated = await updateCase(caseId, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update case or not found' }, { status: 400 });
    }
    const refreshed = await getCaseById(caseId);
    return NextResponse.json({ success: true, case: refreshed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


