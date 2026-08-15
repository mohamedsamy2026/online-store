// Import Supabase
import { createClient } from '@supabase/supabase-js';

// URL
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// API Key
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

//  Export Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


