'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookMarked, Image, RefreshCw, Download, Upload, Plus
} from 'lucide-react';

export default function MushafsManagementPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المصاحف</h1>
          <p className="text-muted-foreground">إدارة إصدارات المصحف المختلفة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إضافة إصدار
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="image" className="space-y-4">
        <TabsList>
          <TabsTrigger value="image">مصاحف صوري</TabsTrigger>
          <TabsTrigger value="ttf">مصاحف خطي</TabsTrigger>
        </TabsList>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>مصاحف صورية</CardTitle>
              <CardDescription>إصدارات المصحف المعروضة كصور صفحات عالية الجودة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Image className="h-16 w-16 mx-auto opacity-50 mb-4" />
                <p>لا توجد إصدارات مصحف صوري حالياً</p>
                <p className="text-sm mt-2">يمكن استيراد إصدارات المصحف من صفحة الاستيراد</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ttf">
          <Card>
            <CardHeader>
              <CardTitle>مصاحف خطية (TTF)</CardTitle>
              <CardDescription>مصاحف تعتمد على خطوط عربية خاصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BookMarked className="h-16 w-16 mx-auto opacity-50 mb-4" />
                <p>لا توجد إصدارات مصحف خطي حالياً</p>
                <p className="text-sm mt-2">يمكن استيراد إصدارات المصحف من صفحة الاستيراد</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
