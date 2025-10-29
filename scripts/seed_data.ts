import { createClient } from '@supabase/supabase-js';
import { mockArticles } from '../src/data/mockNews';

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

const TENANT_ID = '2luDlbgjvhO32uRKNns0OwSKemA3';
const PROJECT_ID = '5f6a2196-caa1-4628-9820-b199b232b496';

async function seedData() {
  console.log('Seeding news articles...\n');

  // Transform mock data to database format
  const articlesForDB = mockArticles.map(article => ({
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: article.title,
    summary: article.summary,
    content: article.content || 'Full article content would go here...',
    source: article.source,
    category: article.category,
    image_url: article.imageUrl,
    likes: article.likes || 0,
    views: article.views || 0,
    reading_time: article.readingTime || 5,
    is_breaking: article.isBreaking || false
  }));

  const { data, error } = await supabase
    .from('news_articles')
    .insert(articlesForDB)
    .select();

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log(`✅ Successfully seeded ${data.length} articles`);
    console.log('Sample:', data[0]);
  }
}

seedData().catch(console.error);
