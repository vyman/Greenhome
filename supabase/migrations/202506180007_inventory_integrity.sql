-- Inventory integrity: concurrent-safe stock checks, return limits per site,
-- and unique product names. Applies to new transactions only; existing rows
-- are not changed.

-- Product names are matched by name in the app, so they must be unique
-- (case-insensitive). Stop with a clear message if duplicates already exist.
do $$
begin
  if exists (
    select lower(name)
    from public.products
    group by lower(name)
    having count(*) > 1
  ) then
    raise exception 'Duplicate product names exist. Rename them before applying this migration.';
  end if;
end;
$$;

create unique index if not exists products_name_unique_idx
on public.products (lower(name));

-- Lock the product row before checking stock, so two issues saved at the
-- same moment cannot both pass the check and take stock below zero.
create or replace function public.prevent_negative_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  available numeric(14,2);
begin
  if new.transaction_type <> 'issue' then
    return new;
  end if;

  perform 1 from public.products where id = new.product_id for update;

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

-- A return cannot exceed the quantity still at that site for that product
-- (issued to the site minus already returned from it).
create or replace function public.prevent_excess_return()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  at_site numeric(14,2);
begin
  if new.transaction_type <> 'return' then
    return new;
  end if;

  perform 1 from public.products where id = new.product_id for update;

  select coalesce(sum(case
      when transaction_type = 'issue' then quantity
      when transaction_type = 'return' then -quantity
      else 0
    end), 0)
  into at_site
  from public.stock_transactions
  where product_id = new.product_id
    and site_id = new.site_id;

  if at_site < new.quantity then
    raise exception 'Return exceeds quantity at site. At site: %, returning: %', greatest(at_site, 0), new.quantity;
  end if;
  return new;
end;
$$;

drop trigger if exists stock_prevent_excess_return on public.stock_transactions;
create trigger stock_prevent_excess_return
before insert on public.stock_transactions
for each row execute function public.prevent_excess_return();
