# FRONTEND_ARCHITECTURE.md

# Frontend Architecture

## Purpose

This document defines the frontend architecture for the Campus Lost & Found Management System.

Framework:

```text
React
TypeScript
Vite
Tailwind CSS
```

The architecture must be:

```text
Scalable
Maintainable
Feature-Based
Production Ready
```

All frontend development must follow this structure.

---

# Architecture Philosophy

Organize code by:

```text
Feature
```

Not by:

```text
File Type Only
```

Good:

```text
features/
  lostReports/
  foundItems/
  notifications/
```

Bad:

```text
pages/
components/
hooks/
services/
everything mixed together
```

---

# Root Structure

```text
src/
│
├── app/
├── routes/
├── layouts/
├── components/
├── features/
├── services/
├── store/
├── hooks/
├── types/
├── utils/
├── constants/
├── assets/
└── styles/
```

---

# App Layer

Location:

```text
src/app
```

Purpose:

```text
Application Bootstrapping
Global Providers
Query Client
Theme Setup
```

Example:

```text
src/app/

App.tsx

providers/
```

---

# Routes Layer

Location:

```text
src/routes
```

Contains:

```text
Route Definitions
Protected Routes
Role Guards
```

Example:

```text
src/routes/

index.tsx

ProtectedRoute.tsx

RoleGuard.tsx
```

---

# Layout Layer

Location:

```text
src/layouts
```

Contains:

```text
AppLayout
DashboardLayout
AuthLayout
```

Purpose:

```text
Shared Page Structures
```

---

# Shared Components

Location:

```text
src/components
```

Contains reusable UI.

Examples:

```text
Button
Modal
Table
SearchBar
StatusBadge
PageHeader
```

Rules:

```text
Must Be Generic
Must Not Contain Business Logic
```

---

# Feature Modules

Location:

```text
src/features
```

Every business feature gets its own module.

---

# Feature Structure

Example:

```text
src/features/lostReports

components/

pages/

hooks/

services/

types/
```

Every feature follows the same pattern.

---

# Authentication Module

```text
src/features/auth

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Google OAuth
Registration
Auth State
```

---

# Lost Reports Module

```text
src/features/lostReports

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Create Report
Edit Report
View Report
Review Report
```

---

# Found Items Module

```text
src/features/foundItems

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Create Item
Edit Item
Search Items
Match Items
Return Items
```

---

# Notifications Module

```text
src/features/notifications

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Notification List
Notification Details
Mark Read
```

---

# Users Module

```text
src/features/users

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Profile
User Management
```

---

# Dashboard Module

```text
src/features/dashboard

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Statistics
Recent Activity
Widgets
```

---

# Audit Module

```text
src/features/audit

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Audit Logs
Audit Search
Audit Filters
```

---

# Reception Module

```text
src/features/receptions

components/
pages/
hooks/
services/
types/
```

Responsibilities:

```text
Reception Data
Reception Statistics
```

---

# Service Layer

Location:

```text
src/services
```

Purpose:

```text
Backend Communication
```

Examples:

```text
authService.ts

lostReportService.ts

foundItemService.ts

notificationService.ts
```

Rules:

```text
No UI Logic
No Component Logic
```

---

# API Client

Location:

```text
src/services/api.ts
```

Responsibilities:

```text
Axios Instance
Interceptors
Authentication
Error Handling
```

All services use this client.

---

# Hooks Layer

Location:

```text
src/hooks
```

Shared hooks.

Examples:

```text
useDebounce

useTheme

usePagination
```

---

# Feature Hooks

Location:

```text
src/features/*/hooks
```

Examples:

```text
useLostReports

useFoundItems

useNotifications
```

Purpose:

```text
TanStack Query
Mutations
Business Queries
```

---

# Store Layer

Location:

```text
src/store
```

Technology:

```text
Zustand
```

Use only for:

```text
Authentication
Theme
Global Preferences
```

Avoid storing:

```text
Found Items
Reports
Notifications
```

Those belong in TanStack Query.

---

# Types Layer

Location:

```text
src/types
```

Contains:

```text
User

LostReport

FoundItem

Notification

AuditLog
```

Shared application types.

---

# Feature Types

Location:

```text
src/features/*/types
```

Contains:

```text
Feature-Specific Types
```

---

# Utils Layer

Location:

```text
src/utils
```

Examples:

```text
dateUtils.ts

validationUtils.ts

formatters.ts
```

Must be:

```text
Pure Functions
```

---

# Constants Layer

Location:

```text
src/constants
```

Examples:

```text
roles.ts

statuses.ts

routes.ts
```

Avoid magic strings.

---

# Assets Layer

Location:

```text
src/assets
```

Contains:

```text
Images
Icons
Logos
```

---

# Styles Layer

Location:

```text
src/styles
```

Contains:

```text
globals.css
theme.css
```

Avoid feature-specific CSS files.

Use Tailwind whenever possible.

---

# State Flow

Correct Flow:

```text
Page
↓
Component
↓
Hook
↓
Service
↓
API
```

Never:

```text
Page
↓
API
```

---

# Data Flow

Server Data:

```text
API
↓
Service
↓
TanStack Query
↓
Component
```

---

# Authentication Flow

```text
Google Login
↓
Auth Service
↓
Backend
↓
JWT
↓
Auth Store
```

---

# Error Handling Flow

```text
API Error
↓
Service
↓
Query Error
↓
UI Error State
```

Avoid handling raw API errors in pages.

---

# Import Rules

Preferred:

```text
Feature Imports
```

Example:

```ts
import { LostReportForm } from "@/features/lostReports/components";
```

Avoid deep relative imports.

---

# Path Aliases

Recommended:

```json
{
  "@/*": ["src/*"]
}
```

Examples:

```ts
@/components
@/features
@/services
```

---

# Performance Rules

Use:

```text
Lazy Loading
Route Splitting
TanStack Query Caching
```

For:

```text
Admin Pages
Audit Logs
Large Tables
```

---

# Feature Development Workflow

When adding a feature:

1. Create feature folder.
2. Create types.
3. Create service.
4. Create hooks.
5. Create components.
6. Create pages.
7. Add route.

Never skip layers.

---

# Antigravity Rules

Before implementing frontend code:

Read:

```text
PROJECT_RULES.md
UI_GUARDRAILS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md
FRONTEND_RULES.md
```

Follow architecture exactly.

Do not invent new folder structures.

Do not move existing architecture without updating this document.

---

# Final Rule

The frontend must always follow:

```text
Feature
↓
Hook
↓
Service
↓
API
```

and

```text
Shared Components
↓
Feature Components
↓
Pages
```

This separation is mandatory and should be preserved throughout the lifetime of the project.
