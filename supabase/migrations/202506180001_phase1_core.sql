-- Green Home Building Solutions
-- Phase 1 core: authentication profiles, feature flags, customers, sites,
-- inspections, measurements, quotations, progress, files, reports, and audit.

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'owner_admin',
  'office_staff',
  'site_supervisor',
  'store_staff'
);

create type public.site_status as enum (
  'new_enquiry',
  'visit_scheduled',
  'inspection_completed',
  'quotation_pending',
  'quotation_sent',
  'follow_up_pending',
  'approved_won',
  'work_scheduled',
  'ongoing',
  'on_hold',
  'completed',
  'cancelled'
);

create type public.inspection_status as enum (
  'draft',
  'submitted',
  'approved',
  'returned'
);

create type public.quotation_status as enum (
  'draft',
  'sent',
  'follow_up_pending',
  'accepted',
  'rejected'
);

create sequence public.customer_number_seq start 1;
create sequence public.site_number_seq start 1;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'site_supervisor',
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.feature_flags (
  key text primary key,
  name text not null,
  description text not null default '',
  enabled boolean not null default false,
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_number bigint not null default nextval('public.customer_number_seq'),
  customer_code text not null unique,
  name text not null,
  primary_mobile text not null,
  email text,
  billing_name text,
  billing_address text,
  gstin text,
  notes text,
  archived_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint customers_mobile_not_blank check (btrim(primary_mobile) <> '')
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  site_number bigint not null default nextval('public.site_number_seq'),
  site_code text not null unique,
  customer_id uuid not null references public.customers(id),
  project_name text not null,
  address text not null,
  maps_url text,
  site_type text not null check (site_type in ('residential', 'commercial', 'semi_residential', 'other')),
  application_areas text[] not null default '{}',
  lead_source text not null default 'direct' check (lead_source in ('ultratech', 'direct', 'referral', 'other')),
  ultratech_referrer_name text,
  ultratech_sr_id text,
  visit_date date,
  supervisor_id uuid references public.profiles(id),
  status public.site_status not null default 'new_enquiry',
  cover_file_path text,
  notes text,
  archived_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  visit_number integer not null default 1 check (visit_number > 0),
  inspected_at timestamptz not null,
  inspector_id uuid references public.profiles(id),
  building_type text not null check (building_type in ('new', 'existing')),
  application_areas text[] not null default '{}',
  surface_wetness text check (surface_wetness in ('dry', 'damp', 'wet_standing_water')),
  surface_cleanliness text,
  observed_problems text[] not null default '{}',
  exact_problem_location text,
  existing_waterproofing_layer text,
  findings text,
  suspected_cause text,
  repairs_required text[] not null default '{}',
  readiness text check (readiness in ('ready', 'repair_required', 'further_investigation', 'specialist_assessment')),
  remarks text,
  status public.inspection_status not null default 'draft',
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (site_id, visit_number)
);

create table public.toilet_measurements (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  toilet_id text not null,
  floor_length_ft numeric(10,2) not null check (floor_length_ft >= 0),
  floor_width_ft numeric(10,2) not null check (floor_width_ft >= 0),
  wall_height_ft numeric(10,2) not null check (wall_height_ft >= 0),
  door_deduction_ft numeric(10,2) not null default 2.5 check (door_deduction_ft >= 0),
  additional_opening_deduction_ft numeric(10,2) not null default 0 check (additional_opening_deduction_ft >= 0),
  floor_area_sqft numeric(12,2) generated always as (floor_length_ft * floor_width_ft) stored,
  perimeter_ft numeric(12,2) generated always as (2 * (floor_length_ft + floor_width_ft)) stored,
  net_wall_length_ft numeric(12,2) generated always as (
    greatest(0, 2 * (floor_length_ft + floor_width_ft) - door_deduction_ft - additional_opening_deduction_ft)
  ) stored,
  wall_area_sqft numeric(12,2) generated always as (
    greatest(0, 2 * (floor_length_ft + floor_width_ft) - door_deduction_ft - additional_opening_deduction_ft)
    * wall_height_ft
  ) stored,
  combined_total_sqft numeric(12,2) generated always as (
    floor_length_ft * floor_width_ft
    + greatest(0, 2 * (floor_length_ft + floor_width_ft) - door_deduction_ft - additional_opening_deduction_ft)
      * wall_height_ft
  ) stored,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (inspection_id, toilet_id)
);

create table public.terrace_sections (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  section_name text not null,
  length_ft numeric(10,2) not null check (length_ft >= 0),
  width_ft numeric(10,2) not null check (width_ft >= 0),
  approved_exclusion_sqft numeric(12,2) not null default 0 check (approved_exclusion_sqft >= 0),
  exclusion_notes text,
  gross_area_sqft numeric(12,2) generated always as (length_ft * width_ft) stored,
  net_area_sqft numeric(12,2) generated always as (greatest(0, length_ft * width_ft - approved_exclusion_sqft)) stored,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (inspection_id, section_name)
);

create table public.parapet_measurements (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  segment_name text not null,
  length_ft numeric(10,2) not null check (length_ft >= 0),
  application_height_ft numeric(10,2) not null check (application_height_ft >= 0),
  face text not null check (face in ('inside', 'outside', 'both')),
  top_width_ft numeric(10,2) check (top_width_ft >= 0),
  face_area_sqft numeric(12,2) generated always as (
    length_ft * application_height_ft * case when face = 'both' then 2 else 1 end
  ) stored,
  top_area_sqft numeric(12,2) generated always as (length_ft * coalesce(top_width_ft, 0)) stored,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.other_measurements (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  application_area text not null,
  label text not null,
  quantity numeric(12,2) not null check (quantity >= 0),
  unit text not null check (unit in ('sq_ft', 'running_ft', 'points', 'count')),
  deductions numeric(12,2) not null default 0 check (deductions >= 0),
  net_quantity numeric(12,2) generated always as (greatest(0, quantity - deductions)) stored,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_files (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  inspection_id uuid references public.inspections(id) on delete cascade,
  category text not null check (category in ('inspection_photo', 'progress_photo', 'quotation', 'site_document', 'report')),
  stage text,
  application_area text,
  caption text,
  remarks text,
  bucket_id text not null default 'site-files',
  object_path text not null unique,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  uploaded_by uuid references public.profiles(id),
  captured_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  inspection_id uuid references public.inspections(id),
  quotation_number text not null,
  revision integer not null default 1 check (revision > 0),
  quotation_date date not null,
  total_value numeric(14,2) not null check (total_value >= 0),
  tax_amount numeric(14,2) check (tax_amount is null or tax_amount >= 0),
  status public.quotation_status not null default 'draft',
  follow_up_date date,
  follow_up_remarks text,
  source_app text not null default 'quotation_maker',
  pdf_file_id uuid references public.site_files(id),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (quotation_number, revision)
);

create table public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  progress_date date not null,
  supervisor_id uuid references public.profiles(id),
  work_completed text not null,
  pending_work text,
  status public.site_status,
  issues text,
  next_action text,
  target_date date,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  report_number text not null unique,
  photo_option text not null default 'selected' check (photo_option in ('selected', 'all', 'summary')),
  object_path text,
  generated_by uuid references public.profiles(id),
  generated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  site_id uuid references public.sites(id),
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.write_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  record_id uuid;
  related_site_id uuid;
begin
  if tg_op = 'DELETE' then
    record_id := old.id;
    related_site_id := case when tg_table_name = 'sites' then old.id else null end;
    insert into public.audit_events (actor_id, action, entity_type, entity_id, site_id, before_data)
    values (auth.uid(), lower(tg_op), tg_table_name, record_id, related_site_id, to_jsonb(old));
    return old;
  end if;

  record_id := new.id;
  related_site_id := case
    when tg_table_name = 'sites' then new.id
    when to_jsonb(new) ? 'site_id' then nullif(to_jsonb(new) ->> 'site_id', '')::uuid
    else null
  end;
  insert into public.audit_events (actor_id, action, entity_type, entity_id, site_id, before_data, after_data)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    record_id,
    related_site_id,
    case when tg_op = 'UPDATE' then to_jsonb(old) else null end,
    to_jsonb(new)
  );
  return new;
end;
$$;

create or replace function public.assign_customer_code()
returns trigger
language plpgsql
as $$
begin
  if new.customer_code is null or btrim(new.customer_code) = '' then
    new.customer_code := 'CUS-' || lpad(new.customer_number::text, 4, '0');
  end if;
  return new;
end;
$$;

create or replace function public.assign_site_code()
returns trigger
language plpgsql
as $$
begin
  if new.site_code is null or btrim(new.site_code) = '' then
    new.site_code := 'GH-' || lpad(new.site_number::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger customers_assign_code before insert on public.customers
for each row execute function public.assign_customer_code();

create trigger sites_assign_code before insert on public.sites
for each row execute function public.assign_site_code();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'site_supervisor'::public.app_role
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid() and active = true
$$;

create or replace function public.is_admin_or_office()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('owner_admin', 'office_staff'), false)
$$;

create or replace function public.can_access_site(target_site_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_app_role() in ('owner_admin', 'office_staff')
    or exists (
      select 1
      from public.sites s
      where s.id = target_site_id
        and s.supervisor_id = auth.uid()
        and s.archived_at is null
    ),
    false
  )
$$;

create index customers_name_idx on public.customers using gin (to_tsvector('simple', name));
create index customers_mobile_idx on public.customers (primary_mobile);
create index sites_customer_idx on public.sites (customer_id);
create index sites_supervisor_idx on public.sites (supervisor_id);
create index sites_status_idx on public.sites (status);
create index sites_ultratech_sr_idx on public.sites (ultratech_sr_id) where ultratech_sr_id is not null;
create index inspections_site_idx on public.inspections (site_id, inspected_at desc);
create index quotations_site_idx on public.quotations (site_id, quotation_date desc);
create index progress_site_idx on public.progress_updates (site_id, progress_date desc);
create index files_site_idx on public.site_files (site_id, created_at desc);
create index audit_site_idx on public.audit_events (site_id, created_at desc);

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger flags_updated_at before update on public.feature_flags
for each row execute function public.set_updated_at();
create trigger customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();
create trigger sites_updated_at before update on public.sites
for each row execute function public.set_updated_at();
create trigger inspections_updated_at before update on public.inspections
for each row execute function public.set_updated_at();
create trigger toilets_updated_at before update on public.toilet_measurements
for each row execute function public.set_updated_at();
create trigger terraces_updated_at before update on public.terrace_sections
for each row execute function public.set_updated_at();
create trigger parapets_updated_at before update on public.parapet_measurements
for each row execute function public.set_updated_at();
create trigger other_measurements_updated_at before update on public.other_measurements
for each row execute function public.set_updated_at();
create trigger quotations_updated_at before update on public.quotations
for each row execute function public.set_updated_at();
create trigger progress_updated_at before update on public.progress_updates
for each row execute function public.set_updated_at();

create trigger customers_audit
after insert or update or delete on public.customers
for each row execute function public.write_audit_event();
create trigger sites_audit
after insert or update or delete on public.sites
for each row execute function public.write_audit_event();
create trigger inspections_audit
after insert or update or delete on public.inspections
for each row execute function public.write_audit_event();
create trigger quotations_audit
after insert or update or delete on public.quotations
for each row execute function public.write_audit_event();
create trigger progress_audit
after insert or update or delete on public.progress_updates
for each row execute function public.write_audit_event();

alter table public.profiles enable row level security;
alter table public.feature_flags enable row level security;
alter table public.customers enable row level security;
alter table public.sites enable row level security;
alter table public.inspections enable row level security;
alter table public.toilet_measurements enable row level security;
alter table public.terrace_sections enable row level security;
alter table public.parapet_measurements enable row level security;
alter table public.other_measurements enable row level security;
alter table public.site_files enable row level security;
alter table public.quotations enable row level security;
alter table public.progress_updates enable row level security;
alter table public.site_reports enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_read on public.profiles
for select to authenticated
using (id = auth.uid() or public.current_app_role() = 'owner_admin');
create policy profiles_admin_write on public.profiles
for all to authenticated
using (public.current_app_role() = 'owner_admin')
with check (public.current_app_role() = 'owner_admin');

create policy flags_read on public.feature_flags
for select to authenticated using (true);
create policy flags_admin_write on public.feature_flags
for all to authenticated
using (public.current_app_role() = 'owner_admin')
with check (public.current_app_role() = 'owner_admin');

create policy customers_read on public.customers
for select to authenticated
using (
  public.is_admin_or_office()
  or exists (
    select 1 from public.sites s
    where s.customer_id = customers.id and public.can_access_site(s.id)
  )
);
create policy customers_write on public.customers
for all to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy sites_read on public.sites
for select to authenticated
using (public.can_access_site(id) or public.current_app_role() = 'store_staff');
create policy sites_write on public.sites
for all to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy inspections_read on public.inspections
for select to authenticated using (public.can_access_site(site_id));
create policy inspections_insert on public.inspections
for insert to authenticated with check (public.can_access_site(site_id));
create policy inspections_update on public.inspections
for update to authenticated
using (public.can_access_site(site_id))
with check (public.can_access_site(site_id));

create policy toilet_measurements_access on public.toilet_measurements
for all to authenticated
using (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)))
with check (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)));
create policy terrace_measurements_access on public.terrace_sections
for all to authenticated
using (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)))
with check (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)));
create policy parapet_measurements_access on public.parapet_measurements
for all to authenticated
using (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)))
with check (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)));
create policy other_measurements_access on public.other_measurements
for all to authenticated
using (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)))
with check (exists (select 1 from public.inspections i where i.id = inspection_id and public.can_access_site(i.site_id)));

create policy site_files_read on public.site_files
for select to authenticated using (public.can_access_site(site_id));
create policy site_files_write on public.site_files
for all to authenticated
using (public.can_access_site(site_id))
with check (public.can_access_site(site_id));

create policy quotations_read on public.quotations
for select to authenticated using (public.can_access_site(site_id));
create policy quotations_write on public.quotations
for all to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy progress_read on public.progress_updates
for select to authenticated using (public.can_access_site(site_id));
create policy progress_write on public.progress_updates
for all to authenticated
using (public.can_access_site(site_id))
with check (public.can_access_site(site_id));

create policy reports_read on public.site_reports
for select to authenticated using (public.can_access_site(site_id));
create policy reports_write on public.site_reports
for all to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy audit_admin_read on public.audit_events
for select to authenticated using (public.current_app_role() = 'owner_admin');
create policy audit_admin_insert on public.audit_events
for insert to authenticated with check (public.current_app_role() = 'owner_admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-files',
  'site-files',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy site_storage_read on storage.objects
for select to authenticated
using (
  bucket_id = 'site-files'
  and case
    when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then public.can_access_site(((storage.foldername(name))[1])::uuid)
    else false
  end
);

create policy site_storage_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'site-files'
  and case
    when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then public.can_access_site(((storage.foldername(name))[1])::uuid)
    else false
  end
);

create policy site_storage_update on storage.objects
for update to authenticated
using (
  bucket_id = 'site-files'
  and case
    when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then public.can_access_site(((storage.foldername(name))[1])::uuid)
    else false
  end
)
with check (
  bucket_id = 'site-files'
  and case
    when (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then public.can_access_site(((storage.foldername(name))[1])::uuid)
    else false
  end
);
