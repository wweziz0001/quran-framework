/**
 * Memorization Demo Data
 * =======================
 * Demo data for memorization module
 */

export const demoMemorizationPlans = [
  {
    id: 1,
    name: "خطة حفظ يومية",
    description: "خطة لحفظ 3 آيات جديدة يومياً مع مراجعة 10 آيات",
    planType: "daily",
    dailyNewAyahs: 3,
    dailyRevision: 10,
    state: "active"
  },
  {
    id: 2,
    name: "خطة حفظ جزء عم",
    description: "خطة لحفظ الجزء الثلاثين",
    planType: "surah",
    dailyNewAyahs: 5,
    dailyRevision: 15,
    state: "active"
  }
];

export const demoProgress = [
  { surahNumber: 1, ayahNumber: 1, state: "memorized", revisionCount: 10, qualityRating: 5 },
  { surahNumber: 1, ayahNumber: 2, state: "memorized", revisionCount: 8, qualityRating: 4 },
  { surahNumber: 1, ayahNumber: 3, state: "reviewing", revisionCount: 5, qualityRating: 4 },
  { surahNumber: 1, ayahNumber: 4, state: "learning", revisionCount: 2, qualityRating: 3 },
  { surahNumber: 1, ayahNumber: 5, state: "learning", revisionCount: 1, qualityRating: 3 }
];

export default { demoMemorizationPlans, demoProgress };
