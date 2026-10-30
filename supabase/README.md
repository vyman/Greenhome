# Supabase database setup

## Files

- `migrations/202506180001_phase1_core.sql` — profiles, feature flags, customers, sites, inspections, measurements, quotations, progress, files, reports, audit records, RLS, and private storage.
- `migrations/202506180002_phase1_operations_finance.sql` — inventory, labour, expense claims, invoices, payments, balance views, validation triggers, and RLS.
- `migrations/202506180003_add_extended_roles.sql` — UltraTech Technical Executive and Labour / Field Worker roles.
- `migrations/202506180004_extended_role_access.sql` — site and self-service access policies for the additional roles.
- `seed.sql` — repeatable sample data and feature flag defaults.

## Authentication users

Create these users in Supabase Authentication before running the seed:

| Email | Temporary password | Application role |
| --- | --- | --- |
| `admin@gmail.com` | `test123` | Owner / Admin |
| `super@gmail.com` | `test123` | Site Supervisor |

The migration creates a profile automatically for every new Auth user. The seed promotes the two emails above to their intended roles. Change both passwords before production.

## Apply with the Supabase CLI

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db seed
```

Alternatively, run the migration files in timestamp order using the Supabase SQL Editor, then run `seed.sql`.

## Feature rollout defaults

The seed enables only site-related activity:

```text
site_activity       = true
operations          = false
finance_reporting   = false
```

Feature flags control interface availability. RLS policies remain the security boundary.

## Storage convention

Private site files use the `site-files` bucket and must be stored under a site UUID:

```text
<site-uuid>/<category>/<filename>
```

For example:

```text
20000000-0000-4000-8000-000000000001/inspection/photo-01.jpg
```
