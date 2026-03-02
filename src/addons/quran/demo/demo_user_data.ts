/**
 * Quran Demo Data - Sample User Data
 * ====================================
 * Demo data for user-related features
 */

export const demoUserData = {
  bookmarks: [
    {
      surahNumber: 1,
      ayahNumber: 1,
      type: "BOOKMARK",
      note: "First verse of the Quran",
      color: "#FFD700"
    },
    {
      surahNumber: 2,
      ayahNumber: 255,
      type: "BOOKMARK",
      note: "Ayatul Kursi - The greatest verse",
      color: "#00CED1"
    },
    {
      surahNumber: 36,
      ayahNumber: 1,
      type: "BOOKMARK",
      note: "Ya-Sin - Heart of the Quran",
      color: "#9370DB"
    }
  ],
  
  memorizationPlans: [
    {
      name: "Hizb Daily Plan",
      description: "Memorize one hizb per day",
      planType: "daily",
      dailyNewAyahs: 3,
      dailyRevision: 10,
      state: "active"
    }
  ],
  
  collections: [
    {
      name: "Morning Adhkar Verses",
      description: "Verses recited in morning remembrance",
      icon: "sunrise",
      color: "#FFA500"
    },
    {
      name: "Evening Adhkar Verses",
      description: "Verses recited in evening remembrance",
      icon: "sunset",
      color: "#8B4513"
    },
    {
      name: "Protection Verses",
      description: "Verses for protection (Ruqyah)",
      icon: "shield",
      color: "#4169E1"
    }
  ]
};

export default demoUserData;
