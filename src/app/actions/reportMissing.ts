'use server';

import { insertCase } from '@/lib/db/database';

export async function submitReportMissing(data: any) {
  try {
    if (!data.fullName || !data.fullName.trim()) {
      return { success: false, error: 'Full name of the missing person is required.' };
    }
    if (!data.reporterName || !data.reporterName.trim()) {
      return { success: false, error: 'Reporter name is required.' };
    }
    if (!data.reporterPhone || !data.reporterPhone.trim()) {
      return { success: false, error: 'Contact phone number is required.' };
    }

    const newCase = await insertCase({
      type: 'missing',
      status: 'missing',
      fullName: data.fullName.trim(),
      nickname: data.nickname?.trim() || '',
      age: Number(data.age) || 0,
      gender: data.gender || 'other',
      districtId: Number(data.district) || 1,
      lastKnownLocation: data.lastSeenLocation?.trim() || 'Location not specified',
      dateStr: data.lastSeenDate || new Date().toISOString().split('T')[0],
      features: data.features?.trim() || '',
      clothing: data.clothing?.trim() || '',
      photoUrl: data.photoUrl || '',
      reporterName: data.reporterName.trim(),
      reporterPhone: data.reporterPhone.trim(),
      relationship: data.relationship || 'other',
      privacyConsent: data.privacyConsent ? 1 : 0,
      trustTier: 'community',
      isPublished: 1,
    });

    console.log(`[DB] Successfully created missing report: ${newCase.caseId}`);
    return { success: true, caseId: newCase.caseId, data: newCase };
  } catch (error: any) {
    console.error('[SERVER] Error saving missing report:', error);
    return { success: false, error: error.message || 'Database insert failed' };
  }
}
