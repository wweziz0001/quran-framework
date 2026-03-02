/**
 * Mushaf Controller
 * ==================
 * Controller for Mushaf Editions (Image & TTF)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registry } from '@/core/registry';

export class MushafController {
  static _name = 'mushaf.controller';

  /**
   * GET /api/mushaf/editions
   * List all mushaf editions
   */
  static async listEditions(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const type = searchParams.get('type'); // 'image' or 'ttf'

      const [imageEditions, ttfEditions] = await Promise.all([
        type !== 'ttf' ? db.imageMushafEdition.findMany({
          where: { isActive: true },
          orderBy: { isDefault: 'desc' }
        }) : Promise.resolve([]),
        type !== 'image' ? db.ttfMushafEdition.findMany({
          where: { isActive: true },
          orderBy: { isDefault: 'desc' }
        }) : Promise.resolve([])
      ]);

      return NextResponse.json({
        success: true,
        data: {
          image: imageEditions,
          ttf: ttfEditions
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
   * GET /api/mushaf/image/:editionId/pages/:pageNumber
   * Get mushaf page (image-based)
   */
  static async getImagePage(
    request: NextRequest,
    { params }: { params: { editionId: string; pageNumber: string } }
  ) {
    try {
      const { editionId, pageNumber } = params;
      const page = parseInt(pageNumber);

      const [pageData, ayahs] = await Promise.all([
        db.imageMushafPage.findUnique({
          where: {
            editionId_pageNumber: { editionId, pageNumber: page }
          }
        }),
        db.imageMushafAyah.findMany({
          where: { editionId, page },
          include: {
            lines: {
              orderBy: { lineNumber: 'asc' },
              include: {
                words: { orderBy: { wordNumber: 'asc' } }
              }
            }
          }
        })
      ]);

      if (!pageData) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          page: pageData,
          ayahs
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
   * GET /api/mushaf/ttf/:editionId/pages/:pageNumber
   * Get mushaf page (TTF-based)
   */
  static async getTtfPage(
    request: NextRequest,
    { params }: { params: { editionId: string; pageNumber: string } }
  ) {
    try {
      const { editionId, pageNumber } = params;
      const page = parseInt(pageNumber);

      const [pageData, ayahs] = await Promise.all([
        db.ttfMushafPage.findUnique({
          where: {
            editionId_pageNumber: { editionId, pageNumber: page }
          }
        }),
        db.ttfMushafAyah.findMany({
          where: { editionId, page },
          orderBy: { ayah: 'asc' },
          include: {
            words: { orderBy: [{ lineNumber: 'asc' }, { wordNumber: 'asc' }] }
          }
        })
      ]);

      if (!pageData) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          page: pageData,
          ayahs
        }
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
}

Registry.registerAddon('mushaf.controller', MushafController, ['quran']);

export default MushafController;
