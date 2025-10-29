// Script to create database schema for news aggregator app

const createArticlesTableSQL = `
-- ============================================
-- Migration: Create news_articles table
-- Purpose: Store news articles with multi-tenant isolation
-- ============================================

-- Create news_articles table with required columns
create table if not exists public.news_articles (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Article metadata
  title text not null,
  summary text not null,
  content text not null,
  source text not null,
  category text not null,
  image_url text,

  -- Engagement metrics
  likes integer default 0,
  views integer default 0,
  reading_time integer default 5,
  is_breaking boolean default false,

  -- Timestamps
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints (required)
alter table public.news_articles
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.news_articles
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS (required)
alter table public.news_articles enable row level security;

-- RLS Policies (required - separate per operation)
create policy "anon_select_articles"
  on public.news_articles for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_articles"
  on public.news_articles for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_articles"
  on public.news_articles for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_articles"
  on public.news_articles for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_articles"
  on public.news_articles for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes for performance
create index if not exists idx_articles_tenant_project
  on public.news_articles(tenantid, projectid);
create index if not exists idx_articles_category
  on public.news_articles(category);
create index if not exists idx_articles_published
  on public.news_articles(published_at desc);
create index if not exists idx_articles_breaking
  on public.news_articles(is_breaking) where is_breaking = true;

-- Add helpful comments
comment on table public.news_articles is 'News articles with tenant/project isolation';
comment on column public.news_articles.tenantid is 'FK to tenants.id';
comment on column public.news_articles.projectid is 'FK to projects.id';
comment on column public.news_articles.is_breaking is 'Flag for breaking news articles';
`;

const createBookmarksTableSQL = `
-- ============================================
-- Migration: Create bookmarks table
-- Purpose: Store user bookmarks for articles
-- ============================================

-- Create bookmarks table
create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Bookmark data
  article_id uuid not null,
  user_session_id text not null,
  notes text,

  created_at timestamptz default now()
);

-- Add foreign key constraints
alter table public.bookmarks
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.bookmarks
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

alter table public.bookmarks
  add constraint fk_article
    foreign key (article_id)
    references public.news_articles(id)
    on delete cascade;

-- Unique constraint: one bookmark per article per user
create unique index if not exists idx_bookmarks_unique
  on public.bookmarks(article_id, user_session_id, tenantid, projectid);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- RLS Policies
create policy "anon_select_bookmarks"
  on public.bookmarks for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_all_bookmarks"
  on public.bookmarks for all to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes
create index if not exists idx_bookmarks_tenant_project
  on public.bookmarks(tenantid, projectid);
create index if not exists idx_bookmarks_user
  on public.bookmarks(user_session_id);

-- Add comments
comment on table public.bookmarks is 'User bookmarks for articles';
comment on column public.bookmarks.tenantid is 'FK to tenants.id';
comment on column public.bookmarks.projectid is 'FK to projects.id';
`;

const createPreferencesTableSQL = `
-- ============================================
-- Migration: Create user_preferences table
-- Purpose: Store user preferences and settings
-- ============================================

-- Create user_preferences table
create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- User identification
  user_session_id text not null unique,

  -- Preferences
  favorite_categories text[] default '{}',
  notification_enabled boolean default true,
  theme text default 'light',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints
alter table public.user_preferences
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade;

alter table public.user_preferences
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.user_preferences enable row level security;

-- RLS Policies
create policy "anon_select_preferences"
  on public.user_preferences for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_all_preferences"
  on public.user_preferences for all to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  )
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Add indexes
create index if not exists idx_preferences_tenant_project
  on public.user_preferences(tenantid, projectid);
create index if not exists idx_preferences_user
  on public.user_preferences(user_session_id);

-- Add comments
comment on table public.user_preferences is 'User preferences and settings';
comment on column public.user_preferences.tenantid is 'FK to tenants.id';
comment on column public.user_preferences.projectid is 'FK to projects.id';
`;

async function createSchema() {
  console.log('Creating database schema...\n');

  const migrations = [
    { name: 'create_news_articles_table', sql: createArticlesTableSQL },
    { name: 'create_bookmarks_table', sql: createBookmarksTableSQL },
    { name: 'create_user_preferences_table', sql: createPreferencesTableSQL },
  ];

  for (const migration of migrations) {
    console.log(`Creating migration: ${migration.name}...`);

    const response = await fetch('http://localhost:3006/api/supabase/migrations/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: migration.name,
        sql: migration.sql,
        autoApply: true
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ ${migration.name}: Created and applied`);
      console.log(`   File: ${result.fileName}`);
      if (result.validation && !result.validation.passed) {
        console.log(`   ⚠️  Validation warnings:`, result.validation.warnings);
      }
    } else {
      console.error(`❌ ${migration.name}: Failed`);
      console.error(`   Error:`, result.error);
      if (result.validation) {
        console.error(`   Validation errors:`, result.validation.errors);
      }
    }
    console.log('');
  }

  console.log('Schema creation complete!');
}

createSchema().catch(console.error);
