/**
 * Memorization Controller
 * ========================
 * Controller for memorization plans and progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Registry } from '@/core/registry';

export class MemorizationController {
  static _name = 'memorization.controller';

  /**
   * GET /api/memorization/plans
   * List all memorization plans for user
   */
  static async listPlans(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('user_id');

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      const plans = await db.quranMemorizationPlan.findMany({
        where: { 
          userId: parseInt(userId),
          active: true 
        },
        include: {
          _count: { select: { progress: true, achievements: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: plans
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/memorization/plans
   * Create new memorization plan
   */
  static async createPlan(request: NextRequest) {
    try {
      const body = await request.json();
      const { userId, name, description, planType, dailyNewAyahs, dailyRevision } = body;

      const plan = await db.quranMemorizationPlan.create({
        data: {
          userId,
          name,
          description,
          planType: planType || 'daily',
          dailyNewAyahs: dailyNewAyahs || 5,
          dailyRevision: dailyRevision || 10,
          state: 'draft'
        }
      });

      return NextResponse.json({
        success: true,
        data: plan
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/memorization/progress/:planId
   * Get progress for a plan
   */
  static async getProgress(
    request: NextRequest,
    { params }: { params: { planId: string } }
  ) {
    try {
      const progress = await db.quranMemorizationProgress.findMany({
        where: { planId: parseInt(params.planId) },
        include: { ayah: true },
        orderBy: { ayahId: 'asc' }
      });

      return NextResponse.json({
        success: true,
        data: progress
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/memorization/progress
   * Update memorization progress
   */
  static async updateProgress(request: NextRequest) {
    try {
      const body = await request.json();
      const { planId, ayahId, qualityRating } = body;

      // Get existing progress
      const existing = await db.quranMemorizationProgress.findUnique({
        where: {
          planId_ayahId: { planId, ayahId }
        }
      });

      // Calculate new SM-2 values
      const oldEf = existing?.easeFactor || 2.5;
      const oldInterval = existing?.intervalDays || 1;
      
      // SM-2 Algorithm
      let newEf = oldEf + (0.1 - (5 - qualityRating) * (0.08 + (5 - qualityRating) * 0.02));
      newEf = Math.max(1.3, newEf);
      
      let newInterval = 1;
      if (existing?.revisionCount === 0) {
        newInterval = 1;
      } else if (existing?.revisionCount === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(oldInterval * newEf);
      }

      const progress = await db.quranMemorizationProgress.upsert({
        where: {
          planId_ayahId: { planId, ayahId }
        },
        create: {
          planId,
          ayahId,
          surahId: body.surahId,
          userId: body.userId,
          state: qualityRating >= 3 ? 'reviewing' : 'learning',
          revisionCount: 1,
          correctCount: qualityRating >= 3 ? 1 : 0,
          mistakeCount: qualityRating < 3 ? 1 : 0,
          qualityRating,
          easeFactor: newEf,
          intervalDays: newInterval,
          firstMemorized: new Date(),
          lastRevised: new Date(),
          nextRevision: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
        },
        update: {
          state: qualityRating >= 3 ? 'reviewing' : 'learning',
          revisionCount: { increment: 1 },
          correctCount: qualityRating >= 3 ? { increment: 1 } : undefined,
          mistakeCount: qualityRating < 3 ? { increment: 1 } : undefined,
          qualityRating,
          easeFactor: newEf,
          intervalDays: newInterval,
          lastRevised: new Date(),
          nextRevision: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
        }
      });

      return NextResponse.json({
        success: true,
        data: progress
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/memorization/revisions/today
   * Get today's revision schedule
   */
  static async getTodayRevisions(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('user_id');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const revisions = await db.quranRevisionSchedule.findMany({
        where: {
          userId: parseInt(userId!),
          scheduledDate: today,
          state: 'pending'
        },
        include: { plan: true }
      });

      return NextResponse.json({
        success: true,
        data: revisions
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/memorization/achievements/:userId
   * Get user achievements
   */
  static async getAchievements(
    request: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      const achievements = await db.quranAchievement.findMany({
        where: { userId: parseInt(params.userId) },
        orderBy: { achievedAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }
}

Registry.registerAddon('memorization.controller', MemorizationController, ['quran']);

export default MemorizationController;
