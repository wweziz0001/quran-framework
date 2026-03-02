/**
 * Memorization Initial Data - Achievement Types
 * ==============================================
 * Data file containing achievement definitions
 */

export const achievementTypesData = [
  {
    type: "first_ayah",
    titleArabic: "البداية",
    titleEnglish: "The Beginning",
    descriptionArabic: "حفظ أول آية",
    descriptionEnglish: "Memorize your first ayah",
    points: 10,
    badgeIcon: "star",
    badgeColor: "#FFD700"
  },
  {
    type: "first_surah",
    titleArabic: "سورة كاملة",
    titleEnglish: "Complete Surah",
    descriptionArabic: "حفظ سورة كاملة",
    descriptionEnglish: "Memorize a complete surah",
    points: 50,
    badgeIcon: "book",
    badgeColor: "#4CAF50"
  },
  {
    type: "first_juz",
    titleArabic: "جزء كامل",
    titleEnglish: "Complete Juz",
    descriptionArabic: "حفظ جزء كامل",
    descriptionEnglish: "Memorize a complete juz",
    points: 200,
    badgeIcon: "book-open",
    badgeColor: "#2196F3"
  },
  {
    type: "streak_7",
    titleArabic: "أسبوع متواصل",
    titleEnglish: "Week Streak",
    descriptionArabic: "المراجعة 7 أيام متتالية",
    descriptionEnglish: "Review for 7 consecutive days",
    points: 30,
    badgeIcon: "flame",
    badgeColor: "#FF5722"
  },
  {
    type: "streak_30",
    titleArabic: "شهر متواصل",
    titleEnglish: "Month Streak",
    descriptionArabic: "المراجعة 30 يوم متتالية",
    descriptionEnglish: "Review for 30 consecutive days",
    points: 100,
    badgeIcon: "award",
    badgeColor: "#9C27B0"
  },
  {
    type: "hafiz_quarter",
    titleArabic: "ربع حافظ",
    titleEnglish: "Quarter Hafiz",
    descriptionArabic: "حفظ ربع القرآن",
    descriptionEnglish: "Memorize a quarter of the Quran",
    points: 500,
    badgeIcon: "crown",
    badgeColor: "#FFD700"
  },
  {
    type: "hafiz_half",
    titleArabic: "نصف حافظ",
    titleEnglish: "Half Hafiz",
    descriptionArabic: "حفظ نصف القرآن",
    descriptionEnglish: "Memorize half of the Quran",
    points: 1000,
    badgeIcon: "crown",
    badgeColor: "#C0C0C0"
  },
  {
    type: "hafiz_complete",
    titleArabic: "حافظ كامل",
    titleEnglish: "Complete Hafiz",
    descriptionArabic: "حفظ القرآن كاملاً",
    descriptionEnglish: "Memorize the entire Quran",
    points: 5000,
    badgeIcon: "trophy",
    badgeColor: "#FFD700"
  }
];

export default achievementTypesData;
