/**
 * ORM Core - API Decorators
 * =========================
 * Odoo-like decorators for model methods
 */

// Method decorators storage
const methodDecorators = new Map<string, Map<string, DecoratorInfo>>();

interface DecoratorInfo {
  type: 'model' | 'depends' | 'onchange' | 'constrains' | 'returns' | 'ondelete';
  params?: unknown[];
}

/**
 * @api.model - Method operates on model level (no record context)
 * Example: @api.model
 * def create(self, values): ...
 */
export function model(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const modelName = (target as { constructor: { name: string } }).constructor.name;
  addDecorator(modelName, propertyKey, { type: 'model' });
  return descriptor;
}

/**
 * @api.depends - Declare field dependencies for computed fields
 * Example: @api.depends('field1', 'field2.subfield')
 */
export function depends(...fields: string[]) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const modelName = (target as { constructor: { name: string } }).constructor.name;
    addDecorator(modelName, propertyKey, { type: 'depends', params: fields });
    return descriptor;
  };
}

/**
 * @api.onchange - Trigger method when specified fields change
 * Example: @api.onchange('partner_id')
 */
export function onchange(...fields: string[]) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const modelName = (target as { constructor: { name: string } }).constructor.name;
    addDecorator(modelName, propertyKey, { type: 'onchange', params: fields });
    return descriptor;
  };
}

/**
 * @api.constrains - Add constraint validation
 * Example: @api.constrains('quantity', 'price')
 */
export function constrains(...fields: string[]) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const modelName = (target as { constructor: { name: string } }).constructor.name;
    addDecorator(modelName, propertyKey, { type: 'constrains', params: fields });
    return descriptor;
  };
}

/**
 * @api.returns - Specify return type for relational methods
 */
export function returns(model: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const modelName = (target as { constructor: { name: string } }).constructor.name;
    addDecorator(modelName, propertyKey, { type: 'returns', params: [model] });
    return descriptor;
  };
}

/**
 * @api.ondelete - Hook for delete operations
 */
export function ondelete(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const modelName = (target as { constructor: { name: string } }).constructor.name;
  addDecorator(modelName, propertyKey, { type: 'ondelete' });
  return descriptor;
}

// Helper to add decorator
function addDecorator(modelName: string, methodName: string, info: DecoratorInfo) {
  if (!methodDecorators.has(modelName)) {
    methodDecorators.set(modelName, new Map());
  }
  methodDecorators.get(modelName)!.set(methodName, info);
}

// Get decorators for a method
export function getDecorators(modelName: string, methodName: string): DecoratorInfo | undefined {
  return methodDecorators.get(modelName)?.get(methodName);
}

// Get all methods with a specific decorator type
export function getMethodsWithDecorator(modelName: string, type: string): string[] {
  const methods: string[] = [];
  const modelDecorators = methodDecorators.get(modelName);
  if (modelDecorators) {
    modelDecorators.forEach((info, method) => {
      if (info.type === type) {
        methods.push(method);
      }
    });
  }
  return methods;
}

// Export API namespace (like Odoo)
export const api = {
  model,
  depends,
  onchange,
  constrains,
  returns,
  ondelete,
};
