'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Surah, Verse, Reciter, TafsirSource, TranslationSource, QuranUserSettings, QuranStore } from '@/types/quran';

const defaultUserSettings: QuranUserSettings = {
  fontSize: 1.5,
  fontFamily: 'uthmani',
  showTajweed: false,
  showTranslation: true,
  audioSpeed: 1.0,
  autoPlay: false,
  dailyReminder: false,
  theme: 'system',
  language: 'ar',
};

export const useQuranStore = create<QuranStore>()(
  persist(
    (set) => ({
      // State
      surahs: [],
      currentSurah: null,
      currentVerse: null,
      verses: [],
      reciters: [],
      currentReciter: null,
      tafsirSources: [],
      currentTafsirSource: null,
      translationSources: [],
      currentTranslationSource: null,
      userSettings: defaultUserSettings,
      
      // UI State
      isDarkMode: false,
      isLoading: false,
      sidebarOpen: true,
      currentMushafPage: 1,
      mushafViewMode: 'list',
      selectedEdition: null,
      
      // Actions
      setSurahs: (surahs) => set({ surahs }),
      setCurrentSurah: (surah) => set({ currentSurah: surah }),
      setCurrentVerse: (verse) => set({ currentVerse: verse }),
      setVerses: (verses) => set({ verses }),
      setReciters: (reciters) => set({ reciters }),
      setCurrentReciter: (reciter) => set({ currentReciter: reciter }),
      setTafsirSources: (sources) => set({ tafsirSources: sources }),
      setCurrentTafsirSource: (source) => set({ currentTafsirSource: source }),
      setTranslationSources: (sources) => set({ translationSources: sources }),
      setCurrentTranslationSource: (source) => set({ currentTranslationSource: source }),
      setUserSettings: (settings) => set((state) => ({
        userSettings: { ...state.userSettings, ...settings }
      })),
      
      // UI Actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setIsLoading: (loading) => set({ isLoading: loading }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCurrentMushafPage: (page) => set({ currentMushafPage: page }),
      setMushafViewMode: (mode) => set({ mushafViewMode: mode }),
      setSelectedEdition: (edition) => set({ selectedEdition: edition }),
    }),
    {
      name: 'quran-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        userSettings: state.userSettings,
        selectedEdition: state.selectedEdition,
        currentReciter: state.currentReciter,
        currentTafsirSource: state.currentTafsirSource,
        currentTranslationSource: state.currentTranslationSource,
      }),
    }
  )
);
