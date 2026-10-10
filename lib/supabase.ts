import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://csfcowujdbpqztaphpur.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmNvd3VqZGJwcXp0YXBocHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MDI2ODYsImV4cCI6MjEwNzE3ODY4Nn0.FSxqRGfFCvQryA5X3aLHesHpigGcVL0NAk99XIewMoU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Health check to verify live connectivity to Supabase project
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && !error.message?.includes('relation') && !error.message?.includes('does not exist')) {
      return { connected: false, message: error.message, details: error };
    }
    return {
      connected: true,
      message: 'Successfully connected to Supabase project csfcowujdbpqztaphpur.supabase.co',
      details: data,
    };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection failed' };
  }
}
