import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/surahs/[id] - Get a specific surah with ayahs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surahNumber = parseInt(id);
    
    if (isNaN(surahNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid surah number' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const includeAyahs = searchParams.get('include_ayahs') !== 'false';
    const translationSource = searchParams.get('translation');

    const surah = await db.quranSurah.findUnique({
      where: { number: surahNumber },
      include: includeAyahs ? {
        ayahs: {
          orderBy: { ayahNumber: 'asc' },
          include: translationSource ? {
            translationEntries: {
              where: { sourceId: translationSource }
            }
          } : undefined
        }
      } : undefined
    });

    if (!surah) {
      return NextResponse.json(
        { success: false, error: 'Surah not found' },
        { status: 404 }
      );
    }

    // Get next and previous surah
    const [prevSurah, nextSurah] = await Promise.all([
      db.quranSurah.findFirst({
        where: { number: surahNumber - 1, active: true },
        select: { number: true, nameEnglish: true, nameArabic: true }
      }),
      db.quranSurah.findFirst({
        where: { number: surahNumber + 1, active: true },
        select: { number: true, nameEnglish: true, nameArabic: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...surah,
        prevSurah,
        nextSurah
      }
    });
  } catch (error) {
    console.error('Error fetching surah:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surah' },
      { status: 500 }
    );
  }
}
