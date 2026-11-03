-- Classify customers by the type of business relationship and customer profile.

alter table public.customers
  add column if not exists business_relationship text,
  add column if not exists customer_type text;

alter table public.customers
  add constraint customers_business_relationship_check check (
    business_relationship is null or business_relationship in (
      'service_only',
      'material_sales_only',
      'both_service_material_sales'
    )
  ),
  add constraint customers_customer_type_check check (
    customer_type is null or customer_type in (
      'individual_home_owner',
      'engineer',
      'architect',
      'contractor',
      'builder_developer',
      'property_manager',
      'dealer',
      'material_buyer',
      'applicator',
      'reseller',
      'other'
    )
  );

create index customers_business_relationship_idx on public.customers (business_relationship);
create index customers_customer_type_idx on public.customers (customer_type);
