-- Phase 1 operations and basic finance.
-- Tables are installed now but their navigation remains controlled by feature flags.

create type public.stock_transaction_type as enum ('receipt', 'issue', 'return');
create type public.attendance_status as enum ('draft', 'submitted', 'approved', 'returned', 'corrected');
create type public.claim_status as enum ('draft', 'submitted', 'approved', 'rejected', 'paid');
create type public.invoice_status as enum ('unpaid', 'partially_paid', 'paid');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  brand text,
  sku text unique,
  unit text not null,
  opening_stock numeric(14,2) not null default 0 check (opening_stock >= 0),
  reorder_threshold numeric(14,2) not null default 0 check (reorder_threshold >= 0),
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.stock_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type public.stock_transaction_type not null,
  transaction_at timestamptz not null,
  product_id uuid not null references public.products(id),
  site_id uuid references public.sites(id),
  quantity numeric(14,2) not null check (quantity > 0),
  supplier_or_reference text,
  labourer_name text,
  notes text,
  original_issue_id uuid references public.stock_transactions(id),
  attachment_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  constraint stock_site_required check (
    transaction_type = 'receipt'
    or site_id is not null
  ),
  constraint return_issue_link check (
    transaction_type <> 'return'
    or original_issue_id is null
    or original_issue_id <> id
  )
);

create or replace view public.product_stock_balances
with (security_invoker = true)
as
select
  p.id as product_id,
  p.name,
  p.unit,
  p.reorder_threshold,
  p.opening_stock
    + coalesce(sum(case
        when st.transaction_type in ('receipt', 'return') then st.quantity
        when st.transaction_type = 'issue' then -st.quantity
        else 0
      end), 0) as available_quantity
from public.products p
left join public.stock_transactions st on st.product_id = p.id
group by p.id;

create or replace function public.prevent_negative_stock()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  available numeric(14,2);
begin
  if new.transaction_type <> 'issue' then
    return new;
  end if;

  select p.opening_stock
    + coalesce(sum(case
        when st.transaction_type in ('receipt', 'return') then st.quantity
        when st.transaction_type = 'issue' then -st.quantity
        else 0
      end), 0)
  into available
  from public.products p
  left join public.stock_transactions st on st.product_id = p.id
  where p.id = new.product_id
  group by p.opening_stock;

  if coalesce(available, 0) < new.quantity then
    raise exception 'Insufficient stock. Available: %, requested: %', coalesce(available, 0), new.quantity;
  end if;
  return new;
end;
$$;

create trigger stock_prevent_negative
before insert on public.stock_transactions
for each row execute function public.prevent_negative_stock();

create table public.labourers (
  id uuid primary key default gen_random_uuid(),
  labourer_code text not null unique,
  name text not null,
  phone text,
  daily_wage numeric(12,2) not null default 0 check (daily_wage >= 0),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.attendance_entries (
  id uuid primary key default gen_random_uuid(),
  attendance_date date not null,
  labourer_id uuid not null references public.labourers(id),
  site_id uuid not null references public.sites(id),
  work_performed text,
  check_in time,
  check_out time,
  day_fraction numeric(3,1) not null check (day_fraction in (0.5, 1, 1.5, 2)),
  daily_wage_snapshot numeric(12,2) not null check (daily_wage_snapshot >= 0),
  overtime_duration_hours numeric(5,2) not null default 0 check (overtime_duration_hours >= 0),
  overtime_amount numeric(12,2) not null default 0 check (overtime_amount >= 0),
  base_pay numeric(12,2) generated always as (daily_wage_snapshot * day_fraction) stored,
  total_pay numeric(12,2) generated always as (daily_wage_snapshot * day_fraction + overtime_amount) stored,
  status public.attendance_status not null default 'draft',
  notes text,
  entered_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (attendance_date, labourer_id, site_id)
);

create table public.expense_claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique,
  labourer_id uuid not null references public.labourers(id),
  site_id uuid not null references public.sites(id),
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  expense_date date not null,
  description text not null,
  payment_method text check (payment_method in ('cash', 'upi', 'bank_transfer', 'other')),
  receipt_path text,
  no_receipt_reason text,
  status public.claim_status not null default 'draft',
  reviewer_id uuid references public.profiles(id),
  reviewer_notes text,
  reviewed_at timestamptz,
  paid_at timestamptz,
  submitted_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint receipt_or_reason check (receipt_path is not null or no_receipt_reason is not null)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  invoice_number text not null unique,
  invoice_date date not null,
  amount numeric(14,2) not null check (amount > 0),
  tax_amount numeric(14,2) not null default 0 check (tax_amount >= 0),
  due_date date not null,
  status public.invoice_status not null default 'unpaid',
  attachment_path text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id),
  payment_date date not null,
  amount numeric(14,2) not null check (amount > 0),
  payment_method text not null check (payment_method in ('cash', 'upi', 'bank_transfer', 'cheque', 'other')),
  reference text,
  notes text,
  proof_path text,
  recorded_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace view public.invoice_balances
with (security_invoker = true)
as
select
  i.id as invoice_id,
  i.site_id,
  i.invoice_number,
  i.amount + i.tax_amount as invoice_total,
  coalesce(sum(p.amount), 0) as amount_received,
  greatest(0, i.amount + i.tax_amount - coalesce(sum(p.amount), 0)) as outstanding_amount,
  i.due_date
from public.invoices i
left join public.payments p on p.invoice_id = i.id
group by i.id;

create or replace function public.prevent_payment_overage()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  remaining numeric(14,2);
begin
  select i.amount + i.tax_amount - coalesce(sum(p.amount), 0)
  into remaining
  from public.invoices i
  left join public.payments p on p.invoice_id = i.id
  where i.id = new.invoice_id
  group by i.id;

  if coalesce(remaining, 0) < new.amount then
    raise exception 'Payment exceeds invoice outstanding amount';
  end if;
  return new;
end;
$$;

create trigger payments_prevent_overage
before insert on public.payments
for each row execute function public.prevent_payment_overage();

create or replace function public.refresh_invoice_status()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_invoice uuid;
  total numeric(14,2);
  received numeric(14,2);
begin
  if tg_op = 'DELETE' then
    target_invoice := old.invoice_id;
  else
    target_invoice := new.invoice_id;
  end if;
  select i.amount + i.tax_amount, coalesce(sum(p.amount), 0)
  into total, received
  from public.invoices i
  left join public.payments p on p.invoice_id = i.id
  where i.id = target_invoice
  group by i.id;

  update public.invoices
  set status = case
    when received <= 0 then 'unpaid'::public.invoice_status
    when received < total then 'partially_paid'::public.invoice_status
    else 'paid'::public.invoice_status
  end
  where id = target_invoice;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger payments_refresh_invoice
after insert or update or delete on public.payments
for each row execute function public.refresh_invoice_status();

create index stock_product_idx on public.stock_transactions (product_id, transaction_at desc);
create index stock_site_idx on public.stock_transactions (site_id, transaction_at desc);
create index attendance_site_date_idx on public.attendance_entries (site_id, attendance_date desc);
create index claims_site_idx on public.expense_claims (site_id, expense_date desc);
create index invoices_site_idx on public.invoices (site_id, invoice_date desc);
create index payments_invoice_idx on public.payments (invoice_id, payment_date desc);

create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger labourers_updated_at before update on public.labourers
for each row execute function public.set_updated_at();
create trigger attendance_updated_at before update on public.attendance_entries
for each row execute function public.set_updated_at();
create trigger claims_updated_at before update on public.expense_claims
for each row execute function public.set_updated_at();
create trigger invoices_updated_at before update on public.invoices
for each row execute function public.set_updated_at();

create trigger stock_transactions_audit
after insert or update or delete on public.stock_transactions
for each row execute function public.write_audit_event();
create trigger attendance_audit
after insert or update or delete on public.attendance_entries
for each row execute function public.write_audit_event();
create trigger expense_claims_audit
after insert or update or delete on public.expense_claims
for each row execute function public.write_audit_event();
create trigger invoices_audit
after insert or update or delete on public.invoices
for each row execute function public.write_audit_event();
create trigger payments_audit
after insert or update or delete on public.payments
for each row execute function public.write_audit_event();

alter table public.products enable row level security;
alter table public.stock_transactions enable row level security;
alter table public.labourers enable row level security;
alter table public.attendance_entries enable row level security;
alter table public.expense_claims enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;

create policy products_read on public.products
for select to authenticated
using (public.current_app_role() in ('owner_admin', 'office_staff', 'store_staff'));
create policy products_write on public.products
for all to authenticated
using (public.current_app_role() in ('owner_admin', 'store_staff'))
with check (public.current_app_role() in ('owner_admin', 'store_staff'));

create policy stock_read on public.stock_transactions
for select to authenticated
using (
  public.current_app_role() in ('owner_admin', 'office_staff', 'store_staff')
  or (site_id is not null and public.can_access_site(site_id))
);
create policy stock_write on public.stock_transactions
for insert to authenticated
with check (
  public.current_app_role() in ('owner_admin', 'store_staff')
  and (
    site_id is null
    or public.current_app_role() = 'store_staff'
    or public.can_access_site(site_id)
  )
);

create policy labourers_read on public.labourers
for select to authenticated
using (public.current_app_role() in ('owner_admin', 'office_staff', 'site_supervisor'));
create policy labourers_write on public.labourers
for all to authenticated
using (public.current_app_role() = 'owner_admin')
with check (public.current_app_role() = 'owner_admin');

create policy attendance_read on public.attendance_entries
for select to authenticated using (public.can_access_site(site_id));
create policy attendance_write on public.attendance_entries
for all to authenticated
using (public.can_access_site(site_id))
with check (public.can_access_site(site_id));

create policy claims_read on public.expense_claims
for select to authenticated using (public.can_access_site(site_id));
create policy claims_insert on public.expense_claims
for insert to authenticated with check (public.can_access_site(site_id));
create policy claims_review on public.expense_claims
for update to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy invoices_read on public.invoices
for select to authenticated using (public.is_admin_or_office());
create policy invoices_write on public.invoices
for all to authenticated
using (public.is_admin_or_office())
with check (public.is_admin_or_office());

create policy payments_read on public.payments
for select to authenticated using (public.is_admin_or_office());
create policy payments_insert on public.payments
for insert to authenticated
with check (public.is_admin_or_office());
