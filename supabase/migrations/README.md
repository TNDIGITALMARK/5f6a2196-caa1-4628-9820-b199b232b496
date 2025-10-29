# Supabase Migrations for News App

This directory contains SQL migrations for the news aggregation app. These migrations need to be applied to your Supabase database to enable data persistence.

## Required Tables

The app requires two main tables with multi-tenant isolation:

1. **articles** - Stores news articles
2. **user_interactions** - Stores user bookmarks and likes

## How to Apply Migrations

### Option 1: Via Supabase Dashboard (Recommended for Manual Setup)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of `001_create_articles_table.sql`
4. Paste into the SQL Editor and click **Run**
5. Repeat for `002_create_user_interactions_table.sql`

### Option 2: Via Supabase CLI

If you have the Supabase CLI installed and linked to your project:

```bash
# Apply all pending migrations
supabase db push

# Or apply migrations remotely
supabase db push --db-url "postgresql://postgres.hfndfmtxhqvubnfiwzlz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### Option 3: Via Migration API (Automated)

The migrations can be automatically applied via the migration API endpoint:

```bash
curl -X POST http://localhost:3006/api/supabase/migrations/execute \
  -H "Content-Type: application/json" \
  -d @migration-payload.json
```

## Migration Files

- `001_create_articles_table.sql` - Creates articles table with tenant/project isolation
- `002_create_user_interactions_table.sql` - Creates user interactions table for bookmarks/likes

## Important Notes

- All tables include `tenantid` and `projectid` columns for multi-tenant isolation
- Row Level Security (RLS) is enabled on all tables
- RLS policies automatically filter data based on JWT claims
- Foreign key constraints ensure referential integrity with `tenants` and `projects` tables
- Indexes are created for optimal query performance

## Verifying Migrations

After applying migrations, you can verify they were successful:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('articles', 'user_interactions');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('articles', 'user_interactions');

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

## Troubleshooting

If you encounter issues:

1. **"Expected 3 parts in JWT"** - This means the scoped token is not being injected. Make sure the Zylo client is properly initialized.
2. **"relation does not exist"** - The migrations haven't been applied yet. Follow the steps above to apply them.
3. **"permission denied"** - RLS policies might be blocking access. Verify your JWT contains the correct tenant_id and project_id claims.

## Data Seeding

The app will automatically seed the database with mock articles on first load if the articles table is empty. You can trigger this by:

1. Clearing the database: `DELETE FROM articles WHERE tenantid = '2luDlbgjvhO32uRKNns0OwSKemA3';`
2. Reloading the app - it will detect the empty table and seed it automatically
