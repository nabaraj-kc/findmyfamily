import { NextResponse } from 'next/server';
import { 
  getCommunityPosts, 
  insertCommunityPost, 
  deleteCommunityPost, 
  deleteCommunityPostsBulk, 
  deleteAllCommunityPosts,
  insertCommunityComment,
  deleteCommunityComment
} from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getCommunityPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, post, comment, postIds } = body;

    if (action === 'delete_bulk' && Array.isArray(postIds)) {
      const count = deleteCommunityPostsBulk(postIds);
      return NextResponse.json({ success: true, count });
    }

    if (action === 'delete_all') {
      const count = deleteAllCommunityPosts();
      return NextResponse.json({ success: true, count });
    }

    if (action === 'create_comment' && comment) {
      const created = insertCommunityComment(comment.postId, comment.author, comment.text);
      return NextResponse.json({ success: true, comment: created });
    }

    if (post && post.content) {
      const created = insertCommunityPost(post);
      return NextResponse.json({ success: true, post: created });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in community POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

