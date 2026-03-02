/**
 * Modules API - Installation Management
 * ======================================
 * Odoo-style module installation system
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Module registry (matches apps-registry)
const moduleRegistry = [
  {
    name: 'base',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Core',
    autoInstall: true,
    application: false,
    depends: []
  },
  {
    name: 'quran',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  {
    name: 'quran_audio',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  {
    name: 'quran_tafsir',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Quran',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  {
    name: 'memorization',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Learning',
    autoInstall: false,
    application: true,
    depends: ['base', 'quran']
  },
  {
    name: 'quran_analytics',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Analytics',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  {
    name: 'prayer_times',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Islamic',
    autoInstall: false,
    application: true,
    depends: ['base']
  },
  {
    name: 'users',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: true,
    application: false,
    depends: ['base']
  },
  {
    name: 'settings',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: true,
    application: false,
    depends: ['base']
  },
  {
    name: 'web_admin',
    version: '17.0.1.0.0',
    author: 'Quran Framework Team',
    category: 'Administration',
    autoInstall: false,
    application: true,
    depends: ['base', 'users']
  }
];

/**
 * GET /api/modules
 * List all modules with installation status
 */
export async function GET(request: NextRequest) {
  try {
    const installedModules = await db.installedModule.findMany({
      where: { installed: true }
    });

    const installedMap = new Map(
      installedModules.map(m => [m.name, m])
    );

    const modules = moduleRegistry.map(mod => ({
      ...mod,
      installed: installedMap.has(mod.name),
      installedAt: installedMap.get(mod.name)?.installedAt || null
    }));

    return NextResponse.json({
      success: true,
      data: modules
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
