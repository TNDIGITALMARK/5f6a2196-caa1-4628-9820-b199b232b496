-- ============================================
-- Migration: Create helper functions
-- Purpose: Utility functions for atomic operations
-- ============================================

-- Function to increment article views atomically
-- This prevents race conditions when multiple users view the same article
create or replace function public.increment_article_views(article_id text)
returns void
language plpgsql
security definer
as $$
begin
  update public.articles
  set
    total_views = total_views + 1,
    updated_at = now()
  where id = article_id
    and tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid;
end;
$$;

-- Add helpful comment
comment on function public.increment_article_views(text) is 'Atomically increment article views count';

-- Grant execute permission to anon and authenticated roles
grant execute on function public.increment_article_views(text) to anon;
grant execute on function public.increment_article_views(text) to authenticated;
