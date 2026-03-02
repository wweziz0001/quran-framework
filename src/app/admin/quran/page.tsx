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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  BookOpen, Search, Plus, Edit, Trash2, Eye, RefreshCw, Download
} from 'lucide-react';

interface Surah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  revelationType: string;
  totalAyahs: number;
  slug?: string;
}

export default function QuranManagementPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [ayahsLoading, setAyahsLoading] = useState(false);
  const [showAyahsDialog, setShowAyahsDialog] = useState(false);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/surahs');
      const data = await res.json();
      if (data.success) {
        setSurahs(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAyahs = async (surahId: number) => {
    setAyahsLoading(true);
    try {
      const res = await fetch(`/api/ayahs?surahId=${surahId}`);
      const data = await res.json();
      if (data.success) {
        setAyahs(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setAyahsLoading(false);
    }
  };

  const handleViewAyahs = (surah: Surah) => {
    setSelectedSurah(surah);
    setShowAyahsDialog(true);
    fetchAyahs(surah.id);
  };

  const filteredSurahs = surahs.filter(surah => 
    surah.nameArabic.includes(searchQuery) ||
    surah.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة القرآن الكريم</h1>
          <p className="text-muted-foreground">إدارة السور والآيات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSurahs}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إضافة سورة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{surahs.length}</p>
                <p className="text-sm text-muted-foreground">سورة</p>
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
                <p className="text-2xl font-bold">{surahs.filter(s => s.revelationType === 'makki').length}</p>
                <p className="text-sm text-muted-foreground">سورة مكية</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{surahs.filter(s => s.revelationType === 'madani').length}</p>
                <p className="text-sm text-muted-foreground">سورة مدنية</p>
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
              placeholder="بحث بالاسم العربي أو الإنجليزي أو رقم السورة..."
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Surahs Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة السور</CardTitle>
          <CardDescription>
            عرض {filteredSurahs.length} من {surahs.length} سورة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-right">الرقم</TableHead>
                    <TableHead className="text-right">الاسم العربي</TableHead>
                    <TableHead className="text-right">الاسم الإنجليزي</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">عدد الآيات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurahs.map((surah) => (
                    <TableRow key={surah.id}>
                      <TableCell className="font-medium">{surah.number}</TableCell>
                      <TableCell className="font-arabic text-lg">{surah.nameArabic}</TableCell>
                      <TableCell>{surah.nameEnglish}</TableCell>
                      <TableCell>
                        <Badge variant={surah.revelationType === 'makki' ? 'default' : 'secondary'}>
                          {surah.revelationType === 'makki' ? 'مكية' : 'مدنية'}
                        </Badge>
                      </TableCell>
                      <TableCell>{surah.totalAyahs}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleViewAyahs(surah)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
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

      {/* Ayahs Dialog */}
      <Dialog open={showAyahsDialog} onOpenChange={setShowAyahsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              آيات سورة {selectedSurah?.nameArabic}
            </DialogTitle>
            <DialogDescription>
              {selectedSurah?.totalAyahs} آية
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {ayahsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : ayahs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد آيات
              </div>
            ) : (
              <div className="space-y-2">
                {ayahs.map((ayah: any) => (
                  <div key={ayah.id} className="p-3 rounded-lg border hover:bg-muted/50">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {ayah.ayahNumber}
                      </div>
                      <p className="flex-1 text-right leading-loose font-arabic" style={{ fontSize: '1.25rem' }}>
                        {ayah.textArabic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
