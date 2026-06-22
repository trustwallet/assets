import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder');
export const PROPERTY_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET ?? 'property-media';
