-- ONE VOIZE FRIENDS CLUB OF LAGOS — Supabase schema
create extension if not exists pgcrypto;

create type public.admin_role as enum ('super_admin','admin','editor','finance');
create type public.content_status as enum ('draft','published','archived');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.admin_role not null default 'editor',
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','editor','finance')); $$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin')); $$;
create or replace function public.is_finance()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','finance')); $$;

create table if not exists public.organization (id uuid primary key default gen_random_uuid(), name text not null, tagline text, mission text, vision text, description text, email text, phone text, address text, logo_url text, updated_at timestamptz not null default now());
create table if not exists public.values (id uuid primary key default gen_random_uuid(), name text not null, description text, display_order int default 0, created_at timestamptz default now());
create table if not exists public.history_timeline (id uuid primary key default gen_random_uuid(), year text not null, title text not null, description text, display_order int default 0, created_at timestamptz default now());
create table if not exists public.team_members (id uuid primary key default gen_random_uuid(), name text not null, role text not null, bio text, photo_url text, linkedin_url text, display_order int default 0, is_active boolean default true, created_at timestamptz default now());
create table if not exists public.board_members (id uuid primary key default gen_random_uuid(), name text not null, position text not null, bio text, photo_url text, expertise text, display_order int default 0, is_active boolean default true, created_at timestamptz default now());
create table if not exists public.leadership (id uuid primary key default gen_random_uuid(), name text not null, role text not null, bio text, photo_url text, display_order int default 0, is_active boolean default true, created_at timestamptz default now());
create table if not exists public.partners (id uuid primary key default gen_random_uuid(), name text not null, logo_url text, website_url text, description text, display_order int default 0, is_active boolean default true, created_at timestamptz default now());
create table if not exists public.governance_documents (id uuid primary key default gen_random_uuid(), title text not null, description text, file_url text not null, document_type text, published_at timestamptz, created_at timestamptz default now());

create table if not exists public.programs (id uuid primary key default gen_random_uuid(), name text not null, description text not null, image_url text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), title text not null, summary text, description text, location text, status text default 'active', image_url text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.impact_metrics (id uuid primary key default gen_random_uuid(), label text not null, value text not null, description text, display_order int default 0, created_at timestamptz default now());
create table if not exists public.locations (id uuid primary key default gen_random_uuid(), name text not null, country text, description text, created_at timestamptz default now());

create table if not exists public.campaigns (id uuid primary key default gen_random_uuid(), title text not null, description text not null, target_amount numeric(14,2) not null default 0, amount_raised numeric(14,2) not null default 0, image_url text, start_date date, end_date date, status text default 'draft', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.donors (id uuid primary key default gen_random_uuid(), name text, email text, phone text, created_at timestamptz default now());
create table if not exists public.donations (id uuid primary key default gen_random_uuid(), donor_id uuid references public.donors(id) on delete set null, campaign_id uuid references public.campaigns(id) on delete set null, amount numeric(14,2) not null, currency text not null default 'NGN', payment_gateway text, payment_reference text unique, payment_status text not null default 'pending', donation_type text default 'one_time', is_anonymous boolean default false, donor_name text, donor_email text, created_at timestamptz default now(), updated_at timestamptz default now());

create table if not exists public.volunteers (id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, interest text, message text, status text default 'new', created_at timestamptz default now());
create table if not exists public.events (id uuid primary key default gen_random_uuid(), title text not null, description text, location text, event_date date not null, image_url text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.event_registrations (id uuid primary key default gen_random_uuid(), event_id uuid references public.events(id) on delete cascade, name text not null, email text not null, phone text, created_at timestamptz default now());

create table if not exists public.blog_posts (id uuid primary key default gen_random_uuid(), title text not null, slug text unique, excerpt text, content text not null, category text, author_name text, featured_image text, status text default 'draft', published_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.blog_categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text unique, description text, created_at timestamptz default now());
create table if not exists public.blog_tags (id uuid primary key default gen_random_uuid(), name text not null unique, slug text unique);
create table if not exists public.blog_post_tags (post_id uuid references public.blog_posts(id) on delete cascade, tag_id uuid references public.blog_tags(id) on delete cascade, primary key(post_id,tag_id));
create table if not exists public.blog_authors (id uuid primary key default gen_random_uuid(), name text not null, bio text, photo_url text, created_at timestamptz default now());
create table if not exists public.contact_messages (id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text, message text not null, status text default 'unread', created_at timestamptz default now());
create table if not exists public.media (id uuid primary key default gen_random_uuid(), name text not null, file_url text not null, mime_type text, size_bytes bigint, created_at timestamptz default now());

-- RLS
alter table public.profiles enable row level security;
create policy "users read own profile" on public.profiles for select to authenticated using (id=auth.uid());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

do $$ declare t text; begin foreach t in array array['organization','values','history_timeline','team_members','board_members','leadership','partners','governance_documents','programs','projects','impact_metrics','locations','campaigns','events','blog_posts','blog_categories','blog_tags','blog_post_tags','blog_authors','media'] loop execute format('alter table public.%I enable row level security',t); execute format('create policy "%s staff read" on public.%I for select to authenticated using (public.is_staff())',t,t); execute format('create policy "%s admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',t,t); end loop; end $$;

alter table public.donations enable row level security;
create policy "finance read donations" on public.donations for select to authenticated using (public.is_finance());
create policy "finance manage donations" on public.donations for all to authenticated using (public.is_finance()) with check (public.is_finance());
alter table public.donors enable row level security;
create policy "finance read donors" on public.donors for select to authenticated using (public.is_finance());
create policy "finance manage donors" on public.donors for all to authenticated using (public.is_finance()) with check (public.is_finance());

do $$ declare t text; begin foreach t in array array['volunteers','event_registrations','contact_messages'] loop execute format('alter table public.%I enable row level security',t); execute format('create policy "%s staff read" on public.%I for select to authenticated using (public.is_staff())',t,t); execute format('create policy "%s admin manage" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',t,t); end loop; end $$;

-- Public read policies for published content. Public submission policies are intentionally narrow.
create policy "public published campaigns" on public.campaigns for select to anon using (status='published');
create policy "public published posts" on public.blog_posts for select to anon using (status='published');
create policy "public active programs" on public.programs for select to anon using (true);
create policy "public active team" on public.team_members for select to anon using (is_active=true);
create policy "public active board" on public.board_members for select to anon using (is_active=true);
create policy "public active leadership" on public.leadership for select to anon using (is_active=true);
create policy "public events" on public.events for select to anon using (true);
create policy "public partners" on public.partners for select to anon using (is_active=true);
create policy "public impact metrics" on public.impact_metrics for select to anon using (true);
create policy "public organization" on public.organization for select to anon using (true);
create policy "public values" on public.values for select to anon using (true);
create policy "public history" on public.history_timeline for select to anon using (true);

create policy "public volunteer applications" on public.volunteers for insert to anon with check (true);
create policy "public contact messages" on public.contact_messages for insert to anon with check (true);

-- Seed placeholder content. Safe to run once; uses distinct names.
insert into public.organization(name,tagline,mission,vision,description,address,email) values ('ONE VOIZE FRIENDS CLUB OF LAGOS','Together, we give back.','To promote integrity, uplift ourselves, support each other, give to less privileged people, and advance goodwill and peace.','To promote unity, peace and progress among members and the communities the Association serves.','ONE VOIZE FRIENDS CLUB OF LAGOS is a not-for-profit and non-political organisation incorporated as an incorporated trustee in Nigeria.','12, HOGAN BASSEY CRESCENT, SURULERE, LAGOS STATE, NIGERIA','') on conflict do nothing;
insert into public.programs(name,description) values ('Education & Learning','[Placeholder program description]'),('Healthcare & Wellness','[Placeholder program description]'),('Community Empowerment','[Placeholder program description]'),('Youth Development','[Placeholder program description]') on conflict do nothing;
insert into public.impact_metrics(label,value) values ('People Reached','10,000+'),('Communities Served','25+'),('Projects Completed','50+'),('Volunteers','500+') on conflict do nothing;
insert into public.blog_categories(name,slug) values ('News & Updates','news-updates'),('Impact Stories','impact-stories'),('Community Stories','community-stories'),('Project Updates','project-updates'),('Insights','insights') on conflict do nothing;

-- Payments, receipts and Storage additions
alter table public.donors add column if not exists email_normalized text generated always as (lower(email)) stored;
create unique index if not exists donors_email_normalized_idx on public.donors(email_normalized) where email_normalized is not null;
alter table public.donations add column if not exists gateway_transaction_id text;
alter table public.donations add column if not exists payment_metadata jsonb;
alter table public.donations add column if not exists verified_at timestamptz;
alter table public.donations add column if not exists receipt_token uuid default gen_random_uuid();
create unique index if not exists donations_receipt_token_idx on public.donations(receipt_token);

create or replace function public.refresh_campaign_amount(campaign_uuid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.campaigns c set amount_raised = coalesce((select sum(d.amount) from public.donations d where d.campaign_id = campaign_uuid and d.payment_status = 'successful'),0), updated_at = now() where c.id = campaign_uuid;
end; $$;

create or replace function public.donation_campaign_totals_trigger()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    if old.campaign_id is not null then perform public.refresh_campaign_amount(old.campaign_id); end if;
    return old;
  end if;
  if tg_op = 'UPDATE' and old.campaign_id is distinct from new.campaign_id then
    if old.campaign_id is not null then perform public.refresh_campaign_amount(old.campaign_id); end if;
  end if;
  if new.campaign_id is not null and (tg_op = 'INSERT' or old.payment_status is distinct from new.payment_status or old.amount is distinct from new.amount or old.campaign_id is distinct from new.campaign_id) then
    perform public.refresh_campaign_amount(new.campaign_id);
  end if;
  return new;
end; $$;
drop trigger if exists donation_campaign_totals on public.donations;
create trigger donation_campaign_totals after insert or update of payment_status, amount, campaign_id on public.donations for each row execute function public.donation_campaign_totals_trigger();

-- Storage buckets. Public media is for website images; governance documents remain private.
insert into storage.buckets (id,name,public) values ('media','media',true) on conflict (id) do update set public=true;
insert into storage.buckets (id,name,public) values ('documents','documents',false) on conflict (id) do update set public=false;

create policy "staff can upload media" on storage.objects for insert to authenticated with check (bucket_id='media' and public.is_staff());
create policy "staff can update media" on storage.objects for update to authenticated using (bucket_id='media' and public.is_staff()) with check (bucket_id='media' and public.is_staff());
create policy "staff can delete media" on storage.objects for delete to authenticated using (bucket_id='media' and public.is_admin());
create policy "public can read media" on storage.objects for select to public using (bucket_id='media');
create policy "staff can upload documents" on storage.objects for insert to authenticated with check (bucket_id='documents' and public.is_admin());
create policy "staff can manage documents" on storage.objects for all to authenticated using (bucket_id='documents' and public.is_admin()) with check (bucket_id='documents' and public.is_admin());

-- Keep the media catalogue synchronized for files uploaded by the admin app.

-- Recalculate totals when a donation is removed as well.
drop trigger if exists donation_campaign_totals_delete on public.donations;
create trigger donation_campaign_totals_delete after delete on public.donations for each row execute function public.donation_campaign_totals_trigger();
