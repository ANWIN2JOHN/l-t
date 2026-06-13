# TESTING_STRATEGY.md

# Purpose

Defines testing requirements for the Campus Lost & Found Management System.

Testing is required before production deployment.

---

# Testing Levels

## Unit Tests

Test:

* Utilities
* Validation Logic
* Custom Hooks

---

## Integration Tests

Test:

* Supabase Queries
* Authentication
* Role Checks
* Notifications

---

## User Workflow Tests

Most important.

---

# Authentication Tests

Verify:

```text
Google Login Works
Allowed Domain Accepted
Other Domains Rejected
Logout Works
Session Persists
```

---

# Registration Tests

Verify:

```text
Valid Roll Number Accepted
Invalid Roll Number Rejected
Duplicate Roll Number Rejected
```

---

# Student Tests

Verify:

```text
Create Lost Report
Edit Lost Report
View Own Reports
View Found Items
Receive Notifications
```

---

# Admin Tests

Verify:

```text
Approve Report
Reject Report
Request Revision
Create Found Item
Match Found Item
Return Item
Donate Item
```

---

# RLS Tests

Critical.

Students must NOT:

```text
Read Other Student Reports
Read Other Student Notifications
Modify Found Items
Access Audit Logs
```

Admins must only:

```text
Manage Assigned Reception
```

---

# Search Tests

Verify:

```text
Keyword Search
Partial Search
Category Filter
Reception Filter
Pagination
```

---

# Notification Tests

Verify:

```text
Notification Created
Notification Delivered
Mark Read
Mark All Read
```

---

# Audit Tests

Verify:

```text
Create Audit Record
Audit Record Immutable
Audit Filters Work
```

---

# Responsive Tests

Required:

```text
Mobile
Tablet
Desktop
```

---

# Browser Tests

Verify:

```text
Chrome
Edge
Safari
```

---

# Pre-Deployment Checklist

Authentication:

```text
PASS
```

RLS:

```text
PASS
```

Lost Reports:

```text
PASS
```

Found Items:

```text
PASS
```

Notifications:

```text
PASS
```

Audit Logs:

```text
PASS
```

Search:

```text
PASS
```

Responsive Design:

```text
PASS
```

---

# MVP Success Criteria

System is production-ready only when:

```text
All Critical User Flows Pass
No RLS Violations Exist
No Authentication Bypass Exists
```

---

# Antigravity Rule

Before deployment:

Run all tests defined in this document.

Do not deploy with failed authentication or RLS tests.
