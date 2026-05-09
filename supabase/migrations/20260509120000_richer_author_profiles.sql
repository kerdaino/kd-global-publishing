alter table public.authors
add column if not exists role_title text;

alter table public.authors
add column if not exists ministry_name text;

alter table public.authors
add column if not exists website_url text;

alter table public.authors
add column if not exists facebook_url text;

alter table public.authors
add column if not exists instagram_url text;

alter table public.authors
add column if not exists x_url text;

alter table public.authors
add column if not exists linkedin_url text;

alter table public.authors
add column if not exists status text default 'active';

alter table public.authors
add column if not exists updated_at timestamp with time zone default now();

update public.authors
set status = 'active'
where status is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'authors'
      and column_name = 'role'
  ) then
    execute 'update public.authors set role_title = coalesce(role_title, role) where role_title is null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'authors'
      and column_name = 'social_links'
  ) then
    execute $social$
      update public.authors
      set
        facebook_url = coalesce(facebook_url, social_links ->> 'facebook'),
        instagram_url = coalesce(instagram_url, social_links ->> 'instagram'),
        x_url = coalesce(x_url, social_links ->> 'x'),
        linkedin_url = coalesce(linkedin_url, social_links ->> 'linkedin')
    $social$;
  end if;
end $$;

create index if not exists authors_status_idx on public.authors(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_authors_updated_at on public.authors;
create trigger set_authors_updated_at
before update on public.authors
for each row
execute function public.set_updated_at();

drop policy if exists "Public can read authors" on public.authors;
create policy "Public can read authors"
on public.authors
for select
using (status = 'active');

insert into storage.buckets (id, name, public, allowed_mime_types)
values
  ('author-images', 'author-images', true, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  name = excluded.name,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read author images" on storage.objects;
create policy "Public can read author images"
on storage.objects
for select
using (bucket_id = 'author-images');

drop policy if exists "Admins can manage author images" on storage.objects;
create policy "Admins can manage author images"
on storage.objects
for all
using (bucket_id = 'author-images' and auth.role() = 'authenticated' and public.is_admin())
with check (bucket_id = 'author-images' and auth.role() = 'authenticated' and public.is_admin());
