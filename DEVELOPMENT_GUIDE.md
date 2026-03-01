# دليل التطوير | Development Guide

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- Bun
- Git

### التثبيت
```bash
bun install
bun run db:push
bun run seed
bun run dev
```

---

## 📁 هيكل المشروع

```
quran-framework/
├── VERSION                    # الإصدار الحالي
├── changelog/
│   ├── CHANGELOG.md          # سجل كل الإصدارات
│   └── v1.0.0.md             # تفاصيل الإصدار
├── DEVELOPMENT_GUIDE.md       # هذا الملف
├── src/
│   ├── app/                  # Next.js App Router
│   ├── core/                 # Framework Core
│   │   ├── orm/             # ORM Layer (Odoo-style)
│   │   ├── security/        # Security (ACL + Groups)
│   │   ├── workflow/        # Workflow Engine
│   │   ├── automation/      # Automation Rules
│   │   ├── module/          # Module Loader
│   │   └── registry/        # Model Registry
│   ├── addons/              # Applications/Modules
│   └── components/          # UI Components
└── prisma/
    └── schema.prisma        # Database Schema
```

---

## 🔢 ترقيم الإصدارات

نستخدم **Semantic Versioning**: `MAJOR.MINOR.PATCH`

| النوع | متى يُستخدم | مثال |
|-------|-------------|------|
| MAJOR | تغييرات جذرية | 1.0.0 → 2.0.0 |
| MINOR | ميزات جديدة | 1.2.0 → 1.3.0 |
| PATCH | إصلاح أخطاء | 1.2.5 → 1.2.6 |

---

## 📝 الرموز المستخدمة

| الرمز | المعنى |
|-------|--------|
| 🟢 | كود جديد (تمت إضافته) |
| 🔴 | كود قديم (تمت إزالته) |
| 🔧 | إصلاح خطأ |
| ✨ | ميزة جديدة |
| 📝 | توثيق |
| 🎨 | تحسينات التصميم |
| ⚡ | تحسينات الأداء |

---

## 🚀 خطوات إصدار تحديث جديد

### عند إصلاح مشكلة (Patch)

```bash
# 1. قراءة الإصدار الحالي
cat VERSION  # مثال: 1.2.5

# 2. تحديث VERSION
echo "1.2.6" > VERSION

# 3. إنشاء ملف التغييرات
# إنشاء changelog/v1.2.6.md

# 4. تحديث CHANGELOG.md

# 5. إنشاء فرع ورفع
git checkout -b v1.2.6
git add .
git commit -m "Release v1.2.6: وصف الإصلاح"
git push origin v1.2.6
```

### عند إضافة ميزة (Minor)

```bash
echo "1.3.0" > VERSION
# إنشاء changelog/v1.3.0.md
```

### عند تغيير جذري (Major)

```bash
echo "2.0.0" > VERSION
# إنشاء changelog/v2.0.0.md
```

---

## 📤 الرفع إلى GitHub

```bash
# إنشاء فرع جديد
git checkout -b v1.2.6

# إضافة الملفات
git add .

# إنشاء commit
git commit -m "Release v1.2.6: وصف التغيير"

# رفع الفرع
git push origin v1.2.6
```

---

## ⚠️ قواعد مهمة

### ✅ يجب فعله
- توثيق دقيق لكل تغيير
- فرع منفصل لكل إصدار
- رسائل commit واضحة
- تحديث VERSION و CHANGELOG

### ❌ لا يجب فعله
- لا تعمل commit مباشر على main
- لا تتخطى التوثيق
- لا تحذف ملفات changelog
- لا تغير VERSION بدون سبب

---

## ✅ قائمة التحقق قبل الإصدار

- [ ] تم تحديث ملف VERSION
- [ ] تم إنشاء ملف changelog/vX.X.X.md
- [ ] تم تحديث changelog/CHANGELOG.md
- [ ] تم إنشاء فرع جديد
- [ ] تم عمل commit مع رسالة واضحة
- [ ] تم رفع الفرع إلى GitHub

---

## 🏗️ بنية Framework

### ORM (Odoo-style)

```typescript
// تعريف نموذج
class SurahModel extends BaseModel {
  static _name = 'quran.surah';
  static _fields = {
    name: new fields.Char({ required: true }),
    number: new fields.Integer({ required: true }),
    ayahs: new fields.One2Many({ model: 'quran.ayah', field: 'surah_id' }),
  };

  @api.depends('ayahs')
  async computeAyahCount() {
    return this.get('ayahs')?.length || 0;
  }
}

// استخدام
const surahs = await SurahModel.search([['revelation_type', '=', 'makki']]);
const surah = await SurahModel.browse(1);
await surah.write({ name: 'Updated' });
```

### Security

```typescript
// ACL
{
  "model": "quran.surah",
  "permissions": {
    "read": ["base.group_user"],
    "write": ["base.group_manager"],
    "create": ["base.group_manager"],
    "unlink": ["base.group_admin"]
  }
}

// Record Rules
{
  "model": "quran.memorization",
  "domain": "[('user_id', '=', user.id)]",
  "groups": ["base.group_user"]
}
```

### Workflow

```typescript
const workflow = {
  states: ['draft', 'active', 'paused', 'completed'],
  transitions: [
    { from: 'draft', to: 'active', action: 'start' },
    { from: 'active', to: 'paused', action: 'pause' },
    { from: 'paused', to: 'active', action: 'resume' },
    { from: 'active', to: 'completed', action: 'complete' },
  ]
};
```

---

## 📦 التطبيقات المتاحة

| ID | الاسم | التصنيف | مثبت |
|----|-------|---------|------|
| quran | قارئ القرآن | Quran | ✅ |
| quran_audio | استماع القرآن | Quran | ❌ |
| quran_tafsir | تفسير القرآن | Quran | ❌ |
| memorization | الحفظ | Learning | ❌ |
| quran_analytics | الإحصائيات | Analytics | ❌ |
| prayer_times | أوقات الصلاة | Islamic | ❌ |
| users | إدارة المستخدمين | Administration | ✅ |
| settings | الإعدادات | Administration | ✅ |

---

## 🔗 روابط مفيدة

- [Odoo ORM Documentation](https://www.odoo.com/documentation/16.0/developer/reference/orm.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**آخر تحديث:** 2025-01-19
**الإصدار:** 1.0.0
