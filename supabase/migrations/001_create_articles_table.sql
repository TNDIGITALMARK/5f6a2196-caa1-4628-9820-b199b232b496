-- ============================================
-- Migration: Create articles table
-- Purpose: Store news articles with multi-tenant isolation
-- Tables: public.articles
-- Dependencies: public.tenants, public.projects
-- ============================================

-- Create articles table with required columns
create table if not exists public.articles (
  id text primary key,
  tenantid text not null,
  projectid uuid not null,

  -- Article content
  title text not null,
  summary text not null,
  content text not null,
  source text not null,
  category text not null,
  image_url text not null,
  timestamp timestamptz not null,
  reading_time integer default 5,
  is_breaking boolean default false,

  -- Aggregate stats (for performance)
  total_likes integer default 0,
  total_views integer default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints (required)
alter table public.articles
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.articles
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.articles enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_articles"
  on public.articles for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_articles"
  on public.articles for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_articles"
  on public.articles for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "anon_insert_articles"
  on public.articles for insert to anon
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_articles"
  on public.articles for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "anon_update_articles"
  on public.articles for update to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_articles"
  on public.articles for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_articles_tenant_project
  on public.articles(tenantid, projectid);
create index if not exists idx_articles_category
  on public.articles(category);
create index if not exists idx_articles_timestamp
  on public.articles(timestamp desc);
create index if not exists idx_articles_breaking
  on public.articles(is_breaking) where is_breaking = true;

-- Add helpful comments
comment on table public.articles is 'News articles with tenant/project isolation';
comment on column public.articles.tenantid is 'FK to tenants.id';
comment on column public.articles.projectid is 'FK to projects.id';
comment on column public.articles.total_likes is 'Aggregate count of likes for performance';
comment on column public.articles.total_views is 'Aggregate count of views for performance';
