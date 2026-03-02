/**
 * Quran Demo Data Index
 * ======================
 * Exports all demo data files
 * This file is loaded for demo/testing purposes
 */

import { demoAyahsData } from './demo_ayahs';
import { demoTafsirData } from './demo_tafsir';
import { demoTranslationData } from './demo_translation';
import { demoUserData } from './demo_user_data';

export const quranDemoData = {
  ayahs: demoAyahsData,
  tafsir: demoTafsirData,
  translations: demoTranslationData,
  userData: demoUserData
};

export default quranDemoData;
