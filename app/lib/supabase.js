import { createClient } from "@supabase/supabase-js";

export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not found. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Export a mock client for build time compatibility
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ error: null }),
    update: () => Promise.resolve({ error: null }),
    delete: () => Promise.resolve({ error: null }),
    eq: function() { return this; }
  })
};