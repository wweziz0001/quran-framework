/**
 * Quran i18n Index
 * ==================
 * Translation helper for Quran module
 */

import arTranslations from './ar.json';
import enTranslations from './en.json';

type TranslationKey = string;
type TranslationValue = string | Record<string, string>;

class I18n {
  private locale: string = 'ar';
  private translations: Record<string, Record<string, TranslationValue>> = {
    ar: arTranslations,
    en: enTranslations
  };

  setLocale(locale: string) {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }

  t(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: TranslationValue = this.translations[this.locale];

    for (const k of keys) {
      if (typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, v),
        value
      );
    }

    return value;
  }

  // Get all translations for a section
  getSection(section: string): Record<string, string> {
    const sectionData = this.translations[this.locale][section];
    if (typeof sectionData === 'object') {
      return sectionData as Record<string, string>;
    }
    return {};
  }
}

export const i18n = new I18n();
export { arTranslations, enTranslations };
export default i18n;
