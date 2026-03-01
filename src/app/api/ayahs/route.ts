import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/ayahs - Get ayahs with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const surahId = searchParams.get('surah_id');
    const juzNumber = searchParams.get('juz');
    const pageNumber = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const translationSource = searchParams.get('translation');

    const where: Record<string, unknown> = { active: true };
    
    if (surahId) {
      where.surahId = parseInt(surahId);
    }
    if (juzNumber) {
      where.juzNumber = parseInt(juzNumber);
    }
    if (pageNumber) {
      where.pageNumber = parseInt(pageNumber);
    }

    const include: Record<string, unknown> = {
      surah: {
        select: { number: true, nameEnglish: true, nameArabic: true }
      }
    };

    if (translationSource) {
      include.translationEntries = {
        where: { sourceId: translationSource }
      };
    }

    const [ayahs, total] = await Promise.all([
      db.quranAyah.findMany({
        where,
        orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
        skip: offset,
        take: limit,
        include
      }),
      db.quranAyah.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: ayahs,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching ayahs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ayahs' },
      { status: 500 }
    );
  }
}
