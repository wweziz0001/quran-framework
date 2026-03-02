/**
 * Quran Initial Data - Mushaf Editions
 * =====================================
 * Data file containing mushaf editions
 */

export const imageMushafEditionsData = [
  {
    id: "hafs",
    slug: "hafs",
    nameArabic: "مصحف حفص",
    nameEnglish: "Hafs Mushaf",
    description: "Standard Hafs an Asim narration",
    totalPages: 604,
    width: 1024,
    height: 1656,
    imageExtension: ".png",
    isDefault: true
  },
  {
    id: "warsh",
    slug: "warsh", 
    nameArabic: "مصحف ورش",
    nameEnglish: "Warsh Mushaf",
    description: "Warsh an Nafi narration - North African style",
    totalPages: 604,
    width: 1024,
    height: 1656,
    imageExtension: ".png",
    isDefault: false
  },
  {
    id: "qaloon",
    slug: "qaloon",
    nameArabic: "مصحف قالون",
    nameEnglish: "Qaloon Mushaf", 
    description: "Qaloon an Nafi narration",
    totalPages: 604,
    width: 1024,
    height: 1656,
    imageExtension: ".png",
    isDefault: false
  }
];

export const ttfMushafEditionsData = [
  {
    id: "uthmani",
    slug: "uthmani",
    nameArabic: "الخط العثماني",
    nameEnglish: "Uthmani Script",
    description: "Traditional Uthmani script",
    type: "uthmani",
    isDefault: true
  },
  {
    id: "indopak",
    slug: "indopak",
    nameArabic: "الخط الهندي",
    nameEnglish: "Indopak Script",
    description: "Indo-Pak style script",
    type: "indopak",
    isDefault: false
  },
  {
    id: "tajweed",
    slug: "tajweed",
    nameArabic: "مصحف التجويد",
    nameEnglish: "Tajweed Mushaf",
    description: "Color-coded Tajweed script",
    type: "tajweed",
    isDefault: false
  }
];

export default { imageMushafEditionsData, ttfMushafEditionsData };
