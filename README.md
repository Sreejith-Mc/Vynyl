# Vynyl

A warm, neumorphic music-player app — built in **React + TypeScript + Vite** from the Claude Design handoff. It plays **real, full-length music** — Malayalam, Tamil, Hindi, Telugu, English and more — streamed from **JioSaavn's** catalog, with a **320 / 160 kbps quality toggle**.

> *Every song ever made. Wrapped in warmth.*

## Real audio

- **Full-length playback** of real songs (no 30-second previews) via a real `HTMLAudioElement` — see `src/store.tsx`. No API key or login needed.
- **Huge multi-language catalog** — Malayalam, Tamil, Hindi, Telugu, English mainstream, etc., with real cover art.
- **Quality toggle** — switch between **320 kbps (High)** and **160 kbps**. Toggling hot-swaps the stream at the current position without interrupting playback; if 320 isn't published for a track it drops to 160 transparently. Reachable from the Now Playing pill and Profile → *Audio quality*.
- Play/pause, next/prev, click-to-seek, shuffle, repeat, like, queue, and auto-advance all operate on the real audio element.

## How it streams (and the caveats)

- JioSaavn returns each track's media URL **DES-encrypted**; `src/saavn.ts` decrypts it (key `38346591`, the same thing every community JioSaavn API does internally) to get the real `saavncdn.com` URL, then swaps the `_<bitrate>.mp4` segment for the quality toggle.
- In dev, API calls go through a Vite proxy (`/saavn` → `www.jiosaavn.com`) to avoid CORS; audio plays directly from the CDN.
- **Unofficial API:** this uses JioSaavn's public web endpoints, not a sanctioned partner API. It's great for a personal/demo build, but for production you'd want a sanctioned source or a self-hosted proxy. JioSaavn's free tier caps at 320 kbps AAC — there's no true lossless here.
- The catalog sits behind a thin layer (`src/saavn.ts` + `src/catalog.tsx`), so another source (Spotify, etc.) can be swapped in without touching the UI.

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

- Real audio playback advances the seek bar and auto-skips to the next track at the end.
- Play / pause, next / prev (with restart-if-past-3s), shuffle, repeat, like, click-to-seek, and the quality toggle all work.
- Mini player docks above the nav whenever the app is booted and reflects live progress.
- Every tappable element has a press-scale affordance; screen and sheet transitions use the design's original keyframes.

## Structure

```
src/
  App.tsx          providers + shell + screen routing
  store.tsx        player state + real HTMLAudioElement (play/pause/seek/next/prev/shuffle/repeat/quality)
  saavn.ts         JioSaavn client — search, albums, DES-decrypt stream URLs, bitrate swap
  catalog.tsx      loads Home shelves from JioSaavn on boot, primes the player
  data.ts          types, palette, playlist/genre definitions, helpers
  icons.tsx        SVG icon set (ported verbatim)
  components/Cover.tsx   album cover (real artwork, color fallback)
  components/Shell.tsx   status bar, mini player, bottom nav
  screens/         Splash, Home, Search, Library, Profile, Detail, NowPlaying, Queue
  styles.css       fonts, keyframes, phone frame
```

Visuals (colors, shadows, radii, animations) are ported 1:1 from the `Vynyl.dc.html` design prototype.
