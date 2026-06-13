# AUDIT_LOG_RULES.md

# Audit Log Rules

## Purpose

This document defines all audit logging requirements for the Campus Lost & Found Management System.

Audit logs provide:

* Accountability
* Traceability
* Security Monitoring
* Administrative Oversight
* Historical Records

All critical system actions must be recorded.

Audit logging is mandatory.

---

# Audit Log Principles

The audit system must answer:

```text
Who performed the action?
What action was performed?
When was it performed?
Where was it performed?
Which record was affected?
```

Every log entry should provide enough information to reconstruct the event.

---

# Audit Log Collection

Collection:

```text
audit_logs
```

Reference:

```text
DATABASE_SCHEMA.md
```

---

# Audit Log Schema

```json
{
  "_id": "ObjectId",

  "action": "CREATE_FOUND_ITEM",

  "performedBy": "ObjectId",

  "receptionId": "ObjectId",

  "targetType": "found_item",

  "targetId": "ObjectId",

  "metadata": {},

  "createdAt": "Date"
}
```

---

# Mandatory Audit Fields

Every audit log must contain:

```text
Action
User
Timestamp
Target Type
Target Record
```

Optional:

```text
Reception
Metadata
```

---

# Audit Log Ownership

Audit logs belong to the system.

No user owns an audit log.

Audit logs are system records.

---

# Immutable Rule

Audit logs:

```text
Cannot Be Edited
Cannot Be Deleted
Cannot Be Modified
```

Under any circumstances.

Audit records are permanent.

---

# Who Can View Audit Logs

## Students

Students cannot:

```text
View Audit Logs
Search Audit Logs
Export Audit Logs
```

---

## Admins

Admins may:

```text
View Audit Logs
Search Audit Logs
Filter Audit Logs
Export Audit Logs
```

Subject to reception restrictions.

---

# Reception Restrictions

Admins may only view audit logs relevant to:

```text
Their Assigned Reception
```

Example:

Humanities Admin

Can view:

```text
Humanities Audit Logs
```

Cannot view:

```text
Main Block Logs
Administrative Block Logs
```

---

# Authentication Events

The following events must be logged.

## LOGIN

Example:

```json
{
  "action": "LOGIN"
}
```

---

## LOGOUT

Example:

```json
{
  "action": "LOGOUT"
}
```

---

## FAILED_LOGIN

Optional future enhancement.

```json
{
  "action": "FAILED_LOGIN"
}
```

---

# User Management Events

## CREATE_USER

Triggered when:

```text
New Student Registers
```

---

## CREATE_ADMIN

Triggered when:

```text
Admin Account Created
```

---

## UPDATE_USER

Triggered when:

```text
User Information Updated
```

---

## SUSPEND_USER

Triggered when:

```text
User Suspended
```

---

## DEACTIVATE_USER

Triggered when:

```text
User Deactivated
```

---

# Lost Report Events

## CREATE_LOST_REPORT

Triggered when:

```text
Student Creates Report
```

---

## UPDATE_LOST_REPORT

Triggered when:

```text
Report Updated
```

---

## APPROVE_REPORT

Triggered when:

```text
Admin Approves Report
```

---

## REJECT_REPORT

Triggered when:

```text
Admin Rejects Report
```

---

## REQUEST_REVISION

Triggered when:

```text
Admin Requests Revision
```

---

## CLOSE_REPORT

Triggered when:

```text
Admin Closes Report
```

---

# Found Item Events

## CREATE_FOUND_ITEM

Triggered when:

```text
Admin Creates Found Item
```

---

## UPDATE_FOUND_ITEM

Triggered when:

```text
Found Item Updated
```

---

## MATCH_FOUND_ITEM

Triggered when:

```text
Found Item Linked To Lost Report
```

---

## RETURN_ITEM

Triggered when:

```text
Item Returned To Owner
```

---

## DONATE_ITEM

Triggered when:

```text
Item Donated
```

---

## ARCHIVE_ITEM

Triggered when:

```text
Item Archived
```

---

# Reception Events

## TRANSFER_ITEM

Triggered when:

```text
Item Moved Between Receptions
```

Example:

```text
Main Block
↓
Humanities Block
```

---

# Notification Events

## CREATE_NOTIFICATION

Triggered when:

```text
System Notification Created
```

---

## READ_NOTIFICATION

Optional.

Triggered when:

```text
Notification Marked Read
```

---

# Metadata Rules

Metadata should contain useful context.

Example:

```json
{
  "action": "APPROVE_REPORT",
  "metadata": {
    "reportNumber": "LR-2026-0012"
  }
}
```

---

# Target Types

Allowed values:

```text
user
lost_report
found_item
notification
reception
roll_number
system
```

---

# Timestamp Rules

Every audit log must use:

```text
UTC Time
```

Store timestamps using:

```javascript
new Date()
```

---

# Audit Log Retention

Audit logs:

```text
Never Expire
Never Delete
```

Permanent retention.

---

# Search Requirements

Admins should be able to filter by:

```text
Action
User
Reception
Target Type
Date Range
```

---

# Export Requirements

Admins may export:

```text
CSV
Excel
```

Future enhancement.

Not required for MVP.

---

# Security Rules

Audit logs must never be:

```text
Editable
Client Controlled
Frontend Generated
```

Audit logs are generated only by backend services.

---

# Backend Logging Rules

Logging should occur:

```text
After Successful Action
```

Example:

```text
Create Found Item
↓
Database Success
↓
Create Audit Log
```

Not:

```text
Create Audit Log
↓
Database Fails
```

---

# Error Handling

Failure to create an audit log:

```text
Must Be Logged Internally
```

but should not corrupt the main operation.

Example:

```text
Found Item Created
Audit Log Failed
```

Item creation remains successful.

System should report audit failure internally.

---

# Dashboard Metrics

Audit logs may power:

```text
Recent Activity
Admin Activity
Reception Activity
System Statistics
```

---

# Development Rules

Before implementing logging:

Read:

```text
PROJECT_RULES.md
USER_ROLES.md
RECEPTION_MODEL.md
DATABASE_SCHEMA.md
```

All critical business actions must generate audit logs.

If an action changes system state, it should probably be audited.

When in doubt:

```text
Log The Action
```
