'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Cloud, Download, RefreshCw, Check, AlertTriangle, 
  BookOpen, Headphones
} from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface Reciter {
  id: string;
  name: string;
  reciter_eng: string;
  identifier: string;
}

export default function ImportDataPage() {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<Record<string, 'idle' | 'running' | 'completed' | 'error'>>({});
  const [activeTab, setActiveTab] = useState('surahs');
  
  const [surahsData, setSurahsData] = useState<Surah[]>([]);
  const [selectedSurahs, setSelectedSurahs] = useState<number[]>([]);
  const [recitersData, setRecitersData] = useState<Reciter[]>([]);
  const [selectedReciters, setSelectedReciters] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [surahsRes, recitersRes] = await Promise.all([
        fetch('https://api.alquran.cloud/v1/surah'),
        fetch('https://api.alquran.cloud/v1/recitation/en')
      ]);
      
      const surahsJson = await surahsRes.json();
      const recitersJson = await recitersRes.json();
      
      if (surahsJson.data) setSurahsData(surahsJson.data);
      if (recitersJson.data) setRecitersData(recitersJson.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const importSurahs = async () => {
    setImporting(true);
    setImportStatus({ surahs: 'running' });
    setProgress(0);
    
    try {
      for (let i = 0; i < surahsData.length; i++) {
        const surah = surahsData[i];
        try {
          await fetch('/api/surahs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              number: surah.number,
              nameArabic: surah.name,
              nameEnglish: surah.englishName,
              nameTransliteration: surah.englishNameTranslation,
              revelationType: surah.revelationType.toLowerCase() === 'meccan' ? 'makki' : 'madani',
              totalAyahs: surah.numberOfAyahs,
            })
          });
        } catch (error) {
          console.error('Error importing surah:', surah.number, error);
        }
        setProgress(Math.round(((i + 1) / surahsData.length) * 100));
      }
      setImportStatus({ surahs: 'completed' });
    } catch (error) {
      console.error('Error importing surahs:', error);
      setImportStatus({ surahs: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const importReciters = async () => {
    setImporting(true);
    setImportStatus({ reciters: 'running' });
    setProgress(0);
    
    try {
      for (let i = 0; i < recitersData.length; i++) {
        const reciter = recitersData[i];
        try {
          await fetch('/api/reciters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nameArabic: reciter.name,
              nameEnglish: reciter.reciter_eng,
              slug: reciter.reciter_eng.toLowerCase().replace(/\s+/g, '-'),
              hasGapless: true,
              hasHighQuality: false,
              totalDownloads: 0,
              popularity: 0,
              isActive: true,
              apiIdentifier: reciter.identifier
            })
          });
        } catch (error) {
          console.error('Error importing reciter:', reciter.name, error);
        }
        setProgress(Math.round(((i + 1) / recitersData.length) * 100));
      }
      setImportStatus({ reciters: 'completed' });
    } catch (error) {
      console.error('Error importing reciters:', error);
      setImportStatus({ reciters: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const startImport = async () => {
    if (activeTab === 'surahs') {
      await importSurahs();
    } else if (activeTab === 'reciters') {
      await importReciters();
    }
  };

  const isRunning = importStatus.surahs === 'running' || importStatus.reciters === 'running';

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">استيراد البيانات</h1>
          <p className="text-muted-foreground">استيراد البيانات من مصادر خارجية</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setSelectedSurahs([]); setSelectedReciters([]); }}>
            إعادة تعيين
          </Button>
          <Button onClick={startImport} disabled={importing}>
            {importing ? (
              <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 ml-2" />
            )}
            بدء الاستيراد
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="surahs">السور ({surahsData.length})</TabsTrigger>
          <TabsTrigger value="reciters">القراء ({recitersData.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="surahs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                استيراد السور
              </CardTitle>
              <CardDescription>
                استيراد قائمة السور من AlQuran Cloud API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{surahsData.length} سورة متاحة</Badge>
                  <Badge variant="secondary">{selectedSurahs.length} محددة</Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedSurahs(surahsData.map(s => s.number))}
                  disabled={selectedSurahs.length === surahsData.length}
                >
                  تحديد الكل
                </Button>
              </div>

              {importStatus.surahs === 'running' && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">جاري الاستيراد... {progress}%</p>
                </div>
              )}

              {importStatus.surahs === 'completed' && (
                <div className="p-4 rounded-lg bg-green-500/10 text-green-600 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  تم استيراد السور بنجاح
                </div>
              )}

              {importStatus.surahs === 'error' && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  خطأ في الاستيراد
                </div>
              )}

              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {surahsData.map((surah) => (
                    <Card
                      key={surah.number}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSurahs.includes(surah.number) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedSurahs(prev => 
                          prev.includes(surah.number) 
                            ? prev.filter(n => n !== surah.number) 
                            : [...prev, surah.number]
                        );
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-arabic">{surah.name}</span>
                          <Badge variant="outline">{surah.numberOfAyahs} آية</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                        <p className="text-xs text-muted-foreground">
                          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reciters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                استيراد القراء
              </CardTitle>
              <CardDescription>
                استيراد قائمة القراء من AlQuran Cloud API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{recitersData.length} قارئ متاح</Badge>
                  <Badge variant="secondary">{selectedReciters.length} محددة</Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedReciters(recitersData.map(r => r.id))}
                  disabled={selectedReciters.length === recitersData.length}
                >
                  تحديد الكل
                </Button>
              </div>

              {importStatus.reciters === 'running' && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">جاري الاستيراد... {progress}%</p>
                </div>
              )}

              {importStatus.reciters === 'completed' && (
                <div className="p-4 rounded-lg bg-green-500/10 text-green-600 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  تم استيراد القراء بنجاح
                </div>
              )}

              {importStatus.reciters === 'error' && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  خطأ في الاستيراد
                </div>
              )}

              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recitersData.map((reciter) => (
                    <Card
                      key={reciter.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedReciters.includes(reciter.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedReciters(prev => 
                          prev.includes(reciter.id) 
                            ? prev.filter(id => id !== reciter.id) 
                            : [...prev, reciter.id]
                        );
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Headphones className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{reciter.name}</p>
                            <p className="text-xs text-muted-foreground">{reciter.reciter_eng}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
