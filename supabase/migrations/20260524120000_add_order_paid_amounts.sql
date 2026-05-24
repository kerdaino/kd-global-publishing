alter table public.orders
add column if not exists amount_paid numeric;

alter table public.orders
add column if not exists paystack_fee numeric;
