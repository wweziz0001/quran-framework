'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, Play, Download, Upload, RefreshCw, TableIcon, 
  Code, BarChart, FileJson, Clock, AlertCircle, Check
} from 'lucide-react';

interface TableInfo {
  name: string;
  rowCount: number;
}

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
  rowCount: number;
}

export default function DBManagerPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  
  // SQL Editor
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM QuranSurah LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  
  // Saved queries
  const [savedQueries] = useState([
    { name: 'جميع السور', query: 'SELECT * FROM QuranSurah ORDER BY number;' },
    { name: 'عدد الآيات لكل سورة', query: 'SELECT s.nameArabic, COUNT(a.id) as ayahCount FROM QuranSurah s LEFT JOIN QuranAyah a ON s.id = a.surahId GROUP BY s.id;' },
    { name: 'القراء النشطون', query: 'SELECT * FROM QuranReciter WHERE isActive = 1;' },
    { name: 'إحصائيات قاعدة البيانات', query: "SELECT name FROM sqlite_master WHERE type='table';" },
  ]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db/tables');
      const data = await res.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setSelectedTable(tableName);
    try {
      const res = await fetch(`/api/admin/db/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT * FROM ${tableName} LIMIT 100;` })
      });
      const data = await res.json();
      if (data.success) {
        setTableData(data.data.rows);
        setTableColumns(data.data.columns);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const runQuery = async () => {
    setQueryRunning(true);
    setQueryError(null);
    setQueryResult(null);
    
    try {
      const res = await fetch('/api/admin/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      const data = await res.json();
      
      if (data.success) {
        setQueryResult({
          columns: data.data.columns,
          rows: data.data.rows,
          executionTime: data.data.executionTime,
          rowCount: data.data.rows.length
        });
      } else {
        setQueryError(data.error || 'خطأ في تنفيذ الاستعلام');
      }
    } catch (error: any) {
      setQueryError(error.message);
    } finally {
      setQueryRunning(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!queryResult) return;
    
    let content: string;
    let filename: string;
    
    if (format === 'json') {
      content = JSON.stringify(queryResult.rows, null, 2);
      filename = 'query-result.json';
    } else {
      const headers = queryResult.columns.join(',');
      const rows = queryResult.rows.map(row => 
        queryResult.columns.map(col => JSON.stringify(row[col] ?? '')).join(',')
      );
      content = [headers, ...rows].join('\n');
      filename = 'query-result.csv';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدير قاعدة البيانات</h1>
          <p className="text-muted-foreground">إدارة واستعلام قاعدة البيانات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchTables}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <TableIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tables.length}</p>
                <p className="text-sm text-muted-foreground">جدول</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <Database className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">SQLite</p>
                <p className="text-sm text-muted-foreground">نوع قاعدة البيانات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tables.reduce((sum, t) => sum + (t.rowCount || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">إجمالي الصفوف</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <FileJson className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">prisma</p>
                <p className="text-sm text-muted-foreground">ORM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables" className="gap-2">
            <TableIcon className="h-4 w-4" />
            الجداول
          </TabsTrigger>
          <TabsTrigger value="query" className="gap-2">
            <Code className="h-4 w-4" />
            محرر SQL
          </TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Tables List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">الجداول</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {loading ? (
                      <div className="p-4 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      </div>
                    ) : (
                      tables.map((table) => (
                        <Button
                          key={table.name}
                          variant={selectedTable === table.name ? 'secondary' : 'ghost'}
                          className="w-full justify-between rounded-none h-auto py-3 px-4"
                          onClick={() => fetchTableData(table.name)}
                        >
                          <span className="font-mono text-sm">{table.name}</span>
                          <Badge variant="outline">{table.rowCount}</Badge>
                        </Button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Table Data */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedTable || 'اختر جدولاً'}
                </CardTitle>
                <CardDescription>
                  {tableData.length} صف
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  <ScrollArea className="h-[450px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableColumns.map((col) => (
                            <TableHead key={col} className="font-mono text-xs">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, i) => (
                          <TableRow key={i}>
                            {tableColumns.map((col) => (
                              <TableCell key={col} className="text-sm max-w-[200px] truncate">
                                {row[col]?.toString() || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto opacity-50 mb-4" />
                    <p>اختر جدولاً من القائمة لعرض البيانات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SQL Query Tab */}
        <TabsContent value="query">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Saved Queries */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">استعلامات محفوظة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedQueries.map((q, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start text-right h-auto py-2"
                    onClick={() => setSqlQuery(q.query)}
                  >
                    <span>{q.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Query Editor & Results */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  محرر SQL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Query Input */}
                <div className="space-y-2">
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM QuranSurah LIMIT 10;"
                    className="font-mono text-sm min-h-[150px]"
                    dir="ltr"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={runQuery} disabled={queryRunning}>
                      {queryRunning ? (
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 ml-2" />
                      )}
                      تنفيذ
                    </Button>
                    {queryResult && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                          <Download className="h-4 w-4 ml-2" />
                          JSON
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                          <Download className="h-4 w-4 ml-2" />
                          CSV
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Error */}
                {queryError && (
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{queryError}</span>
                  </div>
                )}

                {/* Results */}
                {queryResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="gap-1">
                        <Check className="h-3 w-3" />
                        تم التنفيذ بنجاح
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {queryResult.executionTime.toFixed(2)}ms
                        </span>
                        <span>{queryResult.rowCount} صف</span>
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {queryResult.columns.map((col) => (
                              <TableHead key={col} className="font-mono text-xs">
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.rows.map((row, i) => (
                            <TableRow key={i}>
                              {queryResult.columns.map((col) => (
                                <TableCell key={col} className="text-sm max-w-[200px] truncate">
                                  {row[col]?.toString() || '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
