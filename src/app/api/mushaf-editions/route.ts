import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get image mushaf editions
    const imageEditions = await db.imageMushafEdition.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { ImageMushafPage: true, ImageMushafAyah: true } }
      }
    });
    
    // Get TTF mushaf editions
    const ttfEditions = await db.ttfMushafEdition.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { TtfMushafPage: true, TtfMushafAyah: true } }
      }
    });
    
    const editions = [
      ...imageEditions.map(e => ({
        id: e.id,
        nameArabic: e.nameArabic,
        nameEnglish: e.nameEnglish,
        type: 'image',
        isDefault: e.isDefault,
        pagesCount: e._count.ImageMushafPage,
        ayahsCount: e._count.ImageMushafAyah
      })),
      ...ttfEditions.map(e => ({
        id: `ttf-${e.id}`,
        nameArabic: `${e.nameArabic} (خط)`,
        nameEnglish: `${e.nameEnglish} (Font)`,
        type: 'ttf',
        isDefault: e.isDefault,
        pagesCount: e._count.TtfMushafPage,
        ayahsCount: e._count.TtfMushafAyah
      }))
    ];
    
    return NextResponse.json({
      success: true,
      data: editions
    });
  } catch (error: any) {
    console.error('Error fetching mushaf editions:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
