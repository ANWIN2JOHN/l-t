# PROJECT_RULES.md

## Project Name

Campus Lost & Found Management System

---

# Project Purpose

The Campus Lost & Found Management System is a production-ready web application for managing lost and found items across multiple reception locations within Kristu Jayanti College.

The system must provide secure reporting, searching, tracking, and administration of lost and found items while maintaining privacy, accountability, and auditability.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite
* React Router

## Backend

* Express.js
* Node.js
* Mongoose

## Database

* MongoDB Atlas

## Authentication

* Google OAuth

## Hosting

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

---

# Development Philosophy

The objective is to build a maintainable, scalable, and production-ready system.

Priorities:

1. Correct Business Logic
2. Security
3. Maintainability
4. User Experience
5. Performance
6. Code Elegance

Do not sacrifice business requirements for code simplicity.

---

# Core Rules

## Rule 1

Implement only documented requirements.

Do not invent features.

Do not introduce speculative functionality.

---

## Rule 2

Follow APP_REQUIREMENTS.md.

If uncertainty exists, APP_REQUIREMENTS.md is the source of truth.

---

## Rule 3

Follow USER_ROLES.md for permissions.

Never bypass role restrictions.

---

## Rule 4

Follow UI_GUARDRAILS.md.

Do not redesign the interface.

Do not introduce alternative UI patterns.

---

# Authentication Rules

Authentication is Google OAuth only.

Do not implement:

* Username login
* Password login
* Password reset
* Email verification workflows

Allowed email domain:

```text
@kristujayanti.com
```

Users with other domains must be rejected.

---

# Registration Rules

First-time users:

```text
Google Login
↓
Domain Validation
↓
Roll Number Entry
↓
Roll Number Verification
↓
Account Creation
```

Account creation is not allowed without a valid roll number.

---

# User Roles

Current roles:

```text
student
admin
```

Future role:

```text
super_admin
```

Design the system to support future expansion.

---

# Reception Model

Reception locations:

```text
Main Block
Humanities Block
Administrative Block
```

Rules:

* Every Found Item belongs to exactly one Reception.
* Every Admin belongs to exactly one Reception.
* Reception ownership must be enforced.

Do not hardcode reception names in business logic.

Use database records.

---

# Lost Report Rules

Students can:

* Create Lost Reports
* Edit Lost Reports until reviewed
* View their own reports

Students cannot:

* View reports from other students

Lost Reports require:

* Title
* Category
* Location Lost
* Date Lost
* Description
* Contact Information

Optional:

* Unique Identifiers

---

# Found Item Rules

Only Admins can create Found Items.

Students cannot create Found Items.

Found Items must include:

* Title
* Category
* Description
* Reception
* Date Found
* Status

---

# Claim Rules

Claims are physical only.

Do not implement online claiming.

Students must visit the reception physically.

Ownership verification is handled by Admins.

---

# Search Rules

Students may search:

* Public Found Items

Students may not search:

* Other students' Lost Reports

Search must support:

* Keyword Search
* Category Filters
* Reception Filters
* Fuzzy Matching

Use MongoDB Atlas Search.

Avoid regex-based search implementations.

---

# Notification Rules

Notification delivery method:

* In-App Notifications

Do not implement:

* Email Notifications
* SMS Notifications
* Push Notifications

Student notifications:

* Report Approved
* Report Rejected
* Report Updated
* Report Closed

Admin notifications:

* New User Registered
* New Lost Report Submitted
* Item Returned

---

# Audit Log Rules

Audit logging is mandatory.

Track:

* Login
* Create Report
* Update Report
* Approve Report
* Reject Report
* Create Found Item
* Update Found Item
* Return Item
* Donate Item
* Transfer Item

Audit logs must never be editable by students.

---

# Item Lifecycle Rules

Lost Reports:

```text
DRAFT
SUBMITTED
UNDER_REVIEW
NEEDS_REVISION
APPROVED
REJECTED
CLOSED
```

Found Items:

```text
AVAILABLE
MATCHED
RETURNED
EXPIRED
DONATED
ARCHIVED
```

---

# Expiration Rules

Found Items expire after:

```text
60 Days
```

Expired items may be donated.

Donation actions must be logged.

---

# Data Protection Rules

Never permanently delete:

* Users
* Lost Reports
* Found Items

Use:

```text
isArchived
```

for archival.

Maintain historical records.

---

# Mobile Responsiveness

The application must support:

* Mobile Devices
* Tablets
* Desktop Devices

Student experience is mobile-first.

Admin experience is desktop-first.

---

# Dark Mode

Dark Mode is required.

Every new component must support:

* Light Theme
* Dark Theme

Do not postpone Dark Mode implementation.

---

# Security Rules

Use:

* JWT Authentication
* Protected Routes
* Role-Based Authorization

Never trust frontend validation alone.

Validate all data on the backend.

---

# API Rules

Use REST APIs.

API responses must follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

or

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# Database Rules

Use MongoDB Atlas.

Use Mongoose Models.

Create indexes for:

* email
* rollNumber
* status
* receptionId
* createdAt

Avoid unnecessary collections.

---

# Deployment Rules

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

Never hardcode environment variables.

Always use environment configuration files.

---

# Development Workflow

Development phases:

1. Authentication
2. User Management
3. Lost Reports
4. Found Items
5. Search
6. Notifications
7. Audit Logs
8. Dashboards
9. Optimization

Complete one phase before starting the next.

---

# Antigravity Instructions

Before implementing any feature:

Read:

* PROJECT_RULES.md
* APP_REQUIREMENTS.md
* USER_ROLES.md
* UI_GUARDRAILS.md

These files override default assumptions.

Do not redesign.

Do not invent features.

Implement only documented requirements.
