# SUPABASE_RLS.md

# Row Level Security Rules

## profiles

### Student

Can:

```text
Read Own Profile
Update Own Profile
```

Cannot:

```text
Read Other Profiles
Change Role
```

---

### Admin

Can:

```text
Read Student Profiles
```

Cannot:

```text
Modify Roles
```

---

# lost_reports

## Students

Can:

```text
Create Own Reports
Read Own Reports
Edit Own Reports
```

Only while status:

```text
SUBMITTED
NEEDS_REVISION
```

Cannot:

```text
View Other Students' Reports
```

---

## Admins

Can:

```text
Read All Reports
Approve
Reject
Request Revision
Close
```

---

# found_items

## Students

Can:

```text
Read Public Found Items
```

Cannot:

```text
Create
Update
Delete
```

---

## Admins

Can:

```text
Create Found Items
Update Found Items
Return Items
Donate Items
Transfer Items
```

Only for:

```text
Their Reception
```

---

# notifications

Users can:

```text
Read Own Notifications
Update Own Notifications
```

Cannot:

```text
Read Others
```

---

# audit_logs

Students:

```text
No Access
```

Admins:

```text
Read Only
```

No updates.

No deletes.

---

# receptions

Students:

```text
Read Only
```

Admins:

```text
Read Only
```

Only super admins may manage receptions.
