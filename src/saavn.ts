// Client over JioSaavn's public web API. This is the catalog behind Vynyl:
// real Malayalam / Tamil / Hindi / Telugu / English songs, full-length, free.
//
// JioSaavn returns each track's media URL DES-encrypted; we decrypt it
// (the same thing every community JioSaavn API does internally) to get the
// real CDN URL, then swap the bitrate segment for the quality toggle.
//
// Dev calls go through Vite's /saavn proxy (vite.config.ts) to dodge CORS.
// Audio plays directly from the saavncdn.com URL (no CORS needed for media).

import CryptoJS from "crypto-js";
import { PALETTE, type Album, type Track } from "./data";

// Always relative: dev = Vite proxy, prod = serverless function (both at /saavn).
const BASE = "/saavn";
const DES_KEY = CryptoJS.enc.Utf8.parse("38346591");

// ---- helpers ----

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

// Decode HTML entities JioSaavn embeds in titles (&amp; &quot; &#039; …).
function decode(s: string): string {
  if (!s) return "";
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

function hiRes(img: string): string {
  return (img || "").replace(/\d+x\d+/, "500x500");
}

function decrypt(enc: string): string {
  if (!enc) return "";
  try {
    const dec = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(enc) } as CryptoJS.lib.CipherParams, DES_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return dec.toString(CryptoJS.enc.Utf8).replace(/^http:/, "https:");
  } catch {
    return "";
  }
}

interface RawSong {
  id: string;
  title?: string;
  name?: string;
  subtitle?: string;
  image?: string;
  language?: string;
  more_info?: {
    duration?: string;
    album?: string;
    encrypted_media_url?: string;
    artistMap?: { primary_artists?: { name: string }[] };
  };
}

function artistOf(song: RawSong): string {
  const pa = song.more_info?.artistMap?.primary_artists;
  if (Array.isArray(pa) && pa.length) return pa.map((a) => decode(a.name)).join(", ");
  return decode(song.subtitle || "");
}

function toTrack(song: RawSong): Track | null {
  const enc = song.more_info?.encrypted_media_url;
  if (!enc) return null;
  const audio = decrypt(enc);
  if (!audio) return null;
  return {
    id: "js" + song.id,
    title: decode(song.title || song.name || ""),
    artist: artistOf(song),
    album: decode(song.more_info?.album || ""),
    artwork: hiRes(song.image || ""),
    audio,
    len: Number(song.more_info?.duration) || 0,
    color: colorFor(String(song.id)),
  };
}

function tracksFrom(list: RawSong[]): Track[] {
  const out: Track[] = [];
  const seen = new Set<string>();
  for (const s of list || []) {
    const t = toTrack(s);
    if (t && !seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }
  return out;
}

async function call(name: string, params: Record<string, string | number>): Promise<any> {
  const qs = new URLSearchParams({
    __call: name,
    _format: "json",
    _marker: "0",
    api_version: "4",
    ctx: "web6dot0",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  try {
    const r = await fetch(`${BASE}/api.php?${qs.toString()}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ---- public API ----

export async function searchTracks(term: string, limit = 25): Promise<Track[]> {
  if (!term.trim()) return [];
  const j = await call("search.getResults", { q: term, n: limit, p: 1 });
  return tracksFrom(j?.results ?? []);
}

/** Albums for the "New releases" / library shelves. */
export async function searchAlbums(term: string, limit = 12): Promise<Album[]> {
  const j = await call("search.getAlbumResults", { q: term, n: limit, p: 1 });
  const res: any[] = j?.results ?? [];
  return res
    .filter((a) => a.id && a.title)
    .map((a) => ({
      id: String(a.id),
      title: decode(a.title),
      artist: decode(a.subtitle || a.more_info?.music || ""),
      artwork: hiRes(a.image || ""),
      color: colorFor(String(a.id)),
      meta: "Album" + (a.year ? " · " + a.year : ""),
      tracks: [],
    }));
}

/** All tracks in an album. Falls back to a search if details are empty. */
export async function albumTracks(albumId: string, fallbackQuery = ""): Promise<Track[]> {
  const j = await call("content.getAlbumDetails", { albumid: albumId });
  const list: RawSong[] = j?.list ?? j?.songs ?? [];
  const tracks = tracksFrom(list);
  if (tracks.length) return tracks;
  return fallbackQuery ? searchTracks(fallbackQuery, 25) : [];
}
