import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surahId = searchParams.get('surahId');
    const reciterId = searchParams.get('reciterId');
    
    const where: any = { isActive: true };
    if (surahId) where.surahId = parseInt(surahId);
    if (reciterId) where.reciterId = reciterId;
    
    const recitations = await db.quranRecitation.findMany({
      where,
      include: {
        reciter: {
          select: { id: true, nameArabic: true, nameEnglish: true, slug: true }
        }
      },
      orderBy: { downloadCount: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: recitations.map(r => ({
        id: r.id,
        surahId: r.surahId,
        reciterId: r.reciterId,
        reciter: r.reciter,
        style: r.style,
        bitrate: r.bitrate,
        format: r.format,
        audioUrl: r.audioUrl,
        audioUrlHd: r.audioUrlHd,
        durationSeconds: r.durationSeconds,
        downloadCount: r.downloadCount
      }))
    });
  } catch (error: any) {
    console.error('Error fetching recitations:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
