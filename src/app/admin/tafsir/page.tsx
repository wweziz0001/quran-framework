'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, Search, Plus, Edit, Trash2, RefreshCw, Cloud
} from 'lucide-react';

interface TafsirSource {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  slug: string;
  authorArabic?: string;
  authorEnglish?: string;
  language: string;
  isDefault: boolean;
  isActive: boolean;
  _count?: { TafsirEntry: number };
}

export default function TafsirManagementPage() {
  const [sources, setSources] = useState<TafsirSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nameArabic: '',
    nameEnglish: '',
    slug: '',
    authorArabic: '',
    authorEnglish: '',
    language: 'ar'
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tafsir');
      const data = await res.json();
      if (data.success) {
        setSources(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async () => {
    try {
      const res = await fetch('/api/tafsir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isDefault: false,
          isActive: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setSources([...sources, data.data]);
        setShowAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return;
    
    try {
      const res = await fetch(`/api/tafsir/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setSources(sources.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nameArabic: '',
      nameEnglish: '',
      slug: '',
      authorArabic: '',
      authorEnglish: '',
      language: 'ar'
    });
  };

  const filteredSources = sources.filter(source => 
    source.nameArabic.includes(searchQuery) ||
    source.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة التفاسير</h1>
          <p className="text-muted-foreground">إدارة مصادر التفسير والترجمات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSources}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة مصدر
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.length}</p>
                <p className="text-sm text-muted-foreground">مصدر تفسير</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.filter(s => s.isActive).length}</p>
                <p className="text-sm text-muted-foreground">نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.filter(s => s.language === 'ar').length}</p>
                <p className="text-sm text-muted-foreground">بالعربية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم العربي أو الإنجليزي..."
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة مصادر التفسير</CardTitle>
          <CardDescription>
            عرض {filteredSources.length} من {sources.length} مصدر
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">لا توجد مصادر تفسير</p>
              <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة مصدر
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم العربي</TableHead>
                  <TableHead className="text-right">الاسم الإنجليزي</TableHead>
                  <TableHead className="text-right">المؤلف</TableHead>
                  <TableHead className="text-right">اللغة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التفاسير</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-arabic">{source.nameArabic}</TableCell>
                    <TableCell>{source.nameEnglish}</TableCell>
                    <TableCell className="font-arabic">{source.authorArabic || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{source.language}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.isActive ? 'default' : 'secondary'}>
                        {source.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>{source._count?.TafsirEntry || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Source Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مصدر تفسير جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">المعرف (ID)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="ibn-kathir"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameArabic">الاسم العربي</Label>
              <Input
                id="nameArabic"
                value={formData.nameArabic}
                onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                placeholder="تفسير ابن كثير"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">الاسم الإنجليزي</Label>
              <Input
                id="nameEnglish"
                value={formData.nameEnglish}
                onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                placeholder="Ibn Kathir"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">الرابط (Slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="ibn-kathir"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorArabic">المؤلف (عربي)</Label>
              <Input
                id="authorArabic"
                value={formData.authorArabic}
                onChange={(e) => setFormData({ ...formData, authorArabic: e.target.value })}
                placeholder="الحافظ ابن كثير"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="ar"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddSource}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
