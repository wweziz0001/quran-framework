'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Lock, Key, Eye, AlertTriangle, Check
} from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الأمان والحماية</h1>
          <p className="text-muted-foreground">إعدادات الأمان والصلاحيات</p>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">نشط</p>
                  <p className="text-sm text-muted-foreground">نظام الحماية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">JWT</p>
                  <p className="text-sm text-muted-foreground">المصادقة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">AES-256</p>
                  <p className="text-sm text-muted-foreground">التشفير</p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الأمان</CardTitle>
          <CardDescription>تكوين إعدادات الأمان الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">المصادقة الثنائية</p>
                <p className="text-sm text-muted-foreground">تفعيل المصادقة الثنائية للمستخدمين</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">نشط</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">تشفير كلمات المرور</p>
                <p className="text-sm text-muted-foreground">bcrypt مع salt factor 10</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">نشط</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">حماية من CSRF</p>
                <p className="text-sm text-muted-foreground">حماية طلبات التزوير</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">نشط</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">سجل التدقيق</p>
                <p className="text-sm text-muted-foreground">تسجيل جميع العمليات الحساسة</p>
              </div>
            </div>
            <Badge variant="secondary">متاح</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
