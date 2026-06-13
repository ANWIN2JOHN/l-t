# SUPABASE_SQL_SETUP.md

# Purpose

This file contains the SQL required to initialize the Campus Lost & Found database inside Supabase.

Run scripts in order.

---

# Enable Extensions

```sql
create extension if not exists pgcrypto;
```

---

# Updated At Trigger

```sql
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

---

# Receptions Table

```sql
create table public.receptions (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,

  description text,

  location text,

  contact_email text,

  contact_phone text,

  is_active boolean default true,

  created_at timestamptz default now()
);
```

---

# Profiles Table

```sql
create table public.profiles (

  id uuid primary key references auth.users(id) on delete cascade,

  email text unique not null,

  full_name text,

  roll_number text unique,

  role text not null default 'student',

  reception_id uuid references public.receptions(id),

  account_status text default 'ACTIVE',

  created_at timestamptz default now(),

  updated_at timestamptz default now()
);
```

---

# Lost Reports

```sql
create table public.lost_reports (

  id uuid primary key default gen_random_uuid(),

  student_id uuid references public.profiles(id),

  title text not null,

  category text not null,

  location_lost text not null,

  date_lost date not null,

  description text not null,

  contact_information text not null,

  unique_identifiers text,

  status text default 'SUBMITTED',

  admin_notes text,

  reviewed_by uuid references public.profiles(id),

  reviewed_at timestamptz,

  linked_found_item_id uuid,

  created_at timestamptz default now(),

  updated_at timestamptz default now()
);
```

---

# Found Items

```sql
create table public.found_items (

  id uuid primary key default gen_random_uuid(),

  title text not null,

  category text not null,

  description text not null,

  location_found text not null,

  date_found date not null,

  reception_id uuid references public.receptions(id),

  status text default 'AVAILABLE',

  linked_lost_report_id uuid,

  created_by uuid references public.profiles(id),

  returned_by uuid references public.profiles(id),

  returned_at timestamptz,

  expires_at timestamptz,

  created_at timestamptz default now(),

  updated_at timestamptz default now()
);
```

---

# Notifications

```sql
create table public.notifications (

  id uuid primary key default gen_random_uuid(),

  user_id uuid references public.profiles(id),

  type text not null,

  title text not null,

  message text not null,

  is_read boolean default false,

  created_at timestamptz default now()
);
```

---

# Audit Logs

```sql
create table public.audit_logs (

  id uuid primary key default gen_random_uuid(),

  action text not null,

  performed_by uuid references public.profiles(id),

  reception_id uuid references public.receptions(id),

  target_type text not null,

  target_id uuid,

  metadata jsonb default '{}',

  created_at timestamptz default now()
);
```

---

# Valid Roll Numbers

```sql
create table public.valid_roll_numbers (

  id uuid primary key default gen_random_uuid(),

  roll_number text unique not null,

  is_used boolean default false,

  is_active boolean default true,

  created_at timestamptz default now()
);
```

---

# Foreign Key Updates

```sql
alter table public.lost_reports
add constraint fk_lost_found
foreign key (linked_found_item_id)
references public.found_items(id);
```

```sql
alter table public.found_items
add constraint fk_found_lost
foreign key (linked_lost_report_id)
references public.lost_reports(id);
```

---

# Indexes

## Profiles

```sql
create index idx_profiles_role
on public.profiles(role);

create index idx_profiles_reception
on public.profiles(reception_id);
```

---

## Lost Reports

```sql
create index idx_lost_reports_student
on public.lost_reports(student_id);

create index idx_lost_reports_status
on public.lost_reports(status);

create index idx_lost_reports_created
on public.lost_reports(created_at desc);
```

---

## Found Items

```sql
create index idx_found_items_status
on public.found_items(status);

create index idx_found_items_reception
on public.found_items(reception_id);

create index idx_found_items_created
on public.found_items(created_at desc);
```

---

## Notifications

```sql
create index idx_notifications_user
on public.notifications(user_id);

create index idx_notifications_read
on public.notifications(is_read);
```

---

## Audit Logs

```sql
create index idx_audit_logs_action
on public.audit_logs(action);

create index idx_audit_logs_created
on public.audit_logs(created_at desc);
```

---

# Full Text Search

Lost Reports

```sql
alter table public.lost_reports
add column search_vector tsvector;
```

```sql
create index idx_lost_reports_search
on public.lost_reports
using gin(search_vector);
```

---

Found Items

```sql
alter table public.found_items
add column search_vector tsvector;
```

```sql
create index idx_found_items_search
on public.found_items
using gin(search_vector);
```

---

# Updated At Triggers

Profiles

```sql
create trigger profiles_updated_at
before update
on public.profiles
for each row
execute function public.handle_updated_at();
```

---

Lost Reports

```sql
create trigger lost_reports_updated_at
before update
on public.lost_reports
for each row
execute function public.handle_updated_at();
```

---

Found Items

```sql
create trigger found_items_updated_at
before update
on public.found_items
for each row
execute function public.handle_updated_at();
```

---

# Seed Receptions

```sql
insert into public.receptions
(name, location)
values

('Main Block', 'Main Block'),

('Humanities Block', 'Humanities Block'),

('Administrative Block', 'Administrative Block');
```

---

# Enable RLS

```sql
alter table public.profiles enable row level security;

alter table public.receptions enable row level security;

alter table public.lost_reports enable row level security;

alter table public.found_items enable row level security;

alter table public.notifications enable row level security;

alter table public.audit_logs enable row level security;

alter table public.valid_roll_numbers enable row level security;
```

---

# Authentication Trigger

Automatically create profile after Google login.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin

insert into public.profiles (
  id,
  email,
  role
)
values (
  new.id,
  new.email,
  'student'
);

return new;

end;
$$;
```

---

```sql
create trigger on_auth_user_created
after insert
on auth.users
for each row
execute procedure public.handle_new_user();
```

---

# Development Rule

After executing this file:

1. Execute SUPABASE_RLS.md policies.
2. Configure Google OAuth.
3. Import valid roll numbers.
4. Create first admin account.
5. Begin Authentication Phase.
