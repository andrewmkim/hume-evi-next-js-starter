import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahawhnracswfyulfdfaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXdobnJhY3N3Znl1bGZkZmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDUzMTksImV4cCI6MjA2MjMyMTMxOX0.W4dWlbf-Q8yOGgsxVPcptMBg8sRviE0CaDVzB4fBEFQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 