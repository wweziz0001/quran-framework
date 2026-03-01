import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/surahs - Get all surahs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '114');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const revelationType = searchParams.get('revelation_type') || '';

    const where: Record<string, unknown> = { active: true };
    
    if (search) {
      where.OR = [
        { nameArabic: { contains: search, mode: 'insensitive' } },
        { nameEnglish: { contains: search, mode: 'insensitive' } },
        { number: parseInt(search) || -1 }
      ];
    }
    
    if (revelationType) {
      where.revelationType = revelationType;
    }

    const [surahs, total] = await Promise.all([
      db.quranSurah.findMany({
        where,
        orderBy: { number: 'asc' },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: { ayahs: true }
          }
        }
      }),
      db.quranSurah.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: surahs.map(s => ({
        ...s,
        ayahCount: s._count.ayahs
      })),
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surahs' },
      { status: 500 }
    );
  }
}
