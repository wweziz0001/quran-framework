/**
 * Apps/Modules Registry
 * =====================
 * Central registry for all available applications
 */

export interface AppManifest {
  id: string;
  name: string;
  nameAr: string;
  version: string;
  summary: string;
  summaryAr: string;
  description: string;
  descriptionAr: string;
  author: string;
  website?: string;
  category: string;
  icon: string;
  color: string;
  depends: string[];
  installed: boolean;
  installable: boolean;
  autoInstall: boolean;
  application: boolean;
  price?: string;
  currency?: string;
}

export const appsRegistry: AppManifest[] = [
  {
    id: 'base',
    name: 'Base',
    nameAr: 'النظام الأساسي',
    version: '1.0.0',
    summary: 'Core framework module',
    summaryAr: 'الوحدة الأساسية للنظام',
    description: 'Core module providing essential functionality for the Quran Framework including models, security, and base features.',
    descriptionAr: 'الوحدة الأساسية التي توفر الوظائف الأساسية لنظام القرآن بما في ذلك النماذج والأمان والميزات الأساسية.',
    author: 'Quran Framework Team',
    website: 'https://quran-framework.example.com',
    category: 'Core',
    icon: 'Settings',
    color: '#6366f1',
    depends: [],
    installed: true,
    installable: true,
    autoInstall: true,
    application: false,
  },
  {
    id: 'quran',
    name: 'Quran Reader',
    nameAr: 'قارئ القرآن',
    version: '1.0.0',
    summary: 'Read and browse the Holy Quran',
    summaryAr: 'اقرأ وتصفح القرآن الكريم',
    description: 'Complete Quran reading experience with Arabic text, translations, search functionality, and beautiful typography.',
    descriptionAr: 'تجربة قراءة القرآن الكاملة مع النص العربي والترجمات والبحث والطباعة الجميلة.',
    author: 'Quran Framework Team',
    website: 'https://quran-framework.example.com',
    category: 'Quran',
    icon: 'BookOpen',
    color: '#059669',
    depends: ['base'],
    installed: true,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'quran_audio',
    name: 'Quran Audio',
    nameAr: 'استماع القرآن',
    version: '1.0.0',
    summary: 'Listen to Quran recitations',
    summaryAr: 'استمع لتلاوات القرآن الكريم',
    description: 'Audio recitations from famous reciters with verse-by-verse playback, audio controls, and offline support.',
    descriptionAr: 'تلاوات صوتية من قراء مشهورين مع التشغيل آية بآية وتحكم في الصوت ودعم عدم الاتصال.',
    author: 'Quran Framework Team',
    category: 'Quran',
    icon: 'Headphones',
    color: '#7c3aed',
    depends: ['base', 'quran'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'quran_tafsir',
    name: 'Quran Tafsir',
    nameAr: 'تفسير القرآن',
    version: '1.0.0',
    summary: 'Quran exegesis and interpretations',
    summaryAr: 'تفسير وتأويل القرآن الكريم',
    description: 'Access multiple tafsir sources with word-by-word analysis and scholarly interpretations.',
    descriptionAr: 'الوصول إلى مصادر تفسير متعددة مع تحليل كلمة بكلمة وتفاسير العلماء.',
    author: 'Quran Framework Team',
    category: 'Quran',
    icon: 'BookMarked',
    color: '#d97706',
    depends: ['base', 'quran'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'memorization',
    name: 'Memorization',
    nameAr: 'الحفظ',
    version: '1.0.0',
    summary: 'Quran memorization assistant',
    summaryAr: 'مساعد حفظ القرآن الكريم',
    description: 'Planned memorization with spaced repetition algorithm (SM-2), progress tracking, and revision schedules.',
    descriptionAr: 'خطط للحفظ مع خوارزمية التكرار المتباعد (SM-2) وتتبع التقدم وجداول المراجعة.',
    author: 'Quran Framework Team',
    category: 'Learning',
    icon: 'Target',
    color: '#dc2626',
    depends: ['base', 'quran'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'quran_analytics',
    name: 'Analytics',
    nameAr: 'الإحصائيات',
    version: '1.0.0',
    summary: 'Reading statistics and progress tracking',
    summaryAr: 'إحصائيات القراءة وتتبع التقدم',
    description: 'Track your reading habits, memorization progress, achievements, and get personalized insights.',
    descriptionAr: 'تتبع عادات القراءة وتقدم الحفظ والإنجازات واحصل على رؤى مخصصة.',
    author: 'Quran Framework Team',
    category: 'Analytics',
    icon: 'BarChart3',
    color: '#0891b2',
    depends: ['base'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'prayer_times',
    name: 'Prayer Times',
    nameAr: 'أوقات الصلاة',
    version: '1.0.0',
    summary: 'Prayer times and Qibla direction',
    summaryAr: 'أوقات الصلاة واتجاه القبلة',
    description: 'Accurate prayer times based on your location with Qibla compass and prayer reminders.',
    descriptionAr: 'أوقات صلاة دقيقة بناءً على موقعك مع بوصلة القبلة وتنبيهات الصلاة.',
    author: 'Quran Framework Team',
    category: 'Islamic',
    icon: 'Compass',
    color: '#4f46e5',
    depends: ['base'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
  {
    id: 'users',
    name: 'User Management',
    nameAr: 'إدارة المستخدمين',
    version: '1.0.0',
    summary: 'User authentication and permissions',
    summaryAr: 'المصادقة والصلاحيات',
    description: 'Manage users, groups, roles, and access rights with comprehensive security features.',
    descriptionAr: 'إدارة المستخدمين والمجموعات والأدوار وصلاحيات الوصول مع ميزات أمان شاملة.',
    author: 'Quran Framework Team',
    category: 'Administration',
    icon: 'Users',
    color: '#64748b',
    depends: ['base'],
    installed: true,
    installable: true,
    autoInstall: true,
    application: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    nameAr: 'الإعدادات',
    version: '1.0.0',
    summary: 'System configuration and preferences',
    summaryAr: 'إعدادات النظام والتفضيلات',
    description: 'Configure system settings, appearance, themes, languages, and user preferences.',
    descriptionAr: 'تكوين إعدادات النظام والمظهر والسمات واللغات وتفضيلات المستخدم.',
    author: 'Quran Framework Team',
    category: 'Administration',
    icon: 'Settings',
    color: '#78716c',
    depends: ['base'],
    installed: true,
    installable: true,
    autoInstall: true,
    application: false,
  },
  {
    id: 'web_admin',
    name: 'Admin Dashboard',
    nameAr: 'لوحة التحكم',
    version: '17.0.1.0.0',
    summary: 'Administrative control panel',
    summaryAr: 'لوحة تحكم إدارية للنظام',
    description: 'Complete admin dashboard for managing Quran data, users, reciters, tafsir sources, and system settings with CRUD operations.',
    descriptionAr: 'لوحة تحكم كاملة لإدارة بيانات القرآن والمستخدمين والقراء ومصادر التفسير وإعدادات النظام مع عمليات CRUD.',
    author: 'Quran Framework Team',
    website: 'https://quran-framework.example.com',
    category: 'Administration',
    icon: 'LayoutDashboard',
    color: '#3b82f6',
    depends: ['base'],
    installed: false,
    installable: true,
    autoInstall: false,
    application: true,
  },
];

export function getInstalledApps(): AppManifest[] {
  return appsRegistry.filter(app => app.installed);
}

export function getApplicationApps(): AppManifest[] {
  return appsRegistry.filter(app => app.application);
}

export function getAppById(id: string): AppManifest | undefined {
  return appsRegistry.find(app => app.id === id);
}

export function getAppsByCategory(): Record<string, AppManifest[]> {
  const categories: Record<string, AppManifest[]> = {};
  for (const app of appsRegistry) {
    if (!categories[app.category]) {
      categories[app.category] = [];
    }
    categories[app.category].push(app);
  }
  return categories;
}
