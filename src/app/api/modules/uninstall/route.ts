/**
 * Module Uninstall API
 * =====================
 * Uninstall a module (checking for dependents)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/modules/uninstall
 * Uninstall a module by name
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

    // Cannot uninstall base or required modules
    const protectedModules = ['base', 'users', 'settings'];
    if (protectedModules.includes(name)) {
      return NextResponse.json(
        { success: false, error: `Cannot uninstall protected module "${name}"` },
        { status: 400 }
      );
    }

    // Check if module is installed
    const existing = await prisma.installedModule.findUnique({
      where: { name }
    });

    if (!existing || !existing.installed) {
      return NextResponse.json(
        { success: false, error: `Module "${name}" is not installed` },
        { status: 400 }
      );
    }

    // Check for dependent modules
    const allInstalled = await prisma.installedModule.findMany({
      where: { installed: true }
    });

    const dependents: string[] = [];
    for (const mod of allInstalled) {
      if (mod.depends) {
        const deps = JSON.parse(mod.depends);
        if (deps.includes(name)) {
          dependents.push(mod.name);
        }
      }
    }

    if (dependents.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot uninstall "${name}". The following modules depend on it: ${dependents.join(', ')}. Uninstall them first.` 
        },
        { status: 400 }
      );
    }

    // Uninstall the module
    await prisma.installedModule.update({
      where: { name },
      data: { 
        installed: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        name,
        message: `Successfully uninstalled "${name}"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
