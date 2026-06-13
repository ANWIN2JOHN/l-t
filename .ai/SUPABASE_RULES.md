# SUPABASE_RULES.md

# Purpose

This document defines how Supabase must be used throughout the Campus Lost & Found Management System.

Stack:

* Supabase Auth
* Supabase PostgreSQL
* Supabase RLS
* Supabase Edge Functions (only when required)
* React + TypeScript

---

# Core Principle

Use Supabase as the backend.

Avoid creating a separate Express backend unless absolutely necessary.

---

# Authentication Rules

Authentication Provider:

```text
Google OAuth
```

Allowed Domain:

```text
@kristujayanti.com
```

Reject all other domains.

---

# User Roles

Supported Roles:

```text
student
admin
super_admin
```

Role stored in:

```text
profiles.role
```

Never trust frontend roles.

Always enforce through RLS.

---

# Database Access

Preferred:

```text
Supabase Client
```

Avoid:

```text
Custom API Layer
```

unless business logic cannot be expressed through RLS or RPC.

---

# Edge Functions

Use only for:

* Complex business workflows
* Scheduled jobs
* Admin-only operations
* Audit automation

Do not create Edge Functions for simple CRUD.

---

# Audit Logging

All critical actions must generate audit records.

Examples:

```text
CREATE_LOST_REPORT
APPROVE_REPORT
REJECT_REPORT
CREATE_FOUND_ITEM
RETURN_ITEM
DONATE_ITEM
```

---

# Notifications

Store notifications inside:

```text
notifications
```

table.

---

# Search

Use PostgreSQL Full Text Search.

Do not introduce Elasticsearch or MongoDB Atlas Search.

---

# Storage

Current MVP:

```text
No File Uploads
No Images
```

Do not create storage buckets.

---

# Security Rules

Always enforce:

* Authentication
* Authorization
* RLS
* Role Checks
* Reception Ownership

through Supabase policies.

---

# Final Rule

If a feature can be implemented using:

```text
Supabase Auth
Supabase Tables
Supabase RLS
```

Use those before creating custom backend code.
