# PROJECT_STRUCTURE.md

# Project Structure

## Purpose

This document defines the official folder structure for the Campus Lost & Found Management System.

All development must follow this structure.

Do not create new top-level folders unless this document is updated.

---

# Repository Structure

```text
campus-lost-found/
│
├── .ai/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── .gitignore
├── README.md
└── package.json
```

---

# AI Documentation

Location:

```text
.ai/
```

Contains project governance.

```text
PROJECT_RULES.md
APP_REQUIREMENTS.md

USER_ROLES.md
AUTH_FLOW.md
RECEPTION_MODEL.md

DATABASE_SCHEMA.md
API_CONTRACTS.md
AUDIT_LOG_RULES.md

UI_GUARDRAILS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md

FRONTEND_RULES.md
FRONTEND_ARCHITECTURE.md

BACKEND_RULES.md

DEPLOYMENT.md
DEVELOPMENT_PHASES.md
ANTIGRAVITY_PROMPTS.md

PROJECT_STRUCTURE.md
```

---

# Frontend Structure

Location:

```text
frontend/
```

Framework:

```text
React
TypeScript
Vite
Tailwind
shadcn/ui
```

---

# Frontend Folder Structure

```text
frontend/
│
├── public/
│
├── src/
│
│   ├── app/
│   ├── routes/
│   ├── layouts/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   ├── assets/
│   └── styles/
│
├── .env
├── vite.config.ts
└── package.json
```

---

# App Layer

```text
src/app/
```

Contains:

```text
App.tsx
Providers
Theme Setup
Query Client Setup
```

---

# Routes Layer

```text
src/routes/
```

Contains:

```text
Route Definitions
ProtectedRoute
RoleGuard
```

Reference:

```text
ROUTING_MAP.md
```

---

# Layout Layer

```text
src/layouts/
```

Contains:

```text
AppLayout
DashboardLayout
AuthLayout
```

---

# Shared Components

```text
src/components/
```

Contains:

```text
Buttons
Tables
Modals
Forms
Badges
Inputs
Shared UI
```

No business logic allowed.

---

# Feature Modules

```text
src/features/
```

Every business feature gets its own module.

---

## Authentication

```text
src/features/auth/

components/
pages/
hooks/
services/
types/
```

---

## Dashboard

```text
src/features/dashboard/

components/
pages/
hooks/
services/
types/
```

---

## Lost Reports

```text
src/features/lostReports/

components/
pages/
hooks/
services/
types/
```

---

## Found Items

```text
src/features/foundItems/

components/
pages/
hooks/
services/
types/
```

---

## Notifications

```text
src/features/notifications/

components/
pages/
hooks/
services/
types/
```

---

## Users

```text
src/features/users/

components/
pages/
hooks/
services/
types/
```

---

## Audit

```text
src/features/audit/

components/
pages/
hooks/
services/
types/
```

---

## Receptions

```text
src/features/receptions/

components/
pages/
hooks/
services/
types/
```

---

# Service Layer

```text
src/services/
```

Examples:

```text
api.ts

authService.ts
lostReportService.ts
foundItemService.ts
notificationService.ts
userService.ts
auditService.ts
```

Purpose:

```text
Backend Communication
```

---

# Store Layer

```text
src/store/
```

Technology:

```text
Zustand
```

Stores:

```text
authStore.ts
themeStore.ts
```

Avoid storing server data.

Use TanStack Query instead.

---

# Hooks Layer

```text
src/hooks/
```

Shared hooks.

Examples:

```text
useDebounce.ts
usePagination.ts
useTheme.ts
```

---

# Types Layer

```text
src/types/
```

Shared types.

Examples:

```text
User.ts
FoundItem.ts
LostReport.ts
Notification.ts
AuditLog.ts
```

---

# Backend Structure

Location:

```text
backend/
```

Framework:

```text
Node.js
Express.js
MongoDB Atlas
Mongoose
```

---

# Backend Folder Structure

```text
backend/
│
├── src/
│
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── jobs/
│   ├── utils/
│   ├── constants/
│   ├── types/
│
│   ├── app.ts
│   └── server.ts
│
├── .env
└── package.json
```

---

# Controllers

```text
src/controllers/
```

Responsibilities:

```text
Request Handling
Response Formatting
```

No business logic.

---

# Services

```text
src/services/
```

Responsibilities:

```text
Business Logic
Audit Logging
Notifications
Database Operations
```

---

# Models

```text
src/models/
```

Must follow:

```text
DATABASE_SCHEMA.md
```

---

# Middleware

```text
src/middleware/
```

Examples:

```text
authMiddleware.ts
roleMiddleware.ts
errorHandler.ts
```

---

# Validators

```text
src/validators/
```

Technology:

```text
Zod
```

---

# Scheduled Jobs

```text
src/jobs/
```

Examples:

```text
expireFoundItemsJob.ts
```

Runs:

```text
Daily
```

---

# Documentation

Location:

```text
docs/
```

Contains:

```text
API Examples
Deployment Notes
Architecture Notes
Developer Guides
```

Not required for MVP.

---

# Naming Conventions

Folders:

```text
camelCase
```

Examples:

```text
lostReports
foundItems
```

---

Files:

```text
camelCase.ts
```

Examples:

```text
authService.ts
lostReportController.ts
```

---

React Components:

```text
PascalCase.tsx
```

Examples:

```text
FoundItemCard.tsx
LostReportForm.tsx
```

---

# Import Rules

Use aliases.

Example:

```ts
@/components
@/features
@/services
@/store
```

Avoid:

```text
../../../../
```

style imports.

---

# State Flow

Frontend:

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

---

# Backend Flow

```text
Route
↓
Controller
↓
Service
↓
Model
↓
Database
```

---

# Development Rules

Before creating files:

Read:

```text
PROJECT_RULES.md
FRONTEND_ARCHITECTURE.md
BACKEND_RULES.md
```

Follow the structure exactly.

Do not invent new top-level architecture.

---

# Final Rule

Every new file must have a clear location.

If a developer cannot determine where a file belongs:

```text
Update PROJECT_STRUCTURE.md First
```

Architecture documentation always takes precedence over assumptions.
