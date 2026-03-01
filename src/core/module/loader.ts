/**
 * Module System Core
 * ===================
 * Odoo-like module system with manifest and lifecycle
 */

import fs from 'fs';
import path from 'path';

// Module manifest
export interface ModuleManifest {
  name: string;
  version: string;
  summary?: string;
  description?: string;
  author?: string;
  website?: string;
  license?: string;
  category?: string;
  depends?: string[];
  data?: string[];
  demo?: string[];
  assets?: Record<string, string[]>;
  installable?: boolean;
  application?: boolean;
  autoInstall?: boolean;
  active?: boolean;
}

// Module info
export interface ModuleInfo extends ModuleManifest {
  path: string;
  installed?: boolean;
  installDate?: Date;
  latestVersion?: string;
}

// Module loader
export class ModuleLoader {
  private static instance: ModuleLoader;
  private modules: Map<string, ModuleInfo> = new Map();
  private loadedModels: Map<string, typeof import('./orm/base').BaseModel> = new Map();
  private loadOrder: string[] = [];
  
  private constructor() {}
  
  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }
  
  // Register module
  registerModule(modulePath: string): void {
    const manifestPath = path.join(modulePath, '__manifest__.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found at ${manifestPath}`);
    }
    
    const manifest: ModuleManifest = JSON.parse(
      fs.readFileSync(manifestPath, 'utf-8')
    );
    
    const moduleInfo: ModuleInfo = {
      ...manifest,
      path: modulePath,
      installed: false
    };
    
    this.modules.set(manifest.name, moduleInfo);
  }
  
  // Load module
  async loadModule(moduleName: string): Promise<void> {
    const moduleInfo = this.modules.get(moduleName);
    
    if (!moduleInfo) {
      throw new Error(`Module ${moduleName} not found`);
    }
    
    // Load dependencies first
    if (moduleInfo.depends) {
      for (const dep of moduleInfo.depends) {
        if (!this.loadOrder.includes(dep)) {
          await this.loadModule(dep);
        }
      }
    }
    
    // Load models
    const modelsPath = path.join(moduleInfo.path, 'models');
    if (fs.existsSync(modelsPath)) {
      await this.loadModels(modelsPath);
    }
    
    // Load data
    if (moduleInfo.data) {
      await this.loadData(moduleInfo.path, moduleInfo.data);
    }
    
    // Mark as loaded
    this.loadOrder.push(moduleName);
    moduleInfo.installed = true;
    moduleInfo.installDate = new Date();
    
    console.log(`Module loaded: ${moduleName} v${moduleInfo.version}`);
  }
  
  // Load all modules
  async loadAllModules(): Promise<void> {
    // Resolve dependencies and load in order
    const sortedModules = this.resolveDependencies();
    
    for (const moduleName of sortedModules) {
      await this.loadModule(moduleName);
    }
  }
  
  // Resolve dependencies
  private resolveDependencies(): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    
    const visit = (name: string) => {
      if (visited.has(name)) return;
      visited.add(name);
      
      const moduleInfo = this.modules.get(name);
      if (moduleInfo?.depends) {
        for (const dep of moduleInfo.depends) {
          visit(dep);
        }
      }
      
      result.push(name);
    };
    
    for (const name of this.modules.keys()) {
      visit(name);
    }
    
    return result;
  }
  
  // Load models from directory
  private async loadModels(modelsPath: string): Promise<void> {
    const files = fs.readdirSync(modelsPath)
      .filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    
    for (const file of files) {
      const modelPath = path.join(modelsPath, file);
      
      try {
        const modelModule = await import(modelPath);
        
        for (const exportName of Object.keys(modelModule)) {
          const exported = modelModule[exportName];
          
          if (exported && exported._name && exported.prototype) {
            this.loadedModels.set(exported._name, exported);
          }
        }
      } catch (error) {
        console.error(`Error loading model from ${modelPath}:`, error);
      }
    }
  }
  
  // Load data files
  private async loadData(modulePath: string, dataFiles: string[]): Promise<void> {
    for (const dataFile of dataFiles) {
      const filePath = path.join(modulePath, dataFile);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`Data file not found: ${filePath}`);
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const data = filePath.endsWith('.json')
          ? JSON.parse(content)
          : content;
        
        // Process data based on file type
        console.log(`Loading data from ${dataFile}`);
      } catch (error) {
        console.error(`Error loading data from ${filePath}:`, error);
      }
    }
  }
  
  // Get module
  getModule(name: string): ModuleInfo | undefined {
    return this.modules.get(name);
  }
  
  // Get all modules
  getAllModules(): ModuleInfo[] {
    return Array.from(this.modules.values());
  }
  
  // Get loaded models
  getLoadedModels(): Map<string, typeof import('./orm/base').BaseModel> {
    return this.loadedModels;
  }
  
  // Get model by name
  getModel(name: string): typeof import('./orm/base').BaseModel | undefined {
    return this.loadedModels.get(name);
  }
}

// Export singleton
export const moduleLoader = ModuleLoader.getInstance();
