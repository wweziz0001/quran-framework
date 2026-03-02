import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ayahId = searchParams.get('ayahId');
    const surahId = searchParams.get('surahId');
    const sourceId = searchParams.get('sourceId');
    
    const where: any = {};
    if (ayahId) where.ayahId = parseInt(ayahId);
    if (surahId) where.surahId = parseInt(surahId);
    if (sourceId) where.sourceId = sourceId;
    
    const entries = await db.quranTafsirEntry.findMany({
      where,
      include: {
        source: {
          select: { id: true, nameArabic: true, nameEnglish: true, language: true }
        }
      },
      take: 50
    });
    
    return NextResponse.json({
      success: true,
      data: entries.map(e => ({
        id: e.id,
        surahId: e.surahId,
        ayahId: e.ayahId,
        source: e.source,
        textArabic: e.textArabic,
        textTranslation: e.textTranslation,
        htmlContent: e.htmlContent
      }))
    });
  } catch (error: any) {
    console.error('Error fetching tafsir entries:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
