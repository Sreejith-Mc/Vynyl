// ---- Core types (backed by real JioSaavn data) ----

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string; // cover image url ('' -> fall back to color)
  audio: string; // full-length streaming URL (JioSaavn CDN, bitrate is swappable)
  len: number; // seconds
  color: string; // fallback / accent tint
}

// JioSaavn streams cap at 320kbps AAC (no true lossless on the free tier),
// so the toggle switches bitrate: 160kbps (Normal) <-> 320kbps (High).
export type Quality = "standard" | "high";

/**
 * Resolve the playable URL for a track at the requested quality.
 * JioSaavn CDN URLs end in `_<bitrate>.mp4` (e.g. _96/_160/_320), so we just
 * swap the bitrate segment. Non-matching URLs are returned untouched.
 */
export function streamUrl(t: Track | undefined, quality: Quality): string {
  if (!t || !t.audio) return "";
  if (/_\d+\.mp4/.test(t.audio)) {
    return t.audio.replace(/_\d+\.mp4/, `_${quality === "high" ? "320" : "160"}.mp4`);
  }
  return t.audio;
}

export function qualityLabel(quality: Quality): string {
  return quality === "high" ? "320 kbps · High" : "160 kbps";
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
  { id: "daily", title: "Malayalam Melodies", sub: "Mollywood favourites", query: "malayalam melody hits" },
  { id: "focus", title: "Deep Focus", sub: "Lo-fi & instrumental", query: "lofi" },
  { id: "chill", title: "Sushin Shyam", sub: "On repeat", query: "Sushin Shyam" },
  { id: "power", title: "Party Hour", sub: "Upbeat energy", query: "party hits" },
  { id: "nights", title: "Romantic Nights", sub: "After dark", query: "romantic hits" },
];

// Queries that fill the home shelves.
export const SHELF_QUERIES = {
  recently: "malayalam hits",
  charts: "trending india",
  newReleases: "2025",
};

// Browse-all tiles double as quick searches (languages + genres).
export const GENRES: [string, string][] = [
  ["Malayalam", "#E0654F"],
  ["Tamil", "#C98A3C"],
  ["Hindi", "#7E8B6A"],
  ["Telugu", "#8A6A8C"],
  ["English", "#4F8C82"],
  ["Romance", "#B5533C"],
  ["Lo-fi", "#6E8499"],
  ["Party", "#A77A55"],
];

export const LIB_TABS = ["Playlists", "Artists", "Albums", "Downloads"] as const;
export type LibTab = (typeof LIB_TABS)[number];

export const ARTISTS: [string, string][] = [
  ["Sushin Shyam", "#C96F4A"],
  ["Arijit Singh", "#6E8499"],
  ["Anirudh Ravichander", "#8A6A8C"],
  ["A.R. Rahman", "#D2A24C"],
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
  { icon: "§", label: "Terms & Privacy", value: "" },
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
