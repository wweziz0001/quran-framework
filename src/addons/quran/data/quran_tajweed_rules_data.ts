/**
 * Quran Initial Data - Tajweed Rules
 * ===================================
 * Data file containing tajweed coloring rules
 */

export const tajweedRulesData = [
  {
    code: "hamzat_wasl",
    nameArabic: "همزة الوصل",
    nameEnglish: "Hamzat Wasl",
    description: "Connecting hamza - pronounced when starting, silent when continuing",
    color: "#AAAAAA",
    category: "basics",
    sortOrder: 1
  },
  {
    code: "madd_wajib",
    nameArabic: "مد واجب متصل",
    nameEnglish: "Obligatory Madd (Connected)",
    description: "Required elongation of 4-5 counts when hamza follows in same word",
    color: "#D4A017",
    category: "madd",
    sortOrder: 10
  },
  {
    code: "madd_jaiz",
    nameArabic: "مد جائز منفصل",
    nameEnglish: "Permissible Madd (Separated)",
    description: "Optional elongation of 2-4 counts when hamza follows in next word",
    color: "#5B8C5A",
    category: "madd",
    sortOrder: 11
  },
  {
    code: "madd_ghunnah",
    nameArabic: "غنة",
    nameEnglish: "Ghunnah (Nasalization)",
    description: "Nasal sound on meem and noon with shadda - 2 counts",
    color: "#A6A6C7",
    category: "ghunnah",
    sortOrder: 20
  },
  {
    code: "idgham_ghunnah",
    nameArabic: "إدغام بغنة",
    nameEnglish: "Idgham with Ghunnah",
    description: "Merging with nasal sound - ي ن م و letters",
    color: "#A6A6C7",
    category: "idgham",
    sortOrder: 30
  },
  {
    code: "idgham_no_ghunnah",
    nameArabic: "إدغام بلا غنة",
    nameEnglish: "Idgham without Ghunnah",
    description: "Complete merging without nasal sound - ر ل letters",
    color: "#C4C4C4",
    category: "idgham",
    sortOrder: 31
  },
  {
    code: "iqlab",
    nameArabic: "إقلاب",
    nameEnglish: "Iqlab (Conversion)",
    description: "Converting noon to meem before ba - with ghunnah",
    color: "#5B5BA6",
    category: "iqlab",
    sortOrder: 40
  },
  {
    code: "ikhfa",
    nameArabic: "إخفاء",
    nameEnglish: "Ikhfa (Hiding)",
    description: "Hiding noon/tanween sound before certain letters",
    color: "#5B8CA6",
    category: "ikhfa",
    sortOrder: 50
  },
  {
    code: "qalqalah",
    nameArabic: "قلقلة",
    nameEnglish: "Qalqalah (Bouncing)",
    description: "Bouncing sound on قطب جد letters with sukoon",
    color: "#A65B5B",
    category: "qalqalah",
    sortOrder: 60
  },
  {
    code: "tafkheem",
    nameArabic: "تفخيم",
    nameEnglish: "Tafkheem (Heavy)",
    description: "Heavy/full pronunciation of letters",
    color: "#805B5B",
    category: "tafkheem",
    sortOrder: 70
  },
  {
    code: "tarqeeq",
    nameArabic: "ترقيق",
    nameEnglish: "Tarqeeq (Light)",
    description: "Light/thin pronunciation of letters",
    color: "#5BA68C",
    category: "tarqeeq",
    sortOrder: 71
  },
  {
    code: "sajdah",
    nameArabic: "سجدة",
    nameEnglish: "Sajdah Verse",
    description: "Prostration verse marker",
    color: "#A65B8C",
    category: "special",
    sortOrder: 80
  }
];

export default tajweedRulesData;
