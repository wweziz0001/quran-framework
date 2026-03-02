'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Headphones, Users, Database, Cloud, 
  Shield, Activity, ArrowUpRight, ArrowDownRight,
  RefreshCw, Download, Upload, Server
} from 'lucide-react';

interface SystemStats {
  totalSurahs: number;
  totalAyahs: number;
  totalReciters: number;
  totalRecitations: number;
  totalUsers: number;
  totalTafsirSources: number;
  dbSize: string;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export function DashboardSection() {
  const [stats, setStats] = useState<SystemStats>({
    totalSurahs: 114,
    totalAyahs: 6236,
    totalReciters: 0,
    totalRecitations: 0,
    totalUsers: 0,
    totalTafsirSources: 0,
    dbSize: '0 MB',
    systemHealth: 'healthy'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [surahsRes, statsRes] = await Promise.all([
          fetch('/api/surahs'),
          fetch('/api/stats')
        ]);
        const surahsData = await surahsRes.json();
        const statsData = await statsRes.json();
        
        if (surahsData.success) {
          setStats(prev => ({
            ...prev,
            totalSurahs: surahsData.data.length || 114,
            totalAyahs: statsData.data?.totalAyahs || 6236
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: 'استيراد البيانات', href: '/admin/import', icon: <Cloud className="h-4 w-4" />, color: 'bg-blue-500' },
    { label: 'إدارة السور', href: '/admin/quran', icon: <BookOpen className="h-4 w-4" />, color: 'bg-emerald-500' },
    { label: 'إدارة القراء', href: '/admin/reciters', icon: <Headphones className="h-4 w-4" />, color: 'bg-purple-500' },
    { label: 'إدارة التفاسير', href: '/admin/tafsir', icon: <BookOpen className="h-4 w-4" />, color: 'bg-amber-500' },
    { label: 'قاعدة البيانات', href: '/admin/db-manager', icon: <Database className="h-4 w-4" />, color: 'bg-cyan-500' },
    { label: 'الأمان', href: '/admin/security', icon: <Shield className="h-4 w-4" />, color: 'bg-red-500' },
  ];

  const statCards = [
    { title: 'السور', value: stats.totalSurahs, icon: <BookOpen className="h-5 w-5" />, color: 'text-emerald-600', change: '+0%' },
    { title: 'الآيات', value: stats.totalAyahs.toLocaleString(), icon: <BookOpen className="h-5 w-5" />, color: 'text-blue-600', change: '+0%' },
    { title: 'القراء', value: stats.totalReciters, icon: <Headphones className="h-5 w-5" />, color: 'text-purple-600', change: '+0%' },
    { title: 'المستخدمون', value: stats.totalUsers, icon: <Users className="h-5 w-5" />, color: 'text-amber-600', change: '+0%' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على النظام والإحصائيات</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            v1.0.0
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${stat.color} bg-opacity-10 p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Health */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              صحة النظام
            </CardTitle>
            <CardDescription>مراقبة حالة النظام والموارد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">قاعدة البيانات</span>
                <Badge variant="default" className="bg-green-500">نشط</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">واجهة API</span>
                <Badge variant="default" className="bg-green-500">نشط</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">التخزين</span>
                <Badge variant="secondary">{stats.dbSize}</Badge>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">الذاكرة</span>
                <Badge variant="secondary">256 MB</Badge>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>الوصول السريع للمهام الشائعة</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3"
                asChild
              >
                <a href={action.href}>
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="flex-1 text-right">{action.label}</span>
                  <ArrowUpRight className="h-4 w-4 mr-auto" />
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Database Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            نظرة عامة على قاعدة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-emerald-600">{stats.totalSurahs}</p>
              <p className="text-sm text-muted-foreground">سورة</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-blue-600">{stats.totalAyahs.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">آية</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-purple-600">{stats.totalReciters}</p>
              <p className="text-sm text-muted-foreground">قارئ</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-amber-600">{stats.totalTafsirSources}</p>
              <p className="text-sm text-muted-foreground">مصدر تفسير</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
