/**
 * Audio Controller
 * =================
 * Controller for Recitations and Audio
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registry } from '@/core/registry';

export class AudioController {
  static _name = 'audio.controller';

  /**
   * GET /api/audio/reciters
   * List all reciters
   */
  static async listReciters(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '50');

      const reciters = await db.quranReciter.findMany({
        where: { 
          isActive: true,
          deletedAt: null
        },
        orderBy: [
          { popularity: 'desc' },
          { nameEnglish: 'asc' }
        ],
        take: limit
      });

      return NextResponse.json({
        success: true,
        data: reciters
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/audio/reciters/:id
   * Get reciter details
   */
  static async getReciter(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const reciter = await db.quranReciter.findUnique({
        where: { id: params.id },
        include: {
          recitations: {
            where: { isActive: true },
            include: { surah: true }
          }
        }
      });

      if (!reciter) {
        return NextResponse.json(
          { success: false, error: 'Reciter not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: reciter
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/audio/recitations/:surahId/:reciterId
   * Get recitation for surah by reciter
   */
  static async getRecitation(
    request: NextRequest,
    { params }: { params: { surahId: string; reciterId: string } }
  ) {
    try {
      const { surahId, reciterId } = params;

      const recitation = await db.quranRecitation.findFirst({
        where: {
          surahId: parseInt(surahId),
          reciterId,
          isActive: true
        },
        include: {
          reciter: true,
          surah: true,
          ayahTimings: {
            orderBy: { startTimeMs: 'asc' }
          }
        }
      });

      if (!recitation) {
        return NextResponse.json(
          { success: false, error: 'Recitation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: recitation
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/audio/timing/:recitationId/:ayahId
   * Get ayah timing for word highlighting
   */
  static async getAyahTiming(
    request: NextRequest,
    { params }: { params: { recitationId: string; ayahId: string } }
  ) {
    try {
      const timing = await db.quranRecitationAyah.findUnique({
        where: {
          recitationId_ayahId: {
            recitationId: params.recitationId,
            ayahId: parseInt(params.ayahId)
          }
        }
      });

      if (!timing) {
        return NextResponse.json(
          { success: false, error: 'Timing not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: timing
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
}

Registry.registerAddon('audio.controller', AudioController, ['quran']);

export default AudioController;
