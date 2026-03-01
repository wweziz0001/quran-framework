/**
 * Security Core - User and Groups
 * ================================
 */

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  active: boolean;
  groups: string[];
  companyId?: number;
  lang: string;
  tz: string;
}

// Group interface
export interface Group {
  id: string;
  name: string;
  category: string;
  full_name: string;
  implied_groups: string[];
  users: number[];
  model_access: AccessRight[];
  rule_ids: string[];
}

// Access Right
export interface AccessRight {
  id: string;
  name: string;
  model: string;
  group_id: string;
  perm_read: boolean;
  perm_write: boolean;
  perm_create: boolean;
  perm_unlink: boolean;
}

// Predefined groups for Quran application
export const QURAN_GROUPS: GroupDefinition[] = [
  {
    id: 'group_quran_user',
    name: 'User',
    category: 'Quran',
    comment: 'Basic user - can read Quran'
  },
  {
    id: 'group_quran_reader',
    name: 'Reader',
    category: 'Quran',
    impliedIds: ['group_quran_user'],
    comment: 'Can read Quran, add bookmarks'
  },
  {
    id: 'group_quran_student',
    name: 'Student',
    category: 'Quran',
    impliedIds: ['group_quran_reader'],
    comment: 'Can track memorization progress'
  },
  {
    id: 'group_quran_teacher',
    name: 'Teacher',
    category: 'Quran',
    impliedIds: ['group_quran_student'],
    comment: 'Can manage students'
  },
  {
    id: 'group_quran_manager',
    name: 'Manager',
    category: 'Quran',
    impliedIds: ['group_quran_teacher'],
    comment: 'Full access to Quran data'
  },
  {
    id: 'group_system_admin',
    name: 'System Administrator',
    category: 'Administration',
    impliedIds: ['group_quran_manager'],
    comment: 'Full system access'
  }
];

// Default ACL rules
export const DEFAULT_ACL_RULES: ACLEntry[] = [
  // Surah - Read for all, write for managers
  {
    id: 'access_quran_surah_user',
    name: 'quran.surah.user',
    modelId: 'quran.surah',
    groupId: 'group_quran_user',
    permRead: true,
    permWrite: false,
    permCreate: false,
    permUnlink: false,
    active: true
  },
  {
    id: 'access_quran_surah_manager',
    name: 'quran.surah.manager',
    modelId: 'quran.surah',
    groupId: 'group_quran_manager',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  // Ayah - Read for all
  {
    id: 'access_quran_ayah_user',
    name: 'quran.ayah.user',
    modelId: 'quran.ayah',
    groupId: 'group_quran_user',
    permRead: true,
    permWrite: false,
    permCreate: false,
    permUnlink: false,
    active: true
  },
  // Bookmark - Own records only
  {
    id: 'access_quran_bookmark_user',
    name: 'quran.bookmark.user',
    modelId: 'quran.bookmark',
    groupId: 'group_quran_user',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  // Memorization Plan - Own records only
  {
    id: 'access_quran_memorization_plan_user',
    name: 'quran.memorization.plan.user',
    modelId: 'quran.memorization.plan',
    groupId: 'group_quran_student',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  {
    id: 'access_quran_memorization_plan_teacher',
    name: 'quran.memorization.plan.teacher',
    modelId: 'quran.memorization.plan',
    groupId: 'group_quran_teacher',
    permRead: true,
    permWrite: true,
    permCreate: false,
    permUnlink: false,
    active: true
  },
  // User Settings - Own only
  {
    id: 'access_quran_user_settings_user',
    name: 'quran.user.settings.user',
    modelId: 'quran.user.settings',
    groupId: 'group_quran_user',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  }
];

// Default Record Rules
export const DEFAULT_RECORD_RULES: RecordRule[] = [
  // Bookmarks - User can only see their own
  {
    id: 'rule_quran_bookmark_user',
    name: 'Own Bookmarks',
    modelId: 'quran.bookmark',
    groupId: 'group_quran_user',
    domainForce: '[("user_id", "=", user.id)]',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  // Memorization Plan - User can only see their own
  {
    id: 'rule_quran_memorization_plan_user',
    name: 'Own Memorization Plans',
    modelId: 'quran.memorization.plan',
    groupId: 'group_quran_student',
    domainForce: '[("user_id", "=", user.id)]',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  // Memorization Plan - Teacher can see all students
  {
    id: 'rule_quran_memorization_plan_teacher',
    name: 'All Students Plans',
    modelId: 'quran.memorization.plan',
    groupId: 'group_quran_teacher',
    domainForce: '[]',
    permRead: true,
    permWrite: true,
    permCreate: false,
    permUnlink: false,
    active: true
  },
  // User Settings - Own only
  {
    id: 'rule_quran_user_settings_user',
    name: 'Own Settings',
    modelId: 'quran.user.settings',
    groupId: 'group_quran_user',
    domainForce: '[("user_id", "=", user.id)]',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  },
  // Memorization Progress - Own only
  {
    id: 'rule_quran_memorization_progress_user',
    name: 'Own Progress',
    modelId: 'quran.memorization.progress',
    groupId: 'group_quran_student',
    domainForce: '[("user_id", "=", user.id)]',
    permRead: true,
    permWrite: true,
    permCreate: true,
    permUnlink: true,
    active: true
  }
];

// Initialize security
export function initializeSecurity(): void {
  const aclManager = ACLManager.getInstance();
  const rulesManager = RecordRulesManager.getInstance();
  
  // Register groups
  for (const group of QURAN_GROUPS) {
    aclManager.registerGroup(group);
  }
  
  // Register ACL rules
  for (const rule of DEFAULT_ACL_RULES) {
    aclManager.registerRule(rule);
  }
  
  // Register record rules
  for (const rule of DEFAULT_RECORD_RULES) {
    rulesManager.registerRule(rule);
  }
}

import { ACLManager, RecordRulesManager, RecordRule, GroupDefinition, ACLEntry } from './acl';
