import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    const pageNumber = searchParams.get('pageNumber');
    
    if (!editionId || !pageNumber) {
      return NextResponse.json({
        success: false,
        error: 'editionId and pageNumber are required'
      }, { status: 400 });
    }
    
    // Try to find page in ImageMushafPage
    const page = await db.imageMushafPage.findFirst({
      where: {
        editionId,
        pageNumber: parseInt(pageNumber)
      }
    });
    
    if (page) {
      return NextResponse.json({
        success: true,
        data: {
          id: page.id,
          pageNumber: page.pageNumber,
          imageUrl: page.imageUrl || `/api/mushaf-images/${editionId}/${pageNumber}.png`
        }
      });
    }
    
    // Return placeholder if not found
    return NextResponse.json({
      success: true,
      data: {
        id: `placeholder-${pageNumber}`,
        pageNumber: parseInt(pageNumber),
        imageUrl: null
      }
    });
  } catch (error: any) {
    console.error('Error fetching mushaf page:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
