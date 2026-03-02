import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all tafsir sources
export async function GET() {
  try {
    const sources = await db.quranTafsirSource.findMany({
      include: {
        _count: {
          select: { entries: true }
        }
      },
      orderBy: { nameArabic: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      data: sources
    });
  } catch (error: any) {
    console.error('Error fetching tafsir sources:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create a new tafsir source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nameArabic, nameEnglish, slug, authorArabic, authorEnglish, language, isDefault, isActive } = body;
    
    if (!id || !nameArabic || !nameEnglish || !slug) {
      return NextResponse.json({
        success: false,
        error: 'الحقول المطلوبة: id, nameArabic, nameEnglish, slug'
      }, { status: 400 });
    }
    
    const source = await db.quranTafsirSource.create({
      data: {
        id,
        nameArabic,
        nameEnglish,
        slug,
        authorArabic: authorArabic || null,
        authorEnglish: authorEnglish || null,
        language: language || 'ar',
        isDefault: isDefault || false,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: source
    });
  } catch (error: any) {
    console.error('Error creating tafsir source:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
