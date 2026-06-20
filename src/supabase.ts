import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_ENABLED = !!(url && key);

// One client for the app's lifetime; null when env vars aren't set (then the
// app falls back to on-device storage — see backend.ts).
export const supabase: SupabaseClient | null = SUPABASE_ENABLED ? createClient(url!, key!) : null;
