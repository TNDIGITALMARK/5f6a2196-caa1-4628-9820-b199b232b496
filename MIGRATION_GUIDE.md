# 🚀 Local Storage to Supabase Migration Guide

This guide explains the migration from localStorage to Supabase for the News Aggregation App.

## 📋 Summary of Changes

### What Changed

**BEFORE (localStorage):**
- Articles, bookmarks, and likes stored in browser localStorage
- Data lost when localStorage is cleared
- No sync across devices or browsers
- Limited to ~5-10MB storage

**AFTER (Supabase):**
- Articles stored in `public.articles` table
- User interactions (bookmarks/likes) stored in `public.user_interactions` table
- Data persists across sessions, devices, and browsers
- Full database capabilities with queries, indexes, and relationships
- Multi-tenant isolation via Row Level Security (RLS)

### Files Modified

1. **`src/context/NewsContext.tsx`** - Updated to use Supabase queries instead of localStorage
2. **`lib/supabase/client.ts`** - Enhanced with TypeScript types
3. **`lib/supabase/queries.ts`** - NEW - All database operations
4. **`lib/supabase/types.ts`** - NEW - TypeScript database types

### Files Created

1. **`supabase/migrations/001_create_articles_table.sql`**
2. **`supabase/migrations/002_create_user_interactions_table.sql`**
3. **`supabase/migrations/003_create_helper_functions.sql`**
4. **`supabase/migrations/README.md`**

## 🗄️ Database Schema

### Table: `articles`

Stores all news articles with multi-tenant isolation.

```sql
CREATE TABLE public.articles (
  id TEXT PRIMARY KEY,              -- Article ID (from mock data)
  tenantid TEXT NOT NULL,           -- Tenant ID (RLS enforced)
  projectid UUID NOT NULL,          -- Project ID (RLS enforced)

  -- Content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  reading_time INTEGER DEFAULT 5,
  is_breaking BOOLEAN DEFAULT FALSE,

  -- Aggregate counts
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_articles_tenant_project` - Fast tenant/project filtering
- `idx_articles_category` - Fast category filtering
- `idx_articles_timestamp` - Fast chronological sorting
- `idx_articles_breaking` - Fast breaking news queries

### Table: `user_interactions`

Stores user bookmarks and likes with session-based tracking.

```sql
CREATE TABLE public.user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenantid TEXT NOT NULL,           -- Tenant ID (RLS enforced)
  projectid UUID NOT NULL,          -- Project ID (RLS enforced)

  -- User and article
  user_session_id TEXT NOT NULL,    -- Generated client-side
  article_id TEXT NOT NULL,         -- FK to articles.id

  -- Interaction flags
  is_bookmarked BOOLEAN DEFAULT FALSE,
  is_liked BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_session_id, article_id)  -- One interaction per user per article
);
```

**Indexes:**
- `idx_interactions_tenant_project` - Fast tenant/project filtering
- `idx_interactions_user_session` - Fast user lookup
- `idx_interactions_article` - Fast article lookup
- `idx_interactions_bookmarked` - Fast bookmarked article queries
- `idx_interactions_liked` - Fast liked article queries

## 🔐 Security: Row Level Security (RLS)

All tables have RLS enabled with policies that automatically filter data based on JWT claims:

```sql
-- Example policy (applied to all tables)
CREATE POLICY "anon_select_articles"
  ON public.articles FOR SELECT TO anon
  USING (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    AND projectid = (auth.jwt() ->> 'project_id')::uuid
  );
```

**What this means:**
- Users can ONLY see data for their tenant (`2luDlbgjvhO32uRKNns0OwSKemA3`)
- Users can ONLY see data for their project (`5f6a2196-caa1-4628-9820-b199b232b496`)
- No manual WHERE clauses needed - RLS handles it automatically
- Complete isolation between tenants and projects

## 🔄 Migration Steps

### Step 1: Apply Database Migrations

Choose one method:

#### Method A: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and run each migration file in order:
   - `supabase/migrations/001_create_articles_table.sql`
   - `supabase/migrations/002_create_user_interactions_table.sql`
   - `supabase/migrations/003_create_helper_functions.sql`

#### Method B: Supabase CLI

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Link to your project
supabase link --project-ref hfndfmtxhqvubnfiwzlz

# Push migrations
supabase db push
```

### Step 2: Verify Migrations

Run this query in the SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name, row_security
FROM information_schema.tables t
JOIN pg_tables p ON t.table_name = p.tablename
WHERE table_schema = 'public'
AND table_name IN ('articles', 'user_interactions');

-- Should show:
-- articles          | on
-- user_interactions | on
```

### Step 3: Start the Application

The app will automatically:
1. Detect if the `articles` table is empty
2. Seed it with mock articles on first load
3. Generate a session ID for the user (stored in localStorage)
4. Load bookmarks and likes from the database

```bash
npm run dev
```

## 📊 How It Works

### Data Flow

```
User Action
   ↓
NewsContext (React)
   ↓
Supabase Queries (lib/supabase/queries.ts)
   ↓
Supabase Client (lib/supabase/client.ts)
   ↓
Supabase Database
   ↓
RLS Policies (auto-filter by tenant/project)
   ↓
Return Data
```

### Session Management

The app uses **session-based tracking** for anonymous users:

1. On first visit, a unique session ID is generated: `session_1234567890_abcde`
2. Session ID is stored in localStorage: `news_app_session_id`
3. All user interactions are linked to this session ID
4. Session persists across page reloads
5. Clearing localStorage creates a new session

**Why session IDs?**
- Allows tracking bookmarks/likes without user authentication
- Works for anonymous users
- Can be upgraded to user-based tracking when auth is added

### Optimistic Updates

The app uses **optimistic updates** for better UX:

```typescript
// 1. Update UI immediately (optimistic)
setBookmarkedArticles([...bookmarks, articleId]);

// 2. Persist to database
await dbToggleBookmark(sessionId, articleId, true);

// 3. Revert on error
catch (error) {
  setBookmarkedArticles(bookmarks); // Undo optimistic update
}
```

**Benefits:**
- Instant UI feedback (no loading spinner)
- Graceful error handling
- Better perceived performance

## 🎯 Key Features

### 1. Automatic Data Seeding

On first load, if the database is empty:

```typescript
const articles = await getAllArticles();

if (articles.length === 0) {
  // Seed database with mock articles
  await upsertArticles(mockArticles);
}
```

### 2. Atomic View Counting

Uses a database function to prevent race conditions:

```sql
CREATE FUNCTION increment_article_views(article_id TEXT)
```

```typescript
await incrementArticleViews(articleId); // Atomic increment
```

### 3. Aggregate Like Counts

Articles store aggregate like counts for performance:

- When user likes: `total_likes = total_likes + 1`
- When user unlikes: `total_likes = total_likes - 1`
- No need to count `user_interactions` rows every time

### 4. Efficient Queries

All queries are optimized with indexes:

```typescript
// Fast query - uses idx_articles_timestamp
const articles = await getAllArticles();

// Fast query - uses idx_interactions_user_session
const bookmarks = await getBookmarkedArticleIds(sessionId);
```

## 🐛 Troubleshooting

### Error: "Expected 3 parts in JWT; got 1"

**Cause:** The scoped token is not being injected by Zylo client.

**Solution:**
1. Verify Zylo client is initialized in your app
2. Check that `process.env.SUPABASE_SCOPED_TOKEN` is set at runtime
3. The placeholder `placeholder_will_be_injected_at_runtime` should be replaced by Zylo

### Error: "relation 'articles' does not exist"

**Cause:** Migrations haven't been applied.

**Solution:**
1. Follow **Step 1: Apply Database Migrations** above
2. Verify migrations in Supabase Dashboard → Database → Tables

### Error: "permission denied for table articles"

**Cause:** RLS policies are blocking access.

**Solution:**
1. Verify your JWT contains correct claims:
   ```javascript
   console.log(await supabase.auth.getSession());
   // Should show tenant_id and project_id in JWT
   ```
2. Check RLS policies in Supabase Dashboard → Authentication → Policies

### Data Not Persisting

**Cause:** Database writes might be failing silently.

**Solution:**
1. Open browser console and check for errors
2. Look for "Error toggling bookmark" or similar messages
3. Verify RLS policies allow INSERT/UPDATE for your role

## 📚 Code Examples

### Fetching Articles

```typescript
import { getAllArticles } from '@/lib/supabase/queries';

const articles = await getAllArticles();
// Returns NewsArticle[] with automatic tenant/project filtering
```

### Toggling Bookmarks

```typescript
import { toggleBookmark, getOrCreateSessionId } from '@/lib/supabase/queries';

const sessionId = getOrCreateSessionId();
await toggleBookmark(sessionId, 'article-123', true); // Bookmark
await toggleBookmark(sessionId, 'article-123', false); // Unbookmark
```

### Toggling Likes

```typescript
import { toggleLike, getOrCreateSessionId } from '@/lib/supabase/queries';

const sessionId = getOrCreateSessionId();
await toggleLike(sessionId, 'article-123', true); // Like
await toggleLike(sessionId, 'article-123', false); // Unlike
// Also updates article's total_likes count automatically
```

### Incrementing Views

```typescript
import { incrementArticleViews } from '@/lib/supabase/queries';

await incrementArticleViews('article-123');
// Atomically increments total_views by 1
```

## 🚀 Next Steps

### 1. User Authentication

When you add user auth:

```typescript
// Replace session ID with user ID
const userId = (await supabase.auth.getUser()).data.user?.id;

await toggleBookmark(userId, articleId, true);
```

### 2. Real-time Updates

Enable real-time subscriptions:

```typescript
supabase
  .channel('articles-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'articles'
  }, (payload) => {
    console.log('Article changed:', payload);
    // Update UI in real-time
  })
  .subscribe();
```

### 3. Advanced Queries

Add more sophisticated queries:

```typescript
// Search articles
const results = await supabase
  .from('articles')
  .select('*')
  .textSearch('title', 'AI technology', { type: 'websearch' });

// Pagination
const { data } = await supabase
  .from('articles')
  .select('*')
  .range(0, 9) // First 10 items
  .order('timestamp', { ascending: false });
```

## ✅ Verification Checklist

After migration, verify:

- [ ] Migrations applied successfully
- [ ] Tables visible in Supabase Dashboard
- [ ] RLS enabled on both tables
- [ ] App loads without errors
- [ ] Articles display correctly
- [ ] Bookmarking works and persists
- [ ] Liking works and updates counts
- [ ] View counts increment
- [ ] Data persists after page reload
- [ ] Session ID generated and stored

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase Dashboard → Logs for database errors
3. Review this guide's Troubleshooting section
4. Verify JWT claims contain correct tenant_id and project_id

---

**Migration completed successfully! 🎉**

Your news app now uses Supabase for persistent, scalable data storage with full multi-tenant isolation.
