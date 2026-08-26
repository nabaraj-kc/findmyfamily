import { NextResponse } from 'next/server';
import { insertCase } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const syncedCases: any[] = [];

    for (const item of items) {
      try {
        const isFound = item.type === 'found' || item._type === 'FOUND' || item.status === 'safe' || item.status === 'injured' || item.status === 'deceased';
        const type = isFound ? 'found' : 'missing';
        const isDeceased = item.status === 'deceased';

        const created = await insertCase({
          type,
          status: item.status || 'missing',
          fullName: item.fullName || 'Unknown',
          nickname: item.nickname || '',
          age: Number(item.age) || 0,
          gender: item.gender || 'other',
          districtId: Number(item.district) || 1,
          lastKnownLocation: item.lastSeenLocation || item.foundLocation || 'Location not specified',
          dateStr: item.lastSeenDate || item.foundDate || new Date().toISOString().split('T')[0],
          features: item.features || '',
          clothing: item.clothing || '',
          photoUrl: item.photoUrl || '',
          reporterName: item.reporterName || 'Anonymous',
          reporterPhone: item.reporterPhone || '',
          relationship: item.relationship || 'other',
          privacyConsent: 1,
          trustTier: isDeceased ? 'community' : 'volunteer',
          isPublished: isDeceased ? 0 : 1
        });

        syncedCases.push({ offlineId: item._offlineId || item.id, caseId: created.caseId });
      } catch (err: any) {
        console.error('[SYNC] Failed to sync item:', item, err);
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount: syncedCases.length,
      syncedCases
    });
  } catch (error: any) {
    console.error('[SYNC] Error in sync endpoint:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
