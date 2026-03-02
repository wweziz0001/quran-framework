import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surahId = searchParams.get('surahId');
    const surahNumber = searchParams.get('surahNumber');
    const ayahNumber = searchParams.get('ayahNumber');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get ayah by surah number and ayah number
    if (surahNumber && ayahNumber) {
      const ayah = await db.quranAyah.findFirst({
        where: {
          surah: { number: parseInt(surahNumber) },
          ayahNumber: parseInt(ayahNumber)
        },
        include: {
          surah: {
            select: { id: true, number: true, nameArabic: true, nameEnglish: true }
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        data: ayah ? [ayah] : []
      });
    }
    
    // Get ayahs by surah ID
    if (surahId) {
      const ayahs = await db.quranAyah.findMany({
        where: { surahId: parseInt(surahId) },
        orderBy: { ayahNumber: 'asc' },
        include: {
          surah: {
            select: { id: true, number: true, nameArabic: true, nameEnglish: true }
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        data: ayahs
      });
    }
    
    // Get all ayahs with pagination
    const ayahs = await db.quranAyah.findMany({
      take: limit,
      skip: offset,
      orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
      include: {
        surah: {
          select: { id: true, number: true, nameArabic: true, nameEnglish: true }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: ayahs
    });
  } catch (error: any) {
    console.error('Error fetching ayahs:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
