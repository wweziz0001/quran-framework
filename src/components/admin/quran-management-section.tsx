'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Loader2, BookOpen, List, Save, X, Eye } from 'lucide-react';

interface Surah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration?: string;
  revelationType: string;
  totalAyahs: number;
  ayahCount?: number;
}

interface Verse {
  id: number;
  ayahNumber: number;
  textArabic: string;
  textTranslation?: string;
  juzNumber: number | null;
  pageNumber: number | null;
}

export function QuranManagementSection() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [totalAyahs, setTotalAyahs] = useState(0);
  
  // Dialog states
  const [isAddSurahOpen, setIsAddSurahOpen] = useState(false);
  const [isAddVerseOpen, setIsAddVerseOpen] = useState(false);
  const [isEditVerseOpen, setIsEditVerseOpen] = useState(false);
  const [isVersesOpen, setIsVersesOpen] = useState(false);
  const [isDeleteVerseOpen, setIsDeleteVerseOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [surahForm, setSurahForm] = useState({
    number: '',
    nameArabic: '',
    nameEnglish: '',
    nameTransliteration: '',
    revelationType: 'makki',
    totalAyahs: '7',
  });

  const [verseForm, setVerseForm] = useState({
    ayahNumber: '',
    textArabic: '',
    textTranslation: '',
    juzNumber: '1',
    pageNumber: '1',
  });

  useEffect(() => {
    fetchSurahs();
  }, []);

  async function fetchSurahs() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/surahs');
      const data = await response.json();
      if (data.success) {
        setSurahs(data.data);
        const total = data.data.reduce((sum: number, surah: Surah) => sum + (surah.ayahCount || surah.totalAyahs || 0), 0);
        setTotalAyahs(total);
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchVerses(surahId: number) {
    setIsLoadingVerses(true);
    try {
      const response = await fetch(`/api/ayahs?surahId=${surahId}`);
      const data = await response.json();
      if (data.success) {
        setVerses(data.data);
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setIsLoadingVerses(false);
    }
  }

  async function handleAddSurah() {
    if (!surahForm.nameArabic || !surahForm.nameEnglish) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/surahs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: parseInt(surahForm.number) || surahs.length + 1,
          nameArabic: surahForm.nameArabic,
          nameEnglish: surahForm.nameEnglish,
          nameTransliteration: surahForm.nameTransliteration || surahForm.nameEnglish,
          revelationType: surahForm.revelationType,
          totalAyahs: parseInt(surahForm.totalAyahs) || 0,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('تمت إضافة السورة بنجاح');
        setIsAddSurahOpen(false);
        fetchSurahs();
        resetSurahForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      alert('فشل في إضافة السورة');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddVerse() {
    if (!selectedSurah || !verseForm.textArabic) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/ayahs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahId: selectedSurah.id,
          ayahNumber: parseInt(verseForm.ayahNumber) || verses.length + 1,
          textArabic: verseForm.textArabic,
          juzNumber: parseInt(verseForm.juzNumber) || 1,
          pageNumber: parseInt(verseForm.pageNumber) || 1,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('تمت إضافة الآية بنجاح');
        fetchVerses(selectedSurah.id);
        resetVerseForm();
        setIsAddVerseOpen(false);
      }
    } catch (error) {
      alert('فشل في إضافة الآية');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEditVerse() {
    if (!selectedVerse || !verseForm.textArabic) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/ayahs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedVerse.id,
          ayahNumber: parseInt(verseForm.ayahNumber),
          textArabic: verseForm.textArabic,
          juzNumber: parseInt(verseForm.juzNumber),
          pageNumber: parseInt(verseForm.pageNumber),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('تم تحديث الآية بنجاح');
        if (selectedSurah) {
          fetchVerses(selectedSurah.id);
        }
        setIsEditVerseOpen(false);
        setSelectedVerse(null);
      }
    } catch (error) {
      alert('فشل في تحديث الآية');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteVerse() {
    if (!selectedVerse) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/ayahs?id=${selectedVerse.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('تم حذف الآية بنجاح');
        if (selectedSurah) {
          fetchVerses(selectedSurah.id);
        }
        setIsDeleteVerseOpen(false);
        setSelectedVerse(null);
      }
    } catch (error) {
      alert('فشل في حذف الآية');
    } finally {
      setIsSaving(false);
    }
  }

  function openVersesDialog(surah: Surah) {
    setSelectedSurah(surah);
    setVerses([]);
    fetchVerses(surah.id);
    setIsVersesOpen(true);
  }

  function openEditVerseDialog(verse: Verse) {
    setSelectedVerse(verse);
    setVerseForm({
      ayahNumber: verse.ayahNumber.toString(),
      textArabic: verse.textArabic,
      textTranslation: verse.textTranslation || '',
      juzNumber: (verse.juzNumber || 1).toString(),
      pageNumber: (verse.pageNumber || 1).toString(),
    });
    setIsEditVerseOpen(true);
  }

  function resetSurahForm() {
    setSurahForm({
      number: '',
      nameArabic: '',
      nameEnglish: '',
      nameTransliteration: '',
      revelationType: 'makki',
      totalAyahs: '7',
    });
  }

  function resetVerseForm() {
    setVerseForm({
      ayahNumber: '',
      textArabic: '',
      textTranslation: '',
      juzNumber: '1',
      pageNumber: '1',
    });
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة القرآن</h2>
          <p className="text-muted-foreground">إدارة السور والآيات</p>
        </div>
        <Button onClick={() => setIsAddSurahOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة سورة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{surahs.length}</p>
                <p className="text-xs text-muted-foreground">سورة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <BookOpen className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAyahs.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-muted-foreground">آية</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <List className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{surahs.length}</p>
                <p className="text-xs text-muted-foreground">السور المتوقعة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surahs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            السور ({surahs.length})
          </CardTitle>
          <CardDescription>قائمة جميع السور في قاعدة البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الاسم بالعربية</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الاسم بالإنجليزية</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">النوع</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">عدد الآيات</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {surahs.map((surah) => (
                    <tr key={surah.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{surah.number}</td>
                      <td className="py-3 px-4 text-sm" style={{ fontFamily: "'Amiri', serif" }}>{surah.nameArabic}</td>
                      <td className="py-3 px-4 text-sm">{surah.nameEnglish}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={surah.revelationType === 'makki' ? 'default' : 'secondary'}>
                          {surah.revelationType === 'makki' || surah.revelationType === 'meccan' ? 'مكية' : 'مدنية'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={surah.ayahCount !== surah.totalAyahs ? 'text-amber-500 font-medium' : ''}>
                          {surah.ayahCount ?? surah.totalAyahs}
                        </span>
                        {surah.ayahCount !== surah.totalAyahs && surah.ayahCount !== undefined && (
                          <span className="text-xs text-muted-foreground mr-1">(متوقع: {surah.totalAyahs})</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" onClick={() => openVersesDialog(surah)} className="gap-1">
                          <Eye className="h-3 w-3" />
                          الآيات
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Add Surah Dialog */}
      <Dialog open={isAddSurahOpen} onOpenChange={setIsAddSurahOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة سورة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>رقم السورة</Label>
                <Input type="number" value={surahForm.number} onChange={(e) => setSurahForm({ ...surahForm, number: e.target.value })} />
              </div>
              <div>
                <Label>عدد الآيات</Label>
                <Input type="number" value={surahForm.totalAyahs} onChange={(e) => setSurahForm({ ...surahForm, totalAyahs: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>الاسم بالعربية *</Label>
              <Input value={surahForm.nameArabic} onChange={(e) => setSurahForm({ ...surahForm, nameArabic: e.target.value })} dir="rtl" />
            </div>
            <div>
              <Label>الاسم بالإنجليزية *</Label>
              <Input value={surahForm.nameEnglish} onChange={(e) => setSurahForm({ ...surahForm, nameEnglish: e.target.value })} />
            </div>
            <div>
              <Label>النطق الصوتي</Label>
              <Input value={surahForm.nameTransliteration} onChange={(e) => setSurahForm({ ...surahForm, nameTransliteration: e.target.value })} />
            </div>
            <div>
              <Label>نوع النزول</Label>
              <select 
                className="w-full border rounded-md p-2 bg-background"
                value={surahForm.revelationType}
                onChange={(e) => setSurahForm({ ...surahForm, revelationType: e.target.value })}
              >
                <option value="makki">مكية</option>
                <option value="madani">مدنية</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSurahOpen(false)}>إلغاء</Button>
            <Button onClick={handleAddSurah} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verses Dialog */}
      <Dialog open={isVersesOpen} onOpenChange={setIsVersesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              آيات سورة {selectedSurah?.nameArabic}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-between py-2">
            <Badge variant="outline">{verses.length} آية</Badge>
            <Button onClick={() => {
              setVerseForm({ ayahNumber: (verses.length + 1).toString(), textArabic: '', textTranslation: '', juzNumber: '1', pageNumber: '1' });
              setIsAddVerseOpen(true);
            }} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              إضافة آية
            </Button>
          </div>

          <ScrollArea className="flex-1">
            {isLoadingVerses ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : verses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا توجد آيات</div>
            ) : (
              <div className="space-y-2">
                {verses.map((verse) => (
                  <div key={verse.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className="shrink-0">{verse.ayahNumber}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditVerseDialog(verse)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setSelectedVerse(verse); setIsDeleteVerseOpen(true); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg text-right" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                          {verse.textArabic}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>الجزء: {verse.juzNumber ?? '-'}</span>
                          <span>الصفحة: {verse.pageNumber ?? '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Verse Dialog */}
      <Dialog open={isAddVerseOpen} onOpenChange={setIsAddVerseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة آية جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>رقم الآية</Label>
                <Input type="number" value={verseForm.ayahNumber} onChange={(e) => setVerseForm({ ...verseForm, ayahNumber: e.target.value })} />
              </div>
              <div>
                <Label>الجزء</Label>
                <Input type="number" value={verseForm.juzNumber} onChange={(e) => setVerseForm({ ...verseForm, juzNumber: e.target.value })} />
              </div>
              <div>
                <Label>الصفحة</Label>
                <Input type="number" value={verseForm.pageNumber} onChange={(e) => setVerseForm({ ...verseForm, pageNumber: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>نص الآية *</Label>
              <Textarea 
                value={verseForm.textArabic}
                onChange={(e) => setVerseForm({ ...verseForm, textArabic: e.target.value })}
                rows={4}
                className="text-right text-lg"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVerseOpen(false)}>إلغاء</Button>
            <Button onClick={handleAddVerse} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Verse Dialog */}
      <Dialog open={isEditVerseOpen} onOpenChange={setIsEditVerseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              تعديل الآية {selectedVerse?.ayahNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>رقم الآية</Label>
                <Input type="number" value={verseForm.ayahNumber} onChange={(e) => setVerseForm({ ...verseForm, ayahNumber: e.target.value })} />
              </div>
              <div>
                <Label>الجزء</Label>
                <Input type="number" value={verseForm.juzNumber} onChange={(e) => setVerseForm({ ...verseForm, juzNumber: e.target.value })} />
              </div>
              <div>
                <Label>الصفحة</Label>
                <Input type="number" value={verseForm.pageNumber} onChange={(e) => setVerseForm({ ...verseForm, pageNumber: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>نص الآية *</Label>
              <Textarea 
                value={verseForm.textArabic}
                onChange={(e) => setVerseForm({ ...verseForm, textArabic: e.target.value })}
                rows={4}
                className="text-right text-lg"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditVerseOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              إلغاء
            </Button>
            <Button onClick={handleEditVerse} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-1" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Verse Confirmation */}
      <AlertDialog open={isDeleteVerseOpen} onOpenChange={setIsDeleteVerseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">هل أنت متأكد من حذف هذه الآية؟</span>
              {selectedVerse && (
                <span className="block text-sm text-muted-foreground" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                  الآية {selectedVerse.ayahNumber}: {selectedVerse.textArabic?.substring(0, 50)}...
                </span>
              )}
              <span className="block text-destructive text-sm">⚠️ سيتم حذف جميع البيانات المرتبطة بالآية</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <Button onClick={handleDeleteVerse} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              حذف
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
