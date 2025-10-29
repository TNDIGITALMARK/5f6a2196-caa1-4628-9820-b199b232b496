import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: 'Bearer placeholder_will_be_injected_at_runtime'
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== EXPLORING DATABASE SCHEMA ===\n');

  const tablesToCheck = ['articles', 'news', 'posts', 'bookmarks', 'users', 'preferences', 'news_articles'];

  for (const tableName of tablesToCheck) {
    const result = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!result.error) {
      console.log('✅ ' + tableName + ': exists (' + (result.count || 0) + ' rows)');
    }
  }

  console.log('\n=== DONE ===');
}

exploreSchema().catch(console.error);
