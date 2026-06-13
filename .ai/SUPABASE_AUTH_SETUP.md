# SUPABASE_AUTH_SETUP.md

# Purpose

This document defines authentication setup, configuration, and implementation rules for the Campus Lost & Found Management System.

Authentication Provider:

* Supabase Auth
* Google OAuth

---

# Authentication Flow

```text
User
↓
Google Login
↓
Supabase Auth
↓
Email Domain Validation
↓
Profile Check
↓
Role Assignment
↓
Dashboard
```

---

# Allowed Domain

Only allow:

```text
@kristujayanti.com
```

Reject:

```text
@gmail.com
@yahoo.com
@outlook.com
```

and all other domains.

---

# User Registration Flow

## First Login

User logs in using Google.

System checks:

1. Email domain
2. Existing profile
3. Role assignment
4. Roll number verification

---

## Existing User

```text
Login
↓
Load Profile
↓
Dashboard
```

---

## New User

```text
Login
↓
Complete Registration
↓
Enter Roll Number
↓
Validate Roll Number
↓
Create Profile
↓
Dashboard
```

---

# Profile Creation

Table:

```text
profiles
```

Default values:

```json
{
  "role": "student",
  "account_status": "ACTIVE"
}
```

---

# Roles

Supported:

```text
student
admin
super_admin
```

Stored in:

```text
profiles.role
```

---

# Session Management

Use:

```text
Supabase Session
```

Do not implement custom JWT authentication.

---

# Frontend Auth State

Store:

```ts
user
profile
role
isAuthenticated
isLoading
```

---

# Protected Routes

Student routes require:

```text
Authenticated
role = student
```

Admin routes require:

```text
Authenticated
role = admin
```

---

# Logout Flow

```text
Logout
↓
Clear Session
↓
Clear Local State
↓
Redirect Login
```

Implementation:

```ts
await supabase.auth.signOut();
```

---

# First Admin Creation

Initial admin should be manually promoted.

Example SQL:

```sql
update profiles
set role = 'admin'
where email = 'admin@kristujayanti.com';
```

---

# Authentication Rules

Never trust:

```text
Frontend Role
Frontend Route Protection
```

Role enforcement must use:

```text
RLS Policies
```

---

# Antigravity Rule

Before implementing authentication:

Read:

* AUTH_FLOW.md
* USER_ROLES.md
* SUPABASE_RULES.md
* SUPABASE_RLS.md

Authentication must follow those documents exactly.
