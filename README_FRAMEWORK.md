# 🏗️ Quran Framework - Odoo-Inspired Architecture

<div align="center">

[![Framework](https://img.shields.io/badge/Framework-ODInspired-green.svg)](https://github.com/quran-platform)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

**A standalone framework inspired by Odoo's architecture**

</div>

---

## 🎯 Overview

This is a **standalone framework** that implements Odoo's core concepts without depending on Odoo itself. It's built from scratch using:

- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **Next.js** for the web framework
- **PostgreSQL** for the database

### Why This Approach?

| Odoo Concept | Our Implementation | Benefit |
|--------------|-------------------|---------|
| Models (Python classes) | TypeScript classes with decorators | Type-safe, modern JS/TS |
| ORM | Custom ORM with Prisma | Familiar Odoo patterns in TS |
| ACL + Record Rules | Security Manager | Same security model |
| Workflows | WorkflowEngine | State machines |
| Automation Rules | AutomationEngine | Event-driven automation |
| Modules | ModuleLoader | Plugin architecture |
| Views (XML) | JSON View Definitions | Same declarative UI |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        QURAN FRAMEWORK ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         PRESENTATION LAYER                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │  Next.js UI  │  │  JSON Views  │  │  React OWL   │               │  │
│  │  │  Components  │  │  (Declarative)│  │   Widgets    │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          API LAYER                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │  REST API    │  │  JSON-RPC    │  │  WebSocket   │               │  │
│  │  │  Endpoints   │  │  (Odoo-style)│  │  Real-time   │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         BUSINESS LOGIC LAYER                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │   Models     │  │  Workflows   │  │ Automation   │               │  │
│  │  │  (ORM)       │  │  (State Mach)│  │  Engine      │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          SECURITY LAYER                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │    ACL       │  │ Record Rules │  │  User Groups │               │  │
│  │  │(Access Lists)│  │(Domain Rules)│  │  (Roles)     │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                           DATA LAYER                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │  PostgreSQL  │  │   Prisma     │  │   Redis      │               │  │
│  │  │  Database    │  │   Client     │  │   Cache      │               │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         MODULE SYSTEM (Addons)                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │  │
│  │  │  base    │ │  quran   │ │memorize  │ │  audio   │                │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── core/                          # Framework Core
│   ├── orm/                       # ORM Layer (Odoo-like)
│   │   ├── base.ts                # BaseModel class
│   │   ├── fields.ts              # Field types (Char, Integer, Many2One, etc.)
│   │   ├── decorators.ts          # @api.model, @api.depends, @api.onchange
│   │   └── index.ts
│   │
│   ├── security/                  # Security Layer
│   │   ├── acl.ts                 # Access Control Lists
│   │   ├── groups.ts              # User Groups & Record Rules
│   │   └── index.ts
│   │
│   ├── workflow/                  # Workflow Engine
│   │   ├── engine.ts              # State Machine implementation
│   │   └── index.ts
│   │
│   ├── automation/                # Automation Engine
│   │   ├── engine.ts              # Automation rules & scheduled actions
│   │   └── index.ts
│   │
│   ├── module/                    # Module System
│   │   ├── loader.ts              # Module loader with dependencies
│   │   └── index.ts
│   │
│   └── registry/                  # Global Registry
│       └── index.ts                # Model & addon registry
│
├── addons/                        # Application Modules
│   ├── base/                      # Base Module
│   │   ├── __manifest__.json
│   │   └── ...
│   │
│   ├── quran/                     # Quran Module
│   │   ├── __manifest__.json
│   │   ├── models/
│   │   │   ├── quran_surah.ts     # Surah model
│   │   │   └── quran_ayah.ts      # Ayah model
│   │   ├── views/
│   │   │   ├── quran_surah_views.json
│   │   │   └── quran_menu_views.json
│   │   ├── security/
│   │   │   ├── quran_security.json
│   │   │   └── quran_acl.json
│   │   └── data/
│   │
│   ├── memorization/              # Memorization Module
│   │   ├── __manifest__.json
│   │   ├── models/
│   │   │   └── memorization_plan.ts
│   │   └── ...
│   │
│   ├── audio/                     # Audio Module
│   └── notification/              # Notification Module
│
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   ├── page.tsx                   # Main page
│   └── layout.tsx                 # Root layout
│
├── components/                    # React Components
│   └── ui/                        # UI Components (shadcn/ui)
│
├── lib/                           # Utilities
│   └── db.ts                      # Database client
│
└── prisma/
    └── schema.prisma              # Database schema
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quran-framework

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
bunx prisma generate
bunx prisma db push

# Start development server
bun run dev
```

---

## 📚 Core Concepts

### 1. Models (Odoo-style)

```typescript
import { BaseModel, fields, api } from '@/core/orm';
import { model } from '@/core/registry';

@model('quran.surah', {
  description: 'Quran Surah',
  order: 'number asc',
  recName: 'name_english'
})
export class QuranSurah extends BaseModel {
  static _fields = {
    id: new fields.Id(),
    number: new fields.Integer({ string: 'Number', required: true }),
    name_arabic: new fields.Char({ string: 'Arabic Name', required: true }),
    name_english: new fields.Char({ string: 'English Name', required: true }),
    
    // Relations
    ayah_ids: new fields.One2Many({
      string: 'Ayahs',
      model: 'quran.ayah',
      field: 'surah_id'
    }),
    
    // Computed
    ayah_count: new fields.Computed({
      string: 'Count',
      compute: '_compute_count',
      store: true
    })
  };
  
  @api.depends('ayah_ids')
  async _compute_count(): Promise<number> {
    return (this.get('ayah_ids') as unknown[])?.length || 0;
  }
}
```

### 2. Security (ACL + Record Rules)

```json
{
  "access_rights": [
    {
      "id": "access_quran_surah_user",
      "model_id": "quran.surah",
      "group_id": "group_quran_user",
      "perm_read": true,
      "perm_write": false
    }
  ],
  "record_rules": [
    {
      "id": "rule_bookmark_user",
      "model_id": "quran.bookmark",
      "group_id": "group_quran_user",
      "domain_force": "[['user_id', '=', user.id]]"
    }
  ]
}
```

### 3. Workflow (State Machine)

```typescript
const WORKFLOW: WorkflowDefinition = {
  model: 'quran.memorization.plan',
  field: 'state',
  initial: 'draft',
  states: [
    { name: 'draft', label: 'Draft' },
    { name: 'active', label: 'Active', onEnter: '_start_plan' },
    { name: 'completed', label: 'Completed' }
  ],
  transitions: [
    {
      name: 'start',
      from: 'draft',
      to: 'active',
      trigger: 'action_start',
      button: { label: 'Start', icon: 'play' }
    }
  ]
};

@workflow(WORKFLOW)
@model('quran.memorization.plan')
export class QuranMemorizationPlan extends BaseModel {
  // ...
}
```

### 4. Automation Rules

```typescript
@automation({
  trigger: 'write',
  domain: [['state', '=', 'memorized']],
  action: 'schedule_revision'
})
async schedule_revision(): Promise<void> {
  // Schedule next revision using spaced repetition
}
```

---

## 📖 API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quran/surahs` | List all surahs |
| GET | `/api/quran/surah/:id` | Get surah with ayahs |
| GET | `/api/quran/ayahs` | List ayahs (filterable) |
| POST | `/api/quran/search` | Search in Quran text |
| GET | `/api/quran/page/:num` | Get page content |
| POST | `/api/quran/bookmark` | Add bookmark |

### Example Usage

```typescript
// Get surah with ayahs
const surah = await fetch('/api/quran/surah/1?include_ayahs=true');
const data = await surah.json();

// Search
const results = await fetch('/api/quran/search', {
  method: 'POST',
  body: JSON.stringify({ query: 'الرحمن', limit: 10 })
});
```

---

## 🔐 Security Model

### User Groups

| Group | Permissions |
|-------|-------------|
| `group_quran_user` | Read Quran content |
| `group_quran_student` | Track memorization |
| `group_quran_teacher` | Manage students |
| `group_quran_manager` | Full content management |

### Record Rules

- Users see only their own bookmarks
- Students see only their own memorization plans
- Teachers see plans of their students

---

## 🔄 Comparison: Odoo vs This Framework

| Feature | Odoo | This Framework |
|---------|------|----------------|
| Language | Python | TypeScript |
| ORM | Custom ORM | Prisma + Custom Layer |
| Views | XML QWeb | JSON + React |
| Security | ACL + Rules | Same model |
| Workflow | Python-based | TypeScript |
| Modules | Python packages | TypeScript modules |
| Database | PostgreSQL | PostgreSQL |
| API | JSON-RPC | REST + JSON-RPC |

---

## 📄 License

LGPL-3.0 License - See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for the Quran community**

</div>
