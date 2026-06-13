# FRONTEND_RULES.md

# Frontend Rules

## Purpose

This document defines the frontend architecture, coding standards, component design rules, state management strategy, and implementation guidelines for the Campus Lost & Found Management System.

Frontend Stack:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
React Hook Form
Zod
```

All frontend development must follow this document.

---

# Core Principles

Frontend code must be:

```text
Maintainable
Reusable
Scalable
Responsive
Accessible
Production Ready
```

Prioritize:

```text
Consistency
Readability
Reusability
```

over:

```text
Creative Architectures
Complex Patterns
Experimental Solutions
```

---

# React Rules

Use:

```text
Functional Components
React Hooks
TypeScript
```

Do not use:

```text
Class Components
```

---

# Component Rules

Components must have:

```text
Single Responsibility
```

Each component should do one thing well.

Good:

```text
FoundItemCard
NotificationItem
ProfileForm
```

Bad:

```text
DashboardThatHandlesEverything
```

---

# Component Size Rules

Target:

```text
< 300 lines
```

Maximum:

```text
500 lines
```

If exceeded:

```text
Split Component
```

---

# File Naming Rules

Use:

```text
PascalCase.tsx
```

Examples:

```text
FoundItemCard.tsx
LostReportForm.tsx
NotificationList.tsx
```

---

# Folder Structure

Frontend Structure:

```text
src/

app/

routes/

layouts/

components/

features/

services/

hooks/

store/

types/

utils/
```

---

# Feature Structure

Example:

```text
features/

lostReports/

components/

pages/

hooks/

services/

types/
```

Every feature follows the same structure.

---

# Page Rules

Pages should:

```text
Render UI
Call Hooks
Manage Layout
```

Pages should NOT:

```text
Call APIs Directly
Contain Business Logic
```

---

# Service Layer Rules

All API communication must go through services.

Location:

```text
src/services
```

Examples:

```text
authService.ts
lostReportService.ts
foundItemService.ts
notificationService.ts
```

---

# Forbidden Pattern

Do NOT:

```text
Page
↓
Fetch API
```

Example:

```ts
useEffect(() => {
 fetch(...)
})
```

inside pages.

---

# Correct Pattern

```text
Page
↓
Custom Hook
↓
Service
↓
API
```

---

# State Management

Use the simplest solution possible.

---

## Local State

Use:

```text
useState
```

for:

```text
Modal State
Form Visibility
UI Toggles
```

---

## Server State

Use:

```text
TanStack Query
```

for:

```text
Users
Lost Reports
Found Items
Notifications
```

---

## Global State

Use:

```text
Zustand
```

only for:

```text
Authentication
Theme
Global Preferences
```

Avoid storing server data in Zustand.

---

# Data Fetching Rules

Use:

```text
TanStack Query
```

for:

```text
Fetching
Caching
Refetching
Mutations
```

Avoid:

```text
Manual Fetch Logic Everywhere
```

---

# Form Rules

All forms must use:

```text
React Hook Form
+
Zod
```

---

# Form Validation

Validation must exist:

```text
Frontend
Backend
```

Frontend validation improves UX.

Backend validation is mandatory.

---

# Form Components

Use reusable components:

```text
TextInput
TextArea
SelectInput
DateInput
SearchInput
CheckboxInput
```

Do not create custom inputs unnecessarily.

---

# TypeScript Rules

Never use:

```ts
any
```

unless absolutely necessary.

Prefer:

```ts
Interfaces
Types
Generics
```

---

# Shared Types

Location:

```text
src/types
```

Examples:

```ts
User
LostReport
FoundItem
Notification
```

---

# API Types

All API requests and responses must be typed.

Example:

```ts
CreateLostReportRequest

CreateLostReportResponse
```

---

# Routing Rules

Reference:

```text
ROUTING_MAP.md
```

All routes must follow the routing document.

Do not invent routes.

---

# Route Guards

Use:

```text
ProtectedRoute
RoleGuard
```

for all protected pages.

---

# Authentication State

Authentication state should include:

```ts
user
role
isAuthenticated
isLoading
```

Stored in:

```text
AuthStore
```

---

# Dark Mode Rules

Every component must support:

```text
Light Theme
Dark Theme
```

No exceptions.

---

# Responsive Design Rules

Required:

```text
Mobile
Tablet
Desktop
```

---

# Student Screens

Priority:

```text
Mobile First
```

Examples:

```text
Found Items
My Reports
Notifications
```

---

# Admin Screens

Priority:

```text
Desktop First
```

Examples:

```text
Audit Logs
Users
Management Tables
```

---

# Tailwind Rules

Use Tailwind utility classes.

Avoid:

```text
Large Custom CSS Files
```

---

# Styling Rules

Prefer:

```text
Tailwind Classes
```

over:

```text
Inline Styles
```

---

# Reusable Components

Before creating a component:

Read:

```text
COMPONENT_MAP.md
```

Reuse before creating.

---

# Table Rules

Use reusable table components.

Features:

```text
Sorting
Filtering
Pagination
```

Required for:

```text
Users
Reports
Found Items
Audit Logs
```

---

# Modal Rules

Use:

```text
BaseModal
```

for all modals.

Avoid building unique modal systems.

---

# Error Handling

Every API request must handle:

```text
Loading
Success
Error
```

States.

---

# Empty States

Every page must support:

```text
No Data
```

Examples:

```text
No Reports Found
No Notifications
No Items Available
```

---

# Accessibility Rules

Required:

```text
Keyboard Navigation
Focus States
ARIA Labels
Readable Contrast
```

---

# Performance Rules

Use:

```text
Lazy Loading
Code Splitting
Memoization When Needed
```

Avoid premature optimization.

---

# Security Rules

Never trust frontend permissions.

Frontend role checks are:

```text
User Experience Only
```

Backend remains the source of truth.

---

# API Rules

All API calls must use:

```text
src/services
```

Never call backend directly from components.

---

# Testing Rules

Test:

```text
Forms
Authentication
Route Guards
Critical Components
```

Priority:

```text
User Workflows
```

over implementation details.

---

# Antigravity Rules

Before generating frontend code:

Read:

```text
PROJECT_RULES.md
UI_GUARDRAILS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md
```

Then:

```text
FRONTEND_RULES.md
```

Follow architecture exactly.

Do not redesign.

Do not duplicate components.

Do not bypass service layer.

---

# Final Rule

Frontend flow must always be:

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

Maintain separation of concerns at all times.
