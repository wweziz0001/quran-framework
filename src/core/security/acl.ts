/**
 * Security Core - ACL (Access Control Lists)
 * ===========================================
 * Odoo-like access control system
 */

// Permission types
export type PermissionType = 'read' | 'write' | 'create' | 'unlink';

// Access Right
export interface AccessRight {
  model: string;
  group: string;
  permissions: {
    read: boolean;
    write: boolean;
    create: boolean;
    unlink: boolean;
  };
}

// ACL Entry
interface ACLEntry {
  id: string;
  name: string;
  modelId: string;
  groupId: string;
  permRead: boolean;
  permWrite: boolean;
  permCreate: boolean;
  permUnlink: boolean;
  active: boolean;
}

// Group definition
export interface GroupDefinition {
  id: string;
  name: string;
  category: string;
  impliedIds?: string[];
  comment?: string;
}

// ACL Manager
export class ACLManager {
  private static instance: ACLManager;
  private rules: Map<string, ACLEntry[]> = new Map();
  private groups: Map<string, GroupDefinition> = new Map();
  
  private constructor() {}
  
  static getInstance(): ACLManager {
    if (!ACLManager.instance) {
      ACLManager.instance = new ACLManager();
    }
    return ACLManager.instance;
  }
  
  // Register a group
  registerGroup(group: GroupDefinition): void {
    this.groups.set(group.id, group);
  }
  
  // Register ACL rule
  registerRule(rule: ACLEntry): void {
    if (!this.rules.has(rule.modelId)) {
      this.rules.set(rule.modelId, []);
    }
    this.rules.get(rule.modelId)!.push(rule);
  }
  
  // Check access
  checkAccess(
    model: string,
    operation: PermissionType,
    groups: string[]
  ): boolean {
    const modelRules = this.rules.get(model) || [];
    
    // Check each group
    for (const groupId of groups) {
      // Get implied groups
      const allGroups = this.getAllGroups(groupId);
      
      for (const rule of modelRules) {
        if (allGroups.includes(rule.groupId) && rule.active) {
          const permField = `perm${operation.charAt(0).toUpperCase() + operation.slice(1)}` as keyof ACLEntry;
          if (rule[permField]) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  // Get all groups including implied
  private getAllGroups(groupId: string): string[] {
    const result: string[] = [groupId];
    const group = this.groups.get(groupId);
    
    if (group?.impliedIds) {
      for (const impliedId of group.impliedIds) {
        result.push(...this.getAllGroups(impliedId));
      }
    }
    
    return result;
  }
  
  // Get allowed operations
  getAllowedOperations(model: string, groups: string[]): PermissionType[] {
    const operations: PermissionType[] = [];
    const perms: PermissionType[] = ['read', 'write', 'create', 'unlink'];
    
    for (const perm of perms) {
      if (this.checkAccess(model, perm, groups)) {
        operations.push(perm);
      }
    }
    
    return operations;
  }
}

// Record Rules (Row-level security)
export interface RecordRule {
  id: string;
  name: string;
  modelId: string;
  groupId?: string;
  domainForce: string;        // JSON domain
  permRead: boolean;
  permWrite: boolean;
  permCreate: boolean;
  permUnlink: boolean;
  active: boolean;
}

// Record Rules Manager
export class RecordRulesManager {
  private static instance: RecordRulesManager;
  private rules: Map<string, RecordRule[]> = new Map();
  
  private constructor() {}
  
  static getInstance(): RecordRulesManager {
    if (!RecordRulesManager.instance) {
      RecordRulesManager.instance = new RecordRulesManager();
    }
    return RecordRulesManager.instance;
  }
  
  // Register rule
  registerRule(rule: RecordRule): void {
    if (!this.rules.has(rule.modelId)) {
      this.rules.set(rule.modelId, []);
    }
    this.rules.get(rule.modelId)!.push(rule);
  }
  
  // Get domain for user
  getDomain(
    model: string,
    operation: PermissionType,
    groups: string[],
    userId: number
  ): unknown[] {
    const modelRules = this.rules.get(model) || [];
    const domains: unknown[][] = [];
    
    for (const rule of modelRules) {
      if (!rule.active) continue;
      
      // Check if rule applies to this operation
      const permField = `perm${operation.charAt(0).toUpperCase() + operation.slice(1)}` as keyof RecordRule;
      if (!(rule[permField])) continue;
      
      // Check if rule applies to user's groups (or is global)
      if (rule.groupId && !groups.includes(rule.groupId)) continue;
      
      // Parse domain and substitute user
      let domain = JSON.parse(rule.domainForce);
      domain = this.substituteUser(domain, userId);
      domains.push(domain);
    }
    
    // Combine domains with AND
    if (domains.length === 0) return [];
    if (domains.length === 1) return domains[0];
    
    return ['&', ...domains.flat()];
  }
  
  // Substitute user.id in domain
  private substituteUser(domain: unknown[], userId: number): unknown[] {
    return domain.map(item => {
      if (typeof item === 'string' && item === 'user.id') {
        return userId;
      }
      if (Array.isArray(item)) {
        return this.substituteUser(item, userId);
      }
      return item;
    });
  }
}

// Security Manager (combines ACL + Record Rules)
export class SecurityManager {
  private acl: ACLManager;
  private recordRules: RecordRulesManager;
  
  constructor() {
    this.acl = ACLManager.getInstance();
    this.recordRules = RecordRulesManager.getInstance();
  }
  
  // Check model-level access
  checkModelAccess(
    model: string,
    operation: PermissionType,
    groups: string[]
  ): boolean {
    return this.acl.checkAccess(model, operation, groups);
  }
  
  // Get filtered domain for user
  getAccessDomain(
    model: string,
    operation: PermissionType,
    groups: string[],
    userId: number
  ): unknown[] {
    return this.recordRules.getDomain(model, operation, groups, userId);
  }
  
  // Check record-level access
  async checkRecordAccess(
    model: string,
    recordId: number,
    operation: PermissionType,
    groups: string[],
    userId: number
  ): Promise<boolean> {
    // First check model-level access
    if (!this.checkModelAccess(model, operation, groups)) {
      return false;
    }
    
    // Then check record-level access
    const domain = this.getAccessDomain(model, operation, groups, userId);
    
    if (domain.length === 0) {
      return true; // No record rules, access granted
    }
    
    // Query database to check if record matches domain
    // This would be implemented with actual DB query
    return true;
  }
}

// Export singleton
export const security = new SecurityManager();
