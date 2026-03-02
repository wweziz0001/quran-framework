/**
 * Module Check API
 * =================
 * Check if a specific module is installed
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Module registry
const moduleRegistry: Record<string, {
  version: string;
  author: string;
  category: string;
  autoInstall: boolean;
  application: boolean;
  depends: string[];
}> = {
  base: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Core',
    autoInstall: true,
    application: false,
    depends: []
  },
  quran: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  web_admin: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: false,
    application: true,
    depends: ['base', 'users']
  },
  quran_audio: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  quran_tafsir: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  memorization: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Learning',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  quran_analytics: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Analytics',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  prayer_times: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Islamic',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  users: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: true,
    application: false,
    depends: ['base']
  },
  settings: {
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: true,
    application: false,
    depends: ['base']
  }
};

/**
 * GET /api/modules/check/[name]
 * Check if a module is installed
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name: moduleName } = await params;

    const installed = await db.installedModule.findUnique({
      where: { name: moduleName }
    });

    return NextResponse.json({
      success: true,
      data: {
        name: moduleName,
        installed: installed?.installed ?? false,
        version: installed?.version || moduleRegistry[moduleName]?.version || null,
        installedAt: installed?.installedAt || null
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
