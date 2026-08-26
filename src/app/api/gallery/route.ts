import { NextResponse } from 'next/server';
import { 
  getGalleryImages, 
  insertGalleryImage, 
  deleteGalleryImage, 
  deleteGalleryImagesBulk, 
  deleteAllGalleryImages 
} from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ids, image } = body;

    if (action === 'delete_bulk' && Array.isArray(ids)) {
      const count = deleteGalleryImagesBulk(ids);
      return NextResponse.json({ success: true, count });
    }

    if (action === 'delete_all') {
      const count = deleteAllGalleryImages();
      return NextResponse.json({ success: true, count });
    }

    if (image && image.url) {
      const created = insertGalleryImage(image);
      return NextResponse.json({ success: true, image: created });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in gallery POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const deleted = deleteGalleryImage(id);
      return NextResponse.json({ success: deleted });
    }

    return NextResponse.json({ success: false, error: 'Missing image ID' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
