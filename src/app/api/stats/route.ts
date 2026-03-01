import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stats - Get Quran statistics
export async function GET() {
  try {
    const [
      totalSurahs,
      totalAyahs,
      totalWords,
      totalLetters,
      makkiCount,
      madaniCount,
      totalJuz,
      totalPages
    ] = await Promise.all([
      db.quranSurah.count({ where: { active: true } }),
      db.quranAyah.count({ where: { active: true } }),
      db.quranSurah.aggregate({
        _sum: { wordCount: true }
      }),
      db.quranSurah.aggregate({
        _sum: { letterCount: true }
      }),
      db.quranSurah.count({ where: { revelationType: 'makki', active: true } }),
      db.quranSurah.count({ where: { revelationType: 'madani', active: true } }),
      db.quranAyah.aggregate({
        _max: { juzNumber: true }
      }),
      db.quranAyah.aggregate({
        _max: { pageNumber: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSurahs,
        totalAyahs,
        totalWords: totalWords._sum.wordCount || 0,
        totalLetters: totalLetters._sum.letterCount || 0,
        makkiSurahs: makkiCount,
        madaniSurahs: madaniCount,
        totalJuz: totalJuz._max.juzNumber || 30,
        totalPages: totalPages._max.pageNumber || 604
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
