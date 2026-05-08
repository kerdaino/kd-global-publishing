-- KD Global Publishing House Supabase schema
-- Run this in the Supabase SQL editor or convert it into a migration.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  );
$$;

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  bio text,
  image_url text,
  email text,
  created_at timestamp with time zone default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subtitle text,
  author_id uuid references public.authors(id) on delete set null,
  category text,
  description text,
  short_description text,
  price numeric not null,
  currency text default 'NGN',
  cover_image_url text,
  ebook_file_url text,
  ebook_file_path text,
  sample_file_url text,
  sample_file_path text,
  payment_link text,
  what_readers_will_learn text[],
  format text default 'PDF eBook',
  status text default 'draft',
  is_featured boolean default false,
  is_physical_available boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.books
add column if not exists ebook_file_path text;

alter table public.books
add column if not exists sample_file_path text;

alter table public.books
add column if not exists payment_link text;

alter table public.books
add column if not exists what_readers_will_learn text[];

alter table public.books
alter column what_readers_will_learn type text[]
using case
  when what_readers_will_learn is null then null
  when pg_typeof(what_readers_will_learn)::text = 'text[]' then what_readers_will_learn::text[]
  else array_remove(regexp_split_to_array(what_readers_will_learn::text, E'\\r?\\n'), '')
end;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  amount numeric not null,
  currency text default 'NGN',
  paystack_reference text unique not null,
  payment_status text default 'pending',
  delivery_status text default 'pending',
  created_at timestamp with time zone default now(),
  paid_at timestamp with time zone
);

create table if not exists public.download_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  token text unique not null,
  expires_at timestamp with time zone,
  download_count integer default 0,
  max_downloads integer default 5,
  created_at timestamp with time zone default now()
);

create table if not exists public.publishing_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  book_title text,
  project_stage text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

create table if not exists public.sermon_book_projects (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  ministry_name text,
  email text not null,
  phone text,
  sermon_format text,
  number_of_sermons text,
  project_goal text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

create table if not exists public.print_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  book_title text,
  quantity integer,
  book_size text,
  color_preference text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  email text unique not null,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

create index if not exists authors_slug_idx on public.authors(slug);
create index if not exists books_slug_idx on public.books(slug);
create index if not exists books_ebook_file_path_idx on public.books(ebook_file_path);
create index if not exists books_sample_file_path_idx on public.books(sample_file_path);
create index if not exists orders_paystack_reference_idx on public.orders(paystack_reference);
create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists publishing_inquiries_status_idx on public.publishing_inquiries(status);
create index if not exists sermon_book_projects_status_idx on public.sermon_book_projects(status);
create index if not exists print_requests_status_idx on public.print_requests(status);

alter table public.authors enable row level security;
alter table public.books enable row level security;
alter table public.orders enable row level security;
alter table public.download_tokens enable row level security;
alter table public.publishing_inquiries enable row level security;
alter table public.sermon_book_projects enable row level security;
alter table public.print_requests enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read authors" on public.authors;
create policy "Public can read authors"
on public.authors
for select
using (true);

drop policy if exists "Public can read published books" on public.books;
create policy "Public can read published books"
on public.books
for select
using (status = 'published');

drop policy if exists "Public can insert publishing inquiries" on public.publishing_inquiries;
create policy "Public can insert publishing inquiries"
on public.publishing_inquiries
for insert
with check (true);

drop policy if exists "Public can insert sermon book projects" on public.sermon_book_projects;
create policy "Public can insert sermon book projects"
on public.sermon_book_projects
for insert
with check (true);

drop policy if exists "Public can insert print requests" on public.print_requests;
create policy "Public can insert print requests"
on public.print_requests
for insert
with check (true);

-- No public select policy is created for orders or download_tokens.
-- With RLS enabled, public users cannot read those tables unless an explicit
-- policy is added later for secure order lookup or token validation.

drop policy if exists "Admins can manage authors" on public.authors;
create policy "Admins can manage authors"
on public.authors
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage books" on public.books;
create policy "Admins can manage books"
on public.books
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage download tokens" on public.download_tokens;
create policy "Admins can manage download tokens"
on public.download_tokens
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage publishing inquiries" on public.publishing_inquiries;
create policy "Admins can manage publishing inquiries"
on public.publishing_inquiries
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage sermon book projects" on public.sermon_book_projects;
create policy "Admins can manage sermon book projects"
on public.sermon_book_projects
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage print requests" on public.print_requests;
create policy "Admins can manage print requests"
on public.print_requests
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_books_updated_at on public.books;
create trigger set_books_updated_at
before update on public.books
for each row
execute function public.set_updated_at();

-- Supabase Storage buckets for book assets.
-- Covers and sample files are public. Full eBook files stay private and are
-- served through short-lived signed URLs from the secure download route.
insert into storage.buckets (id, name, public, allowed_mime_types)
values
  ('book-covers', 'book-covers', true, array['image/jpeg', 'image/png', 'image/webp']),
  ('sample-files', 'sample-files', true, array['application/pdf']),
  ('ebook-files', 'ebook-files', false, array['application/pdf', 'application/epub+zip'])
on conflict (id) do update
set
  public = excluded.public,
  name = excluded.name,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read book covers" on storage.objects;
create policy "Public can read book covers"
on storage.objects
for select
using (bucket_id = 'book-covers');

drop policy if exists "Public can read sample files" on storage.objects;
create policy "Public can read sample files"
on storage.objects
for select
using (bucket_id = 'sample-files');

drop policy if exists "Admins can manage book covers" on storage.objects;
create policy "Admins can manage book covers"
on storage.objects
for all
using (bucket_id = 'book-covers' and public.is_admin())
with check (bucket_id = 'book-covers' and public.is_admin());

drop policy if exists "Admins can manage sample files" on storage.objects;
create policy "Admins can manage sample files"
on storage.objects
for all
using (bucket_id = 'sample-files' and public.is_admin())
with check (bucket_id = 'sample-files' and public.is_admin());

drop policy if exists "Admins can manage private ebook files" on storage.objects;
create policy "Admins can manage private ebook files"
on storage.objects
for all
using (bucket_id = 'ebook-files' and public.is_admin())
with check (bucket_id = 'ebook-files' and public.is_admin());
