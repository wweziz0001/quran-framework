import { db } from '../src/lib/db';

// Surah data (114 surahs)
const surahData = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatihah", nameTransliteration: "Al-Fatihah", revelationType: "makki", totalAyahs: 7, pageNumberStart: 1, juzNumberStart: 1 },
  { number: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", nameTransliteration: "Al-Baqarah", revelationType: "madani", totalAyahs: 286, pageNumberStart: 2, juzNumberStart: 1 },
  { number: 3, nameArabic: "آل عمران", nameEnglish: "Aal-Imran", nameTransliteration: "Aal-Imran", revelationType: "madani", totalAyahs: 200, pageNumberStart: 50, juzNumberStart: 3 },
  { number: 4, nameArabic: "النساء", nameEnglish: "An-Nisa", nameTransliteration: "An-Nisa", revelationType: "madani", totalAyahs: 176, pageNumberStart: 77, juzNumberStart: 4 },
  { number: 5, nameArabic: "المائدة", nameEnglish: "Al-Ma'idah", nameTransliteration: "Al-Ma'idah", revelationType: "madani", totalAyahs: 120, pageNumberStart: 106, juzNumberStart: 6 },
  { number: 6, nameArabic: "الأنعام", nameEnglish: "Al-An'am", nameTransliteration: "Al-An'am", revelationType: "makki", totalAyahs: 165, pageNumberStart: 128, juzNumberStart: 7 },
  { number: 7, nameArabic: "الأعراف", nameEnglish: "Al-A'raf", nameTransliteration: "Al-A'raf", revelationType: "makki", totalAyahs: 206, pageNumberStart: 151, juzNumberStart: 8 },
  { number: 8, nameArabic: "الأنفال", nameEnglish: "Al-Anfal", nameTransliteration: "Al-Anfal", revelationType: "madani", totalAyahs: 75, pageNumberStart: 177, juzNumberStart: 9 },
  { number: 9, nameArabic: "التوبة", nameEnglish: "At-Tawbah", nameTransliteration: "At-Tawbah", revelationType: "madani", totalAyahs: 129, pageNumberStart: 187, juzNumberStart: 10 },
  { number: 10, nameArabic: "يونس", nameEnglish: "Yunus", nameTransliteration: "Yunus", revelationType: "makki", totalAyahs: 109, pageNumberStart: 208, juzNumberStart: 11 },
  { number: 11, nameArabic: "هود", nameEnglish: "Hud", nameTransliteration: "Hud", revelationType: "makki", totalAyahs: 123, pageNumberStart: 221, juzNumberStart: 11 },
  { number: 12, nameArabic: "يوسف", nameEnglish: "Yusuf", nameTransliteration: "Yusuf", revelationType: "makki", totalAyahs: 111, pageNumberStart: 235, juzNumberStart: 12 },
  { number: 13, nameArabic: "الرعد", nameEnglish: "Ar-Ra'd", nameTransliteration: "Ar-Ra'd", revelationType: "madani", totalAyahs: 43, pageNumberStart: 249, juzNumberStart: 13 },
  { number: 14, nameArabic: "إبراهيم", nameEnglish: "Ibrahim", nameTransliteration: "Ibrahim", revelationType: "makki", totalAyahs: 52, pageNumberStart: 255, juzNumberStart: 13 },
  { number: 15, nameArabic: "الحجر", nameEnglish: "Al-Hijr", nameTransliteration: "Al-Hijr", revelationType: "makki", totalAyahs: 99, pageNumberStart: 262, juzNumberStart: 14 },
  { number: 16, nameArabic: "النحل", nameEnglish: "An-Nahl", nameTransliteration: "An-Nahl", revelationType: "makki", totalAyahs: 128, pageNumberStart: 267, juzNumberStart: 14 },
  { number: 17, nameArabic: "الإسراء", nameEnglish: "Al-Isra", nameTransliteration: "Al-Isra", revelationType: "makki", totalAyahs: 111, pageNumberStart: 282, juzNumberStart: 15 },
  { number: 18, nameArabic: "الكهف", nameEnglish: "Al-Kahf", nameTransliteration: "Al-Kahf", revelationType: "makki", totalAyahs: 110, pageNumberStart: 293, juzNumberStart: 15 },
  { number: 19, nameArabic: "مريم", nameEnglish: "Maryam", nameTransliteration: "Maryam", revelationType: "makki", totalAyahs: 98, pageNumberStart: 305, juzNumberStart: 16 },
  { number: 20, nameArabic: "طه", nameEnglish: "Ta-Ha", nameTransliteration: "Ta-Ha", revelationType: "makki", totalAyahs: 135, pageNumberStart: 312, juzNumberStart: 16 },
  { number: 21, nameArabic: "الأنبياء", nameEnglish: "Al-Anbiya", nameTransliteration: "Al-Anbiya", revelationType: "makki", totalAyahs: 112, pageNumberStart: 322, juzNumberStart: 17 },
  { number: 22, nameArabic: "الحج", nameEnglish: "Al-Hajj", nameTransliteration: "Al-Hajj", revelationType: "madani", totalAyahs: 78, pageNumberStart: 332, juzNumberStart: 17 },
  { number: 23, nameArabic: "المؤمنون", nameEnglish: "Al-Mu'minun", nameTransliteration: "Al-Mu'minun", revelationType: "makki", totalAyahs: 118, pageNumberStart: 342, juzNumberStart: 18 },
  { number: 24, nameArabic: "النور", nameEnglish: "An-Nur", nameTransliteration: "An-Nur", revelationType: "madani", totalAyahs: 64, pageNumberStart: 350, juzNumberStart: 18 },
  { number: 25, nameArabic: "الفرقان", nameEnglish: "Al-Furqan", nameTransliteration: "Al-Furqan", revelationType: "makki", totalAyahs: 77, pageNumberStart: 359, juzNumberStart: 18 },
  { number: 26, nameArabic: "الشعراء", nameEnglish: "Ash-Shu'ara", nameTransliteration: "Ash-Shu'ara", revelationType: "makki", totalAyahs: 227, pageNumberStart: 367, juzNumberStart: 19 },
  { number: 27, nameArabic: "النمل", nameEnglish: "An-Naml", nameTransliteration: "An-Naml", revelationType: "makki", totalAyahs: 93, pageNumberStart: 377, juzNumberStart: 19 },
  { number: 28, nameArabic: "القصص", nameEnglish: "Al-Qasas", nameTransliteration: "Al-Qasas", revelationType: "makki", totalAyahs: 88, pageNumberStart: 385, juzNumberStart: 20 },
  { number: 29, nameArabic: "العنكبوت", nameEnglish: "Al-Ankabut", nameTransliteration: "Al-Ankabut", revelationType: "makki", totalAyahs: 69, pageNumberStart: 393, juzNumberStart: 20 },
  { number: 30, nameArabic: "الروم", nameEnglish: "Ar-Rum", nameTransliteration: "Ar-Rum", revelationType: "makki", totalAyahs: 60, pageNumberStart: 404, juzNumberStart: 21 },
  { number: 31, nameArabic: "لقمان", nameEnglish: "Luqman", nameTransliteration: "Luqman", revelationType: "makki", totalAyahs: 34, pageNumberStart: 411, juzNumberStart: 21 },
  { number: 32, nameArabic: "السجدة", nameEnglish: "As-Sajdah", nameTransliteration: "As-Sajdah", revelationType: "makki", totalAyahs: 30, pageNumberStart: 415, juzNumberStart: 21 },
  { number: 33, nameArabic: "الأحزاب", nameEnglish: "Al-Ahzab", nameTransliteration: "Al-Ahzab", revelationType: "madani", totalAyahs: 73, pageNumberStart: 418, juzNumberStart: 21 },
  { number: 34, nameArabic: "سبأ", nameEnglish: "Saba", nameTransliteration: "Saba", revelationType: "makki", totalAyahs: 54, pageNumberStart: 428, juzNumberStart: 22 },
  { number: 35, nameArabic: "فاطر", nameEnglish: "Fatir", nameTransliteration: "Fatir", revelationType: "makki", totalAyahs: 45, pageNumberStart: 434, juzNumberStart: 22 },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", nameTransliteration: "Ya-Sin", revelationType: "makki", totalAyahs: 83, pageNumberStart: 440, juzNumberStart: 22 },
  { number: 37, nameArabic: "الصافات", nameEnglish: "As-Saffat", nameTransliteration: "As-Saffat", revelationType: "makki", totalAyahs: 182, pageNumberStart: 446, juzNumberStart: 23 },
  { number: 38, nameArabic: "ص", nameEnglish: "Sad", nameTransliteration: "Sad", revelationType: "makki", totalAyahs: 88, pageNumberStart: 453, juzNumberStart: 23 },
  { number: 39, nameArabic: "الزمر", nameEnglish: "Az-Zumar", nameTransliteration: "Az-Zumar", revelationType: "makki", totalAyahs: 75, pageNumberStart: 458, juzNumberStart: 23 },
  { number: 40, nameArabic: "غافر", nameEnglish: "Ghafir", nameTransliteration: "Ghafir", revelationType: "makki", totalAyahs: 85, pageNumberStart: 467, juzNumberStart: 24 },
  { number: 41, nameArabic: "فصلت", nameEnglish: "Fussilat", nameTransliteration: "Fussilat", revelationType: "makki", totalAyahs: 54, pageNumberStart: 477, juzNumberStart: 24 },
  { number: 42, nameArabic: "الشورى", nameEnglish: "Ash-Shura", nameTransliteration: "Ash-Shura", revelationType: "makki", totalAyahs: 53, pageNumberStart: 483, juzNumberStart: 25 },
  { number: 43, nameArabic: "الزخرف", nameEnglish: "Az-Zukhruf", nameTransliteration: "Az-Zukhruf", revelationType: "makki", totalAyahs: 89, pageNumberStart: 489, juzNumberStart: 25 },
  { number: 44, nameArabic: "الدخان", nameEnglish: "Ad-Dukhan", nameTransliteration: "Ad-Dukhan", revelationType: "makki", totalAyahs: 59, pageNumberStart: 496, juzNumberStart: 25 },
  { number: 45, nameArabic: "الجاثية", nameEnglish: "Al-Jathiyah", nameTransliteration: "Al-Jathiyah", revelationType: "makki", totalAyahs: 37, pageNumberStart: 499, juzNumberStart: 25 },
  { number: 46, nameArabic: "الأحقاف", nameEnglish: "Al-Ahqaf", nameTransliteration: "Al-Ahqaf", revelationType: "makki", totalAyahs: 35, pageNumberStart: 502, juzNumberStart: 26 },
  { number: 47, nameArabic: "محمد", nameEnglish: "Muhammad", nameTransliteration: "Muhammad", revelationType: "madani", totalAyahs: 38, pageNumberStart: 507, juzNumberStart: 26 },
  { number: 48, nameArabic: "الفتح", nameEnglish: "Al-Fath", nameTransliteration: "Al-Fath", revelationType: "madani", totalAyahs: 29, pageNumberStart: 511, juzNumberStart: 26 },
  { number: 49, nameArabic: "الحجرات", nameEnglish: "Al-Hujurat", nameTransliteration: "Al-Hujurat", revelationType: "madani", totalAyahs: 18, pageNumberStart: 515, juzNumberStart: 26 },
  { number: 50, nameArabic: "ق", nameEnglish: "Qaf", nameTransliteration: "Qaf", revelationType: "makki", totalAyahs: 45, pageNumberStart: 518, juzNumberStart: 26 },
  { number: 51, nameArabic: "الذاريات", nameEnglish: "Adh-Dhariyat", nameTransliteration: "Adh-Dhariyat", revelationType: "makki", totalAyahs: 60, pageNumberStart: 520, juzNumberStart: 27 },
  { number: 52, nameArabic: "الطور", nameEnglish: "At-Tur", nameTransliteration: "At-Tur", revelationType: "makki", totalAyahs: 49, pageNumberStart: 523, juzNumberStart: 27 },
  { number: 53, nameArabic: "النجم", nameEnglish: "An-Najm", nameTransliteration: "An-Najm", revelationType: "makki", totalAyahs: 62, pageNumberStart: 526, juzNumberStart: 27 },
  { number: 54, nameArabic: "القمر", nameEnglish: "Al-Qamar", nameTransliteration: "Al-Qamar", revelationType: "makki", totalAyahs: 55, pageNumberStart: 528, juzNumberStart: 27 },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", nameTransliteration: "Ar-Rahman", revelationType: "madani", totalAyahs: 78, pageNumberStart: 531, juzNumberStart: 27 },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", nameTransliteration: "Al-Waqi'ah", revelationType: "makki", totalAyahs: 96, pageNumberStart: 534, juzNumberStart: 27 },
  { number: 57, nameArabic: "الحديد", nameEnglish: "Al-Hadid", nameTransliteration: "Al-Hadid", revelationType: "madani", totalAyahs: 29, pageNumberStart: 537, juzNumberStart: 27 },
  { number: 58, nameArabic: "المجادلة", nameEnglish: "Al-Mujadilah", nameTransliteration: "Al-Mujadilah", revelationType: "madani", totalAyahs: 22, pageNumberStart: 542, juzNumberStart: 28 },
  { number: 59, nameArabic: "الحشر", nameEnglish: "Al-Hashr", nameTransliteration: "Al-Hashr", revelationType: "madani", totalAyahs: 24, pageNumberStart: 545, juzNumberStart: 28 },
  { number: 60, nameArabic: "الممتحنة", nameEnglish: "Al-Mumtahanah", nameTransliteration: "Al-Mumtahanah", revelationType: "madani", totalAyahs: 13, pageNumberStart: 549, juzNumberStart: 28 },
  { number: 61, nameArabic: "الصف", nameEnglish: "As-Saff", nameTransliteration: "As-Saff", revelationType: "madani", totalAyahs: 14, pageNumberStart: 551, juzNumberStart: 28 },
  { number: 62, nameArabic: "الجمعة", nameEnglish: "Al-Jumu'ah", nameTransliteration: "Al-Jumu'ah", revelationType: "madani", totalAyahs: 11, pageNumberStart: 553, juzNumberStart: 28 },
  { number: 63, nameArabic: "المنافقون", nameEnglish: "Al-Munafiqun", nameTransliteration: "Al-Munafiqun", revelationType: "madani", totalAyahs: 11, pageNumberStart: 554, juzNumberStart: 28 },
  { number: 64, nameArabic: "التغابن", nameEnglish: "At-Taghabun", nameTransliteration: "At-Taghabun", revelationType: "madani", totalAyahs: 18, pageNumberStart: 556, juzNumberStart: 28 },
  { number: 65, nameArabic: "الطلاق", nameEnglish: "At-Talaq", nameTransliteration: "At-Talaq", revelationType: "madani", totalAyahs: 12, pageNumberStart: 558, juzNumberStart: 28 },
  { number: 66, nameArabic: "التحريم", nameEnglish: "At-Tahrim", nameTransliteration: "At-Tahrim", revelationType: "madani", totalAyahs: 12, pageNumberStart: 560, juzNumberStart: 28 },
  { number: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", nameTransliteration: "Al-Mulk", revelationType: "makki", totalAyahs: 30, pageNumberStart: 562, juzNumberStart: 29 },
  { number: 68, nameArabic: "القلم", nameEnglish: "Al-Qalam", nameTransliteration: "Al-Qalam", revelationType: "makki", totalAyahs: 52, pageNumberStart: 564, juzNumberStart: 29 },
  { number: 69, nameArabic: "الحاقة", nameEnglish: "Al-Haqqah", nameTransliteration: "Al-Haqqah", revelationType: "makki", totalAyahs: 52, pageNumberStart: 566, juzNumberStart: 29 },
  { number: 70, nameArabic: "المعارج", nameEnglish: "Al-Ma'arij", nameTransliteration: "Al-Ma'arij", revelationType: "makki", totalAyahs: 44, pageNumberStart: 568, juzNumberStart: 29 },
  { number: 71, nameArabic: "نوح", nameEnglish: "Nuh", nameTransliteration: "Nuh", revelationType: "makki", totalAyahs: 28, pageNumberStart: 570, juzNumberStart: 29 },
  { number: 72, nameArabic: "الجن", nameEnglish: "Al-Jinn", nameTransliteration: "Al-Jinn", revelationType: "makki", totalAyahs: 28, pageNumberStart: 572, juzNumberStart: 29 },
  { number: 73, nameArabic: "المزمل", nameEnglish: "Al-Muzzammil", nameTransliteration: "Al-Muzzammil", revelationType: "makki", totalAyahs: 20, pageNumberStart: 574, juzNumberStart: 29 },
  { number: 74, nameArabic: "المدثر", nameEnglish: "Al-Muddaththir", nameTransliteration: "Al-Muddaththir", revelationType: "makki", totalAyahs: 56, pageNumberStart: 575, juzNumberStart: 29 },
  { number: 75, nameArabic: "القيامة", nameEnglish: "Al-Qiyamah", nameTransliteration: "Al-Qiyamah", revelationType: "makki", totalAyahs: 40, pageNumberStart: 577, juzNumberStart: 29 },
  { number: 76, nameArabic: "الإنسان", nameEnglish: "Al-Insan", nameTransliteration: "Al-Insan", revelationType: "madani", totalAyahs: 31, pageNumberStart: 578, juzNumberStart: 29 },
  { number: 77, nameArabic: "المرسلات", nameEnglish: "Al-Mursalat", nameTransliteration: "Al-Mursalat", revelationType: "makki", totalAyahs: 50, pageNumberStart: 580, juzNumberStart: 29 },
  { number: 78, nameArabic: "النبأ", nameEnglish: "An-Naba", nameTransliteration: "An-Naba", revelationType: "makki", totalAyahs: 40, pageNumberStart: 582, juzNumberStart: 30 },
  { number: 79, nameArabic: "النازعات", nameEnglish: "An-Nazi'at", nameTransliteration: "An-Nazi'at", revelationType: "makki", totalAyahs: 46, pageNumberStart: 583, juzNumberStart: 30 },
  { number: 80, nameArabic: "عبس", nameEnglish: "Abasa", nameTransliteration: "Abasa", revelationType: "makki", totalAyahs: 42, pageNumberStart: 585, juzNumberStart: 30 },
  { number: 81, nameArabic: "التكوير", nameEnglish: "At-Takwir", nameTransliteration: "At-Takwir", revelationType: "makki", totalAyahs: 29, pageNumberStart: 586, juzNumberStart: 30 },
  { number: 82, nameArabic: "الانفطار", nameEnglish: "Al-Infitar", nameTransliteration: "Al-Infitar", revelationType: "makki", totalAyahs: 19, pageNumberStart: 587, juzNumberStart: 30 },
  { number: 83, nameArabic: "المطففين", nameEnglish: "Al-Mutaffifin", nameTransliteration: "Al-Mutaffifin", revelationType: "makki", totalAyahs: 36, pageNumberStart: 587, juzNumberStart: 30 },
  { number: 84, nameArabic: "الانشقاق", nameEnglish: "Al-Inshiqaq", nameTransliteration: "Al-Inshiqaq", revelationType: "makki", totalAyahs: 25, pageNumberStart: 589, juzNumberStart: 30 },
  { number: 85, nameArabic: "البروج", nameEnglish: "Al-Buruj", nameTransliteration: "Al-Buruj", revelationType: "makki", totalAyahs: 22, pageNumberStart: 590, juzNumberStart: 30 },
  { number: 86, nameArabic: "الطارق", nameEnglish: "At-Tariq", nameTransliteration: "At-Tariq", revelationType: "makki", totalAyahs: 17, pageNumberStart: 591, juzNumberStart: 30 },
  { number: 87, nameArabic: "الأعلى", nameEnglish: "Al-A'la", nameTransliteration: "Al-A'la", revelationType: "makki", totalAyahs: 19, pageNumberStart: 591, juzNumberStart: 30 },
  { number: 88, nameArabic: "الغاشية", nameEnglish: "Al-Ghashiyah", nameTransliteration: "Al-Ghashiyah", revelationType: "makki", totalAyahs: 26, pageNumberStart: 592, juzNumberStart: 30 },
  { number: 89, nameArabic: "الفجر", nameEnglish: "Al-Fajr", nameTransliteration: "Al-Fajr", revelationType: "makki", totalAyahs: 30, pageNumberStart: 593, juzNumberStart: 30 },
  { number: 90, nameArabic: "البلد", nameEnglish: "Al-Balad", nameTransliteration: "Al-Balad", revelationType: "makki", totalAyahs: 20, pageNumberStart: 594, juzNumberStart: 30 },
  { number: 91, nameArabic: "الشمس", nameEnglish: "Ash-Shams", nameTransliteration: "Ash-Shams", revelationType: "makki", totalAyahs: 15, pageNumberStart: 595, juzNumberStart: 30 },
  { number: 92, nameArabic: "الليل", nameEnglish: "Al-Layl", nameTransliteration: "Al-Layl", revelationType: "makki", totalAyahs: 21, pageNumberStart: 595, juzNumberStart: 30 },
  { number: 93, nameArabic: "الضحى", nameEnglish: "Ad-Duhaa", nameTransliteration: "Ad-Duhaa", revelationType: "makki", totalAyahs: 11, pageNumberStart: 596, juzNumberStart: 30 },
  { number: 94, nameArabic: "الشرح", nameEnglish: "Ash-Sharh", nameTransliteration: "Ash-Sharh", revelationType: "makki", totalAyahs: 8, pageNumberStart: 596, juzNumberStart: 30 },
  { number: 95, nameArabic: "التين", nameEnglish: "At-Tin", nameTransliteration: "At-Tin", revelationType: "makki", totalAyahs: 8, pageNumberStart: 597, juzNumberStart: 30 },
  { number: 96, nameArabic: "العلق", nameEnglish: "Al-Alaq", nameTransliteration: "Al-Alaq", revelationType: "makki", totalAyahs: 19, pageNumberStart: 597, juzNumberStart: 30 },
  { number: 97, nameArabic: "القدر", nameEnglish: "Al-Qadr", nameTransliteration: "Al-Qadr", revelationType: "makki", totalAyahs: 5, pageNumberStart: 598, juzNumberStart: 30 },
  { number: 98, nameArabic: "البينة", nameEnglish: "Al-Bayyinah", nameTransliteration: "Al-Bayyinah", revelationType: "madani", totalAyahs: 8, pageNumberStart: 598, juzNumberStart: 30 },
  { number: 99, nameArabic: "الزلزلة", nameEnglish: "Az-Zalzalah", nameTransliteration: "Az-Zalzalah", revelationType: "madani", totalAyahs: 8, pageNumberStart: 599, juzNumberStart: 30 },
  { number: 100, nameArabic: "العاديات", nameEnglish: "Al-Adiyat", nameTransliteration: "Al-Adiyat", revelationType: "makki", totalAyahs: 11, pageNumberStart: 599, juzNumberStart: 30 },
  { number: 101, nameArabic: "القارعة", nameEnglish: "Al-Qari'ah", nameTransliteration: "Al-Qari'ah", revelationType: "makki", totalAyahs: 11, pageNumberStart: 600, juzNumberStart: 30 },
  { number: 102, nameArabic: "التكاثر", nameEnglish: "At-Takathur", nameTransliteration: "At-Takathur", revelationType: "makki", totalAyahs: 8, pageNumberStart: 600, juzNumberStart: 30 },
  { number: 103, nameArabic: "العصر", nameEnglish: "Al-Asr", nameTransliteration: "Al-Asr", revelationType: "makki", totalAyahs: 3, pageNumberStart: 601, juzNumberStart: 30 },
  { number: 104, nameArabic: "الهمزة", nameEnglish: "Al-Humazah", nameTransliteration: "Al-Humazah", revelationType: "makki", totalAyahs: 9, pageNumberStart: 601, juzNumberStart: 30 },
  { number: 105, nameArabic: "الفيل", nameEnglish: "Al-Fil", nameTransliteration: "Al-Fil", revelationType: "makki", totalAyahs: 5, pageNumberStart: 601, juzNumberStart: 30 },
  { number: 106, nameArabic: "قريش", nameEnglish: "Quraysh", nameTransliteration: "Quraysh", revelationType: "makki", totalAyahs: 4, pageNumberStart: 602, juzNumberStart: 30 },
  { number: 107, nameArabic: "الماعون", nameEnglish: "Al-Ma'un", nameTransliteration: "Al-Ma'un", revelationType: "makki", totalAyahs: 7, pageNumberStart: 602, juzNumberStart: 30 },
  { number: 108, nameArabic: "الكوثر", nameEnglish: "Al-Kawthar", nameTransliteration: "Al-Kawthar", revelationType: "makki", totalAyahs: 3, pageNumberStart: 602, juzNumberStart: 30 },
  { number: 109, nameArabic: "الكافرون", nameEnglish: "Al-Kafirun", nameTransliteration: "Al-Kafirun", revelationType: "makki", totalAyahs: 6, pageNumberStart: 603, juzNumberStart: 30 },
  { number: 110, nameArabic: "النصر", nameEnglish: "An-Nasr", nameTransliteration: "An-Nasr", revelationType: "madani", totalAyahs: 3, pageNumberStart: 603, juzNumberStart: 30 },
  { number: 111, nameArabic: "المسد", nameEnglish: "Al-Masad", nameTransliteration: "Al-Masad", revelationType: "makki", totalAyahs: 5, pageNumberStart: 603, juzNumberStart: 30 },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", nameTransliteration: "Al-Ikhlas", revelationType: "makki", totalAyahs: 4, pageNumberStart: 604, juzNumberStart: 30 },
  { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq", nameTransliteration: "Al-Falaq", revelationType: "makki", totalAyahs: 5, pageNumberStart: 604, juzNumberStart: 30 },
  { number: 114, nameArabic: "الناس", nameEnglish: "An-Nas", nameTransliteration: "An-Nas", revelationType: "makki", totalAyahs: 6, pageNumberStart: 604, juzNumberStart: 30 },
];

// Al-Fatihah ayahs
const fatihahAyahs = [
  { ayahNumber: 1, textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
  { ayahNumber: 2, textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
  { ayahNumber: 3, textArabic: "الرَّحْمَٰنِ الرَّحِيمِ" },
  { ayahNumber: 4, textArabic: "مَالِكِ يَوْمِ الدِّينِ" },
  { ayahNumber: 5, textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
  { ayahNumber: 6, textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
  { ayahNumber: 7, textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" },
];

async function seed() {
  console.log('Seeding database...');
  
  // Insert surahs
  console.log('Inserting surahs...');
  for (const surah of surahData) {
    await db.quranSurah.create({
      data: {
        number: surah.number,
        nameArabic: surah.nameArabic,
        nameEnglish: surah.nameEnglish,
        nameTransliteration: surah.nameTransliteration,
        revelationType: surah.revelationType,
        totalAyahs: surah.totalAyahs,
        pageNumberStart: surah.pageNumberStart,
        juzNumberStart: surah.juzNumberStart,
        active: true,
      }
    });
  }
  console.log('Inserted 114 surahs');

  // Insert Al-Fatihah ayahs
  console.log('Inserting Al-Fatihah ayahs...');
  const fatihah = await db.quranSurah.findFirst({ where: { number: 1 } });
  if (fatihah) {
    for (let i = 0; i < fatihahAyahs.length; i++) {
      const ayah = fatihahAyahs[i];
      await db.quranAyah.create({
        data: {
          surahId: fatihah.id,
          ayahNumber: ayah.ayahNumber,
          ayahNumberGlobal: ayah.ayahNumber,
          textArabic: ayah.textArabic,
          textUthmani: ayah.textArabic,
          pageNumber: 1,
          juzNumber: 1,
          active: true,
        }
      });
    }
    console.log('Inserted 7 ayahs for Al-Fatihah');
  }

  console.log('Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
