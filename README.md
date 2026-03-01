# Quran Framework

نظام إسلامي متكامل مبني بمنهجية Odoo Framework

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

---

## 📖 نظرة عامة

Quran Framework هو نظام إسلامي متكامل مبني باستخدام منهجية Odoo، يوفر:

- 📚 **قارئ القرآن الكريم** - مع 114 سورة وآياتها
- 🎧 **استماع القرآن** - تلاوات من قراء مشهورين
- 📝 **التفسير** - مصادر تفسير متعددة
- 🎯 **الحفظ** - مساعد الحفظ مع خوارزمية SM-2
- 📊 **الإحصائيات** - تتبع التقدم والإنجازات
- 🧭 **أوقات الصلاة** - مواقيت الصلاة والقبلة

---

## ✨ المميزات

### نظام Apps Store
واجهة متجر تطبيقات تشبه Odoo، مع إمكانية:
- تثبيت/إلغاء تثبيت التطبيقات
- فلترة حسب التصنيف
- البحث في التطبيقات

### Odoo-style Framework
- **ORM Layer** - نظام ORM مستوحى من Odoo
- **Security Layer** - ACL + Groups + Record Rules
- **Workflow Engine** - محرك سير العمل
- **Automation Engine** - قواعد الأتمتة
- **Module System** - نظام الوحدات/Addons

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- Bun
- Git

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/wweziz0001/quran-framework.git
cd quran-framework

# تثبيت المتطلبات
bun install

# إعداد قاعدة البيانات
bun run db:push
bun run seed

# تشغيل التطبيق
bun run dev
```

---

## 📦 التطبيقات المتاحة

| التطبيق | الوصف | التصنيف |
|---------|-------|---------|
| 📖 قارئ القرآن | قراءة وتصفح القرآن الكريم | Quran |
| 🎧 استماع القرآن | تلاوات صوتية من قراء مشهورين | Quran |
| 📚 تفسير القرآن | تفسير وتأويل الآيات | Quran |
| 🎯 الحفظ | مساعد الحفظ مع خوارزمية SM-2 | Learning |
| 📊 الإحصائيات | تتبع التقدم والإنجازات | Analytics |
| 🧭 أوقات الصلاة | مواقيت الصلاة والقبلة | Islamic |
| 👥 إدارة المستخدمين | المصادقة والصلاحيات | Administration |
| ⚙️ الإعدادات | إعدادات النظام | Administration |

---

## 🏗️ هيكل المشروع

```
quran-framework/
├── VERSION                    # الإصدار الحالي
├── changelog/
│   ├── CHANGELOG.md          # سجل التغييرات
│   └── v1.0.0.md             # تفاصيل الإصدار
├── DEVELOPMENT_GUIDE.md       # دليل التطوير
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API Routes
│   │   ├── page.tsx         # الصفحة الرئيسية
│   │   └── globals.css      # الأنماط
│   ├── core/                # Framework Core
│   │   ├── orm/             # ORM Layer
│   │   ├── security/        # Security Layer
│   │   ├── workflow/        # Workflow Engine
│   │   ├── automation/      # Automation Rules
│   │   └── module/          # Module Loader
│   ├── addons/              # Applications/Modules
│   │   ├── base/           # الوحدة الأساسية
│   │   ├── quran/          # قارئ القرآن
│   │   └── memorization/    # الحفظ
│   ├── lib/                 # المكتبات
│   └── components/          # UI Components
├── prisma/
│   └── schema.prisma        # قاعدة البيانات
└── scripts/
    └── seed.ts              # بيانات أولية
```

---

## 📡 API Endpoints

| Endpoint | الوصف |
|----------|-------|
| `GET /api/surahs` | قائمة السور |
| `GET /api/surahs/:id` | تفاصيل السورة مع الآيات |
| `GET /api/ayahs` | قائمة الآيات |
| `GET /api/stats` | إحصائيات القرآن |
| `GET /api/search` | البحث في القرآن |
| `GET /api/translations` | الترجمات المتاحة |
| `GET /api/reciters` | القراء المتاحين |

---

## 🔧 التقنيات المستخدمة

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **Database:** SQLite with Prisma ORM
- **UI:** shadcn/ui + Tailwind CSS 4
- **Icons:** Lucide React
- **Fonts:** Amiri (Arabic), Geist (Latin)

---

## 📝 التوثيق

- [CHANGELOG.md](./changelog/CHANGELOG.md) - سجل التغييرات
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - دليل التطوير
- [v1.0.0.md](./changelog/v1.0.0.md) - تفاصيل الإصدار الأول

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) للتعرف على:
- منهجية التوثيق
- ترقيم الإصدارات
- قواعد الرفع إلى GitHub

---

## 📄 الترخيص

MIT License

---

## 👨‍💻 المطور

**wweziz0001**
- GitHub: [@wweziz0001](https://github.com/wweziz0001)

---

**آخر تحديث:** 2025-01-19
