/**
 * Quran Models - Surah (السورة)
 * ==============================
 * Model representing a Surah in the Quran
 */

import { BaseModel, db, api, fields, Domain } from '@/core/orm';
import { model } from '@/core/registry';

@model('quran.surah', {
  description: 'Quran Surah',
  order: 'number asc',
  recName: 'name_english'
})
export class QuranSurah extends BaseModel {
  // Field definitions
  static _fields = {
    id: new fields.Id(),
    number: new fields.Integer({ string: 'Surah Number', required: true }),
    name_arabic: new fields.Char({ string: 'Arabic Name', required: true }),
    name_english: new fields.Char({ string: 'English Name', required: true, translate: true }),
    name_transliteration: new fields.Char({ string: 'Transliteration' }),
    
    // Classification
    revelation_type: new fields.Selection({
      string: 'Revelation Type',
      selection: [['makki', 'Makki'], ['madani', 'Madani']],
      required: true,
      default: 'makki'
    }),
    revelation_order: new fields.Integer({ string: 'Revelation Order' }),
    
    // Content
    total_ayahs: new fields.Integer({ string: 'Total Ayahs', required: true }),
    ayah_count: new fields.Computed({
      string: 'Ayah Count',
      compute: '_compute_ayah_count',
      store: true
    }),
    
    // Location
    page_number_start: new fields.Integer({ string: 'Start Page' }),
    page_number_end: new fields.Computed({
      string: 'End Page',
      compute: '_compute_page_end',
      store: true
    }),
    juz_number_start: new fields.Integer({ string: 'Start Juz' }),
    juz_number_end: new fields.Computed({
      string: 'End Juz',
      compute: '_compute_juz_end',
      store: true
    }),
    
    // Statistics
    word_count: new fields.Computed({
      string: 'Word Count',
      compute: '_compute_statistics',
      store: true
    }),
    letter_count: new fields.Computed({
      string: 'Letter Count',
      compute: '_compute_statistics',
      store: true
    }),
    
    // Relations
    ayah_ids: new fields.One2Many({
      string: 'Ayahs',
      model: 'quran.ayah',
      field: 'surah_id'
    }),
    recitation_ids: new fields.One2Many({
      string: 'Recitations',
      model: 'quran.recitation',
      field: 'surah_id'
    }),
    
    // Description
    description: new fields.Html({ string: 'Description', translate: true }),
    themes: new fields.Char({ string: 'Main Themes', translate: true }),
    
    // Active
    active: new fields.Boolean({ string: 'Active', default: true }),
  };
  
  // Computed fields
  @api.depends('ayah_ids')
  async _compute_ayah_count(): Promise<number> {
    const ayahs = this.get('ayah_ids') as number[];
    return ayahs?.length || 0;
  }
  
  @api.depends('ayah_ids.page_number')
  async _compute_page_end(): Promise<number> {
    const ayahs = this.get('ayah_ids') as { page_number: number }[];
    if (!ayahs || ayahs.length === 0) {
      return this.get('page_number_start') as number || 0;
    }
    return Math.max(...ayahs.map(a => a.page_number));
  }
  
  @api.depends('ayah_ids.juz_number')
  async _compute_juz_end(): Promise<number> {
    const ayahs = this.get('ayah_ids') as { juz_number: number }[];
    if (!ayahs || ayahs.length === 0) {
      return this.get('juz_number_start') as number || 0;
    }
    return Math.max(...ayahs.map(a => a.juz_number));
  }
  
  @api.depends('ayah_ids.word_count', 'ayah_ids.letter_count')
  async _compute_statistics(): Promise<{ word_count: number; letter_count: number }> {
    const ayahs = this.get('ayah_ids') as { word_count: number; letter_count: number }[];
    if (!ayahs || ayahs.length === 0) {
      return { word_count: 0, letter_count: 0 };
    }
    return {
      word_count: ayahs.reduce((sum, a) => sum + (a.word_count || 0), 0),
      letter_count: ayahs.reduce((sum, a) => sum + (a.letter_count || 0), 0)
    };
  }
  
  // Constraints
  @api.constrains('total_ayahs', 'ayah_count')
  async _check_ayah_count(): Promise<void> {
    const totalAyahs = this.get('total_ayahs') as number;
    const ayahCount = this.get('ayah_count') as number;
    
    if (ayahCount > 0 && ayahCount !== totalAyahs) {
      throw new Error(`Ayah count (${ayahCount}) does not match expected total (${totalAyahs})`);
    }
  }
  
  // Business methods
  getAyahByNumber(ayahNumber: number): unknown {
    const ayahs = this.get('ayah_ids') as { ayah_number: number }[];
    if (!ayahs) return null;
    return ayahs.find(a => a.ayah_number === ayahNumber);
  }
  
  getAyahsRange(start: number, end: number): unknown[] {
    const ayahs = this.get('ayah_ids') as { ayah_number: number }[];
    if (!ayahs) return [];
    return ayahs.filter(a => a.ayah_number >= start && a.ayah_number <= end);
  }
  
  getFirstAyah(): unknown {
    const ayahs = this.get('ayah_ids') as unknown[];
    return ayahs?.[0] || null;
  }
  
  getLastAyah(): unknown {
    const ayahs = this.get('ayah_ids') as unknown[];
    return ayahs?.[ayahs.length - 1] || null;
  }
  
  // Display name
  get displayName(): string {
    const number = this.get('number');
    const nameEnglish = this.get('name_english');
    const nameArabic = this.get('name_arabic');
    return `${number}. ${nameEnglish} (${nameArabic})`;
  }
  
  // Name search
  static async nameSearch(
    name: string,
    domain: Domain = [],
    operator: string = 'ilike',
    limit: number = 100
  ): Promise<BaseModel[]> {
    if (name) {
      domain = [
        '|', '|',
        ['name_english', operator, name],
        ['name_arabic', operator, name],
        ['number', '=', parseInt(name) || 0],
        ...domain
      ];
    }
    
    return this.search(domain, { limit });
  }
}
