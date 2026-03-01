/**
 * Registry Core
 * ==============
 * Central registry for models and addons (like Odoo's registry)
 */

import { BaseModel } from './orm/base';

// Model registry
class ModelRegistry {
  private models: Map<string, typeof BaseModel> = new Map();
  
  // Register model
  register(name: string, model: typeof BaseModel): void {
    if (this.models.has(name)) {
      console.warn(`Model ${name} already registered, overwriting`);
    }
    this.models.set(name, model);
  }
  
  // Get model
  get(name: string): typeof BaseModel | undefined {
    return this.models.get(name);
  }
  
  // Check if model exists
  has(name: string): boolean {
    return this.models.has(name);
  }
  
  // Get all model names
  getAllNames(): string[] {
    return Array.from(this.models.keys());
  }
  
  // Get all models
  getAll(): Map<string, typeof BaseModel> {
    return this.models;
  }
}

// Addon registry
class AddonRegistry {
  private addons: Map<string, unknown> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  
  // Register addon
  register(name: string, addon: unknown, depends: string[] = []): void {
    this.addons.set(name, addon);
    this.dependencies.set(name, depends);
  }
  
  // Get addon
  get(name: string): unknown {
    return this.addons.get(name);
  }
  
  // Get dependencies
  getDependencies(name: string): string[] {
    return this.dependencies.get(name) || [];
  }
  
  // Check if addon is loaded
  isLoaded(name: string): boolean {
    return this.addons.has(name);
  }
  
  // Resolve load order
  resolveLoadOrder(): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const visit = (name: string) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected: ${name}`);
      }
      
      visiting.add(name);
      
      const deps = this.dependencies.get(name) || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      visiting.delete(name);
      visited.add(name);
      result.push(name);
    };
    
    for (const name of this.addons.keys()) {
      visit(name);
    }
    
    return result;
  }
}

// Global registry
export class Registry {
  static models = new ModelRegistry();
  static addons = new AddonRegistry();
  
  // Model shortcuts
  static model(name: string): typeof BaseModel | undefined {
    return this.models.get(name);
  }
  
  static registerModel(name: string, model: typeof BaseModel): void {
    this.models.register(name, model);
  }
  
  // Addon shortcuts
  static addon(name: string): unknown {
    return this.addons.get(name);
  }
  
  static registerAddon(name: string, addon: unknown, depends: string[] = []): void {
    this.addons.register(name, addon, depends);
  }
}

// Export singleton
export const registry = Registry;

// Model decorator
export function model(name: string, options: {
  description?: string;
  inherit?: string;
  order?: string;
  recName?: string;
} = {}) {
  return function <T extends typeof BaseModel>(target: T) {
    target._name = name;
    if (options.description) target._description = options.description;
    if (options.inherit) target._inherit = options.inherit;
    if (options.order) target._order = options.order;
    if (options.recName) target._rec_name = options.recName;
    
    Registry.registerModel(name, target);
    return target;
  };
}

// Field decorator helper
export function field(definition: unknown) {
  return function (target: unknown, propertyKey: string) {
    const model = target as { constructor: typeof BaseModel };
    model.constructor._fields = model.constructor._fields || {};
    (model.constructor._fields as Record<string, unknown>)[propertyKey] = definition;
  };
}
