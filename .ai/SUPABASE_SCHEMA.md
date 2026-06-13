# SUPABASE_SCHEMA.md

# Database Tables

## profiles

```sql
id uuid primary key references auth.users(id)

email text unique

full_name text

roll_number text unique

role text

reception_id uuid

account_status text

created_at timestamptz

updated_at timestamptz
```

Roles:

```text
student
admin
super_admin
```

---

## receptions

```sql
id uuid primary key

name text unique

description text

location text

contact_email text

contact_phone text

is_active boolean

created_at timestamptz
```

Default Records:

```text
Main Block
Humanities Block
Administrative Block
```

---

## lost_reports

```sql
id uuid primary key

student_id uuid

title text

category text

location_lost text

date_lost date

description text

contact_information text

unique_identifiers text

status text

admin_notes text

reviewed_by uuid

reviewed_at timestamptz

linked_found_item_id uuid

created_at timestamptz

updated_at timestamptz
```

Status:

```text
SUBMITTED
UNDER_REVIEW
NEEDS_REVISION
APPROVED
REJECTED
CLOSED
```

---

## found_items

```sql
id uuid primary key

title text

category text

description text

location_found text

date_found date

reception_id uuid

status text

linked_lost_report_id uuid

created_by uuid

returned_by uuid

returned_at timestamptz

expires_at timestamptz

created_at timestamptz
```

Status:

```text
AVAILABLE
MATCHED
RETURNED
EXPIRED
DONATED
ARCHIVED
```

---

## notifications

```sql
id uuid primary key

user_id uuid

type text

title text

message text

is_read boolean

created_at timestamptz
```

---

## audit_logs

```sql
id uuid primary key

action text

performed_by uuid

reception_id uuid

target_type text

target_id uuid

metadata jsonb

created_at timestamptz
```

---

## valid_roll_numbers

```sql
id uuid primary key

roll_number text unique

is_used boolean

is_active boolean

created_at timestamptz
```
