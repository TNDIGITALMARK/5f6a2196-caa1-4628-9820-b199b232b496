import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Create Supabase client with scoped token for multi-tenant isolation
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SCOPED_TOKEN || 'placeholder_will_be_injected_at_runtime'}`
      }
    }
  }
);

// Tenant and Project IDs (automatically enforced by RLS)
export const TENANT_ID = '2luDlbgjvhO32uRKNns0OwSKemA3';
export const PROJECT_ID = '5f6a2196-caa1-4628-9820-b199b232b496';
