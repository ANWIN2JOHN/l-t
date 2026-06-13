# ANTIGRAVITY_PROMPTS.md

# Antigravity Prompt Library

## Purpose

This file contains reusable prompts for developing the Campus Lost & Found Management System.

Before executing any prompt:

Read all referenced `.ai` documents.

Never skip documentation.

---

# Global Project Context Prompt

Use at the beginning of every new Antigravity session.

```text
Read all files inside:

.ai/

Files include:

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
BACKEND_RULES.md
DEPLOYMENT.md
DEVELOPMENT_PHASES.md

Analyze the project.

Do not modify code.

Return:

1. Understanding of project architecture
2. Missing dependencies
3. Potential risks
4. Development readiness report
```

---

# Phase 1 — Project Foundation

```text
Read:

PROJECT_RULES.md
UI_GUARDRAILS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md
BACKEND_RULES.md

Implement Phase 1 from DEVELOPMENT_PHASES.md.

Requirements:

1. Create frontend architecture.
2. Create backend architecture.
3. Create shared layouts.
4. Configure routing.
5. Configure API layer.
6. Configure MongoDB connection.
7. Configure error handling.
8. Configure validation framework.

Do not implement business features.

Return only modified files.
```

---

# Phase 2 — Authentication

```text
Read:

PROJECT_RULES.md
AUTH_FLOW.md
USER_ROLES.md
DATABASE_SCHEMA.md
API_CONTRACTS.md
BACKEND_RULES.md

Implement Authentication Phase.

Requirements:

1. Google OAuth Login.
2. Restrict to @kristujayanti.com domain.
3. Roll Number validation.
4. JWT authentication.
5. Protected routes.
6. Role guards.
7. Login persistence.

Do not implement future authentication providers.

Return only modified files.
```

---

# Phase 3 — User Management

```text
Read:

PROJECT_RULES.md
USER_ROLES.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Implement User Management.

Requirements:

1. Profile page.
2. Profile editing.
3. User listing.
4. User details page.
5. Admin user management.

Enforce role permissions.

Return only modified files.
```

---

# Phase 4 — Lost Reports

```text
Read:

PROJECT_RULES.md
APP_REQUIREMENTS.md
DATABASE_SCHEMA.md
API_CONTRACTS.md
AUDIT_LOG_RULES.md
USER_ROLES.md

Implement Lost Reports.

Requirements:

1. Create Lost Report.
2. Edit Lost Report.
3. View Lost Reports.
4. Approve Report.
5. Reject Report.
6. Request Revision.
7. Close Report.

Generate audit logs.

Generate notifications.

Return only modified files.
```

---

# Phase 5 — Found Items

```text
Read:

PROJECT_RULES.md
RECEPTION_MODEL.md
DATABASE_SCHEMA.md
API_CONTRACTS.md
AUDIT_LOG_RULES.md

Implement Found Items.

Requirements:

1. Create Found Item.
2. Edit Found Item.
3. Match Found Item.
4. Return Item.
5. Donate Item.
6. Archive Item.
7. Transfer Item.

Enforce Reception ownership.

Generate audit logs.

Return only modified files.
```

---

# Phase 6 — Search

```text
Read:

PROJECT_RULES.md
APP_REQUIREMENTS.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Implement Search.

Requirements:

1. MongoDB Atlas Search.
2. Fuzzy search.
3. Typo tolerance.
4. Category filters.
5. Reception filters.
6. Status filters.
7. Pagination.

Do not use regex-based search.

Return only modified files.
```

---

# Phase 7 — Notifications

```text
Read:

PROJECT_RULES.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Implement Notifications.

Requirements:

1. Notification creation.
2. Notification list.
3. Mark as read.
4. Mark all as read.

Notification Types:

REPORT_APPROVED
REPORT_REJECTED
REPORT_UPDATED
REPORT_CLOSED

NEW_USER_REGISTERED
NEW_LOST_REPORT

ITEM_RETURNED
ITEM_DONATED

Return only modified files.
```

---

# Phase 8 — Audit Logs

```text
Read:

AUDIT_LOG_RULES.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Implement Audit Logs.

Requirements:

1. Audit logging service.
2. Audit log storage.
3. Audit log search.
4. Audit log filtering.
5. Audit log details page.

Audit logs must be immutable.

Return only modified files.
```

---

# Phase 9 — Admin Dashboard

```text
Read:

PROJECT_RULES.md
USER_ROLES.md
COMPONENT_MAP.md
ROUTING_MAP.md

Implement Admin Dashboard.

Requirements:

1. Statistics cards.
2. Pending reports widget.
3. Recent activity.
4. Reception statistics.
5. Quick actions.

Use existing design patterns.

Return only modified files.
```

---

# Frontend Page Creation Prompt

```text
Read:

UI_GUARDRAILS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md

Create requested page.

Requirements:

1. Reuse existing components.
2. Follow design system.
3. Support dark mode.
4. Mobile responsive.
5. No redesigns.

Return only modified files.
```

---

# Backend API Prompt

```text
Read:

BACKEND_RULES.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Create requested API.

Requirements:

1. Follow service architecture.
2. Use validation.
3. Use audit logging.
4. Use consistent responses.
5. Follow authorization rules.

Return only modified files.
```

---

# Database Model Prompt

```text
Read:

DATABASE_SCHEMA.md

Create Mongoose models.

Requirements:

1. Match schema exactly.
2. Create indexes.
3. Add timestamps.
4. Use TypeScript types.

Return only modified files.
```

---

# Refactoring Prompt

```text
Read all .ai files.

Analyze codebase.

Requirements:

1. Improve maintainability.
2. Reduce duplication.
3. Preserve behavior.
4. Preserve UI.
5. Preserve APIs.

Do not redesign.

Return only modified files.
```

---

# Bug Fix Prompt

```text
Read all .ai files.

Analyze bug.

Requirements:

1. Fix root cause.
2. Preserve existing behavior.
3. Preserve UI.
4. Preserve architecture.

Return:

1. Root cause.
2. Fix implemented.
3. Modified files.
```

---

# Pre-Deployment Audit Prompt

```text
Read:

PROJECT_RULES.md
DEPLOYMENT.md
AUTH_FLOW.md
DATABASE_SCHEMA.md
API_CONTRACTS.md

Perform deployment audit.

Verify:

Authentication
Authorization
Role Guards
Reception Ownership
Validation
Search
Notifications
Audit Logs

Return:

1. Passed Checks
2. Failed Checks
3. Risks
4. Deployment Readiness Score
```

---

# Code Review Prompt

```text
Read all .ai files.

Review code.

Check:

Architecture
Security
Performance
Scalability
Maintainability

Return:

1. Critical Issues
2. Major Issues
3. Minor Issues
4. Recommended Fixes
```

---

# Golden Rule

Before any implementation:

1. Read relevant .ai documents.
2. Follow documented requirements.
3. Do not invent features.
4. Do not redesign UI.
5. Follow role permissions.
6. Follow reception ownership.
7. Generate audit logs for business actions.
8. Return only modified files.

Documentation overrides assumptions.

```
```
