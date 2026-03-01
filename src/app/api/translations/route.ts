import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/translations - Get available translations
export async function GET() {
  try {
    const translations = await db.quranTranslationSource.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { language: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: translations
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}
