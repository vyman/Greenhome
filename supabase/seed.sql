-- Safe, repeatable Phase 1 sample data.
-- Create these users in Supabase Auth first:
--   admin@gmail.com / test123
--   super@gmail.com / test123
-- The auth trigger creates profiles; this seed only assigns their application roles.

insert into public.profiles (id, email, full_name, role, active)
select
  id,
  email,
  case
    when email = 'admin@gmail.com' then 'Admin User'
    when email = 'super@gmail.com' then 'Site Supervisor'
    else coalesce(raw_user_meta_data ->> 'full_name', '')
  end,
  case
    when email = 'admin@gmail.com' then 'owner_admin'::public.app_role
    else 'site_supervisor'::public.app_role
  end,
  true
from auth.users
where email in ('admin@gmail.com', 'super@gmail.com')
on conflict (id) do update
set full_name = excluded.full_name,
    role = excluded.role,
    active = true,
    updated_at = timezone('utc', now());

insert into public.feature_flags (key, name, description, enabled)
values
  ('site_activity', 'Site activity', 'Customers, sites, inspections, quotations, progress, photos, and site reports.', true),
  ('operations', 'Operations', 'Inventory, labour attendance, and labour expense claims.', false),
  ('finance_reporting', 'Finance and reporting', 'Invoices, payments, and financial summaries.', false)
on conflict (key) do update
set name = excluded.name,
    description = excluded.description,
    enabled = excluded.enabled,
    updated_at = timezone('utc', now());

insert into public.customers (
  id, customer_code, name, primary_mobile, email, billing_name, billing_address, notes
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'CUS-0001',
    'Raghavendra Rao',
    '+91 98450 23456',
    'raghavendra@example.com',
    'Raghavendra Rao',
    'Jayanagar, Bengaluru, Karnataka',
    'Primary contact for Krishna Residency.'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'CUS-0002',
    'Ananya Sharma',
    '+91 99002 81726',
    'ananya@example.com',
    'Ananya Sharma',
    'Whitefield, Bengaluru, Karnataka',
    'New residential enquiry.'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'CUS-0003',
    'Karthik Industries',
    '+91 98441 40908',
    'accounts@karthikindustries.example',
    'Karthik Industries',
    'Hosur Road, Bengaluru, Karnataka',
    'Commercial customer.'
  )
on conflict (id) do update
set name = excluded.name,
    primary_mobile = excluded.primary_mobile,
    email = excluded.email,
    billing_name = excluded.billing_name,
    billing_address = excluded.billing_address,
    notes = excluded.notes;

select setval(
  'public.customer_number_seq',
  greatest((select coalesce(max(customer_number), 1) from public.customers), 3),
  true
);

insert into public.sites (
  id, site_code, customer_id, project_name, address, site_type,
  application_areas, lead_source, ultratech_sr_id, supervisor_id, status, notes
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'GH-0148',
    '10000000-0000-4000-8000-000000000001',
    'Krishna Residency',
    'Jayanagar, Bengaluru, Karnataka',
    'residential',
    array['terrace', 'utility'],
    'direct',
    null,
    (select id from public.profiles where email = 'super@gmail.com' limit 1),
    'ongoing',
    'Terrace waterproofing work in progress.'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'GH-0147',
    '10000000-0000-4000-8000-000000000002',
    'Aarunya Villa',
    'Whitefield, Bengaluru, Karnataka',
    'residential',
    array['toilet', 'balcony'],
    'ultratech',
    'UT-SR-2025-1042',
    (select id from public.profiles where email = 'super@gmail.com' limit 1),
    'visit_scheduled',
    'Inspection scheduled for toilet and balcony areas.'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'GH-0145',
    '10000000-0000-4000-8000-000000000003',
    'Prestige Warehouse',
    'Hosur Road, Bengaluru, Karnataka',
    'commercial',
    array['terrace', 'external_wall'],
    'referral',
    null,
    (select id from public.profiles where email = 'super@gmail.com' limit 1),
    'quotation_sent',
    'Quotation follow-up pending.'
  )
on conflict (id) do update
set customer_id = excluded.customer_id,
    project_name = excluded.project_name,
    address = excluded.address,
    site_type = excluded.site_type,
    application_areas = excluded.application_areas,
    lead_source = excluded.lead_source,
    ultratech_sr_id = excluded.ultratech_sr_id,
    supervisor_id = excluded.supervisor_id,
    status = excluded.status,
    notes = excluded.notes;

select setval(
  'public.site_number_seq',
  greatest((select coalesce(max(site_number), 1) from public.sites), 148),
  true
);

insert into public.inspections (
  id, site_id, visit_number, inspected_at, inspector_id, building_type,
  application_areas, surface_wetness, observed_problems, findings,
  suspected_cause, repairs_required, readiness, remarks, status
)
values (
  '30000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  1,
  '2025-06-18 09:30:00+05:30',
  (select id from public.profiles where email = 'super@gmail.com' limit 1),
  'existing',
  array['toilet', 'balcony'],
  'damp',
  array['leakage_seepage', 'cracks'],
  'Localized seepage near the toilet wall and balcony outlet.',
  'Failed joint treatment and minor surface cracks.',
  array['cleaning', 'crack_filling', 'joint_treatment'],
  'repair_required',
  'Photographs to be attached from the mobile inspection.',
  'submitted'
)
on conflict (id) do update
set findings = excluded.findings,
    suspected_cause = excluded.suspected_cause,
    remarks = excluded.remarks,
    status = excluded.status;

insert into public.toilet_measurements (
  id, inspection_id, toilet_id, floor_length_ft, floor_width_ft,
  wall_height_ft, door_deduction_ft, additional_opening_deduction_ft, notes
)
values (
  '31000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  'T1',
  4,
  6,
  7,
  2.5,
  0,
  'Approved calculation test case; combined total must equal 146.5 sq ft.'
)
on conflict (id) do update
set floor_length_ft = excluded.floor_length_ft,
    floor_width_ft = excluded.floor_width_ft,
    wall_height_ft = excluded.wall_height_ft,
    door_deduction_ft = excluded.door_deduction_ft,
    additional_opening_deduction_ft = excluded.additional_opening_deduction_ft,
    notes = excluded.notes;

do $$
declare
  calculated_total numeric(12,2);
begin
  select combined_total_sqft
  into calculated_total
  from public.toilet_measurements
  where id = '31000000-0000-4000-8000-000000000001';

  if calculated_total <> 146.50 then
    raise exception 'Toilet measurement test failed. Expected 146.50, received %', calculated_total;
  end if;
end;
$$;

insert into public.terrace_sections (
  id, inspection_id, section_name, length_ft, width_ft, approved_exclusion_sqft, exclusion_notes
)
values (
  '32000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  'Section A',
  40,
  22,
  80,
  'Approved staircase opening.'
)
on conflict (id) do update
set length_ft = excluded.length_ft,
    width_ft = excluded.width_ft,
    approved_exclusion_sqft = excluded.approved_exclusion_sqft,
    exclusion_notes = excluded.exclusion_notes;

insert into public.quotations (
  id, site_id, inspection_id, quotation_number, revision, quotation_date,
  total_value, status, follow_up_date, source_app, notes
)
values (
  '40000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000003',
  null,
  'QT-2025-086',
  2,
  '2025-06-17',
  342000,
  'sent',
  '2025-06-21',
  'quotation_maker',
  'Uploaded quotation revision for follow-up.'
)
on conflict (id) do update
set total_value = excluded.total_value,
    status = excluded.status,
    follow_up_date = excluded.follow_up_date,
    notes = excluded.notes;

insert into public.progress_updates (
  id, site_id, progress_date, supervisor_id, work_completed,
  pending_work, status, next_action, target_date, notes
)
values (
  '50000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '2025-06-18',
  (select id from public.profiles where email = 'super@gmail.com' limit 1),
  'Surface preparation completed for 680 sq ft.',
  'Waterproofing coat 2 remains.',
  'ongoing',
  'Apply coat 2 after surface inspection.',
  '2025-06-19',
  'No blocking issue reported.'
)
on conflict (id) do update
set work_completed = excluded.work_completed,
    pending_work = excluded.pending_work,
    status = excluded.status,
    next_action = excluded.next_action,
    target_date = excluded.target_date,
    notes = excluded.notes;

insert into public.products (
  id, name, category, brand, sku, unit, opening_stock, reorder_threshold
)
values
  ('60000000-0000-4000-8000-000000000001', 'Dr. Fixit Pidifin 2K', 'waterproofing', 'Dr. Fixit', 'DF-P2K', 'bucket', 42, 12),
  ('60000000-0000-4000-8000-000000000002', 'Fosroc Brushbond', 'coating', 'Fosroc', 'FS-BB', 'bag', 8, 10),
  ('60000000-0000-4000-8000-000000000003', 'Sika Latex Power', 'admixture', 'Sika', 'SK-LP', 'can', 6, 8)
on conflict (id) do update
set name = excluded.name,
    category = excluded.category,
    brand = excluded.brand,
    sku = excluded.sku,
    unit = excluded.unit,
    opening_stock = excluded.opening_stock,
    reorder_threshold = excluded.reorder_threshold;

insert into public.labourers (id, labourer_code, name, daily_wage, active)
values
  ('70000000-0000-4000-8000-000000000001', 'LAB-001', 'Ninga', 1000, true),
  ('70000000-0000-4000-8000-000000000002', 'LAB-002', 'Mahesha', 1200, true),
  ('70000000-0000-4000-8000-000000000003', 'LAB-003', 'Govinda', 1000, true),
  ('70000000-0000-4000-8000-000000000004', 'LAB-004', 'Pavan', 1000, true),
  ('70000000-0000-4000-8000-000000000005', 'LAB-005', 'Ringa', 1000, true),
  ('70000000-0000-4000-8000-000000000006', 'LAB-006', 'Shivaraj', 1100, true)
on conflict (id) do update
set name = excluded.name,
    daily_wage = excluded.daily_wage,
    active = excluded.active;

insert into public.stock_transactions (
  id, transaction_type, transaction_at, product_id, site_id, quantity,
  supplier_or_reference, labourer_name, notes, created_by
)
values
  (
    '61000000-0000-4000-8000-000000000001',
    'receipt',
    '2025-06-16 10:00:00+05:30',
    '60000000-0000-4000-8000-000000000003',
    null,
    12,
    'Supplier delivery reference GRN-1042',
    null,
    'Confirmed receipt into godown.',
    (select id from public.profiles where email = 'admin@gmail.com' limit 1)
  ),
  (
    '61000000-0000-4000-8000-000000000002',
    'issue',
    '2025-06-18 11:00:00+05:30',
    '60000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    4,
    'Site issue SI-2025-018',
    'Ninga',
    'Issued for terrace waterproofing.',
    (select id from public.profiles where email = 'admin@gmail.com' limit 1)
  )
on conflict (id) do nothing;

insert into public.attendance_entries (
  id, attendance_date, labourer_id, site_id, work_performed,
  check_in, check_out, day_fraction, daily_wage_snapshot,
  overtime_duration_hours, overtime_amount, status, notes, entered_by
)
values (
  '71000000-0000-4000-8000-000000000001',
  '2025-06-18',
  '70000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  'Surface preparation',
  '09:00',
  '18:00',
  1,
  1000,
  0,
  0,
  'submitted',
  'Overtime calculation remains zero until the client-approved rule is configured.',
  (select id from public.profiles where email = 'super@gmail.com' limit 1)
)
on conflict (id) do update
set work_performed = excluded.work_performed,
    day_fraction = excluded.day_fraction,
    daily_wage_snapshot = excluded.daily_wage_snapshot,
    overtime_duration_hours = excluded.overtime_duration_hours,
    overtime_amount = excluded.overtime_amount,
    status = excluded.status,
    notes = excluded.notes;

insert into public.expense_claims (
  id, claim_number, labourer_id, site_id, category, amount,
  expense_date, description, payment_method, no_receipt_reason,
  status, submitted_by
)
values (
  '72000000-0000-4000-8000-000000000001',
  'EXP-2025-047',
  '70000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000001',
  'site_supplies',
  1240,
  '2025-06-18',
  'Minor consumable supplies purchased near the site.',
  'cash',
  'Vendor did not provide a receipt.',
  'submitted',
  (select id from public.profiles where email = 'super@gmail.com' limit 1)
)
on conflict (id) do update
set amount = excluded.amount,
    description = excluded.description,
    no_receipt_reason = excluded.no_receipt_reason,
    status = excluded.status;

insert into public.invoices (
  id, site_id, invoice_number, invoice_date, amount, tax_amount,
  due_date, status, notes, created_by
)
values (
  '80000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  'INV-2025-064',
  '2025-06-12',
  184500,
  0,
  '2025-06-22',
  'unpaid',
  'Basic Phase 1 invoice record.',
  (select id from public.profiles where email = 'admin@gmail.com' limit 1)
)
on conflict (id) do update
set amount = excluded.amount,
    tax_amount = excluded.tax_amount,
    due_date = excluded.due_date,
    notes = excluded.notes;

insert into public.payments (
  id, invoice_id, payment_date, amount, payment_method,
  reference, notes, recorded_by
)
select
  '81000000-0000-4000-8000-000000000001',
  '80000000-0000-4000-8000-000000000001',
  '2025-06-17'::date,
  136000,
  'bank_transfer'::text,
  'UTR-GH0148-001',
  'Partial payment against INV-2025-064.',
  (select id from public.profiles where email = 'admin@gmail.com' limit 1)
where not exists (
  select 1
  from public.payments
  where id = '81000000-0000-4000-8000-000000000001'
);
