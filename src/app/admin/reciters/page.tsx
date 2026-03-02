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
  Headphones, Search, Plus, Edit, Trash2, RefreshCw, Upload, Cloud
} from 'lucide-react';

interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  slug: string;
  country?: string;
  hasHighQuality: boolean;
  hasGapless: boolean;
  totalDownloads: number;
  popularity: number;
  isActive: boolean;
  apiIdentifier?: string;
}

export default function RecitersManagementPage() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingReciter, setEditingReciter] = useState<Reciter | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nameArabic: '',
    nameEnglish: '',
    slug: '',
    country: '',
    apiIdentifier: ''
  });

  useEffect(() => {
    fetchReciters();
  }, []);

  const fetchReciters = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reciters');
      const data = await res.json();
      if (data.success) {
        setReciters(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReciter = async () => {
    try {
      const res = await fetch('/api/reciters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hasHighQuality: false,
          hasGapless: false,
          totalDownloads: 0,
          popularity: 0,
          isActive: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setReciters([...reciters, data.data]);
        setShowAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteReciter = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القارئ؟')) return;
    
    try {
      const res = await fetch(`/api/reciters/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setReciters(reciters.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nameArabic: '',
      nameEnglish: '',
      slug: '',
      country: '',
      apiIdentifier: ''
    });
  };

  const filteredReciters = reciters.filter(reciter => 
    reciter.nameArabic.includes(searchQuery) ||
    reciter.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة القراء</h1>
          <p className="text-muted-foreground">إدارة القراء والتلاوات الصوتية</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchReciters}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة قارئ
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reciters.length}</p>
                <p className="text-sm text-muted-foreground">قارئ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <Headphones className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reciters.filter(r => r.isActive).length}</p>
                <p className="text-sm text-muted-foreground">نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Headphones className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reciters.filter(r => r.hasGapless).length}</p>
                <p className="text-sm text-muted-foreground">صوت متصل</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Headphones className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reciters.filter(r => r.hasHighQuality).length}</p>
                <p className="text-sm text-muted-foreground">جودة عالية</p>
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

      {/* Reciters Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة القراء</CardTitle>
          <CardDescription>
            عرض {filteredReciters.length} من {reciters.length} قارئ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reciters.length === 0 ? (
            <div className="text-center py-8">
              <Headphones className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">لا يوجد قراء</p>
              <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة قارئ
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم العربي</TableHead>
                    <TableHead className="text-right">الاسم الإنجليزي</TableHead>
                    <TableHead className="text-right">البلد</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الجودة</TableHead>
                    <TableHead className="text-right">التحميلات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReciters.map((reciter) => (
                    <TableRow key={reciter.id}>
                      <TableCell className="font-arabic">{reciter.nameArabic}</TableCell>
                      <TableCell>{reciter.nameEnglish}</TableCell>
                      <TableCell>{reciter.country || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={reciter.isActive ? 'default' : 'secondary'}>
                          {reciter.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {reciter.hasHighQuality && <Badge variant="outline">HD</Badge>}
                          {reciter.hasGapless && <Badge variant="outline">متصل</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{reciter.totalDownloads.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive"
                            onClick={() => handleDeleteReciter(reciter.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Add Reciter Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة قارئ جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nameArabic">الاسم العربي</Label>
              <Input
                id="nameArabic"
                value={formData.nameArabic}
                onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                placeholder="عبد الباسط عبد الصمد"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">الاسم الإنجليزي</Label>
              <Input
                id="nameEnglish"
                value={formData.nameEnglish}
                onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                placeholder="Abdul Basit Abdul Samad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">الرابط (Slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="abdul-basit"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">البلد</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="مصر"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiIdentifier">API Identifier</Label>
              <Input
                id="apiIdentifier"
                value={formData.apiIdentifier}
                onChange={(e) => setFormData({ ...formData, apiIdentifier: e.target.value })}
                placeholder="ar.abdulbasitmurattal"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddReciter}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
