/**
 * ORM Core - Base Model
 * =====================
 * Core model class with Odoo-like functionality
 */

import { PrismaClient } from '@prisma/client';
import { Field, fields, FieldType } from './fields';
import { api, getDecorators, getMethodsWithDecorator } from './decorators';

const db = new PrismaClient();

// Model metadata
interface ModelMeta {
  _name: string;
  _description: string;
  _inherit?: string | string[];
  _order?: string;
  _rec_name?: string;
  _fields: Record<string, FieldType>;
  _constraints: Array<{ name: string; fields: string[]; method: string }>;
  _sql_constraints: Array<{ name: string; definition: string }>;
}

// Record type
export type RecordData = Record<string, unknown>;

// Active Record pattern
export class BaseModel {
  // Static model metadata
  static _name: string = '';
  static _description: string = '';
  static _inherit?: string | string[];
  static _order: string = 'id';
  static _rec_name: string = 'name';
  static _fields: Record<string, FieldType> = {};
  
  // Instance data
  protected _data: RecordData = {};
  protected _changed: Set<string> = new Set();
  protected _env: Environment;
  protected _id: number | string = 0;
  
  // Prisma model name (derived from _name)
  private static _prismaModel: string = '';
  
  constructor(data: RecordData = {}, env?: Environment) {
    this._data = data;
    this._env = env || new Environment();
    this._id = (data.id as number | string) || 0;
  }
  
  // =====================
  // Active Record Methods
  // =====================
  
  get id(): number | string {
    return this._id;
  }
  
  get env(): Environment {
    return this._env;
  }
  
  // Generic getter
  get(field: string): unknown {
    return this._data[field];
  }
  
  // Generic setter
  set(field: string, value: unknown): void {
    this._data[field] = value;
    this._changed.add(field);
  }
  
  // =====================
  // CRUD Operations
  // =====================
  
  /**
   * Create a new record
   * @param values - Field values
   * @returns Created record
   */
  static async create(values: RecordData): Promise<BaseModel> {
    // Apply defaults
    const fullValues = this._applyDefaults(values);
    
    // Validate constraints
    await this._validateConstraints(fullValues);
    
    // Execute before_create hooks
    await this._executeHooks('before_create', fullValues);
    
    // Create in database
    const prismaModel = this._getPrismaModel();
    const record = await (db as Record<string, { create: (args: unknown) => Promise<RecordData> }>)[prismaModel].create({
      data: fullValues
    });
    
    const instance = new this(record);
    
    // Execute after_create hooks
    await this._executeHooks('after_create', instance);
    
    return instance;
  }
  
  /**
   * Browse records by IDs
   * @param ids - Record IDs
   * @returns Recordset
   */
  static async browse(ids: number | number[]): Promise<BaseModel[]> {
    const idArray = Array.isArray(ids) ? ids : [ids];
    
    const prismaModel = this._getPrismaModel();
    const records = await (db as Record<string, { findMany: (args: unknown) => Promise<RecordData[]> }>)[prismaModel].findMany({
      where: { id: { in: idArray } }
    });
    
    return records.map(r => new this(r));
  }
  
  /**
   * Search records by domain
   * @param domain - Search domain
   * @param options - Search options
   * @returns Recordset
   */
  static async search(
    domain: Domain = [],
    options: SearchOptions = {}
  ): Promise<BaseModel[]> {
    const prismaModel = this._getPrismaModel();
    
    const where = DomainParser.parse(domain);
    
    const records = await (db as Record<string, { findMany: (args: unknown) => Promise<RecordData[]> }>)[prismaModel].findMany({
      where,
      orderBy: options.order || this._order,
      skip: options.offset,
      take: options.limit,
      include: options.include,
    });
    
    return records.map(r => new this(r));
  }
  
  /**
   * Search and return count
   */
  static async searchCount(domain: Domain = []): Promise<number> {
    const prismaModel = this._getPrismaModel();
    
    const where = DomainParser.parse(domain);
    
    return await (db as Record<string, { count: (args: unknown) => Promise<number> }>)[prismaModel].count({ where });
  }
  
  /**
   * Get a single record
   */
  static async findOne(domain: Domain = []): Promise<BaseModel | null> {
    const results = await this.search(domain, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }
  
  /**
   * Write (update) records
   */
  async write(values: RecordData): Promise<boolean> {
    const Model = this.constructor as typeof BaseModel;
    
    // Execute before_write hooks
    await Model._executeHooks('before_write', this, values);
    
    const prismaModel = Model._getPrismaModel();
    await (db as Record<string, { update: (args: unknown) => Promise<RecordData> }>)[prismaModel].update({
      where: { id: this._id },
      data: values
    });
    
    // Update instance data
    Object.assign(this._data, values);
    this._changed.clear();
    
    // Execute after_write hooks
    await Model._executeHooks('after_write', this);
    
    return true;
  }
  
  /**
   * Unlink (delete) records
   */
  async unlink(): Promise<boolean> {
    const Model = this.constructor as typeof BaseModel;
    
    // Execute before_unlink hooks
    await Model._executeHooks('before_unlink', this);
    
    const prismaModel = Model._getPrismaModel();
    await (db as Record<string, { delete: (args: unknown) => Promise<RecordData> }>)[prismaModel].delete({
      where: { id: this._id }
    });
    
    // Execute after_unlink hooks
    await Model._executeHooks('after_unlink', this);
    
    return true;
  }
  
  /**
   * Copy (duplicate) record
   */
  async copy(defaults: RecordData = {}): Promise<BaseModel> {
    const Model = this.constructor as typeof BaseModel;
    
    const values = { ...this._data };
    delete values.id;
    delete values.createDate;
    delete values.writeDate;
    
    // Apply copy rules
    for (const [fieldName, field] of Object.entries(Model._fields)) {
      if (field.options.copy === false) {
        delete values[fieldName];
      }
    }
    
    Object.assign(values, defaults);
    
    return await Model.create(values);
  }
  
  // =====================
  // Computed Fields
  // =====================
  
  /**
   * Compute a computed field
   */
  async compute(fieldName: string): Promise<unknown> {
    const Model = this.constructor as typeof BaseModel;
    const field = Model._fields[fieldName];
    
    if (!field || field.type !== 'computed') {
      return this._data[fieldName];
    }
    
    const methodName = (field.options as { compute: string }).compute;
    const method = (this as Record<string, unknown>)[methodName];
    
    if (typeof method === 'function') {
      const value = await (method as () => Promise<unknown>).call(this);
      this._data[fieldName] = value;
      
      // Store if configured
      if (field.options.store) {
        await this.write({ [fieldName]: value });
      }
      
      return value;
    }
    
    return this._data[fieldName];
  }
  
  // =====================
  // Static Helpers
  // =====================
  
  /**
   * Get Prisma model name from Odoo model name
   */
  static _getPrismaModel(): string {
    if (!this._prismaModel) {
      // Convert 'quran.surah' to 'quranSurah' (camelCase)
      this._prismaModel = this._name.split('.')
        .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    }
    return this._prismaModel;
  }
  
  /**
   * Apply default values
   */
  static _applyDefaults(values: RecordData): RecordData {
    const result = { ...values };
    
    for (const [fieldName, field] of Object.entries(this._fields)) {
      if (result[fieldName] === undefined && field.options.default !== undefined) {
        result[fieldName] = typeof field.options.default === 'function'
          ? field.options.default()
          : field.options.default;
      }
    }
    
    return result;
  }
  
  /**
   * Validate constraints
   */
  static async _validateConstraints(values: RecordData): Promise<void> {
    // Check required fields
    for (const [fieldName, field] of Object.entries(this._fields)) {
      if (field.options.required && values[fieldName] === undefined) {
        throw new ValidationError(`Field "${field.options.string || fieldName}" is required`);
      }
    }
    
    // Check custom constraints
    const constraintMethods = getMethodsWithDecorator(this.name, 'constrains');
    for (const methodName of constraintMethods) {
      const instance = new this(values);
      await (instance as Record<string, () => Promise<void>>)[methodName]?.();
    }
  }
  
  /**
   * Execute lifecycle hooks
   */
  static async _executeHooks(hookType: string, ...args: unknown[]): Promise<void> {
    const hookMethods = getMethodsWithDecorator(this.name, hookType);
    for (const methodName of hookMethods) {
      const instance = args[0] instanceof BaseModel ? args[0] : new this(args[0] as RecordData);
      await (instance as Record<string, (...a: unknown[]) => Promise<void>>)[methodName]?.(...args);
    }
  }
  
  // =====================
  // Display Methods
  // =====================
  
  /**
   * Display name for the record
   */
  get displayName(): string {
    const recName = (this.constructor as typeof BaseModel)._rec_name;
    return String(this._data[recName] || this._id);
  }
  
  toString(): string {
    return `${(this.constructor as typeof BaseModel)._name}(${this._id})`;
  }
  
  toJSON(): RecordData {
    return { ...this._data };
  }
}

// =====================
// Supporting Types
// =====================

// Domain type (Odoo-style)
export type Domain = DomainItem[];
type DomainItem = 
  | [string, string, unknown]  // Simple condition
  | string                      // Operator ('&', '|', '!')
  | DomainItem[];               // Nested domain

// Search options
interface SearchOptions {
  order?: string | Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
  include?: Record<string, boolean>;
}

// Environment (user context)
class Environment {
  user: UserContext;
  context: Record<string, unknown>;
  
  constructor(user?: UserContext, context: Record<string, unknown> = {}) {
    this.user = user || { id: 1, name: 'System', groups: ['admin'] };
    this.context = context;
  }
}

interface UserContext {
  id: number;
  name: string;
  groups: string[];
  lang?: string;
  tz?: string;
}

// Validation Error
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Domain Parser (converts Odoo domain to Prisma where)
class DomainParser {
  static parse(domain: Domain): Record<string, unknown> {
    if (domain.length === 0) return {};
    
    const result: Record<string, unknown> = {};
    const stack: unknown[] = [];
    
    for (const item of domain) {
      if (Array.isArray(item) && item.length === 3) {
        const [field, operator, value] = item;
        stack.push(this.parseCondition(field, operator, value));
      } else if (typeof item === 'string') {
        // Logical operator
        if (item === '&') {
          // AND - next two conditions
        } else if (item === '|') {
          // OR - next two conditions
        } else if (item === '!') {
          // NOT - next condition
        }
      }
    }
    
    // Simple implementation - combine all conditions with AND
    for (const item of domain) {
      if (Array.isArray(item) && item.length === 3) {
        const [field, operator, value] = item;
        Object.assign(result, this.parseCondition(field, operator, value));
      }
    }
    
    return result;
  }
  
  static parseCondition(field: string, operator: string, value: unknown): Record<string, unknown> {
    switch (operator) {
      case '=':
        return { [field]: value };
      case '!=':
        return { [field]: { not: value } };
      case '>':
        return { [field]: { gt: value } };
      case '>=':
        return { [field]: { gte: value } };
      case '<':
        return { [field]: { lt: value } };
      case '<=':
        return { [field]: { lte: value } };
      case 'in':
        return { [field]: { in: value as unknown[] } };
      case 'not in':
        return { [field]: { notIn: value as unknown[] } };
      case 'like':
        return { [field]: { contains: value as string } };
      case 'ilike':
        return { [field]: { contains: value as string, mode: 'insensitive' } };
      case '=like':
        return { [field]: { equals: value } };
      case '=ilike':
        return { [field]: { equals: value, mode: 'insensitive' } };
      case 'is':
        return value === null ? { [field]: null } : { [field]: { not: null } };
      default:
        return { [field]: value };
    }
  }
}

export { db, ValidationError, Environment };
