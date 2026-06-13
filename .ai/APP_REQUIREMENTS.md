# APP_REQUIREMENTS.md

# Campus Lost & Found Management System

## Project Overview

The Campus Lost & Found Management System is a web-based platform designed for Kristu Jayanti College to manage lost and found items across multiple reception locations.

The system allows students to report lost items, search for publicly available found items, receive notifications, and recover belongings through a physical verification process.

The system also allows reception administrators to review reports, manage found items, verify ownership, and maintain audit records.

---

# Business Objectives

The system must:

* Provide a centralized lost and found platform.
* Improve item recovery rates.
* Reduce manual paperwork.
* Improve accountability.
* Protect student privacy.
* Support multiple reception locations.
* Maintain complete audit trails.
* Support future expansion.

---

# Supported Receptions

The system currently supports:

1. Main Block
2. Humanities Block
3. Administrative Block

Every Found Item belongs to one Reception.

Every Admin belongs to one Reception.

---

# User Types

## Student

Students can:

* Login using Google OAuth
* Create Lost Reports
* Edit Lost Reports before review
* Search Found Items
* View their own reports
* Receive notifications
* View their profile

Students cannot:

* Create Found Items
* View other students' reports
* Access admin features
* View audit logs

---

## Admin

Admins can:

* Review Lost Reports
* Approve Lost Reports
* Reject Lost Reports
* Request revisions
* Create Found Items
* Edit Found Items
* Link Found Items to Lost Reports
* Mark items as Returned
* Mark items as Donated
* View audit logs
* Manage notifications
* Manage users within system permissions

Admins are assigned to a Reception.

---

# Authentication Requirements

Authentication Method:

Google OAuth

Allowed Email Domain:

```text
@kristujayanti.com
```

Users with any other email domain must be denied access.

---

# Registration Flow

First-time user workflow:

```text
Google Login
↓
Validate Email Domain
↓
Enter Roll Number
↓
Validate Roll Number
↓
Create Account
↓
Dashboard
```

Returning users:

```text
Google Login
↓
Dashboard
```

---

# Roll Number Validation

The university maintains an official roll number database.

Requirements:

* Roll Number must exist in system records.
* Roll Number must be unique.
* Roll Number is required.
* Invalid roll numbers must be rejected.

---

# Student Profile Requirements

Required fields:

* Full Name
* University Email
* Roll Number
* Role
* Account Status

Optional fields:

* Phone Number
* Department (future use)

---

# Lost Report Workflow

## Create Report

Student creates a Lost Report.

Required fields:

* Title
* Category
* Location Lost
* Date Lost
* Description
* Contact Information

Optional fields:

* Unique Identifiers

Examples:

* Laptop stickers
* Wallet contents
* Special markings
* Device serial references

---

## Edit Report

Students may edit reports only while:

```text
DRAFT
SUBMITTED
```

Once reviewed by an Admin:

```text
UNDER_REVIEW
APPROVED
REJECTED
```

Student editing is disabled.

---

## Lost Report Statuses

```text
DRAFT
SUBMITTED
UNDER_REVIEW
NEEDS_REVISION
APPROVED
REJECTED
CLOSED
```

---

# Lost Report Review Workflow

```text
Student Submits Report
↓
Admin Reviews
↓
Decision
```

Possible outcomes:

### Approved

```text
APPROVED
```

Student notified.

### Needs Revision

```text
NEEDS_REVISION
```

Student updates report.

### Rejected

```text
REJECTED
```

Reason required.

Student notified.

---

# Found Item Workflow

Only Admins may create Found Items.

Students cannot create Found Items.

---

## Create Found Item

Required fields:

* Title
* Category
* Description
* Reception
* Date Found

Optional fields:

* Storage Location
* Admin Notes

---

# Found Item Statuses

```text
AVAILABLE
MATCHED
RETURNED
EXPIRED
DONATED
ARCHIVED
```

---

# Found Item Visibility

Publicly visible:

* Title
* Category
* Description
* Reception
* Date Found
* Status

Private:

* Admin Notes
* Audit Information

---

# Item Matching Workflow

Matching is manual.

No AI matching is required.

Admins may:

```text
Link Found Item
↓
Lost Report
```

Example:

```text
Found Item #FI-2026-0012

Linked To

Lost Report #LR-2026-0007
```

Status becomes:

```text
MATCHED
```

---

# Claim Process

Claims are not handled online.

Claim workflow:

```text
Student Finds Match
↓
Visits Reception
↓
Identity Verification
↓
Ownership Verification
↓
Item Released
↓
Marked Returned
```

Verification may include:

* Student ID Card
* Roll Number
* Item Description
* Unique Identifiers

---

# Search Requirements

Students may search:

* Public Found Items

Students may not search:

* Other students' Lost Reports

Search features:

* Keyword Search
* Category Filter
* Reception Filter
* Status Filter
* Date Filter

Search implementation:

MongoDB Atlas Search

Requirements:

* Fuzzy Search
* Partial Match Support
* Typo Tolerance

---

# Notifications

Notification method:

In-App Notifications

---

## Student Notifications

* Report Approved
* Report Rejected
* Report Updated
* Report Closed

---

## Admin Notifications

* New User Registered
* New Lost Report Submitted
* Item Returned
* Item Donated

---

# Audit Logging Requirements

The system must record:

* Login
* Logout
* Create Report
* Update Report
* Approve Report
* Reject Report
* Create Found Item
* Update Found Item
* Link Found Item
* Return Item
* Donate Item
* Transfer Item

Audit records must be immutable.

---

# Expiration Policy

Found Items expire after:

```text
60 Days
```

Workflow:

```text
AVAILABLE
↓
EXPIRED
↓
DONATED
↓
ARCHIVED
```

All actions must be logged.

---

# Privacy Requirements

Students may only view:

* Their own Lost Reports
* Public Found Items

Students may not view:

* Other students' reports
* Admin Notes
* Audit Logs
* Internal verification information

---

# Mobile Requirements

The application must support:

* Mobile Devices
* Tablets
* Desktop Devices

Student workflows must be mobile-friendly.

---

# Theme Requirements

Required themes:

* Light Mode
* Dark Mode

All screens must support both themes.

---

# Performance Requirements

The system should:

* Load quickly on mobile networks.
* Support fuzzy search efficiently.
* Scale to multiple years of records.
* Maintain responsive interactions.

---

# Future Features (Not MVP)

Do not implement unless requested:

* Mobile Apps
* AI Matching
* QR Codes
* Push Notifications
* Email Notifications
* Multi-Campus Support

The MVP should focus on reliable Lost & Found management only.
