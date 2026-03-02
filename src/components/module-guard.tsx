/**
 * Module Guard Component
 * =======================
 * Odoo-style module installation check
 * Redirects to Apps Store if module is not installed
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface ModuleGuardProps {
  moduleName: string;
  children: React.ReactNode;
  moduleTitle?: string;
}

interface ModuleStatus {
  name: string;
  installed: boolean;
  version?: string | null;
  installedAt?: Date | null;
}

export function ModuleGuard({ 
  moduleName, 
  children, 
  moduleTitle 
}: ModuleGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ModuleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkModule();
  }, [moduleName]);

  const checkModule = async () => {
    try {
      const response = await fetch(`/api/modules/check/${moduleName}`);
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to check module status');
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    setInstalling(true);
    setError(null);
    
    try {
      const response = await fetch('/api/modules/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: moduleName })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the page after installation
        router.refresh();
        window.location.reload();
      } else {
        setError(data.error || 'Installation failed');
      }
    } catch (err) {
      setError('Failed to install module');
    } finally {
      setInstalling(false);
    }
  };

  // Loading state
  if (loading) {
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
  if (!status?.installed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-xl">
              الوحدة غير مثبتة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{moduleTitle || moduleName}</strong> غير مثبت في النظام.
                <br />
                يرجى تثبيته من متجر التطبيقات أو تثبيته الآن.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleInstall} 
                disabled={installing}
                className="w-full"
              >
                {installing ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-bounce" />
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

  // Module is installed, render children
  return <>{children}</>;
}

export default ModuleGuard;
