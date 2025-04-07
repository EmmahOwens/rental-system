
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use hardcoded values for Supabase URL and anon key instead of environment variables
const supabaseUrl = 'https://bjhpsgnovsumyvkrglgz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqaHBzZ25vdnN1bXl2a3JnbGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDc3NjAsImV4cCI6MjA1NjQyMzc2MH0.npoPPpae7MdpP_kKl37Mec7rnBkSsb7zUVYcIHh_4ZY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
}

// Create Supabase client with improved options
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    },
    global: {
      fetch: (...args) => {
        return fetch(...args).catch(err => {
          console.error('Supabase fetch error:', err);
          throw err;
        });
      }
    }
  }
);
