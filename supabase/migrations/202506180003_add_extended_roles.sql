-- Add the two additional application roles.
-- Enum values are committed in their own migration before policies reference them.

alter type public.app_role
add value if not exists 'ultratech_technical_executive';

alter type public.app_role
add value if not exists 'labour_field_worker';

alter table public.labourers
add column if not exists user_id uuid unique references public.profiles(id);
