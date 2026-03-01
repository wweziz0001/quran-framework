import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reciters - Get available reciters
export async function GET() {
  try {
    const reciters = await db.quranReciter.findMany({
      where: { isActive: true },
      orderBy: { popularity: 'desc' },
      include: {
        _count: {
          select: { recitations: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: reciters.map(r => ({
        ...r,
        recitationCount: r._count.recitations
      }))
    });
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reciters' },
      { status: 500 }
    );
  }
}
