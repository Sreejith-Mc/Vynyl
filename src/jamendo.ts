// Client over Jamendo's free API (https://devportal.jamendo.com/).
// Free Creative-Commons catalog with FULL-length tracks and, for many tracks,
// true FLAC lossless — which is what powers the lossless toggle.
//
// Dev calls go through Vite's /jamendo proxy (vite.config.ts) to avoid CORS;
// prod calls hit api.jamendo.com directly. Audio stream URLs are played
// directly by the <audio> element (media playback needs no CORS).

import { PALETTE, type Album, type Track } from "./data";

const CLIENT_ID = (import.meta.env.VITE_JAMENDO_CLIENT_ID as string) || "";
export const JAMENDO_ENABLED = CLIENT_ID.trim().length > 0;

const BASE = import.meta.env.DEV ? "/jamendo/v3.0" : "https://api.jamendo.com/v3.0";

interface RawTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name?: string;
  album_id?: string;
  duration?: number;
  audio?: string;
  image?: string;
  album_image?: string;
}

interface RawAlbum {
  id: string;
  name: string;
  artist_name: string;
  image?: string;
}

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function toTrack(t: RawTrack): Track | null {
  if (!t.audio || !t.name) return null;
  return {
    id: "jt" + t.id,
    title: t.name,
    artist: t.artist_name,
    album: t.album_name ?? "",
    artwork: t.image || t.album_image || "",
    audio: t.audio,
    len: Number(t.duration) || 0,
    color: colorFor(String(t.id)),
  };
}

async function jget(path: string): Promise<any[]> {
  if (!JAMENDO_ENABLED) return [];
  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE}${path}${sep}client_id=${CLIENT_ID}&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as any[];
  } catch {
    return [];
  }
}

const q = (s: string) => encodeURIComponent(s);
const COMMON = "audioformat=mp32&imagesize=400&include=musicinfo";

function tracksFrom(raw: RawTrack[]): Track[] {
  const out: Track[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    const t = toTrack(r);
    if (t && !seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }
  return out;
}

/** Free-text song search. */
export async function searchTracks(term: string, limit = 25): Promise<Track[]> {
  if (!term.trim()) return [];
  const raw = await jget(`/tracks/?namesearch=${q(term)}&${COMMON}&order=popularity_total&limit=${limit}`);
  return tracksFrom(raw as RawTrack[]);
}

/** Popular tracks (used for charts / recently played). */
export async function popularTracks(limit = 10): Promise<Track[]> {
  const raw = await jget(`/tracks/?${COMMON}&order=popularity_total&limit=${limit}`);
  return tracksFrom(raw as RawTrack[]);
}

/** Tracks for a tag/genre/mood. */
export async function tagTracks(tag: string, limit = 25): Promise<Track[]> {
  const raw = await jget(`/tracks/?tags=${q(tag)}&${COMMON}&order=popularity_total&limit=${limit}`);
  const t = tracksFrom(raw as RawTrack[]);
  // Fall back to a name search if the tag is sparse.
  return t.length ? t : searchTracks(tag, limit);
}

/** Albums (used for "New releases" / library). */
export async function newAlbums(limit = 10): Promise<Album[]> {
  const raw = (await jget(`/albums/?imagesize=400&order=releasedate_desc&limit=${limit}`)) as RawAlbum[];
  return raw
    .filter((a) => a.id && a.name)
    .map((a) => ({
      id: String(a.id),
      title: a.name,
      artist: a.artist_name,
      artwork: a.image ?? "",
      color: colorFor(String(a.id)),
      meta: "Album",
      tracks: [],
    }));
}

/** All tracks in an album. */
export async function albumTracks(albumId: string): Promise<Track[]> {
  const raw = (await jget(`/albums/tracks/?id=${albumId}&${COMMON}`)) as { tracks?: RawTrack[] }[];
  const album = raw[0];
  if (!album?.tracks) return [];
  return tracksFrom(album.tracks);
}
