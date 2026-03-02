/**
 * Module Install API
 * ===================
 * Install a module and its dependencies
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
 * Install a module and all its dependencies
 */
async function installModuleWithDeps(
  moduleName: string,
  installed: Set<string> = new Set()
): Promise<{ installed: string[]; errors: string[] }> {
  const result = { installed: [] as string[], errors: [] as string[] };

  if (installed.has(moduleName)) {
    return result;
  }

  const moduleInfo = moduleRegistry[moduleName];
  if (!moduleInfo) {
    result.errors.push(`Module "${moduleName}" not found in registry`);
    return result;
  }

  // Check if already installed in database
  const existing = await db.installedModule.findUnique({
    where: { name: moduleName }
  });

  if (existing?.installed) {
    installed.add(moduleName);
    return result;
  }

  // Install dependencies first
  for (const dep of moduleInfo.depends) {
    const depResult = await installModuleWithDeps(dep, installed);
    result.installed.push(...depResult.installed);
    result.errors.push(...depResult.errors);
  }

  if (result.errors.length > 0) {
    return result;
  }

  // Install this module
  try {
    await db.installedModule.upsert({
      where: { name: moduleName },
      create: {
        name: moduleName,
        version: moduleInfo.version,
        author: moduleInfo.author,
        category: moduleInfo.category,
        autoInstall: moduleInfo.autoInstall,
        application: moduleInfo.application,
        depends: JSON.stringify(moduleInfo.depends),
        installed: true
      },
      update: {
        installed: true,
        version: moduleInfo.version
      }
    });

    result.installed.push(moduleName);
    installed.add(moduleName);
  } catch (error) {
    result.errors.push(`Failed to install "${moduleName}": ${(error as Error).message}`);
  }

  return result;
}

/**
 * POST /api/modules/install
 * Install a module by name
 * Body: { name: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Module name is required' },
        { status: 400 }
      );
    }

    const result = await installModuleWithDeps(name);

    if (result.errors.length > 0) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        installed: result.installed,
        message: `Successfully installed: ${result.installed.join(', ')}`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
