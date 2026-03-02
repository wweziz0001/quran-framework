/**
 * Tafsir Controller
 * ==================
 * Controller for Tafsir entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registry } from '@/core/registry';

export class TafsirController {
  static _name = 'tafsir.controller';

  /**
   * GET /api/tafsir/sources
   * List all tafsir sources
   */
  static async listSources(request: NextRequest) {
    try {
      const sources = await db.quranTafsirSource.findMany({
        where: { isActive: true },
        orderBy: { isDefault: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: sources
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/tafsir/:surahId/:ayahNumber
   * Get tafsir for specific ayah
   */
  static async getTafsir(
    request: NextRequest,
    { params }: { params: { surahId: string; ayahNumber: string } }
  ) {
    try {
      const { searchParams } = new URL(request.url);
      const sourceId = searchParams.get('source');

      const where: Record<string, unknown> = {
        surahId: parseInt(params.surahId),
        ayah: { ayahNumber: parseInt(params.ayahNumber) }
      };

      if (sourceId) {
        where.sourceId = sourceId;
      }

      const tafsirEntries = await db.quranTafsirEntry.findMany({
        where: {
          surahId: parseInt(params.surahId),
          ayah: { ayahNumber: parseInt(params.ayahNumber) }
        },
        include: {
          source: true,
          ayah: true
        }
      });

      return NextResponse.json({
        success: true,
        data: tafsirEntries
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
}

Registry.registerAddon('tafsir.controller', TafsirController, ['quran']);

export default TafsirController;
