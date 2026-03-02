'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, Download, ArrowRight, Loader2
} from 'lucide-react';
import { DashboardSection } from '@/components/admin/dashboard-section';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Module installation state
  const [moduleStatus, setModuleStatus] = useState<{
    checked: boolean;
    installed: boolean;
    installing: boolean;
    error: string | null;
  }>({
    checked: false,
    installed: false,
    installing: false,
    error: null
  });

  // Check module installation on mount (Odoo-style)
  useEffect(() => {
    let isMounted = true;
    
    async function checkInstallation() {
      try {
        const response = await fetch('/api/modules/check/web_admin');
        const data = await response.json();
        
        if (isMounted) {
          setModuleStatus({
            checked: true,
            installed: data.success && data.data?.installed,
            installing: false,
            error: null
          });
        }
      } catch {
        if (isMounted) {
          setModuleStatus({
            checked: true,
            installed: false,
            installing: false,
            error: 'فشل في التحقق من حالة الوحدة'
          });
        }
      }
    }
    
    checkInstallation();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInstall = async () => {
    setModuleStatus(prev => ({ ...prev, installing: true, error: null }));
    
    try {
      const response = await fetch('/api/modules/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'web_admin' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.refresh();
        window.location.reload();
      } else {
        setModuleStatus(prev => ({
          ...prev,
          installing: false,
          error: data.error || 'فشل في التثبيت'
        }));
      }
    } catch {
      setModuleStatus(prev => ({
        ...prev,
        installing: false,
        error: 'فشل في التثبيت'
      }));
    }
  };

  // Loading state
  if (!moduleStatus.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Module not installed
  if (!moduleStatus.installed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">
              لوحة التحكم غير مثبتة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                وحدة <strong>لوحة التحكم</strong> غير مثبتة في النظام.
                <br />
                يرجى تثبيتها من متجر التطبيقات أو تثبيتها الآن.
              </AlertDescription>
            </Alert>

            {moduleStatus.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{moduleStatus.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleInstall} 
                disabled={moduleStatus.installing}
                className="w-full"
              >
                {moduleStatus.installing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري التثبيت...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    تثبيت الآن
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة لمتجر التطبيقات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DashboardSection />;
}
