-- Site application areas, expanded lead sources, and referral master data.

create table public.ultratech_engineers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.sites
  add column if not exists ultratech_engineer_id uuid references public.ultratech_engineers(id),
  add column if not exists team_member_id uuid references public.team_members(id),
  add column if not exists referral_customer_id uuid references public.customers(id);

alter table public.sites drop constraint if exists sites_lead_source_check;
update public.sites set lead_source = case lead_source
  when 'ultratech' then 'ultratech_engineer'
  when 'direct' then 'direct_customer'
  when 'referral' then 'customer_reference'
  when 'other' then 'direct_customer'
  else lead_source
end;
alter table public.sites alter column lead_source set default 'direct_customer';
alter table public.sites add constraint sites_lead_source_check check (
  lead_source in (
    'ultratech_engineer',
    'direct_customer',
    'customer_reference',
    'existing_customer',
    'my_team',
    'website',
    'google_search',
    'social_media',
    'justdial',
    'indiamart'
  )
);

create trigger ultratech_engineers_updated_at before update on public.ultratech_engineers
for each row execute function public.set_updated_at();
create trigger team_members_updated_at before update on public.team_members
for each row execute function public.set_updated_at();

alter table public.ultratech_engineers enable row level security;
alter table public.team_members enable row level security;

create policy ultratech_engineers_read on public.ultratech_engineers
for select to authenticated using (true);
create policy ultratech_engineers_write on public.ultratech_engineers
for all to authenticated
using (public.current_app_role() in ('owner_admin', 'office_staff'))
with check (public.current_app_role() in ('owner_admin', 'office_staff'));

create policy team_members_read on public.team_members
for select to authenticated using (true);
create policy team_members_write on public.team_members
for all to authenticated
using (public.current_app_role() in ('owner_admin', 'office_staff'))
with check (public.current_app_role() in ('owner_admin', 'office_staff'));

create index ultratech_engineers_name_idx on public.ultratech_engineers (name);
create index team_members_name_idx on public.team_members (name);
create index sites_ultratech_engineer_idx on public.sites (ultratech_engineer_id);
create index sites_team_member_idx on public.sites (team_member_id);
create index sites_referral_customer_idx on public.sites (referral_customer_id);

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
        and s.archived_at is null
        and (
          (public.current_app_role() = 'site_supervisor' and s.supervisor_id = auth.uid())
          or (
            public.current_app_role() = 'ultratech_technical_executive'
            and s.lead_source = 'ultratech_engineer'
          )
          or (
            public.current_app_role() = 'labour_field_worker'
            and exists (
              select 1
              from public.attendance_entries ae
              join public.labourers l on l.id = ae.labourer_id
              where ae.site_id = s.id
                and l.user_id = auth.uid()
            )
          )
        )
    ),
    false
  )
$$;
