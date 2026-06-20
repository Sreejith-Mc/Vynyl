// Unified auth + library backend. Uses Supabase when configured (real accounts,
// cloud-synced across devices); otherwise falls back to on-device storage so
// the app still works. The store only talks to this module, so swapping or
// extending backends never touches the UI.

import type { Track } from "./data";
import * as local from "./storage";
import type { Playlist } from "./storage";
import { SUPABASE_ENABLED, supabase } from "./supabase";

export const CLOUD = SUPABASE_ENABLED;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface Library {
  liked: Record<string, Track>;
  playlists: Playlist[];
}

const EMPTY: Library = { liked: {}, playlists: [] };

function mapSupaUser(u: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser {
  const name = (u.user_metadata?.name as string) || (u.email ? u.email.split("@")[0] : "You");
  return { id: u.id, name, email: u.email || "" };
}

/** Restore an existing session on app load (or null). */
export async function restore(): Promise<AuthUser | null> {
  if (CLOUD && supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session ? mapSupaUser(data.session.user) : null;
  }
  const u = local.currentSession();
  return u ? { id: u.email, name: u.name, email: u.email } : null;
}

export async function signup(name: string, email: string, password: string): Promise<{ user: AuthUser | null; needsConfirm: boolean }> {
  if (CLOUD && supabase) {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } });
    if (error) throw new Error(error.message);
    if (!data.session || !data.user) return { user: null, needsConfirm: true };
    return { user: mapSupaUser(data.user), needsConfirm: false };
  }
  const u = await local.signup(name, email, password);
  return { user: { id: u.email, name: u.name, email: u.email }, needsConfirm: false };
}

export async function login(email: string, password: string): Promise<AuthUser> {
  if (CLOUD && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(error.message);
    return mapSupaUser(data.user);
  }
  const u = await local.login(email, password);
  return { id: u.email, name: u.name, email: u.email };
}

export async function logout(): Promise<void> {
  if (CLOUD && supabase) {
    await supabase.auth.signOut();
    return;
  }
  local.clearSession();
}

export async function loadLibrary(user: AuthUser): Promise<Library> {
  if (CLOUD && supabase) {
    const { data, error } = await supabase.from("user_library").select("liked,playlists").eq("user_id", user.id).maybeSingle();
    if (error || !data) return EMPTY;
    return { liked: (data.liked as Library["liked"]) || {}, playlists: (data.playlists as Library["playlists"]) || [] };
  }
  const d = local.loadUserData(user.email);
  return { liked: d.liked, playlists: d.playlists };
}

export async function saveLibrary(user: AuthUser, lib: Library): Promise<void> {
  if (CLOUD && supabase) {
    try {
      await supabase.from("user_library").upsert({ user_id: user.id, liked: lib.liked, playlists: lib.playlists, updated_at: new Date().toISOString() });
    } catch {
      /* offline / table missing — keep playing, retry on next change */
    }
    return;
  }
  local.saveUserData(user.email, lib);
}
