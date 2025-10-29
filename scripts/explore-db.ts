import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer placeholder_will_be_injected_at_runtime`
      }
    }
  }
);

async function exploreDatabase() {
  console.log('=== DATABASE EXPLORATION ===\n');

  // Try to list tables by querying information_schema
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (tablesError) {
    console.error('Error fetching tables:', tablesError);
  } else {
    console.log('Available Tables:');
    for (const table of tables || []) {
      console.log(`  - ${table.table_name}`);
    }
  }

  console.log('\n=== CHECKING FOR EXISTING NEWS DATA ===\n');

  // Check if news_articles table exists
  const { data: newsArticles, error: newsError } = await supabase
    .from('news_articles')
    .select('*')
    .limit(1);

  if (newsError) {
    console.log('news_articles table:', newsError.message);
  } else {
    console.log('✅ news_articles table exists with', newsArticles?.length || 0, 'sample rows');
  }

  // Check if articles table exists (alternative name)
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .limit(1);

  if (articlesError) {
    console.log('articles table:', articlesError.message);
  } else {
    console.log('✅ articles table exists with', articles?.length || 0, 'sample rows');
  }

  // Check if bookmarks table exists
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*')
    .limit(1);

  if (bookmarksError) {
    console.log('bookmarks table:', bookmarksError.message);
  } else {
    console.log('✅ bookmarks table exists with', bookmarks?.length || 0, 'sample rows');
  }

  // Check if user_interactions table exists
  const { data: interactions, error: interactionsError } = await supabase
    .from('user_interactions')
    .select('*')
    .limit(1);

  if (interactionsError) {
    console.log('user_interactions table:', interactionsError.message);
  } else {
    console.log('✅ user_interactions table exists with', interactions?.length || 0, 'sample rows');
  }
}

exploreDatabase().catch(console.error);
