const { createClient } = require('@supabase/supabase-js');

// Import a Supabase client from the Supabase CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// สร้าง Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);