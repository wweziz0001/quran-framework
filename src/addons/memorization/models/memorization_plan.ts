/**
 * Quran Models - Memorization Plan (خطة الحفظ)
 * ==============================================
 * Model for tracking Quran memorization plans
 */

import { BaseModel, db, api, fields } from '@/core/orm';
import { model } from '@/core/registry';
import { workflow, WorkflowDefinition } from '@/core/workflow';

// Workflow definition for memorization plan
const MEMORIZATION_PLAN_WORKFLOW: WorkflowDefinition = {
  model: 'quran.memorization.plan',
  field: 'state',
  initial: 'draft',
  states: [
    { name: 'draft', label: 'Draft', color: 'gray', onEnter: '_onDraftEnter' },
    { name: 'active', label: 'Active', color: 'green', onEnter: '_onActiveEnter', onExit: '_onActiveExit' },
    { name: 'paused', label: 'Paused', color: 'yellow', onEnter: '_onPausedEnter' },
    { name: 'completed', label: 'Completed', color: 'blue', onEnter: '_onCompletedEnter' },
    { name: 'cancelled', label: 'Cancelled', color: 'red' }
  ],
  transitions: [
    {
      name: 'start',
      from: 'draft',
      to: 'active',
      trigger: 'action_start',
      condition: '_can_start',
      action: '_do_start',
      button: { label: 'Start Plan', icon: 'play', groups: ['group_quran_student'] }
    },
    {
      name: 'pause',
      from: 'active',
      to: 'paused',
      trigger: 'action_pause',
      button: { label: 'Pause', icon: 'pause', groups: ['group_quran_student'] }
    },
    {
      name: 'resume',
      from: 'paused',
      to: 'active',
      trigger: 'action_resume',
      button: { label: 'Resume', icon: 'play', groups: ['group_quran_student'] }
    },
    {
      name: 'complete',
      from: ['active', 'paused'],
      to: 'completed',
      trigger: 'action_complete',
      condition: '_is_complete',
      action: '_do_complete',
      button: { label: 'Complete', icon: 'check', groups: ['group_quran_student'] }
    },
    {
      name: 'cancel',
      from: ['draft', 'active', 'paused'],
      to: 'cancelled',
      trigger: 'action_cancel',
      button: { label: 'Cancel', icon: 'x', groups: ['group_quran_student'], confirm: 'Are you sure?' }
    }
  ]
};

@workflow(MEMORIZATION_PLAN_WORKFLOW)
@model('quran.memorization.plan', {
  description: 'Memorization Plan',
  order: 'create_date desc',
  recName: 'name'
})
export class QuranMemorizationPlan extends BaseModel {
  static _fields = {
    // Basic
    id: new fields.Id(),
    name: new fields.Char({ string: 'Plan Name', required: true }),
    description: new fields.Html({ string: 'Description' }),
    
    // User
    user_id: new fields.Many2One({
      string: 'User',
      model: 'res.user',
      required: true,
      default: 'self'
    }),
    teacher_id: new fields.Many2One({
      string: 'Teacher',
      model: 'res.user',
      domain: [['groups', 'ilike', 'teacher']]
    }),
    
    // Plan Type
    plan_type: new fields.Selection({
      string: 'Plan Type',
      selection: [
        ['daily', 'Daily'],
        ['weekly', 'Weekly'],
        ['monthly', 'Monthly'],
        ['custom', 'Custom']
      ],
      default: 'daily',
      required: true
    }),
    
    // Settings
    daily_new_ayahs: new fields.Integer({ string: 'New Ayahs per Day', default: 5, required: true }),
    daily_revision: new fields.Integer({ string: 'Revision Ayahs per Day', default: 10 }),
    revision_method: new fields.Selection({
      string: 'Revision Method',
      selection: [
        ['spaced', 'Spaced Repetition'],
        ['sequential', 'Sequential'],
        ['random', 'Random']
      ],
      default: 'spaced'
    }),
    
    // Progress
    current_surah_id: new fields.Many2One({
      string: 'Current Surah',
      model: 'quran.surah'
    }),
    current_ayah_number: new fields.Integer({ string: 'Current Ayah' }),
    total_memorized: new fields.Computed({
      string: 'Total Memorized',
      compute: '_compute_statistics',
      store: true
    }),
    completion_percentage: new fields.Computed({
      string: 'Completion %',
      compute: '_compute_statistics',
      store: true
    }),
    
    // State (Workflow)
    state: new fields.Selection({
      string: 'Status',
      selection: [
        ['draft', 'Draft'],
        ['active', 'Active'],
        ['paused', 'Paused'],
        ['completed', 'Completed'],
        ['cancelled', 'Cancelled']
      ],
      default: 'draft',
      required: true
    }),
    
    // Dates
    start_date: new fields.Date({ string: 'Start Date' }),
    target_date: new fields.Date({ string: 'Target Date' }),
    end_date: new fields.Date({ string: 'Completion Date' }),
    
    // Statistics
    streak_days: new fields.Integer({ string: 'Current Streak', default: 0 }),
    longest_streak: new fields.Integer({ string: 'Longest Streak', default: 0 }),
    last_activity_date: new fields.Date({ string: 'Last Activity' }),
    total_days_active: new fields.Computed({
      string: 'Total Active Days',
      compute: '_compute_statistics',
      store: true
    }),
    
    // Relations
    progress_ids: new fields.One2Many({
      string: 'Progress Records',
      model: 'quran.memorization.progress',
      field: 'plan_id'
    }),
    revision_ids: new fields.One2Many({
      string: 'Revisions',
      model: 'quran.revision.schedule',
      field: 'plan_id'
    }),
    achievement_ids: new fields.One2Many({
      string: 'Achievements',
      model: 'quran.achievement',
      field: 'plan_id'
    }),
    
    // Active
    active: new fields.Boolean({ string: 'Active', default: true }),
  };
  
  // Computed statistics
  @api.depends('progress_ids', 'progress_ids.state', 'start_date')
  async _compute_statistics(): Promise<{
    total_memorized: number;
    completion_percentage: number;
    total_days_active: number;
  }> {
    const progressIds = this.get('progress_ids') as { state: string }[];
    
    const memorized = progressIds?.filter(
      p => p.state === 'memorized' || p.state === 'mastered'
    )?.length || 0;
    
    const totalAyahs = 6236;
    const percentage = (memorized / totalAyahs) * 100;
    
    const startDate = this.get('start_date') as string;
    const endDate = this.get('end_date') as string;
    const totalDays = startDate 
      ? Math.floor((new Date(endDate || Date.now()).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    this.set('total_memorized', memorized);
    this.set('completion_percentage', percentage);
    this.set('total_days_active', totalDays);
    
    return { total_memorized: memorized, completion_percentage: percentage, total_days_active: totalDays };
  }
  
  // Workflow callbacks
  async _onDraftEnter(): Promise<void> {
    console.log('Plan created');
  }
  
  async _onActiveEnter(): Promise<void> {
    this.set('start_date', new Date().toISOString().split('T')[0]);
    await this._initialize_progress();
    await this._create_revision_schedule();
  }
  
  async _onActiveExit(): Promise<void> {
    console.log('Exiting active state');
  }
  
  async _onPausedEnter(): Promise<void> {
    console.log('Plan paused');
  }
  
  async _onCompletedEnter(): Promise<void> {
    this.set('end_date', new Date().toISOString().split('T')[0]);
    await this._award_completion_achievement();
  }
  
  // Workflow conditions
  async _can_start(): Promise<boolean> {
    const dailyNewAyahs = this.get('daily_new_ayahs') as number;
    return dailyNewAyahs >= 1 && dailyNewAyahs <= 50;
  }
  
  async _is_complete(): Promise<boolean> {
    const totalMemorized = this.get('total_memorized') as number;
    return totalMemorized >= 6236;
  }
  
  // Workflow actions
  async _do_start(): Promise<void> {
    console.log('Starting memorization plan');
  }
  
  async _do_complete(): Promise<void> {
    console.log('Completing memorization plan');
  }
  
  // Initialize progress
  private async _initialize_progress(): Promise<void> {
    // Get first Ayahs to memorize
    const ayahs = await db.quranAyah.findMany({
      take: this.get('daily_new_ayahs') as number,
      orderBy: { ayah_number_global: 'asc' }
    });
    
    // Create progress records
    for (const ayah of ayahs) {
      await db.quranMemorizationProgress.create({
        data: {
          plan_id: this.id,
          user_id: this.get('user_id'),
          ayah_id: ayah.id,
          surah_id: ayah.surah_id,
          state: 'learning'
        }
      });
    }
  }
  
  // Create revision schedule
  private async _create_revision_schedule(): Promise<void> {
    const today = new Date();
    
    await db.quranRevisionSchedule.create({
      data: {
        plan_id: this.id,
        user_id: this.get('user_id'),
        scheduled_date: today,
        revision_type: 'daily',
        state: 'pending'
      }
    });
  }
  
  // Award completion achievement
  private async _award_completion_achievement(): Promise<void> {
    await db.quranAchievement.create({
      data: {
        user_id: this.get('user_id'),
        plan_id: this.id,
        achievement_type: 'quran_complete',
        title: 'Quran Memorization Complete!',
        description: 'You have memorized the entire Quran!',
        points: 10000
      }
    });
  }
  
  // Business methods
  async recordDailyProgress(newMemorized: number[], revisionCompleted: number[]): Promise<void> {
    const today = new Date();
    const lastActivity = this.get('last_activity_date') as string;
    
    // Update streak
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.set('streak_days', (this.get('streak_days') as number) + 1);
      } else if (diffDays > 1) {
        this.set('streak_days', 1);
      }
    } else {
      this.set('streak_days', 1);
    }
    
    if ((this.get('streak_days') as number) > (this.get('longest_streak') as number)) {
      this.set('longest_streak', this.get('streak_days'));
    }
    
    this.set('last_activity_date', today.toISOString().split('T')[0]);
    
    await this.write({
      streak_days: this.get('streak_days'),
      longest_streak: this.get('longest_streak'),
      last_activity_date: today.toISOString().split('T')[0]
    });
    
    // Check achievements
    await this._check_achievements();
  }
  
  private async _check_achievements(): Promise<void> {
    const streakDays = this.get('streak_days') as number;
    const totalMemorized = this.get('total_memorized') as number;
    
    const achievements = [
      { days: 7, title: 'Week Streak', points: 70 },
      { days: 30, title: 'Month Streak', points: 300 },
      { days: 100, title: 'Century Streak', points: 1000 },
      { days: 365, title: 'Year Streak', points: 3650 }
    ];
    
    for (const ach of achievements) {
      if (streakDays >= ach.days) {
        const existing = await db.quranAchievement.findFirst({
          where: {
            user_id: this.get('user_id') as number,
            achievement_type: 'streak',
            reference_id: ach.days.toString()
          }
        });
        
        if (!existing) {
          await db.quranAchievement.create({
            data: {
              user_id: this.get('user_id') as number,
              plan_id: this.id as number,
              achievement_type: 'streak',
              reference_id: ach.days.toString(),
              title: ach.title,
              description: `${ach.days} consecutive days of memorization!`,
              points: ach.points
            }
          });
        }
      }
    }
  }
}
