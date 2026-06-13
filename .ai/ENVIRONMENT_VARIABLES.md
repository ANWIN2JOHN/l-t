# ENVIRONMENT_VARIABLES.md

# Purpose

Defines all environment variables used by the Campus Lost & Found Management System.

Never hardcode secrets.

---

# Frontend Environment Variables

File:

```text
.env.local
```

Required:

```env
VITE_SUPABASE_URL=

VITE_SUPABASE_ANON_KEY=
```

Example:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co

VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

# Usage

Create client:

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

# Git Rules

Never commit:

```text
.env
.env.local
.env.production
```

---

# Git Ignore

Required:

```gitignore
.env
.env.local
.env.production
```

---

# Production Environment

Configure variables inside:

```text
Vercel Project Settings
```

Do not store production keys in repository.

---

# Secrets

Never expose:

```text
Service Role Key
Database Password
```

Frontend must only use:

```text
Anon Key
```

---

# Future Variables

Possible additions:

```env
VITE_APP_NAME=

VITE_APP_VERSION=
```

---

# Validation Rule

Application startup should fail if:

```text
VITE_SUPABASE_URL missing
VITE_SUPABASE_ANON_KEY missing
```

to prevent invalid deployments.
