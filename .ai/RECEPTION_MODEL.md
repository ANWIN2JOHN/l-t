# RECEPTION_MODEL.md

# Reception Model

## Purpose

This document defines how Receptions function within the Campus Lost & Found Management System.

Receptions are the physical locations where found items are stored, managed, verified, released, and tracked.

Reception ownership is a core business rule and must be enforced throughout the application.

---

# Business Concept

A Reception represents a physical Lost & Found office within Kristu Jayanti College.

Every Found Item belongs to a Reception.

Every Admin belongs to a Reception.

Receptions determine:

* Item Storage
* Item Management
* Item Release
* Admin Responsibility
* Audit Ownership

---

# Supported Receptions

Current Reception Locations:

```text
Main Block
Humanities Block
Administrative Block
```

These receptions are managed as database records.

Do not hardcode reception names throughout the application.

Use database references.

---

# Reception Responsibilities

A Reception is responsible for:

* Receiving Found Items
* Storing Found Items
* Managing Found Items
* Releasing Found Items
* Verifying Ownership
* Recording Item Returns
* Recording Donations

---

# Reception Collection

## Collection Name

```text
receptions
```

---

## Schema

```json
{
  "_id": "...",
  "name": "Main Block",
  "description": "Main reception area",
  "location": "Main Block Building",
  "contactEmail": "mainreception@kristujayanti.com",
  "contactPhone": "+91xxxxxxxxxx",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

# Reception Rules

## Rule 1

Every Found Item must belong to exactly one Reception.

Example:

```json
{
  "title": "Black Wallet",
  "receptionId": "humanities-block"
}
```

---

## Rule 2

Every Admin must belong to exactly one Reception.

Example:

```json
{
  "name": "Reception Admin",
  "role": "admin",
  "receptionId": "main-block"
}
```

---

## Rule 3

Students are not assigned to Receptions.

Students may interact with any public Found Item.

---

# Reception Ownership

Reception ownership determines:

```text
Who Can Create Items
Who Can Edit Items
Who Can Return Items
Who Can Donate Items
Who Can Transfer Items
```

---

# Admin Ownership Rules

## Example

Humanities Admin:

```json
{
  "role": "admin",
  "receptionId": "humanities-block"
}
```

Can manage:

```text
Humanities Found Items
```

Cannot manage:

```text
Main Block Found Items
Administrative Block Found Items
```

---

# Found Item Ownership

Every Found Item must contain:

```json
{
  "receptionId": "...",
  "createdBy": "...",
  "status": "AVAILABLE"
}
```

The Reception becomes the owner of that item.

---

# Reception Dashboard

Each Reception should have access to its own statistics.

Examples:

```text
Available Items
Returned Items
Expired Items
Donated Items
Pending Matches
```

---

# Reception Statistics

Track:

```text
Items Received
Items Returned
Items Donated
Average Storage Time
Pending Items
```

These metrics may appear in Admin dashboards.

---

# Storage Tracking

Found Items may include storage location information.

Example:

```json
{
  "storageLocation": {
    "cabinet": "A",
    "shelf": "2"
  }
}
```

Examples:

```text
Cabinet A
Cabinet B
Shelf 1
Shelf 2
Counter Storage
```

This helps staff physically locate items.

---

# Found Item Lifecycle

Reception controls the item lifecycle.

Workflow:

```text
AVAILABLE
↓
MATCHED
↓
RETURNED
```

or

```text
AVAILABLE
↓
EXPIRED
↓
DONATED
↓
ARCHIVED
```

---

# Item Transfers

An item may occasionally move between Receptions.

Example:

```text
Main Block
↓
Humanities Block
```

Transfers must be tracked.

---

# Transfer Workflow

```text
Transfer Requested
↓
Transfer Approved
↓
Reception Updated
↓
Audit Log Created
```

---

# Transfer Audit Event

Example:

```json
{
  "action": "TRANSFER_ITEM",
  "itemId": "...",
  "fromReception": "main-block",
  "toReception": "humanities-block",
  "performedBy": "...",
  "timestamp": "..."
}
```

---

# Reception Contact Information

Each Reception should store:

```text
Name
Location
Phone Number
Email Address
```

Students may use this information when collecting items.

---

# Public Visibility

Students may see:

```text
Reception Name
Reception Location
Reception Contact Information
```

Students may not see:

```text
Internal Notes
Admin Assignments
Audit Logs
```

---

# Reception Search Filters

Students may filter Found Items by:

```text
Reception
```

Examples:

```text
Main Block
Humanities Block
Administrative Block
```

---

# Notification Ownership

Notifications should include Reception context when relevant.

Example:

```text
New Found Item Added
Reception:
Humanities Block
```

---

# Audit Logging Requirements

Every Reception-related action must create an audit log.

Examples:

```text
CREATE_FOUND_ITEM
UPDATE_FOUND_ITEM
RETURN_ITEM
DONATE_ITEM
TRANSFER_ITEM
```

Audit logs must include:

```text
Reception
User
Timestamp
Action
```

---

# Future Expansion

The system should support adding new Receptions without code changes.

Future examples:

```text
Library Reception
Hostel Reception
Sports Complex Reception
```

Only database configuration should be required.

---

# Development Rules

When implementing Found Items:

1. Every Found Item requires a Reception.
2. Every Admin requires a Reception.
3. Reception ownership must be validated on backend.
4. Reception ownership must not rely solely on frontend checks.
5. All Reception actions must generate audit logs.

Reception ownership is a core business rule and must be enforced across the entire system.
