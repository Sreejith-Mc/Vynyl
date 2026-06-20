# Vynyl

A warm, neumorphic music-player app — built in **React + TypeScript + Vite** from the Claude Design handoff. It plays **real, full-length music** with **FLAC lossless** support, streamed from **Jamendo's** free Creative-Commons catalog.

> *Every song ever made. Wrapped in warmth.*

## Setup — add a free Jamendo Client ID

Vynyl streams from Jamendo, which needs a free API key:

1. Sign up at **https://devportal.jamendo.com/**
2. Create an app and copy its **Client ID**
3. Put it in `.env`: `VITE_JAMENDO_CLIENT_ID=your_client_id`
4. Restart the dev server

Until a key is present the app runs and shows an in-app setup card.

## Real audio + lossless

- **Full-length playback** of real tracks (no 30-second previews) via a real `HTMLAudioElement` — see `src/store.tsx`.
- **Lossless toggle** — switch between **MP3 320** and **FLAC**. Toggling hot-swaps the stream at the current position without interrupting playback; if a track has no FLAC master it transparently falls back to MP3. Reachable from the Now Playing pill and the Profile → *Audio quality* row.
- Play/pause, next/prev, click-to-seek, shuffle, repeat, like, and auto-advance all operate on the real audio element.
- Search any song/artist; browse playlists, albums, and genres — all real Jamendo data with real cover art.
- **Catalog scope:** Jamendo is independent/Creative-Commons music (all genres), not the major-label mainstream catalog — full-length "every mainstream song" only exists behind paid services (Spotify Premium / Apple Music). The catalog sits behind a thin layer (`src/jamendo.ts` + `src/catalog.tsx`), so another source can be swapped in without touching the UI.
- In dev, API calls go through a Vite proxy (`/jamendo` → `api.jamendo.com`) to avoid CORS; audio streams play directly.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build
```

## What's inside

A single 390×844 phone frame with eight fully interactive screens:

| Screen | Notes |
| --- | --- |
| **Splash** | Spinning vinyl logo, Get started / Log in |
| **Home** | Recently played, Made for you, Trending now, New releases |
| **Search** | Browse-all genre grid + live song/artist/album filtering |
| **Library** | Playlists / Artists / Albums / Downloads tabs |
| **Profile** | Avatar, stats, settings list |
| **Detail** | Playlist & album view with track list and play / like / shuffle |
| **Now Playing** | Spinning vinyl (pauses with playback), seek bar, full transport |
| **Queue** | Now-playing card with animated equaliser + up-next list |

### Behaviour

- A 1-second timer advances the current track and auto-skips at the end.
- Play / pause, next / prev (with restart-if-past-6s), shuffle, repeat, like, and click-to-seek all work.
- Mini player docks above the nav whenever the app is booted and reflects live progress.
- Every tappable element has a press-scale affordance; screen and sheet transitions use the design's original keyframes.

## Structure

```
src/
  App.tsx          providers + shell + screen routing
  store.tsx        player state + real HTMLAudioElement (play/pause/seek/next/prev/shuffle/repeat/lossless)
  jamendo.ts       Jamendo API client (search, popular, tags, albums) + MP3/FLAC stream URLs
  catalog.tsx      loads Home shelves from Jamendo on boot, primes the player
  data.ts          types, palette, playlist/genre definitions, helpers
  icons.tsx        SVG icon set (ported verbatim)
  components/Cover.tsx   album cover (real artwork, color fallback)
  components/Shell.tsx   status bar, mini player, bottom nav
  screens/         Splash, Home, Search, Library, Profile, Detail, NowPlaying, Queue
  styles.css       fonts, keyframes, phone frame
```

Visuals (colors, shadows, radii, animations) are ported 1:1 from the `Vynyl.dc.html` design prototype.
