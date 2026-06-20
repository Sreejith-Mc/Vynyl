// ---- Core types (now backed by real iTunes data) ----

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string; // cover image url ('' -> fall back to color)
  audio: string; // full-length streaming URL (Jamendo) — format is swappable
  len: number; // seconds
  color: string; // fallback / accent tint
}

export type Quality = "standard" | "lossless";

/**
 * Resolve the playable URL for a track at the requested quality.
 * Jamendo stream URLs carry a `format=` param we can swap: mp32 (320kbps MP3)
 * for standard, flac for lossless. Non-Jamendo URLs are returned untouched.
 */
export function streamUrl(t: Track | undefined, quality: Quality): string {
  if (!t || !t.audio) return "";
  if (/[?&]format=/.test(t.audio)) {
    return t.audio.replace(/([?&]format=)[^&]*/, `$1${quality === "lossless" ? "flac" : "mp32"}`);
  }
  return t.audio;
}

export function qualityLabel(quality: Quality): string {
  return quality === "lossless" ? "FLAC · Lossless" : "MP3 · 320";
}

export interface Album {
  id: string; // iTunes collectionId
  title: string;
  artist: string;
  artwork: string;
  color: string;
  meta: string;
  tracks: Track[]; // loaded lazily
}

export interface PlaylistMeta {
  id: string;
  title: string;
  sub: string;
  query: string; // search term that fills the playlist
  artwork: string; // cover (first result), filled at load
  color: string;
}

export const ACCENT = "#F2542D";
export const MUTED = "#a89e89";

// Warm palette used as a fallback tint when art is still loading.
export const PALETTE = ["#C96F4A", "#6E8499", "#7E8B6A", "#D2A24C", "#8A6A8C", "#4F8C82", "#B5533C", "#A77A55"];

// Curated "Made for you" playlists — each is really a search term.
export const PLAYLIST_DEFS: { id: string; title: string; sub: string; query: string }[] = [
  { id: "daily", title: "Daily Mix 1", sub: "Your daily blend", query: "today's hits" },
  { id: "focus", title: "Deep Focus", sub: "Instrumental calm", query: "lofi beats" },
  { id: "chill", title: "Evening Chill", sub: "Wind down", query: "acoustic chill" },
  { id: "power", title: "Power Hour", sub: "Upbeat energy", query: "workout pop" },
  { id: "nights", title: "City Nights", sub: "After dark", query: "electronic night" },
];

// Queries that fill the home shelves.
export const SHELF_QUERIES = {
  recently: "indie pop",
  charts: "top hits 2024",
  newReleases: "new pop album",
};

export const GENRES: [string, string][] = [
  ["Pop", "#E0654F"],
  ["Hip-Hop", "#C98A3C"],
  ["Lo-fi", "#7E8B6A"],
  ["Jazz", "#8A6A8C"],
  ["Electronic", "#4F8C82"],
  ["Rock", "#B5533C"],
  ["Classical", "#6E8499"],
  ["Acoustic", "#A77A55"],
];

export const LIB_TABS = ["Playlists", "Artists", "Albums", "Downloads"] as const;
export type LibTab = (typeof LIB_TABS)[number];

export const ARTISTS: [string, string][] = [
  ["Coldplay", "#C96F4A"],
  ["Dua Lipa", "#6E8499"],
  ["The Weeknd", "#8A6A8C"],
  ["Tame Impala", "#D2A24C"],
];

export interface SettingRow {
  icon: string;
  label: string;
  value: string;
}

export const SETTINGS: SettingRow[] = [
  { icon: "♪", label: "Audio quality", value: "Very high" },
  { icon: "↓", label: "Downloads", value: "24 songs" },
  { icon: "◉", label: "Playback", value: "" },
  { icon: "⚑", label: "Notifications", value: "" },
  { icon: "ⓘ", label: "Account", value: "Premium" },
  { icon: "⚙", label: "Settings", value: "" },
];

export function fmt(sec: number): string {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

export function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
