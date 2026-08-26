'use server';

import { insertTip } from '@/lib/db/database';

export async function submitCaseTip(caseId: string, tipText: string, contactInfo?: string) {
  try {
    if (!caseId || !tipText.trim()) {
      return { success: false, error: 'Tip description cannot be empty.' };
    }

    await insertTip(caseId, tipText.trim(), contactInfo?.trim() || '');
    console.log(`[DB] Saved information tip for case: ${caseId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[SERVER] Error saving tip:', error);
    return { success: false, error: error.message };
  }
}
