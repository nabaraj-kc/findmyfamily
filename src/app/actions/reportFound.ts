'use server';

import { insertCase } from '@/lib/db/database';

export async function submitReportFound(data: any) {
  try {
    if (!data.status) {
      return { success: false, error: 'Status of the found individual is required.' };
    }
    if (!data.reporterName || !data.reporterName.trim()) {
      return { success: false, error: 'Reporter name is required.' };
    }
    if (!data.reporterPhone || !data.reporterPhone.trim()) {
      return { success: false, error: 'Contact phone number is required.' };
    }

    const isDeceased = data.status === 'deceased';
    const trustTier = isDeceased ? 'community' : 'volunteer';

    const newCase = insertCase({
      type: 'found',
      status: data.status,
      fullName: data.fullName?.trim() || (data.status === 'deceased' ? 'Unknown Deceased Individual' : 'Unknown Found Individual'),
      nickname: '',
      age: Number(data.age) || 0,
      gender: data.gender || 'other',
      districtId: Number(data.district) || 1,
      lastKnownLocation: data.foundLocation?.trim() || 'Location not specified',
      dateStr: data.foundDate || new Date().toISOString().split('T')[0],
      features: data.features?.trim() || '',
      clothing: data.clothing?.trim() || '',
      photoUrl: data.photoUrl || '',
      reporterName: data.reporterName.trim(),
      reporterPhone: data.reporterPhone.trim(),
      relationship: data.relationship || 'finder',
      privacyConsent: data.privacyConsent ? 1 : 0,
      trustTier,
      isPublished: isDeceased ? 0 : 1,
    });

    console.log(`[DB] Successfully created found report: ${newCase.caseId} (status: ${data.status})`);
    return { success: true, caseId: newCase.caseId, data: newCase };
  } catch (error: any) {
    console.error('[SERVER] Error saving found report:', error);
    return { success: false, error: error.message || 'Database insert failed' };
  }
}
