-- Extend site access for the additional role presets.

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
            and s.lead_source = 'ultratech'
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

drop policy if exists labourers_read on public.labourers;
create policy labourers_read on public.labourers
for select to authenticated
using (
  public.current_app_role() in ('owner_admin', 'office_staff', 'site_supervisor')
  or user_id = auth.uid()
);

drop policy if exists attendance_read on public.attendance_entries;
create policy attendance_read on public.attendance_entries
for select to authenticated
using (
  public.can_access_site(site_id)
  or exists (
    select 1
    from public.labourers l
    where l.id = labourer_id and l.user_id = auth.uid()
  )
);

drop policy if exists claims_read on public.expense_claims;
create policy claims_read on public.expense_claims
for select to authenticated
using (
  public.can_access_site(site_id)
  or exists (
    select 1
    from public.labourers l
    where l.id = labourer_id and l.user_id = auth.uid()
  )
);
