-- ============================================
-- Migration: Create user_interactions table
-- Purpose: Store user bookmarks and likes with multi-tenant isolation
-- Tables: public.user_interactions
-- Dependencies: public.tenants, public.projects, public.articles
-- ============================================

-- Create user_interactions table with required columns
create table if not exists public.user_interactions (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- User and article reference
  user_session_id text not null,
  article_id text not null,

  -- Interaction flags
  is_bookmarked boolean default false,
  is_liked boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Unique constraint: one interaction per user per article
  unique(user_session_id, article_id)
);

-- Add foreign key constraints (required)
alter table public.user_interactions
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.user_interactions
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

alter table public.user_interactions
  add constraint fk_article
    foreign key (article_id)
    references public.articles(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.user_interactions enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_interactions"
  on public.user_interactions for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_interactions"
  on public.user_interactions for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "anon_insert_interactions"
  on public.user_interactions for insert to anon
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_interactions"
  on public.user_interactions for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "anon_update_interactions"
  on public.user_interactions for update to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_interactions"
  on public.user_interactions for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "anon_delete_interactions"
  on public.user_interactions for delete to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_interactions"
  on public.user_interactions for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_interactions_tenant_project
  on public.user_interactions(tenantid, projectid);
create index if not exists idx_interactions_user_session
  on public.user_interactions(user_session_id);
create index if not exists idx_interactions_article
  on public.user_interactions(article_id);
create index if not exists idx_interactions_bookmarked
  on public.user_interactions(user_session_id, is_bookmarked) where is_bookmarked = true;
create index if not exists idx_interactions_liked
  on public.user_interactions(user_session_id, is_liked) where is_liked = true;

-- Add helpful comments
comment on table public.user_interactions is 'User bookmarks and likes with tenant/project isolation';
comment on column public.user_interactions.tenantid is 'FK to tenants.id';
comment on column public.user_interactions.projectid is 'FK to projects.id';
comment on column public.user_interactions.user_session_id is 'Client-side generated session ID for anonymous users';
comment on column public.user_interactions.article_id is 'FK to articles.id';
comment on column public.user_interactions.is_bookmarked is 'Whether the user has bookmarked this article';
comment on column public.user_interactions.is_liked is 'Whether the user has liked this article';
