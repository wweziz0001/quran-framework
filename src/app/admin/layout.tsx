'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LayoutDashboard, Database, Code, Shield, Settings, 
  BookOpen, Headphones, Cloud,
  Menu, Moon, Sun, Search, Users,
  BookMarked, AlertCircle, Download, ArrowRight, Loader2
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavItem {
  id: string;
  label: string;
  labelAr: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', href: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'quran', label: 'Quran', labelAr: 'القرآن', href: '/admin/quran', icon: <BookOpen className="h-4 w-4" />, badge: 'CRUD' },
  { id: 'mushafs', label: 'Mushafs', labelAr: 'المصاحف', href: '/admin/mushafs', icon: <BookMarked className="h-4 w-4" /> },
  { id: 'reciters', label: 'Reciters', labelAr: 'القراء', href: '/admin/reciters', icon: <Headphones className="h-4 w-4" />, badge: 'CRUD' },
  { id: 'tafsir', label: 'Tafsir', labelAr: 'التفسير', href: '/admin/tafsir', icon: <BookOpen className="h-4 w-4" />, badge: 'CRUD' },
  { id: 'users', label: 'Users', labelAr: 'المستخدمون', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { id: 'import', label: 'Import Data', labelAr: 'استيراد', href: '/admin/import', icon: <Cloud className="h-4 w-4" />, badge: 'NEW' },
  { id: 'db-manager', label: 'DB Manager', labelAr: 'مدير قاعدة البيانات', href: '/admin/db-manager', icon: <Database className="h-4 w-4" />, badge: 'NEW' },
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', href: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'security', label: 'Security', labelAr: 'الأمان', href: '/admin/security', icon: <Shield className="h-4 w-4" /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  // Module installation state
  const [moduleStatus, setModuleStatus] = useState<{
    checked: boolean;
    installed: boolean;
    installing: boolean;
    error: string | null;
  }>({
    checked: false,
    installed: false,
    installing: false,
    error: null
  });

  // Check module installation on mount
  useEffect(() => {
    let isMounted = true;
    
    async function checkInstallation() {
      try {
        const response = await fetch('/api/modules/check/web_admin');
        const data = await response.json();
        
        if (isMounted) {
          setModuleStatus({
            checked: true,
            installed: data.success && data.data?.installed,
            installing: false,
            error: null
          });
        }
      } catch {
        if (isMounted) {
          setModuleStatus({
            checked: true,
            installed: false,
            installing: false,
            error: 'فشل في التحقق من حالة الوحدة'
          });
        }
      }
    }
    
    checkInstallation();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInstall = async () => {
    setModuleStatus(prev => ({ ...prev, installing: true, error: null }));
    
    try {
      const response = await fetch('/api/modules/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'web_admin' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.refresh();
        window.location.reload();
      } else {
        setModuleStatus(prev => ({
          ...prev,
          installing: false,
          error: data.error || 'فشل في التثبيت'
        }));
      }
    } catch {
      setModuleStatus(prev => ({
        ...prev,
        installing: false,
        error: 'فشل في التثبيت'
      }));
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Loading state
  if (!moduleStatus.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Module not installed
  if (!moduleStatus.installed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">
              لوحة التحكم غير مثبتة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                وحدة <strong>لوحة التحكم</strong> غير مثبتة في النظام.
                <br />
                يرجى تثبيتها من متجر التطبيقات أو تثبيتها الآن.
              </AlertDescription>
            </Alert>

            {moduleStatus.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{moduleStatus.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleInstall} 
                disabled={moduleStatus.installing}
                className="w-full"
              >
                {moduleStatus.installing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري التثبيت...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    تثبيت الآن
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة لمتجر التطبيقات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">لوحة التحكم</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3",
                    !sidebarOpen && "justify-center px-0"
                  )}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-right">{item.labelAr}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 flex flex-col",
        sidebarOpen ? "mr-64" : "mr-16"
      )}>
        <header className="h-16 border-b bg-card/50 backdrop-blur sticky top-0 z-40 shrink-0">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="h-9 w-64 pr-9 pl-4 rounded-lg border bg-background text-sm text-right"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                النظام نشط
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  الرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </div>

        <footer className="h-12 border-t flex items-center justify-center text-xs text-muted-foreground shrink-0">
          <p>نظام القرآن الكريم - لوحة التحكم v1.0.0 • Next.js 16 • Prisma</p>
        </footer>
      </main>
    </div>
  );
}
