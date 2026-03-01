# Changelog - Quran Framework

جميع التغييرات الملحوظة في هذا المشروع موثقة في هذا الملف.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/ar/1.0.0/)،
والإصدارات تتبع [Semantic Versioning](https://semver.org/lang/ar/).

---

## [1.0.0] - 2025-01-19

### ✨ الميزات الجديدة

#### نظام Apps Store (متجر التطبيقات)
واجهة متجر تطبيقات مستوحاة من Odoo مع إمكانية تثبيت وإدارة التطبيقات.

**الملفات المتأثرة:**
- `src/lib/apps-registry.ts` (جديد) - سجل التطبيقات
- `src/app/page.tsx` (جديد) - واجهة المتجر

**التفاصيل:**
```diff
+ إنشاء واجهة Apps Store مع 9 تطبيقات
+ نظام تثبيت/إلغاء تثبيت
+ فلترة حسب التصنيف والبحث
+ عرض Grid/List للتطبيقات
```

**النتيجة:**
✅ واجهة متجر تشبه Odoo

#### تطبيق قارئ القرآن
تطبيق كامل لقراءة وتصفح القرآن الكريم.

**الملفات المتأثرة:**
- `src/app/api/surahs/route.ts` (جديد)
- `src/app/api/surahs/[id]/route.ts` (جديد)
- `src/app/api/ayahs/route.ts` (جديد)
- `src/app/api/stats/route.ts` (جديد)
- `src/app/api/search/route.ts` (جديد)
- `src/app/api/translations/route.ts` (جديد)
- `src/app/api/reciters/route.ts` (جديد)

**التفاصيل:**
```diff
+ 114 سورة مع بياناتها الكاملة
+ 7 آيات لسورة الفاتحة كنموذج
+ API endpoints للسور والآيات والبحث
```

**النتيجة:**
✅ قارئ قرآن متكامل مع خط Amiri

#### نظام ORM (Odoo-style)
نظام ORM مستوحى من Odoo مع Prisma.

**الملفات المتأثرة:**
- `src/core/orm/base.ts` (جديد) - BaseModel
- `src/core/orm/fields.ts` (جديد) - أنواع الحقول
- `src/core/orm/decorators.ts` (جديد) - الديكوريتورز

**التفاصيل:**
```diff
+ BaseModel مع CRUD operations
+ Field types: Char, Integer, Boolean, Selection, Many2One, One2Many
+ Decorators: @api.depends, @api.constrains, @api.onchange
```

**النتيجة:**
✅ ORM يشبه Odoo

#### نظام الأمان (Security Layer)
نظام ACL وRecord Rules.

**الملفات المتأثرة:**
- `src/core/security/acl.ts` (جديد)
- `src/core/security/groups.ts` (جديد)

**النتيجة:**
✅ نظام أمان للمجموعات والصلاحيات

#### نظام الوحدات (Module System)
نظام Addons مستوحى من Odoo.

**الملفات المتأثرة:**
- `src/core/module/loader.ts` (جديد)
- `src/core/registry/index.ts` (جديد)
- `src/addons/base/__manifest__.json` (جديد)
- `src/addons/quran/__manifest__.json` (جديد)
- `src/addons/memorization/__manifest__.json` (جديد)

**النتيجة:**
✅ نظام وحدات قابل للتوسع

#### Workflow Engine
محرك سير العمل.

**الملفات المتأثرة:**
- `src/core/workflow/engine.ts` (جديد)
- `src/core/workflow/index.ts` (جديد)

**النتيجة:**
✅ محرك workflows

---

### 📁 هيكل المشروع

```
project/
├── VERSION                    # الإصدار الحالي
├── changelog/
│   ├── CHANGELOG.md          # سجل كل الإصدارات
│   └── v1.0.0.md             # تفاصيل الإصدار
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API Routes
│   │   ├── page.tsx         # الصفحة الرئيسية (Apps Store)
│   │   ├── layout.tsx       # التخطيط الرئيسي
│   │   └── globals.css      # الأنماط
│   ├── core/                # Framework Core
│   │   ├── orm/             # ORM Layer
│   │   ├── security/        # Security Layer
│   │   ├── workflow/        # Workflow Engine
│   │   ├── automation/      # Automation Engine
│   │   ├── module/          # Module System
│   │   └── registry/        # Registry
│   ├── addons/              # التطبيقات/الوحدات
│   │   ├── base/           # الوحدة الأساسية
│   │   ├── quran/          # قارئ القرآن
│   │   └── memorization/    # الحفظ
│   ├── lib/                 # المكتبات
│   │   ├── db.ts           # Prisma Client
│   │   └── apps-registry.ts # سجل التطبيقات
│   └── components/          # UI Components (shadcn/ui)
├── prisma/
│   └── schema.prisma        # قاعدة البيانات
└── scripts/
    └── seed.ts              # بيانات أولية
```

---

### 🔧 المتطلبات التقنية

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **Database:** SQLite with Prisma ORM
- **UI:** shadcn/ui + Tailwind CSS 4
- **Fonts:** Amiri (Arabic), Geist (Latin)

---

### 📝 ملاحظات

هذا الإصدار الأولي يحتوي على:
- البنية الأساسية للـ Framework
- واجهة Apps Store
- تطبيق قارئ القرآن (مع سورة الفاتحة فقط كبيانات)
- 9 تطبيقات في المتجر (3 مثبتة، 6 متاحة)

---

[1.0.0]: https://github.com/wweziz0001/quran-framework/releases/tag/v1.0.0
