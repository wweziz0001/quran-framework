import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/search - Search Quran
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, surah, ayah, translation
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { surahs: [], ayahs: [] },
        meta: { query, total: 0 }
      });
    }

    const results: {
      surahs: unknown[];
      ayahs: unknown[];
    } = {
      surahs: [],
      ayahs: []
    };

    // Search surahs
    if (type === 'all' || type === 'surah') {
      results.surahs = await db.quranSurah.findMany({
        where: {
          active: true,
          OR: [
            { nameArabic: { contains: query, mode: 'insensitive' } },
            { nameEnglish: { contains: query, mode: 'insensitive' } },
            { nameTransliteration: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit
      });
    }

    // Search ayahs
    if (type === 'all' || type === 'ayah') {
      results.ayahs = await db.quranAyah.findMany({
        where: {
          active: true,
          OR: [
            { textArabic: { contains: query, mode: 'insensitive' } },
            { textUthmani: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          surah: {
            select: { number: true, nameEnglish: true, nameArabic: true }
          }
        },
        skip: offset,
        take: limit
      });
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        query,
        type,
        total: (results.surahs as unknown[]).length + (results.ayahs as unknown[]).length
      }
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
