import { NextResponse } from 'next/server';
import { 
  getAllCases, 
  getAllTips, 
  getGalleryImages,
  getCommunityPosts,
  getDashboardMetrics, 
  updateCaseStatus, 
  updateCase, 
  deleteCase, 
  deleteCasesBulk,
  deleteAllCases,
  deleteGalleryImage,
  deleteGalleryImagesBulk,
  deleteAllGalleryImages,
  deleteCommunityPost,
  deleteCommunityPostsBulk,
  deleteAllCommunityPosts,
  deleteCommunityComment,
  deleteTip, 
  deleteTipsBulk,
  deleteAllTips,
  hardPurgeAllData,
  updateTipStatus 
} from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cases = await getAllCases();
    const tips = await getAllTips();
    const gallery = await getGalleryImages();
    const community = await getCommunityPosts();
    const metrics = await getDashboardMetrics();
    return NextResponse.json({ success: true, cases, tips, gallery, community, metrics });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, caseIds, tipIds, imageIds, postIds } = body;

    if (action === 'hard_purge_all') {
      const summary = await hardPurgeAllData();
      return NextResponse.json({ 
        success: true, 
        summary, 
        message: `Hard Purge completed: ${summary.casesDeleted} cases, ${summary.tipsDeleted} tips, ${summary.galleryDeleted} photos, ${summary.postsDeleted} posts erased permanently.` 
      });
    }

    // Cases bulk
    if (action === 'delete_selected_cases' && Array.isArray(caseIds)) {
      const count = await deleteCasesBulk(caseIds);
      return NextResponse.json({ success: true, count, message: `${count} cases deleted permanently` });
    }
    if (action === 'delete_all_cases') {
      const count = await deleteAllCases();
      return NextResponse.json({ success: true, count, message: `All ${count} cases purged permanently` });
    }

    // Tips bulk
    if (action === 'delete_selected_tips' && Array.isArray(tipIds)) {
      const count = await deleteTipsBulk(tipIds);
      return NextResponse.json({ success: true, count, message: `${count} tips deleted permanently` });
    }
    if (action === 'delete_all_tips') {
      const count = await deleteAllTips();
      return NextResponse.json({ success: true, count, message: `All ${count} tips purged permanently` });
    }

    // Gallery bulk
    if (action === 'delete_selected_gallery' && Array.isArray(imageIds)) {
      const count = await deleteGalleryImagesBulk(imageIds);
      return NextResponse.json({ success: true, count, message: `${count} gallery images deleted permanently` });
    }
    if (action === 'delete_all_gallery') {
      const count = await deleteAllGalleryImages();
      return NextResponse.json({ success: true, count, message: `All ${count} gallery images purged permanently` });
    }

    // Community bulk
    if (action === 'delete_selected_posts' && Array.isArray(postIds)) {
      const count = await deleteCommunityPostsBulk(postIds);
      return NextResponse.json({ success: true, count, message: `${count} community posts deleted permanently` });
    }
    if (action === 'delete_all_posts') {
      const count = await deleteAllCommunityPosts();
      return NextResponse.json({ success: true, count, message: `All ${count} community posts purged permanently` });
    }

    return NextResponse.json({ success: false, error: 'Invalid bulk action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin bulk operation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { action, caseId, status, data, tipId, tipStatus } = body;

    if (action === 'edit_case' && caseId && data) {
      const updated = await updateCase(caseId, data);
      return NextResponse.json({ success: updated });
    }

    if (action === 'update_tip' && tipId && tipStatus) {
      const updated = await updateTipStatus(tipId, tipStatus);
      return NextResponse.json({ success: updated });
    }

    if (caseId && status) {
      const updated = await updateCaseStatus(caseId, status);
      return NextResponse.json({ success: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating case in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const tipId = searchParams.get('tipId');
    const galleryId = searchParams.get('galleryId');
    const postId = searchParams.get('postId');
    const commentId = searchParams.get('commentId');
    const purge = searchParams.get('purge');

    if (purge === 'hard_purge_all') {
      const summary = await hardPurgeAllData();
      return NextResponse.json({ success: true, summary, message: 'All database data purged and vacuumed' });
    }
    if (purge === 'all_cases') {
      const count = await deleteAllCases();
      return NextResponse.json({ success: true, count, message: `All ${count} cases purged` });
    }
    if (purge === 'all_tips') {
      const count = await deleteAllTips();
      return NextResponse.json({ success: true, count, message: `All ${count} tips purged` });
    }
    if (purge === 'all_gallery') {
      const count = await deleteAllGalleryImages();
      return NextResponse.json({ success: true, count, message: `All ${count} gallery photos purged` });
    }
    if (purge === 'all_posts') {
      const count = await deleteAllCommunityPosts();
      return NextResponse.json({ success: true, count, message: `All ${count} community posts purged` });
    }

    if (caseId) {
      const deleted = await deleteCase(caseId);
      return NextResponse.json({ success: deleted, message: `Case ${caseId} deleted permanently` });
    }

    if (tipId) {
      const deleted = await deleteTip(tipId);
      return NextResponse.json({ success: deleted, message: `Tip ${tipId} deleted permanently` });
    }

    if (galleryId) {
      const deleted = await deleteGalleryImage(galleryId);
      return NextResponse.json({ success: deleted, message: `Gallery photo ${galleryId} deleted permanently` });
    }

    if (postId) {
      const deleted = await deleteCommunityPost(postId);
      return NextResponse.json({ success: deleted, message: `Community post ${postId} deleted permanently` });
    }

    if (commentId) {
      const deleted = await deleteCommunityComment(commentId);
      return NextResponse.json({ success: deleted, message: `Comment ${commentId} deleted permanently` });
    }

    return NextResponse.json({ success: false, error: 'Missing target ID or purge parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting record in admin:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
