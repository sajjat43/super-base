import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmorpjbkipwdimjjwpuq.supabase.co';  // Replace with your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtb3JwamJraXB3ZGltamp3cHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM4MzgsImV4cCI6MjA1NjU1OTgzOH0.BFWzKE71Ajk--VuoPRneK19eDdRR0bkNPhAon9KwqwY';  // Replace with your anon key
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtb3JwamJraXB3ZGltamp3cHVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk4MzgzOCwiZXhwIjoyMDU2NTU5ODM4fQ.K7e3T40OPj0QODYvn21QZfqg2Hy6HSmaRK1VFoOCnew';  // Replace with your service role key

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
export const serviceRole = createClient(supabaseUrl, supabaseServiceRoleKey);