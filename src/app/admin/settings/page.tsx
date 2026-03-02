'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Save, RefreshCw, Moon, Sun, Monitor
} from 'lucide-react';

interface AppSetting {
  key: string;
  label: string;
  description: string;
  type: string;
  value: string | boolean;
  category?: string;
}

const defaultSettings: AppSetting[] = [
  { key: 'dark_mode', label: 'الوضع الداكن', description: 'تفعيل الوضع الداكن للواجهة', type: 'boolean', value: false, category: 'appearance' },
  { key: 'font_size', label: 'حجم الخط', description: 'حجم الخط في قارئ القرآن', type: 'number', value: '28', category: 'appearance' },
  { key: 'auto_play', label: 'التشغيل التلقائي', description: 'تشغيل الصوت تلقائياً', type: 'boolean', value: false, category: 'audio' },
  { key: 'show_tajweed', label: 'عرض التجويد', description: 'تلوين أحكام التجويد', type: 'boolean', value: false, category: 'quran' },
  { key: 'show_translation', label: 'عرض الترجمة', description: 'عرض الترجمة تحت الآيات', type: 'boolean', value: true, category: 'quran' },
];

const categories = [
  { id: 'all', labelAr: 'الكل' },
  { id: 'appearance', labelAr: 'المظهر' },
  { id: 'audio', labelAr: 'الصوت' },
  { id: 'quran', labelAr: 'القرآن' },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSetting[]>(defaultSettings);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const filteredSettings = selectedCategory === 'all' 
    ? settings 
    : settings.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 ml-2" />
            حفظ
          </Button>
        </div>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>التصنيفات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full justify-start"
              >
                <span className="font-medium">{cat.labelAr}</span>
                <Badge variant="outline" className="mr-2">
                  {cat.id === 'all' ? settings.length : settings.filter(s => s.category === cat.id).length}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <Badge>{filteredSettings.length} إعداد</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredSettings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{setting.label}</Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {setting.type === 'boolean' ? (
                        <Switch
                          checked={setting.value === true || setting.value === 'true'}
                          onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(setting.value)}
                          onChange={(e) => updateSetting(setting.key, e.target.value)}
                          className="h-9 w-32 px-3 rounded-md border bg-background text-sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
