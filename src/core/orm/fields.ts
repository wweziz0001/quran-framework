/**
 * ORM Core - Field Types
 * ======================
 * Odoo-like field types for models
 */

// Base Field Options
export interface BaseFieldOptions {
  string?: string;           // Label
  help?: string;             // Help text
  required?: boolean;        // Required field
  readonly?: boolean;        // Read-only
  default?: unknown;         // Default value
  index?: boolean;           // Create index
  store?: boolean;           // Store in database (for computed)
  translate?: boolean;       // Translatable field
  copy?: boolean;            // Copy on duplicate
  groups?: string[];         // Access groups
}

// Simple Fields
export interface StringFieldOptions extends BaseFieldOptions {
  size?: number;
  trim?: boolean;
}

export interface IntegerFieldOptions extends BaseFieldOptions {
  min?: number;
  max?: number;
}

export interface FloatFieldOptions extends BaseFieldOptions {
  digits?: [number, number]; // [precision, scale]
}

export type BooleanFieldOptions = BaseFieldOptions;

export type DateFieldOptions = BaseFieldOptions;

export type DateTimeFieldOptions = BaseFieldOptions;

export interface SelectionFieldOptions extends BaseFieldOptions {
  selection: [string, string][] | (() => [string, string][]);
}

export type TextFieldOptions = BaseFieldOptions;

export interface HtmlFieldOptions extends BaseFieldOptions {
  sanitize?: boolean;
}

export type JsonFieldOptions = BaseFieldOptions;

// Relational Fields
export interface Many2OneFieldOptions extends BaseFieldOptions {
  model: string;
  ondelete?: 'cascade' | 'set null' | 'restrict' | 'no action';
  domain?: unknown[][];
  context?: Record<string, unknown>;
}

export interface One2ManyFieldOptions extends BaseFieldOptions {
  model: string;
  field: string;           // Foreign key field in related model
  domain?: unknown[][];
  context?: Record<string, unknown>;
  copy?: boolean;
}

export interface Many2ManyFieldOptions extends BaseFieldOptions {
  model: string;
  relation?: string;        // Junction table name
  column1?: string;         // Column name for this model
  column2?: string;         // Column name for related model
  domain?: unknown[][];
}

// Computed Field
export interface ComputedFieldOptions extends BaseFieldOptions {
  compute: string;          // Method name
  depends?: string[];       // Dependencies
  store?: boolean;
  search?: string;          // Search method name
  inverse?: string;         // Inverse method name
}

// Related Field
export interface RelatedFieldOptions extends BaseFieldOptions {
  related: string;          // Field path (e.g., 'partner_id.name')
}

// Field Classes
export class Field<T = unknown> {
  type: string;
  options: BaseFieldOptions & T;
  
  constructor(type: string, options: T & BaseFieldOptions = {} as T & BaseFieldOptions) {
    this.type = type;
    this.options = options;
  }
  
  get string(): string {
    return this.options.string || '';
  }
  
  get required(): boolean {
    return this.options.required || false;
  }
  
  get readonly(): boolean {
    return this.options.readonly || false;
  }
  
  get default(): unknown {
    return this.options.default;
  }
}

// Field Type Definitions
export class CharField extends Field<StringFieldOptions> {
  constructor(options: StringFieldOptions = {}) {
    super('char', options);
  }
}

export class TextField extends Field<TextFieldOptions> {
  constructor(options: TextFieldOptions = {}) {
    super('text', options);
  }
}

export class HtmlField extends Field<HtmlFieldOptions> {
  constructor(options: HtmlFieldOptions = {}) {
    super('html', options);
  }
}

export class IntegerField extends Field<IntegerFieldOptions> {
  constructor(options: IntegerFieldOptions = {}) {
    super('integer', options);
  }
}

export class FloatField extends Field<FloatFieldOptions> {
  constructor(options: FloatFieldOptions = {}) {
    super('float', options);
  }
}

export class BooleanField extends Field<BooleanFieldOptions> {
  constructor(options: BooleanFieldOptions = {}) {
    super('boolean', { default: false, ...options });
  }
}

export class DateField extends Field<DateFieldOptions> {
  constructor(options: DateFieldOptions = {}) {
    super('date', options);
  }
}

export class DateTimeField extends Field<DateTimeFieldOptions> {
  constructor(options: DateTimeFieldOptions = {}) {
    super('datetime', options);
  }
}

export class SelectionField extends Field<SelectionFieldOptions> {
  constructor(options: SelectionFieldOptions) {
    super('selection', options);
  }
  
  getSelection(): [string, string][] {
    if (typeof this.options.selection === 'function') {
      return this.options.selection();
    }
    return this.options.selection;
  }
}

export class JsonField extends Field<JsonFieldOptions> {
  constructor(options: JsonFieldOptions = {}) {
    super('json', options);
  }
}

// Relational Fields
export class Many2OneField extends Field<Many2OneFieldOptions> {
  constructor(options: Many2OneFieldOptions) {
    super('many2one', options);
  }
  
  get model(): string {
    return this.options.model;
  }
}

export class One2ManyField extends Field<One2ManyFieldOptions> {
  constructor(options: One2ManyFieldOptions) {
    super('one2many', options);
  }
  
  get model(): string {
    return this.options.model;
  }
}

export class Many2ManyField extends Field<Many2ManyFieldOptions> {
  constructor(options: Many2ManyFieldOptions) {
    super('many2many', options);
  }
  
  get model(): string {
    return this.options.model;
  }
}

// Computed Field
export class ComputedField extends Field<ComputedFieldOptions> {
  constructor(options: ComputedFieldOptions) {
    super('computed', options);
  }
  
  get compute(): string {
    return this.options.compute;
  }
  
  get depends(): string[] {
    return this.options.depends || [];
  }
}

// Related Field
export class RelatedField extends Field<RelatedFieldOptions> {
  constructor(options: RelatedFieldOptions) {
    super('related', options);
  }
}

// ID Field
export class IdField extends Field {
  constructor() {
    super('id', { string: 'ID', readonly: true });
  }
}

// Export all field types
export const fields = {
  Char: CharField,
  Text: TextField,
  Html: HtmlField,
  Integer: IntegerField,
  Float: FloatField,
  Boolean: BooleanField,
  Date: DateField,
  DateTime: DateTimeField,
  Selection: SelectionField,
  Json: JsonField,
  Many2One: Many2OneField,
  One2Many: One2ManyField,
  Many2Many: Many2ManyField,
  Computed: ComputedField,
  Related: RelatedField,
  Id: IdField,
};

export type FieldType = 
  | CharField 
  | TextField 
  | HtmlField 
  | IntegerField 
  | FloatField 
  | BooleanField 
  | DateField 
  | DateTimeField 
  | SelectionField 
  | JsonField 
  | Many2OneField 
  | One2ManyField 
  | Many2ManyField 
  | ComputedField 
  | RelatedField 
  | IdField;
