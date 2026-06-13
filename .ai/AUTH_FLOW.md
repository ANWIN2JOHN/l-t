# AUTH_FLOW.md

# Authentication & Authorization Flow

## Purpose

This document defines:

* Authentication
* Registration
* User Verification
* Authorization
* Session Management
* Route Protection

for the Campus Lost & Found Management System.

All frontend and backend authentication logic must follow this document.

---

# Authentication Method

Authentication Provider:

```text
Google OAuth 2.0
```

The system does not support:

* Username Login
* Password Login
* Email Verification Codes
* Password Reset
* Magic Links

Google OAuth is the only authentication method.

---

# Allowed Email Domains

Only university accounts are allowed.

Valid domain:

```text
@kristujayanti.com
```

Examples:

```text
student@kristujayanti.com
admin@kristujayanti.com
```

Rejected:

```text
student@gmail.com
user@yahoo.com
test@hotmail.com
```

Users with invalid domains must not be allowed to register or login.

---

# Authentication Workflow

## New User Flow

```text
User Clicks Login
↓
Google OAuth
↓
Google Returns User Data
↓
Validate Email Domain
↓
Check Existing Account
↓
Account Not Found
↓
Prompt Roll Number
↓
Validate Roll Number
↓
Create Account
↓
Generate Session
↓
Redirect Dashboard
```

---

# Existing User Flow

```text
User Clicks Login
↓
Google OAuth
↓
Validate Email Domain
↓
Find Existing Account
↓
Generate Session
↓
Redirect Dashboard
```

---

# Roll Number Validation

## Purpose

Prevent unauthorized registrations.

The university maintains an official roll number database.

Registration is allowed only when:

```text
Roll Number Exists
AND
Roll Number Is Active
AND
Roll Number Is Unused
```

---

# Validation Workflow

```text
Google Login
↓
Enter Roll Number
↓
Check valid_roll_numbers Collection
↓
Exists?
↓
YES
↓
Create Account

NO
↓
Reject Registration
```

---

# Roll Number Rules

Requirements:

```text
Required
Unique
Case Insensitive
Indexed
```

Examples:

```text
23MCA001
23BCA023
22MBA014
```

Roll Numbers cannot be modified after registration.

Only administrators may change them.

---

# User Account Creation

## Required Fields

```text
Google ID
Full Name
University Email
Roll Number
Role
Account Status
```

Example:

```json
{
  "googleId": "123456789",
  "name": "John Doe",
  "email": "john@kristujayanti.com",
  "rollNumber": "23MCA001",
  "role": "student",
  "accountStatus": "ACTIVE"
}
```

---

# Account Statuses

## ACTIVE

```text
Full Access
```

Allowed:

* Login
* Create Reports
* Search Items
* Receive Notifications

---

## SUSPENDED

```text
Restricted Access
```

Allowed:

* Login

Restricted:

* Create Reports
* Update Reports
* Submit Actions

---

## DEACTIVATED

```text
Access Denied
```

User cannot login.

---

# Session Management

Authentication must be session-based.

Preferred:

```text
JWT
+
HttpOnly Cookies
```

Avoid:

```text
localStorage Tokens
sessionStorage Tokens
```

for authentication storage.

---

# Session Workflow

```text
Login
↓
Generate JWT
↓
Store HttpOnly Cookie
↓
Access Protected Routes
```

Logout:

```text
Logout
↓
Clear Cookie
↓
Destroy Session
```

---

# JWT Requirements

JWT payload:

```json
{
  "userId": "...",
  "role": "student",
  "receptionId": null
}
```

Admin example:

```json
{
  "userId": "...",
  "role": "admin",
  "receptionId": "humanities-block"
}
```

---

# Authorization Model

Authentication:

```text
Who Are You?
```

Authorization:

```text
What Are You Allowed To Do?
```

Every protected route must validate both.

---

# Role-Based Authorization

Current Roles:

```text
student
admin
```

Future:

```text
super_admin
```

Role permissions are defined in:

```text
USER_ROLES.md
```

---

# Reception-Based Authorization

Admins belong to a Reception.

Example:

```json
{
  "role": "admin",
  "receptionId": "main-block"
}
```

Rules:

Admins may manage only their assigned Reception.

---

# Route Protection

## Public Routes

```text
/
/login
/auth/google
/auth/callback
```

---

## Student Routes

Authentication Required:

```text
/dashboard
/my-reports
/found-items
/notifications
/profile
```

---

## Admin Routes

Admin Only:

```text
/admindashboard
/admin/lost-reports
/admin/found-items
/admin/users
/admin/notifications
/admin/audit-logs
```

---

# API Protection

Every protected API must:

```text
Verify JWT
Verify User Exists
Verify Account Status
Verify Permissions
Verify Reception Ownership
```

Never trust frontend role checks.

---

# Google OAuth Requirements

Google returns:

```text
Google ID
Name
Email
Profile Picture
```

Store:

```text
Google ID
Name
Email
```

Profile picture storage is optional.

---

# Login Audit Logs

Every login must generate:

```text
LOGIN
```

Audit event.

Every logout should generate:

```text
LOGOUT
```

Audit event.

---

# Authentication Errors

## Invalid Domain

Message:

```text
Only Kristu Jayanti College accounts are allowed.
```

---

## Invalid Roll Number

Message:

```text
Roll Number not found.
Please contact administration.
```

---

## Account Suspended

Message:

```text
Your account has been suspended.
Please contact administration.
```

---

## Account Deactivated

Message:

```text
Your account has been deactivated.
Please contact administration.
```

---

# Security Rules

Never trust:

```text
Frontend Role
Frontend User ID
Frontend Reception ID
```

Always validate on backend.

---

# Password Rules

No passwords exist in the system.

Do not:

```text
Store Passwords
Implement Password Reset
Implement Password Change
Implement Password Login
```

Google OAuth is the only authentication provider.

---

# Future Authentication Support

Potential future additions:

```text
Microsoft OAuth
University SSO
LDAP
```

Do not implement now.

System architecture should remain extensible.

---

# Development Rules

Before implementing authentication:

Read:

```text
PROJECT_RULES.md
USER_ROLES.md
APP_REQUIREMENTS.md
```

Authentication logic must never bypass:

* Domain Validation
* Roll Number Validation
* Account Status Checks
* Role Authorization
* Reception Authorization

These checks are mandatory for every protected request.
