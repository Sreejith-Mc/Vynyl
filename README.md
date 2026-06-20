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

## Legal

- In-app **Legal** screen (Terms / Privacy / Licenses) — open it from **Profile → Terms & Privacy**, the footer link, or the agreement line on the splash screen. Source: [`src/legal.ts`](src/legal.ts) + [`src/screens/Legal.tsx`](src/screens/Legal.tsx).
- Long-form docs: [TERMS.md](TERMS.md) and [PRIVACY.md](PRIVACY.md).
- These are **plain-language templates, not legal advice.** Replace every `[bracketed]` placeholder (your name, contact email, jurisdiction) and have a lawyer review before any public release.

### ⚠️ Before you publish (read this)

This build streams from JioSaavn's **unofficial** API by decrypting its media URLs. That is fine for a **private, personal, non-commercial** project, but it is **not safe to publish** as-is:

- It violates **JioSaavn's Terms of Service** (no scraping / reverse-engineering), and
- it redistributes **labels' copyrighted music** without a licence.

A Terms of Service does **not** fix this — it governs your users, not your right to the music. Before shipping to app stores or adding ads/payments you must change the backend to one of:

1. **Licensed user-auth model** — Spotify Web Playback SDK or Apple MusicKit: the *user* plays through their own subscription; you never host/redistribute audio. (The legitimate "all songs" path.)
2. **Royalty-free / Creative-Commons only** — Jamendo, Audius, Free Music Archive. Fully redistributable; no major-label/regional catalog.
3. **A purchased content licence.**

Other pre-publish steps: fill the legal placeholders, add a consent flow if you introduce analytics/accounts, complete the app stores' data-safety / privacy forms, and get legal sign-off.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build
```

## Install on your phone (PWA)

Vynyl is an installable PWA — it adds to your home screen and runs full-screen like a native app, on **both Android and iPhone, no Mac or app store needed**. Because the phone needs to reach it over HTTPS, deploy it once (free) and install from that URL.

**1. Deploy (free, ~2 min).** Easiest is connecting the GitHub repo — no CLI, and it auto-redeploys on every push.

**Netlify (recommended, via GitHub):**
1. Go to **app.netlify.com** → sign up (free) with your GitHub account.
2. **Add new site → Import an existing project → GitHub** → authorize → pick **`Sreejith-Mc/Vynyl`**.
3. Build settings are auto-read from [`netlify.toml`](netlify.toml) (build `npm run build`, publish `dist`, functions in `netlify/functions`). Click **Deploy**.
4. ~1–2 min later you get **`https://<name>.netlify.app`**. Done. Every `git push` now redeploys automatically.

The `/saavn/*` music calls are proxied by [`netlify/functions/saavn.js`](netlify/functions/saavn.js) so playback works in production. No environment variables or keys are needed.

**Vercel (alternative):** Import the same repo at **vercel.com** (auto-detects Vite; uses [`vercel.json`](vercel.json) + [`api/saavn.js`](api/saavn.js)) — or via CLI:

```bash
npm i -g vercel && vercel --prod
```

**2. Install on the phone:**

- **Android (Chrome):** open the URL → menu **⋮** → **Add to Home screen** / **Install app**.
- **iPhone (Safari):** open the URL → **Share** → **Add to Home Screen**.

The icon, splash colour, and full-screen standalone mode are already configured. Likes and audio-quality preference persist on-device.

> **iOS limits:** audio pauses when the screen locks / you leave the app — that's an Apple PWA restriction, not a bug. A true background-audio iOS app needs a native build (Mac + Xcode).
>
> **Keep it private.** Deploy it for your own use; don't share the public link or list it in app stores while it runs on the JioSaavn backend (see *Before you publish*).

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

### Accounts, likes & playlists

- **Sign up / log in** from the splash screen. Accounts are stored **on-device** (passwords are salted + SHA-256 hashed, never plain text) — see [`src/storage.ts`](src/storage.ts). The session is remembered across launches.
- **Liked songs** (the heart) and **playlists** persist per account on the device.
- **Create a playlist** with the **+** in Library; **add the current song** to one via the **＋** button on the Now Playing screen; open a playlist to play it or delete it.
- **On-device only:** data doesn't sync across devices and this isn't real cloud auth. The whole auth/data layer lives in `src/storage.ts`, so swapping in a backend (e.g. **Supabase** free tier) for real accounts + cross-device sync only touches that one file.

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
