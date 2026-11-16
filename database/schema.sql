create extension if not exists pgcrypto;

create type public.ad_platform as enum ('meta','google','tiktok');
create type public.destination_type as enum ('social_inbox','landing_page','website');
create type public.campaign_status as enum ('draft','pending_approval','approved','active','paused','rejected','error');
create type public.approval_status as enum ('pending','approved','rejected','expired');

create table public.businesses (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, business_type text not null default 'ecommerce',
 country_code char(2) not null default 'BD', currency char(3) not null default 'BDT',
 timezone text not null default 'Asia/Dhaka', created_at timestamptz not null default now()
);

create table public.sales_destinations (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 name text not null, destination_kind public.destination_type not null,
 url text, social_platform text, is_primary boolean not null default false,
 tracking_status text not null default 'unknown', created_at timestamptz not null default now(),
 check (destination_kind = 'social_inbox' or url is not null)
);

create table public.ad_accounts (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 platform public.ad_platform not null, external_account_id text not null,
 account_name text, currency char(3) not null default 'BDT',
 connection_status text not null default 'pending', created_at timestamptz not null default now(),
 unique(platform, external_account_id)
);

-- Reference a server-side secrets vault; never store plaintext OAuth tokens in this table.
create table public.platform_token_refs (
 id uuid primary key default gen_random_uuid(),
 ad_account_id uuid not null references public.ad_accounts(id) on delete cascade,
 secret_ref text not null, scopes text[] not null default '{}',
 expires_at timestamptz, updated_at timestamptz not null default now()
);

create table public.products (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 name text not null, description text, sku text,
 price_bdt numeric(14,2), cost_bdt numeric(14,2), inventory_status text,
 created_at timestamptz not null default now()
);

create table public.campaigns (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 ad_account_id uuid references public.ad_accounts(id) on delete set null,
 destination_id uuid references public.sales_destinations(id) on delete set null,
 product_id uuid references public.products(id) on delete set null,
 platform public.ad_platform not null, external_campaign_id text,
 name text not null, objective text not null default 'sales',
 status public.campaign_status not null default 'draft',
 daily_budget_bdt numeric(14,2) not null,
 monthly_budget_cap_bdt numeric(14,2) not null default 10000,
 currency char(3) not null default 'BDT', config jsonb not null default '{}',
 idempotency_key text unique, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (daily_budget_bdt > 0 and monthly_budget_cap_bdt > 0)
);

create table public.ad_groups (
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 external_ad_group_id text, name text not null, targeting jsonb not null default '{}',
 placement_config jsonb not null default '{}', created_at timestamptz not null default now()
);

create table public.creatives (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null,
 name text not null, format text not null, asset_path text,
 primary_text text, headline text, call_to_action text,
 claims_review_status text not null default 'needs_review', created_at timestamptz not null default now()
);

create table public.ads (
 id uuid primary key default gen_random_uuid(),
 ad_group_id uuid not null references public.ad_groups(id) on delete cascade,
 creative_id uuid references public.creatives(id) on delete set null,
 external_ad_id text, status text not null default 'draft', created_at timestamptz not null default now()
);

create table public.orders (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 external_order_id text, order_source text, currency char(3) not null default 'BDT',
 gross_revenue_bdt numeric(14,2) not null default 0, discount_bdt numeric(14,2) not null default 0,
 shipping_revenue_bdt numeric(14,2) not null default 0, refund_bdt numeric(14,2) not null default 0,
 order_status text not null default 'pending', ordered_at timestamptz not null default now(),
 unique(business_id, external_order_id)
);

create table public.campaign_metrics (
 id bigserial primary key, campaign_id uuid not null references public.campaigns(id) on delete cascade,
 metric_date date not null, spend_bdt numeric(14,2) not null default 0,
 impressions bigint not null default 0, clicks bigint not null default 0,
 purchases bigint not null default 0, attributed_revenue_bdt numeric(14,2) not null default 0,
 source_payload jsonb not null default '{}', fetched_at timestamptz not null default now(),
 unique(campaign_id, metric_date)
);

create table public.ai_tasks (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 agent_name text not null, task_type text not null, input jsonb not null default '{}',
 output jsonb, status text not null default 'queued', created_at timestamptz not null default now(),
 completed_at timestamptz
);

create table public.approvals (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 campaign_id uuid references public.campaigns(id) on delete cascade,
 ai_task_id uuid references public.ai_tasks(id) on delete set null,
 action_type text not null, proposed_change jsonb not null,
 status public.approval_status not null default 'pending',
 requested_at timestamptz not null default now(), decided_at timestamptz,
 decided_by uuid references auth.users(id), decision_notes text
);

create table public.budget_rules (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id) on delete cascade,
 monthly_cap_bdt numeric(14,2) not null default 10000,
 daily_cap_bdt numeric(14,2) not null default 333,
 auto_increase_enabled boolean not null default false,
 require_approval_for_launch boolean not null default true,
 emergency_pause_enabled boolean not null default true,
 updated_at timestamptz not null default now(),
 check (monthly_cap_bdt > 0 and daily_cap_bdt > 0)
);

create table public.audit_logs (
 id bigserial primary key, business_id uuid not null references public.businesses(id) on delete cascade,
 actor_type text not null, actor_id text, action text not null,
 entity_type text, entity_id text, before_state jsonb, after_state jsonb,
 result text not null, created_at timestamptz not null default now()
);

create index campaigns_business_idx on public.campaigns(business_id, created_at desc);
create index metrics_campaign_date_idx on public.campaign_metrics(campaign_id, metric_date desc);
create index approvals_pending_idx on public.approvals(business_id, status) where status='pending';
create index orders_business_date_idx on public.orders(business_id, ordered_at desc);

-- Tenant isolation. Service-role backend bypasses RLS; browser clients do not.
alter table public.businesses enable row level security;
create policy "owner manages businesses" on public.businesses
 for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

do $$
declare t text;
begin
 foreach t in array array['sales_destinations','ad_accounts','products',
 'campaigns','creatives','orders','ai_tasks','approvals','budget_rules','audit_logs']
 loop
  execute format('alter table public.%I enable row level security', t);
  execute format('create policy "owner access" on public.%I for all using
   (exists (select 1 from public.businesses b where b.id = business_id and b.owner_user_id = auth.uid()))
   with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_user_id = auth.uid()))', t);
 end loop;
end $$;


alter table public.platform_token_refs enable row level security;
create policy "owner access platform_token_refs" on public.platform_token_refs for all
 using (exists (select 1 from public.ad_accounts a join public.businesses b on b.id=a.business_id
 where a.id=ad_account_id and b.owner_user_id=auth.uid()))
 with check (exists (select 1 from public.ad_accounts a join public.businesses b on b.id=a.business_id
 where a.id=ad_account_id and b.owner_user_id=auth.uid()));

alter table public.ad_groups enable row level security;
create policy "owner access ad_groups" on public.ad_groups for all
 using (exists (select 1 from public.campaigns c join public.businesses b on b.id=c.business_id
 where c.id=campaign_id and b.owner_user_id=auth.uid()))
 with check (exists (select 1 from public.campaigns c join public.businesses b on b.id=c.business_id
 where c.id=campaign_id and b.owner_user_id=auth.uid()));

alter table public.ads enable row level security;
create policy "owner access ads" on public.ads for all
 using (exists (select 1 from public.ad_groups g join public.campaigns c on c.id=g.campaign_id
 join public.businesses b on b.id=c.business_id where g.id=ad_group_id and b.owner_user_id=auth.uid()))
 with check (exists (select 1 from public.ad_groups g join public.campaigns c on c.id=g.campaign_id
 join public.businesses b on b.id=c.business_id where g.id=ad_group_id and b.owner_user_id=auth.uid()));

alter table public.campaign_metrics enable row level security;
create policy "owner access campaign_metrics" on public.campaign_metrics for all
 using (exists (select 1 from public.campaigns c join public.businesses b on b.id=c.business_id
 where c.id=campaign_id and b.owner_user_id=auth.uid()))
 with check (exists (select 1 from public.campaigns c join public.businesses b on b.id=c.business_id
 where c.id=campaign_id and b.owner_user_id=auth.uid()));
