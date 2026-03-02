# 📖 Quran Framework

نظام متكامل لقراءة وتدبر القرآن الكريم مبني بمنهجية Odoo Framework

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-LGPL--3-green)](LICENSE)

---

## 📋 المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [المتطلبات](#-المتطلبات)
- [التثبيت والتشغيل](#-التثبيت-والتشغيل)
- [هيكل المشروع](#-هيكل-المشروع)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [المساهمة](#-المساهمة)

---

## 🌟 نظرة عامة

**Quran Framework** هو نظام متكامل لقراءة القرآن الكريم مبني باستخدام Next.js 16 ويتبع منهجية Odoo Framework في تنظيم الوحدات والكود.

### لماذا Quran Framework؟

- 🏗️ **بنية Odoo** - تنظيم الوحدات بشكل احترافي
- 📦 **نظام تثبيت** - تثبيت الوحدات من متجر التطبيقات
- 🎨 **تصميم حديث** - واجهة مستخدم جميلة ومتجاوبة
- 🌙 **وضع داكن** - دعم كامل للوضع الداكن
- 📱 **متجاوب** - يعمل على جميع الأجهزة

---

## ✨ الميزات

| الميزة | الوصف |
|--------|-------|
| 📖 **قارئ القرآن** | قراءة القرآن بخطوط عثمانية متعددة |
| 🎨 **التجويد** | تلوين آيات التجويد |
| 🔊 **الاستماع** | الاستماع لتلاوات القراء المشهورين |
| 📝 **التفسير** | الوصول لتفاسير متعددة |
| 🔍 **البحث** | بحث دلالي في آيات القرآن |
| ⚙️ **لوحة التحكم** | إدارة شاملة للنظام |
| 🏪 **متجر التطبيقات** | تثبيت وإدارة الوحدات |

---

## 💻 المتطلبات

### المتطلبات الأساسية

| البرنامج | الإصدار | رابط التحميل |
|----------|---------|---------------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Bun** | 1.0+ | [bun.sh](https://bun.sh/) |
| **Git** | أحدث إصدار | [git-scm.com](https://git-scm.com/) |

### أنظمة التشغيل المدعومة

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+

---

## 🚀 التثبيت والتشغيل

### الخطوة 1: استنساخ المشروع

```bash
# استنساخ من GitHub
git clone https://github.com/wweziz0001/quran-framework.git

# الدخول لمجلد المشروع
cd quran-framework
```

### الخطوة 2: تثبيت التبعيات

```bash
# تثبيت جميع المكتبات
bun install
```

### الخطوة 3: إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات والجداول
bun run db:push

# (اختياري) إنشاء عميل Prisma
bun run db:generate
```

### الخطوة 4: تشغيل المشروع

```bash
# تشغيل في وضع التطوير
bun run dev
```

### الخطوة 5: فتح المتصفح

```
http://localhost:3000
```

---

## ⚡ أوامر التشغيل السريعة

| الأمر | الوصف |
|-------|-------|
| `bun run dev` | تشغيل في وضع التطوير |
| `bun run build` | بناء المشروع للإنتاج |
| `bun run start` | تشغيل نسخة الإنتاج |
| `bun run lint` | فحص جودة الكود |
| `bun run db:push` | تحديث قاعدة البيانات |
| `bun run db:generate` | إنشاء عميل Prisma |

---

## 📁 هيكل المشروع

```
quran-framework/
├── 📄 VERSION                 # الإصدار الحالي
├── 📄 package.json           # إعدادات المشروع
├── 📁 changelog/             # سجل التغييرات
│   ├── CHANGELOG.md
│   └── v1.0.0.md
├── 📁 prisma/                # قاعدة البيانات
│   └── schema.prisma
├── 📁 src/
│   ├── 📁 addons/            # الوحدات (Odoo Style)
│   │   ├── 📁 quran/         # وحدة القرآن
│   │   │   ├── __manifest__.json
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── views/
│   │   │   ├── stores/
│   │   │   ├── security/
│   │   │   ├── data/
│   │   │   ├── demo/
│   │   │   ├── i18n/
│   │   │   └── static/
│   │   └── 📁 memorization/  # وحدة الحفظ
│   ├── 📁 app/               # Next.js App Router
│   │   ├── page.tsx          # متجر التطبيقات
│   │   ├── 📁 quran/         # قارئ القرآن
│   │   ├── 📁 admin/         # لوحة التحكم
│   │   └── 📁 api/           # API Routes
│   ├── 📁 lib/               # المكتبات
│   │   ├── apps-registry.ts
│   │   ├── module-utils.ts
│   │   └── db.ts
│   ├── 📁 components/        # المكونات
│   │   ├── 📁 ui/            # shadcn/ui
│   │   └── 📁 admin/
│   └── 📁 types/             # TypeScript types
├── 📁 public/                # الملفات العامة
└── 📄 DEVELOPMENT_GUIDE.md   # دليل التطوير
```

---

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية (Frontend)

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| [Next.js](https://nextjs.org/) | 16.1.1 | إطار العمل |
| [React](https://react.dev/) | 19.0.0 | مكتبة الواجهات |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | لغة البرمجة |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | التصميم |
| [shadcn/ui](https://ui.shadcn.com/) | - | مكونات UI |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.11 | إدارة الحالة |
| [Framer Motion](https://www.framer.com/motion/) | 12.23.2 | الحركات |

### الواجهة الخلفية (Backend)

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| [Prisma](https://www.prisma.io/) | 6.11.1 | ORM |
| [SQLite](https://www.sqlite.org/) | - | قاعدة البيانات |
| [NextAuth.js](https://next-auth.js.org/) | 4.24.11 | المصادقة |

---

## 🔧 إعداد البيئة

### ملف `.env`

```env
# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📖 كيفية الاستخدام

### 1. متجر التطبيقات

عند فتح المشروع، ستجد **متجر التطبيقات** في الصفحة الرئيسية:

- 📦 عرض جميع التطبيقات المتاحة
- ⬇️ تثبيت التطبيقات
- ▶️ فتح التطبيقات المثبتة

### 2. قارئ القرآن

```bash
# التثبيت من المتجر أو مباشرة
# ثم افتح: http://localhost:3000/quran
```

### 3. لوحة التحكم

```bash
# تثبيت web_admin من المتجر
# ثم افتح: http://localhost:3000/admin
```

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى قراءة [دليل التطوير](DEVELOPMENT_GUIDE.md) قبل البدء.

### خطوات المساهمة

1. 🍴 Fork المشروع
2. 🌿 إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. 💾 حفظ التغييرات (`git commit -m 'Add amazing feature'`)
4. 📤 رفع الفرع (`git push origin feature/amazing-feature`)
5. 🔓 فتح Pull Request

---

## 📞 الدعم

- 📧 **البريد:** support@quran-framework.com
- 🐛 **المشاكل:** [GitHub Issues](https://github.com/wweziz0001/quran-framework/issues)
- 💬 **المناقشات:** [GitHub Discussions](https://github.com/wweziz0001/quran-framework/discussions)

---

## 📜 الترخيص

هذا المشروع مرخص تحت رخصة [LGPL-3.0](LICENSE).

---

## 🙏 شكر وتقدير

- [quran.com](https://quran.com) - مصدر البيانات
- [alquran.cloud](https://alquran.cloud) - API التلاوات
- جميع المساهمين في المشروع

---

<div align="center">

**صنع بـ ❤️ للقرآن الكريم**

[⬆️ العودة للأعلى](#-quran-framework)

</div>
