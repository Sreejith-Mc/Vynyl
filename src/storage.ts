// On-device persistence + lightweight local accounts.
//
// NOTE: This is device-local, not a real auth server. Passwords are salted +
// SHA-256 hashed (never stored in plain text), but there is no cross-device
// sync and this is not a substitute for proper cloud auth. When Vynyl goes
// public, swap this layer for a backend (e.g. Supabase) — the store calls
// these functions in one place, so only this file changes.

import type { Track } from "./data";

export interface User {
  name: string;
  email: string;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: number;
  tracks: Track[];
}

interface StoredUser extends User {
  salt: string;
  hash: string;
}

interface UserData {
  liked: Record<string, Track>;
  playlists: Playlist[];
}

const USERS_KEY = "vynyl.users";
const SESSION_KEY = "vynyl.session";
const QUALITY_KEY = "vynyl.quality";
const dataKey = (email: string) => `vynyl.data.${email.toLowerCase()}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

// ---- password hashing (Web Crypto) ----
function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + ":" + password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---- accounts ----
function getUsers(): Record<string, StoredUser> {
  return read<Record<string, StoredUser>>(USERS_KEY, {});
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  const key = email.trim().toLowerCase();
  const users = getUsers();
  if (users[key]) throw new Error("An account with this email already exists.");
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const user: StoredUser = { name: name.trim(), email: key, salt, hash };
  users[key] = user;
  write(USERS_KEY, users);
  write(SESSION_KEY, key);
  return { name: user.name, email: user.email };
}

export async function login(email: string, password: string): Promise<User> {
  const key = email.trim().toLowerCase();
  const user = getUsers()[key];
  if (!user) throw new Error("No account found for this email.");
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) throw new Error("Incorrect password.");
  write(SESSION_KEY, key);
  return { name: user.name, email: user.email };
}

export function currentSession(): User | null {
  const key = read<string | null>(SESSION_KEY, null);
  if (!key) return null;
  const user = getUsers()[key];
  return user ? { name: user.name, email: user.email } : null;
}

export function clearSession() {
  write(SESSION_KEY, null);
}

// ---- per-user data ----
export function loadUserData(email: string): UserData {
  return read<UserData>(dataKey(email), { liked: {}, playlists: [] });
}

export function saveUserData(email: string, data: UserData) {
  write(dataKey(email), data);
}

// ---- global prefs ----
export function loadQuality(): "standard" | "high" | null {
  return read<"standard" | "high" | null>(QUALITY_KEY, null);
}
export function saveQuality(q: "standard" | "high") {
  write(QUALITY_KEY, q);
}

export function newId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : "pl_" + randomHex(8);
}
