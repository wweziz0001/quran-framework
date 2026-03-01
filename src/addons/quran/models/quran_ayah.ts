/**
 * Quran Models - Ayah (الآية)
 * ============================
 * Model representing an Ayah (verse) in the Quran
 */

import { BaseModel, db, api, fields } from '@/core/orm';
import { model } from '@/core/registry';

@model('quran.ayah', {
  description: 'Quran Ayah',
  order: 'surah_id asc, ayah_number asc',
  recName: 'display_name'
})
export class QuranAyah extends BaseModel {
  static _fields = {
    // Identification
    id: new fields.Id(),
    surah_id: new fields.Many2One({
      string: 'Surah',
      model: 'quran.surah',
      required: true,
      ondelete: 'cascade'
    }),
    ayah_number: new fields.Integer({ string: 'Ayah Number', required: true }),
    ayah_number_global: new fields.Integer({ string: 'Global Number', required: true }),
    
    // Text variations
    text_arabic: new fields.Text({ string: 'Arabic Text (Simple)', required: true }),
    text_uthmani: new fields.Text({ string: 'Arabic Text (Uthmani)' }),
    text_indopak: new fields.Text({ string: 'Arabic Text (Indopak)' }),
    text_clean: new fields.Text({ string: 'Clean Text (No Diacritics)' }),
    
    // Location
    page_number: new fields.Integer({ string: 'Page Number' }),
    juz_number: new fields.Integer({ string: 'Juz Number' }),
    hizb_number: new fields.Integer({ string: 'Hizb Number' }),
    rub_number: new fields.Integer({ string: 'Rub Number' }),
    quarter_number: new fields.Integer({ string: 'Quarter Number' }),
    manzil_number: new fields.Integer({ string: 'Manzil Number' }),
    
    // Special markers
    sajdah: new fields.Boolean({ string: 'Has Sajdah', default: false }),
    sajdah_type: new fields.Selection({
      string: 'Sajdah Type',
      selection: [
        ['obligatory', 'Obligatory (واجبة)'],
        ['recommended', 'Recommended (مستحبة)']
      ]
    }),
    sajdah_number: new fields.Integer({ string: 'Sajdah Number' }),
    
    // Statistics
    word_count: new fields.Integer({ string: 'Word Count' }),
    letter_count: new fields.Integer({ string: 'Letter Count' }),
    
    // Computed fields
    display_name: new fields.Computed({
      string: 'Display Name',
      compute: '_compute_display_name',
      store: true
    }),
    surah_number: new fields.Related({
      string: 'Surah Number',
      related: 'surah_id.number',
      store: true
    }),
    surah_name: new fields.Related({
      string: 'Surah Name',
      related: 'surah_id.name_english',
      store: true
    }),
    surah_name_arabic: new fields.Related({
      string: 'Surah Name (Arabic)',
      related: 'surah_id.name_arabic',
      store: true
    }),
    revelation_type: new fields.Related({
      string: 'Revelation Type',
      related: 'surah_id.revelation_type',
      store: true
    }),
    is_bismillah: new fields.Computed({
      string: 'Is Bismillah',
      compute: '_compute_is_bismillah',
      store: true
    }),
    
    // Relations
    bookmark_ids: new fields.One2Many({
      string: 'Bookmarks',
      model: 'quran.bookmark',
      field: 'ayah_id'
    }),
    recitation_ayah_ids: new fields.One2Many({
      string: 'Recitation Timing',
      model: 'quran.recitation.ayah',
      field: 'ayah_id'
    }),
    tafsir_ids: new fields.One2Many({
      string: 'Tafsir Entries',
      model: 'quran.tafsir.entry',
      field: 'ayah_id'
    }),
    translation_ids: new fields.One2Many({
      string: 'Translations',
      model: 'quran.translation.entry',
      field: 'ayah_id'
    }),
    memorization_progress_ids: new fields.One2Many({
      string: 'Memorization Progress',
      model: 'quran.memorization.progress',
      field: 'ayah_id'
    }),
    
    // Active
    active: new fields.Boolean({ string: 'Active', default: true }),
  };
  
  // Compute display name
  @api.depends('surah_number', 'ayah_number')
  async _compute_display_name(): Promise<string> {
    const surahNum = this.get('surah_number');
    const ayahNum = this.get('ayah_number');
    return `${surahNum}:${ayahNum}`;
  }
  
  // Compute is_bismillah
  @api.depends('surah_number', 'ayah_number')
  async _compute_is_bismillah(): Promise<boolean> {
    const surahNum = this.get('surah_number') as number;
    const ayahNum = this.get('ayah_number') as number;
    
    // Bismillah is: Surah 1 Ayah 1, or Ayah 1 of Surahs except At-Tawbah (9)
    if (surahNum === 1 && ayahNum === 1) return true;
    if (ayahNum === 1 && surahNum !== 9) return true;
    return false;
  }
  
  // Business methods
  getTranslation(sourceId?: string): unknown {
    const translations = this.get('translation_ids') as { source_id: string }[];
    if (!translations) return null;
    
    if (sourceId) {
      return translations.find(t => t.source_id === sourceId);
    }
    return translations[0];
  }
  
  getTafsir(sourceId?: string): unknown {
    const tafsirs = this.get('tafsir_ids') as { source_id: string }[];
    if (!tafsirs) return null;
    
    if (sourceId) {
      return tafsirs.find(t => t.source_id === sourceId);
    }
    return tafsirs[0];
  }
  
  getNextAyah(): Promise<BaseModel | null> {
    const globalNum = this.get('ayah_number_global') as number;
    return QuranAyah.findOne([['ayah_number_global', '=', globalNum + 1]]);
  }
  
  getPreviousAyah(): Promise<BaseModel | null> {
    const globalNum = this.get('ayah_number_global') as number;
    return QuranAyah.findOne([['ayah_number_global', '=', globalNum - 1]]);
  }
  
  // Search methods
  static async searchByText(text: string, limit: number = 50): Promise<BaseModel[]> {
    return this.search([
      '|',
      ['text_arabic', 'ilike', text],
      ['text_clean', 'ilike', text]
    ], { limit });
  }
  
  static async searchByPage(pageNumber: number): Promise<BaseModel[]> {
    return this.search([['page_number', '=', pageNumber]]);
  }
  
  static async searchByJuz(juzNumber: number): Promise<BaseModel[]> {
    return this.search([['juz_number', '=', juzNumber]]);
  }
  
  static async getByReference(reference: string): Promise<BaseModel | null> {
    try {
      const parts = reference.split(':');
      if (parts.length !== 2) return null;
      
      const surahNum = parseInt(parts[0]);
      const ayahNum = parseInt(parts[1]);
      
      return this.findOne([
        ['surah_number', '=', surahNum],
        ['ayah_number', '=', ayahNum]
      ]);
    } catch {
      return null;
    }
  }
  
  // Constraints
  @api.constrains('ayah_number', 'surah_id')
  async _check_ayah_number(): Promise<void> {
    const surahId = this.get('surah_id');
    const ayahNumber = this.get('ayah_number') as number;
    
    // Get surah
    const surah = await QuranAyah.browse(surahId);
    const totalAyahs = surah[0]?.get('total_ayahs') as number;
    
    if (totalAyahs && ayahNumber > totalAyahs) {
      throw new Error(`Ayah number ${ayahNumber} exceeds surah's total (${totalAyahs})`);
    }
  }
  
  // Display
  get displayName(): string {
    const surahName = this.get('surah_name') as string;
    const surahNameArabic = this.get('surah_name_arabic') as string;
    const ayahNum = this.get('ayah_number');
    return `${surahName} (${surahNameArabic}): ${ayahNum}`;
  }
}

import { QuranAyah } from './quran_ayah';
