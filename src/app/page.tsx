'use client';

import { useState, useEffect } from 'react';
import {
  Settings, BookOpen, Headphones, BookMarked, Target, BarChart3, Compass,
  Users, Search, ChevronRight, Check, Download, Play, Star, Clock,
  Grid, List, Filter, RefreshCw, X, Home, Menu, Book, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Types
import type { AppManifest } from '@/lib/apps-registry';
import { appsRegistry, getAppsByCategory } from '@/lib/apps-registry';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Settings,
  BookOpen,
  Headphones,
  BookMarked,
  Target,
  BarChart3,
  Compass,
  Users,
  Book,
  Heart,
};

// App Card Component
function AppCard({
  app,
  onInstall,
  onOpen,
  viewMode
}: {
  app: AppManifest;
  onInstall: (id: string) => void;
  onOpen: (id: string) => void;
  viewMode: 'grid' | 'list';
}) {
  const Icon = iconMap[app.icon] || Settings;
  const isInstalling = false;

  if (viewMode === 'list') {
    return (
      <Card className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        app.installed && "border-primary/30 bg-primary/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: app.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{app.nameAr}</h3>
                <span className="text-sm text-muted-foreground">({app.name})</span>
                {app.installed && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    مثبت
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{app.summaryAr}</p>
            </div>
            <div className="flex items-center gap-2">
              {app.installed && app.application ? (
                <Button onClick={() => onOpen(app.id)}>
                  <Play className="w-4 h-4 mr-1" />
                  فتح
                </Button>
              ) : !app.installed ? (
                <Button variant="outline" onClick={() => onInstall(app.id)} disabled={isInstalling}>
                  {isInstalling ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-1" />
                  )}
                  تثبيت
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
      app.installed && "border-primary/30 bg-primary/5"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: app.color }}
          >
            <Icon className="w-7 h-7" />
          </div>
          {app.installed && (
            <Badge variant="secondary" className="text-xs">
              <Check className="w-3 h-3 mr-1" />
              مثبت
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{app.nameAr}</h3>
          <p className="text-sm text-muted-foreground">{app.name}</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{app.summaryAr}</p>
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline">{app.category}</Badge>
          <span className="text-xs text-muted-foreground">v{app.version}</span>
        </div>
        {app.installed && app.application ? (
          <Button className="w-full mt-2" onClick={() => onOpen(app.id)}>
            <Play className="w-4 h-4 mr-2" />
            فتح التطبيق
          </Button>
        ) : !app.installed ? (
          <Button className="w-full mt-2" variant="outline" onClick={() => onInstall(app.id)} disabled={isInstalling}>
            {isInstalling ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            تثبيت
          </Button>
        ) : (
          <Button className="w-full mt-2" variant="ghost" disabled>
            <Check className="w-4 h-4 mr-2" />
            مثبت
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// App Detail Modal
function AppDetail({
  app,
  onClose,
  onInstall,
  onOpen
}: {
  app: AppManifest;
  onClose: () => void;
  onInstall: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const Icon = iconMap[app.icon] || Settings;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-start gap-4 pt-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: app.color }}
            >
              <Icon className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{app.nameAr}</h2>
                {app.installed && (
                  <Badge variant="secondary">
                    <Check className="w-3 h-3 mr-1" />
                    مثبت
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{app.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{app.category}</Badge>
                <span className="text-sm text-muted-foreground">v{app.version}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{app.author}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">الوصف</h3>
            <p className="text-muted-foreground">{app.descriptionAr}</p>
          </div>

          {app.depends.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">يعتمد على</h3>
              <div className="flex flex-wrap gap-2">
                {app.depends.map(dep => {
                  const depApp = appsRegistry.find(a => a.id === dep);
                  return (
                    <Badge key={dep} variant="secondary">
                      {depApp?.nameAr || dep}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-3">
            {app.installed && app.application ? (
              <Button className="flex-1" size="lg" onClick={() => onOpen(app.id)}>
                <Play className="w-5 h-5 mr-2" />
                فتح التطبيق
              </Button>
            ) : !app.installed ? (
              <Button className="flex-1" size="lg" onClick={() => onInstall(app.id)}>
                <Download className="w-5 h-5 mr-2" />
                تثبيت
              </Button>
            ) : (
              <Button className="flex-1" size="lg" variant="ghost" disabled>
                <Check className="w-5 h-5 mr-2" />
                مثبت
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Apps Store Component
export default function AppsStore() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<AppManifest | null>(null);
  const [activeView, setActiveView] = useState<'apps' | 'installed' | 'app'>('apps');
  const [currentApp, setCurrentApp] = useState<AppManifest | null>(null);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  // Get categories
  const categories = getAppsByCategory();
  const categoryList = ['all', ...Object.keys(categories)];

  // Filter apps
  const filteredApps = appsRegistry.filter(app => {
    const matchesSearch = !searchQuery ||
      app.nameAr.includes(searchQuery) ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.summaryAr.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesView = activeView === 'apps' || (activeView === 'installed' && app.installed);
    return matchesSearch && matchesCategory && matchesView;
  });

  // Handlers
  const handleInstall = async (appId: string) => {
    setIsInstalling(appId);
    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const app = appsRegistry.find(a => a.id === appId);
    if (app) app.installed = true;
    setIsInstalling(null);
  };

  const handleOpenApp = (appId: string) => {
    const app = appsRegistry.find(a => a.id === appId);
    if (app) {
      setCurrentApp(app);
      setActiveView('app');
    }
  };

  // App View (when a specific app is opened)
  if (activeView === 'app' && currentApp) {
    if (currentApp.id === 'quran') {
      return <QuranAppView app={currentApp} onBack={() => setActiveView('apps')} />;
    }
    
    // Generic app view for other apps
    const Icon = iconMap[currentApp.icon] || Settings;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* App Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center px-4 gap-4">
            <Button variant="ghost" size="sm" onClick={() => setActiveView('apps')}>
              <ChevronRight className="w-4 h-4 ml-1" />
              العودة للتطبيقات
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: currentApp.color }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <h1 className="font-semibold">{currentApp.nameAr}</h1>
          </div>
        </header>

        {/* App Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl"
              style={{ backgroundColor: currentApp.color }}
            >
              <Icon className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">{currentApp.nameAr}</h2>
            <p className="text-muted-foreground max-w-md">{currentApp.descriptionAr}</p>
            <Badge variant="secondary">قيد التطوير</Badge>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-4 bg-muted/30">
          <div className="container px-4 text-center text-sm text-muted-foreground">
            {currentApp.nameAr} v{currentApp.version}
          </div>
        </footer>
      </div>
    );
  }

  // Apps Store View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Grid className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold">متجر التطبيقات</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث..."
                className="w-64 pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r bg-muted/30 hidden md:block">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4 space-y-4">
              {/* Navigation */}
              <div className="space-y-1">
                <Button
                  variant={activeView === 'apps' ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveView('apps')}
                >
                  <Grid className="w-4 h-4" />
                  جميع التطبيقات
                </Button>
                <Button
                  variant={activeView === 'installed' ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveView('installed')}
                >
                  <Check className="w-4 h-4" />
                  المثبتة
                </Button>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-2">التصنيفات</h3>
                <div className="space-y-1">
                  {categoryList.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === 'all' ? 'الكل' : cat}
                      <Badge variant="outline" className="mr-auto">
                        {cat === 'all'
                          ? appsRegistry.length
                          : categories[cat]?.length || 0}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeView === 'installed' ? 'التطبيقات المثبتة' : 'جميع التطبيقات'}
                </h2>
                <p className="text-muted-foreground">
                  {filteredApps.length} تطبيق
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Apps Grid/List */}
            <div className={cn(
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-2"
            )}>
              {filteredApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onInstall={handleInstall}
                  onOpen={handleOpenApp}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-12">
                <Grid className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-semibold">لا توجد تطبيقات</h3>
                <p className="text-muted-foreground">جرب تغيير معايير البحث</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-3 bg-muted/30">
        <div className="container px-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>نظام القرآن الكريم - Odoo Framework</span>
          <span>{appsRegistry.filter(a => a.installed).length} تطبيق مثبت</span>
        </div>
      </footer>

      {/* App Detail Modal */}
      {selectedApp && (
        <AppDetail
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onInstall={handleInstall}
          onOpen={handleOpenApp}
        />
      )}
    </div>
  );
}

// Quran App View (the actual Quran application)
function QuranAppView({ app, onBack }: { app: AppManifest; onBack: () => void }) {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ayahsLoading, setAyahsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSurah, setShowSurah] = useState(false);
  const [fontSize, setFontSize] = useState(1.5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surahsRes, statsRes] = await Promise.all([
          fetch('/api/surahs'),
          fetch('/api/stats')
        ]);
        const surahsData = await surahsRes.json();
        const statsData = await statsRes.json();
        if (surahsData.success) setSurahs(surahsData.data);
        if (statsData.success) setStats(statsData.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      const fetchAyahs = async () => {
        setAyahsLoading(true);
        try {
          const res = await fetch(`/api/surahs/${selectedSurah.number}`);
          const data = await res.json();
          if (data.success) setAyahs(data.data.ayahs || []);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setAyahsLoading(false);
        }
      };
      fetchAyahs();
    }
  }, [selectedSurah]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto animate-pulse text-primary" />
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4 gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronRight className="w-4 h-4 ml-1" />
            العودة
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="font-semibold">{app.nameAr}</h1>
          
          <div className="flex-1" />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'fixed md:relative z-40 w-72 border-r bg-background transition-transform duration-300 md:translate-x-0'
        )}>
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4 space-y-4">
              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">السور</p>
                    <p className="text-xl font-bold">{stats.totalSurahs}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">الآيات</p>
                    <p className="text-xl font-bold">{stats.totalAyahs}</p>
                  </Card>
                </div>
              )}

              <Separator />

              {/* Surah List */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">السور</h3>
                {surahs.map(surah => (
                  <Card
                    key={surah.id}
                    className={cn(
                      "cursor-pointer transition-all p-3",
                      selectedSurah?.id === surah.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => { setSelectedSurah(surah); setShowSurah(true); }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold",
                        surah.revelationType === 'makki' ? 'bg-emerald-500' : 'bg-amber-500'
                      )}>
                        {surah.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{surah.nameArabic}</p>
                        <p className="text-xs text-muted-foreground">{surah.totalAyahs} آية</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {!showSurah || !selectedSurah ? (
            // Home View
            <div className="container py-6 px-4 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">القرآن الكريم</h2>
                <p className="text-muted-foreground">اختر سورة للقراءة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {surahs.slice(0, 12).map(surah => (
                  <Card
                    key={surah.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => { setSelectedSurah(surah); setShowSurah(true); }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold",
                          surah.revelationType === 'makki' ? 'bg-emerald-500' : 'bg-amber-500'
                        )}>
                          {surah.number}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{surah.nameArabic}</CardTitle>
                          <CardDescription>{surah.nameEnglish}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {surah.revelationType === 'makki' ? 'مكية' : 'مدنية'}
                        </Badge>
                        <span>{surah.totalAyahs} آية</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Surah View
            <div className="container py-6 px-4 space-y-6">
              {/* Surah Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setShowSurah(false)}>
                      <ChevronRight className="w-4 h-4 ml-1" />
                      العودة
                    </Button>
                    <Badge variant={selectedSurah.revelationType === 'makki' ? 'default' : 'secondary'}>
                      {selectedSurah.revelationType === 'makki' ? 'مكية' : 'مدنية'}
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-arabic font-bold">{selectedSurah.nameArabic}</h2>
                    <p className="text-xl text-muted-foreground">{selectedSurah.nameEnglish}</p>
                    <p className="text-muted-foreground">{selectedSurah.totalAyahs} آية</p>
                  </div>
                  {selectedSurah.number !== 9 && (
                    <p className="text-center text-2xl font-arabic mt-4 text-primary" dir="rtl">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Font Size Control */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm text-muted-foreground">حجم الخط:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(1, fontSize - 0.25))}>أ-</Button>
                  <span className="w-12 text-center">{fontSize.toFixed(2)}rem</span>
                  <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(3, fontSize + 0.25))}>أ+</Button>
                </div>
              </div>

              {/* Ayahs */}
              {ayahsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0 divide-y">
                    {ayahs.map((ayah: any) => (
                      <div key={ayah.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {ayah.ayahNumber}
                          </div>
                          <p
                            className="flex-1 text-right leading-loose"
                            style={{ fontSize: `${fontSize}rem`, fontFamily: 'Amiri, "Traditional Arabic", serif' }}
                            dir="rtl"
                          >
                            {ayah.textArabic}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-3 bg-muted/30">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          القرآن الكريم - {app.version}
        </div>
      </footer>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
