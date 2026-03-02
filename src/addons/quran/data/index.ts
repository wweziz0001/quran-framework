/**
 * Quran Data Index
 * =================
 * Exports all data files for module initialization
 * This file is loaded during module installation
 */

import { surahsData } from './quran_surah_data';
import { recitersData } from './quran_reciters_data';
import { tafsirSourcesData } from './quran_tafsir_sources_data';
import { imageMushafEditionsData, ttfMushafEditionsData } from './quran_mushaf_editions_data';
import { tajweedRulesData } from './quran_tajweed_rules_data';
import { translationSourcesData } from './quran_translation_sources_data';

export const quranData = {
  surahs: surahsData,
  reciters: recitersData,
  tafsirSources: tafsirSourcesData,
  imageMushafEditions: imageMushafEditionsData,
  ttfMushafEditions: ttfMushafEditionsData,
  tajweedRules: tajweedRulesData,
  translationSources: translationSourcesData
};

export default quranData;
