// Quran Types

export interface Surah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  revelationType: 'meccan' | 'medinan' | 'makki' | 'madani';
  totalAyahs: number;
  pageNumberStart?: number;
  juzNumberStart?: number;
  description?: string;
  slug?: string;
}

export interface Verse {
  id: number;
  surahId: number;
  ayahNumber: number;
  ayahNumberGlobal: number;
  textArabic: string;
  textUthmani?: string;
  textIndopak?: string;
  pageNumber?: number;
  juzNumber?: number;
  hizbNumber?: number;
  sajdah?: boolean;
  sajdahType?: string;
  wordCount?: number;
  letterCount?: number;
  surah?: Surah;
  numberInSurah?: number;
}

export interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  slug: string;
  bio?: string;
  imageUrl?: string;
  country?: string;
  hasHighQuality: boolean;
  hasGapless: boolean;
  totalDownloads: number;
  popularity: number;
  isActive: boolean;
  apiIdentifier?: string;
}

export interface Recitation {
  id: string;
  surahId: number;
  reciterId: string;
  style: string;
  bitrate: number;
  format: string;
  audioUrl: string;
  audioUrlHd?: string;
  timingDataUrl?: string;
  fileSize?: number;
  durationSeconds?: number;
  downloadCount: number;
  isActive: boolean;
  reciter?: Reciter;
}

export interface TafsirSource {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  slug: string;
  authorArabic?: string;
  authorEnglish?: string;
  description?: string;
  language: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface TafsirEntry {
  id: string;
  surahId: number;
  ayahId: number;
  sourceId: string;
  textArabic?: string;
  textTranslation?: string;
  htmlContent?: string;
  wordExplanations?: string;
}

export interface TranslationSource {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  author?: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface TranslationEntry {
  id: string;
  ayahId: number;
  sourceId: string;
  text: string;
  footnotes?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  ayahId: number;
  type: string;
  note?: string;
  color?: string;
  createdAt: Date;
}

export interface MushafEdition {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  slug: string;
  type: 'image' | 'ttf';
  isDefault: boolean;
  isActive: boolean;
  totalPages: number;
  width: number;
  height: number;
}

export interface QuranUserSettings {
  fontSize: number;
  fontFamily: 'uthmani' | 'indopak' | 'standard';
  showTajweed: boolean;
  showTranslation: boolean;
  preferredTranslation?: string;
  defaultReciterId?: string;
  audioSpeed: number;
  autoPlay: boolean;
  dailyReminder: boolean;
  reminderTime?: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

// Store Types
export interface QuranStore {
  // State
  surahs: Surah[];
  currentSurah: Surah | null;
  currentVerse: Verse | null;
  verses: Verse[];
  reciters: Reciter[];
  currentReciter: Reciter | null;
  tafsirSources: TafsirSource[];
  currentTafsirSource: TafsirSource | null;
  translationSources: TranslationSource[];
  currentTranslationSource: TranslationSource | null;
  userSettings: QuranUserSettings;
  
  // UI State
  isDarkMode: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  currentMushafPage: number;
  mushafViewMode: 'list' | 'mushaf-images' | 'mushaf-ttf';
  selectedEdition: string | null;
  
  // Actions
  setSurahs: (surahs: Surah[]) => void;
  setCurrentSurah: (surah: Surah | null) => void;
  setCurrentVerse: (verse: Verse | null) => void;
  setVerses: (verses: Verse[]) => void;
  setReciters: (reciters: Reciter[]) => void;
  setCurrentReciter: (reciter: Reciter | null) => void;
  setTafsirSources: (sources: TafsirSource[]) => void;
  setCurrentTafsirSource: (source: TafsirSource | null) => void;
  setTranslationSources: (sources: TranslationSource[]) => void;
  setCurrentTranslationSource: (source: TranslationSource | null) => void;
  setUserSettings: (settings: Partial<QuranUserSettings>) => void;
  
  // UI Actions
  toggleDarkMode: () => void;
  setIsLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setCurrentMushafPage: (page: number) => void;
  setMushafViewMode: (mode: 'list' | 'mushaf-images' | 'mushaf-ttf') => void;
  setSelectedEdition: (edition: string | null) => void;
}
