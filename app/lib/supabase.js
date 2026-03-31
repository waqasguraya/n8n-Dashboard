import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://blrvaygupvkouryksvae.supabase.co:5432/postgres";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscnZheWd1cHZrb3VyeWtzdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjUyMzgsImV4cCI6MjA5MDQ0MTIzOH0.A3uXPLulwzKxfv8bbKLtHirZ-0fR3tiboVeIMItm5rE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);