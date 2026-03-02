/**
 * Quran Controller
 * =================
 * Odoo-style Controller for Quran API endpoints
 * 
 * Following Odoo's @http.route decorator pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registry } from '@/core/registry';

// Controller base class (Odoo-style)
export class QuranController {
  // Model reference
  static _name = 'quran.controller';
  static _model = 'quran.surah';

  /**
   * GET /api/quran/surahs
   * List all surahs
   */
  static async listSurahs(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '114');
      const offset = parseInt(searchParams.get('offset') || '0');
      const revelationType = searchParams.get('revelation_type');

      const where: Record<string, unknown> = { active: true };
      if (revelationType) {
        where.revelationType = revelationType;
      }

      const [surahs, total] = await Promise.all([
        db.quranSurah.findMany({
          where,
          orderBy: { number: 'asc' },
          take: limit,
          skip: offset,
          include: {
            _count: { select: { ayahs: true } }
          }
        }),
        db.quranSurah.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: surahs.map(s => ({
          ...s,
          ayah_count: s._count.ayahs
        })),
        pagination: {
          total,
          limit,
          offset,
          has_more: offset + limit < total
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/quran/surahs/:id
   * Get single surah with ayahs
   */
  static async getSurah(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const surahId = parseInt(params.id);
      const { searchParams } = new URL(request.url);
      const includeAyahs = searchParams.get('include_ayahs') !== 'false';
      const translationSource = searchParams.get('translation');

      const surah = await db.quranSurah.findUnique({
        where: { id: surahId },
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

      return NextResponse.json({
        success: true,
        data: surah
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/quran/ayahs
   * List ayahs with filters
   */
  static async listAyahs(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const surahId = searchParams.get('surah_id') ? parseInt(searchParams.get('surah_id')!) : undefined;
      const juzNumber = searchParams.get('juz') ? parseInt(searchParams.get('juz')!) : undefined;
      const pageNumber = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      const where: Record<string, unknown> = { active: true, deletedAt: null };
      if (surahId) where.surahId = surahId;
      if (juzNumber) where.juzNumber = juzNumber;
      if (pageNumber) where.pageNumber = pageNumber;

      const [ayahs, total] = await Promise.all([
        db.quranAyah.findMany({
          where,
          orderBy: [{ surahId: 'asc' }, { ayahNumber: 'asc' }],
          take: limit,
          skip: offset
        }),
        db.quranAyah.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: ayahs,
        pagination: { total, limit, offset, has_more: offset + limit < total }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/quran/ayahs/:id
   * Get single ayah
   */
  static async getAyah(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const ayahId = parseInt(params.id);

      const ayah = await db.quranAyah.findUnique({
        where: { id: ayahId },
        include: {
          surah: true,
          tafsirEntries: {
            include: { source: true }
          }
        }
      });

      if (!ayah) {
        return NextResponse.json(
          { success: false, error: 'Ayah not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: ayah
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/quran/search
   * Search in Quran
   */
  static async search(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q');
      const limit = parseInt(searchParams.get('limit') || '20');

      if (!query) {
        return NextResponse.json(
          { success: false, error: 'Query parameter "q" is required' },
          { status: 400 }
        );
      }

      // Search in Arabic text
      const results = await db.quranAyah.findMany({
        where: {
          OR: [
            { textArabic: { contains: query } },
            { textUthmani: { contains: query } },
            { textClean: { contains: query } }
          ]
        },
        orderBy: { ayahNumberGlobal: 'asc' },
        take: limit,
        include: { surah: true }
      });

      return NextResponse.json({
        success: true,
        data: results,
        query,
        count: results.length
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
}

// Register controller
Registry.registerAddon('quran.controller', QuranController, ['quran']);

export default QuranController;
