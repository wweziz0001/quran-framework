/**
 * Server-side Module Check
 * =========================
 * Server component to check module installation
 */

import { db } from '@/lib/db';

export interface ModuleStatus {
  name: string;
  installed: boolean;
  version?: string | null;
}

/**
 * Check if a module is installed (server-side)
 */
export async function checkModuleInstalled(moduleName: string): Promise<ModuleStatus> {
  try {
    const module = await db.installedModule.findUnique({
      where: { name: moduleName }
    });

    return {
      name: moduleName,
      installed: module?.installed ?? false,
      version: module?.version
    };
  } catch (error) {
    console.error('Failed to check module:', error);
    return {
      name: moduleName,
      installed: false
    };
  }
}

/**
 * Get all installed modules (server-side)
 */
export async function getInstalledModules(): Promise<string[]> {
  try {
    const modules = await db.installedModule.findMany({
      where: { installed: true },
      select: { name: true }
    });

    return modules.map(m => m.name);
  } catch (error) {
    console.error('Failed to get installed modules:', error);
    return [];
  }
}

/**
 * Initialize auto-install modules on first run
 */
export async function initializeModules(): Promise<void> {
  try {
    const autoInstallModules = [
      { name: 'base', version: '17.0.1.0.0', author: 'Quran Framework Team', category: 'Core' },
      { name: 'users', version: '17.0.1.0.0', author: 'Quran Framework Team', category: 'Administration' },
      { name: 'settings', version: '17.0.1.0.0', author: 'Quran Framework Team', category: 'Administration' }
    ];

    for (const mod of autoInstallModules) {
      const existing = await db.installedModule.findUnique({
        where: { name: mod.name }
      });

      if (!existing) {
        await db.installedModule.create({
          data: {
            name: mod.name,
            version: mod.version,
            author: mod.author,
            category: mod.category,
            autoInstall: true,
            application: false,
            installed: true
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to initialize modules:', error);
  }
}
