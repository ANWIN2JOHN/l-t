# USER_ROLES.md

# User Roles & Permissions

## Purpose

This document defines all user roles, permissions, restrictions, and authorization rules for the Campus Lost & Found Management System.

All frontend and backend authorization logic must follow this document.

If any conflict exists between implementation and this document, this document takes precedence.

---

# Current Roles

The system currently supports:

```text
student
admin
```

Future role:

```text
super_admin
```

The system must be designed to support future role expansion.

---

# Student Role

## Description

Students are the primary users of the system.

Students can:

* Login using Google OAuth
* Create Lost Reports
* Edit Lost Reports before review
* Search Found Items
* View their own reports
* View notifications
* Manage their profile

Students cannot:

* Create Found Items
* Review reports
* Approve reports
* Reject reports
* Manage users
* Access audit logs
* Access admin dashboards
* View reports from other students

---

# Student Permissions

## Authentication

Allowed:

```text
Login
Logout
View Profile
Update Profile
```

Restricted:

```text
Create Admin Accounts
Modify Roles
```

---

## Lost Reports

Allowed:

```text
Create Lost Report
View Own Lost Reports
Edit Own Lost Reports
```

Condition:

```text
Editing allowed only before review
```

Editable statuses:

```text
DRAFT
SUBMITTED
NEEDS_REVISION
```

Read-only statuses:

```text
UNDER_REVIEW
APPROVED
REJECTED
CLOSED
```

---

## Found Items

Allowed:

```text
View Found Items
Search Found Items
Filter Found Items
```

Restricted:

```text
Create Found Items
Update Found Items
Delete Found Items
```

---

## Notifications

Allowed:

```text
View Notifications
Mark Notifications Read
```

Restricted:

```text
Delete System Notifications
```

---

# Admin Role

## Description

Admins manage Lost Reports and Found Items for a specific Reception.

Each Admin belongs to exactly one Reception.

Examples:

```text
Main Block Admin
Humanities Block Admin
Administrative Block Admin
```

---

# Admin Responsibilities

Admins are responsible for:

* Reviewing Lost Reports
* Creating Found Items
* Managing Found Items
* Verifying Ownership
* Marking Items Returned
* Managing Notifications
* Reviewing Audit Logs

---

# Admin Permissions

## Lost Reports

Allowed:

```text
View Submitted Reports
Review Reports
Approve Reports
Reject Reports
Request Revisions
Close Reports
```

Restricted:

```text
Delete Reports
```

---

## Found Items

Allowed:

```text
Create Found Item
Edit Found Item
Archive Found Item
Mark Returned
Mark Donated
Link Found Item
Transfer Found Item
```

---

## User Management

Allowed:

```text
View Users
View Student Profiles
```

Restricted:

```text
Delete Users
```

---

## Notifications

Allowed:

```text
Create Notifications
View Notifications
Mark Notifications Read
```

---

## Audit Logs

Allowed:

```text
View Audit Logs
Filter Audit Logs
Export Audit Logs
```

Restricted:

```text
Modify Audit Logs
Delete Audit Logs
```

Audit records are immutable.

---

# Reception Restrictions

Admins are restricted to their assigned Reception.

Example:

```text
Humanities Admin
```

Can:

```text
Manage Humanities Found Items
```

Cannot:

```text
Manage Main Block Items
Manage Administrative Block Items
```

---

# Reception Assignment

Every Admin record must contain:

```text
receptionId
```

Example:

```json
{
  "role": "admin",
  "receptionId": "humanities-block"
}
```

Authorization must enforce reception ownership.

---

# Future Super Admin Role

## Description

Not part of MVP.

The system should support it in the future.

Capabilities:

```text
Manage All Receptions
Manage All Admins
Manage All Users
View All Audit Logs
Access System Settings
```

---

# Permission Matrix

| Action                     | Student | Admin |
| -------------------------- | ------- | ----- |
| Login                      | ✅       | ✅     |
| Logout                     | ✅       | ✅     |
| View Profile               | ✅       | ✅     |
| Update Profile             | ✅       | ✅     |
| Create Lost Report         | ✅       | ✅     |
| Edit Own Lost Report       | ✅       | ✅     |
| View Own Lost Report       | ✅       | ✅     |
| View Other Student Reports | ❌       | ✅     |
| Review Reports             | ❌       | ✅     |
| Approve Reports            | ❌       | ✅     |
| Reject Reports             | ❌       | ✅     |
| Request Revisions          | ❌       | ✅     |
| Create Found Item          | ❌       | ✅     |
| Edit Found Item            | ❌       | ✅     |
| Mark Item Returned         | ❌       | ✅     |
| Mark Item Donated          | ❌       | ✅     |
| Link Found Item            | ❌       | ✅     |
| Search Found Items         | ✅       | ✅     |
| View Notifications         | ✅       | ✅     |
| Create Notifications       | ❌       | ✅     |
| View Audit Logs            | ❌       | ✅     |
| Export Audit Logs          | ❌       | ✅     |
| Create Admin Account       | ❌       | ❌     |
| Delete Audit Logs          | ❌       | ❌     |

---

# Ownership Rules

## Lost Reports

Owner:

```text
Student who created report
```

Permissions:

```text
View Own Report
Edit Own Report (before review)
```

---

## Found Items

Owner:

```text
Reception
```

Managed by:

```text
Assigned Reception Admins
```

---

# Security Rules

Students must never access:

```text
Admin APIs
Admin Dashboards
Audit Logs
Admin Notes
Internal Verification Data
```

Backend authorization is mandatory.

Do not rely solely on frontend role checks.

Every protected route must verify:

```text
Authentication
Authorization
Reception Ownership
```

---

# Account Statuses

Users may have:

```text
ACTIVE
SUSPENDED
DEACTIVATED
```

Rules:

ACTIVE

```text
Full Access
```

SUSPENDED

```text
Login Allowed
Actions Restricted
```

DEACTIVATED

```text
Login Denied
```

---

# Role Validation Rules

Roles must be stored in database.

Do not:

```text
Infer Roles
Hardcode Roles
Store Roles Only In Frontend
```

The backend is the source of truth for authorization.

---

# Development Rules

When implementing any feature:

1. Check USER_ROLES.md first.
2. Verify role permissions.
3. Verify reception ownership.
4. Implement backend authorization.
5. Implement frontend visibility rules.

Never expose unauthorized data to users.
