import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { streamUrl, type LibTab, type Quality, type Track } from "./data";
import * as backend from "./backend";
import type { AuthUser as User } from "./backend";
import { loadQuality, newId, saveQuality } from "./storage";
import type { Playlist } from "./storage";

export type Tab = "home" | "search" | "library" | "profile";
export type AuthMode = "login" | "signup" | null;
export type Sheet = { type: "createPlaylist" } | { type: "addToPlaylist"; track: Track } | null;

export type DetailRef =
  | { kind: "playlist"; id: string; title: string; subtitle: string; color: string; artwork: string; query: string }
  | { kind: "album"; id: string; title: string; subtitle: string; color: string; artwork: string; collectionId: string }
  | { kind: "userplaylist"; id: string; title: string; subtitle: string; color: string; artwork: string; playlistId: string }
  | { kind: "liked"; id: "liked"; title: string; subtitle: string; color: string; artwork: string };

interface State {
  booted: boolean;
  user: User | null;
  authMode: AuthMode;
  authError: string;
  authBusy: boolean;
  playlists: Playlist[];
  sheet: Sheet;
  tab: Tab;
  detail: DetailRef | null;
  npOpen: boolean;
  queueOpen: boolean;
  legalOpen: boolean;
  shuffle: boolean;
  repeat: boolean;
  libTab: LibTab;
  queue: Track[];
  idx: number;
  playing: boolean;
  loading: boolean;
  currentTime: number;
  duration: number;
  liked: Record<string, Track>;
  detailLiked: Record<string, boolean>;
  quality: Quality;
  qualityFellBack: boolean;
}

const initialState: State = {
  booted: false,
  user: null,
  authMode: null,
  authError: "",
  authBusy: false,
  playlists: [],
  sheet: null,
  tab: "home",
  detail: null,
  npOpen: false,
  queueOpen: false,
  legalOpen: false,
  shuffle: false,
  repeat: false,
  libTab: "Playlists",
  queue: [],
  idx: 0,
  playing: false,
  loading: false,
  currentTime: 0,
  duration: 0,
  liked: {},
  detailLiked: {},
  quality: "high",
  qualityFellBack: false,
};

export interface PlayerApi extends State {
  cur: Track | undefined;
  progressPct: number;
  playQueue: (tracks: Track[], i?: number, openNp?: boolean) => void;
  primeQueue: (tracks: Track[]) => void;
  openDetail: (ref: DetailRef) => void;
  back: () => void;
  togglePlayStop: (e?: { stopPropagation?: () => void }) => void;
  next: () => void;
  prev: () => void;
  seekTo: (pct: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleQuality: () => void;
  toggleCurLike: () => void;
  toggleDetailLike: () => void;
  isLiked: (id: string) => boolean;
  setLibTab: (t: LibTab) => void;
  openNP: () => void;
  closeNP: () => void;
  toggleQueue: () => void;
  openLegal: () => void;
  closeLegal: () => void;
  goTab: (t: Tab) => void;
  // auth
  setAuthMode: (m: AuthMode) => void;
  signup: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  // playlists
  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  // sheet
  openSheet: (s: Sheet) => void;
  closeSheet: () => void;
}

const Ctx = createContext<PlayerApi | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initialState);
  const sRef = useRef(s);
  sRef.current = s;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSeekRef = useRef<number | null>(null);

  // ---- helpers operating directly on the audio element ----
  const loadAndPlay = useCallback((track: Track | undefined, autoplay: boolean) => {
    const a = audioRef.current;
    if (!a || !track) return;
    const url = streamUrl(track, sRef.current.quality);
    if (a.src !== url) {
      a.src = url;
      a.load();
    }
    a.currentTime = 0;
    if (autoplay) {
      setS((p) => ({ ...p, loading: true }));
      a.play().catch(() => setS((p) => ({ ...p, loading: false })));
    }
  }, []);

  const advance = useCallback(
    (dir: number, autoplay: boolean) => {
      const st = sRef.current;
      const n = st.queue.length;
      if (!n) return;
      let i: number;
      if (st.shuffle && n > 1) {
        do {
          i = Math.floor(Math.random() * n);
        } while (i === st.idx);
      } else {
        i = (st.idx + dir + n) % n;
      }
      setS((p) => ({ ...p, idx: i }));
      loadAndPlay(st.queue[i], autoplay);
    },
    [loadAndPlay]
  );

  // ---- one audio element for the app's lifetime ----
  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    const onTime = () => setS((p) => ({ ...p, currentTime: a.currentTime }));
    const onMeta = () => {
      if (pendingSeekRef.current != null && a.duration) {
        a.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
      }
      setS((p) => ({ ...p, duration: a.duration || 0 }));
    };
    const onPlaying = () => setS((p) => ({ ...p, playing: true, loading: false }));
    const onPause = () => setS((p) => ({ ...p, playing: false }));
    const onWaiting = () => setS((p) => ({ ...p, loading: true }));
    const onError = () => {
      // 320kbps isn't published for every track — drop to 160 transparently.
      const st = sRef.current;
      const track = st.queue[st.idx];
      if (st.quality === "high" && track) {
        pendingSeekRef.current = a.currentTime || null;
        setS((p) => ({ ...p, quality: "standard", qualityFellBack: true }));
        a.src = streamUrl(track, "standard");
        a.load();
        a.play().catch(() => {});
      } else {
        setS((p) => ({ ...p, loading: false }));
      }
    };
    const onEnded = () => {
      const st = sRef.current;
      if (st.repeat) {
        a.currentTime = 0;
        a.play().catch(() => {});
      } else {
        advance(1, true);
      }
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("play", onPlaying);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("play", onPlaying);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
    };
  }, [advance]);

  // ---- restore session + saved quality on first load ----
  useEffect(() => {
    const q = loadQuality();
    if (q) setS((p) => ({ ...p, quality: q }));
    backend.restore().then((user) => {
      if (!user) return;
      backend.loadLibrary(user).then((lib) => setS((p) => ({ ...p, user, booted: true, liked: lib.liked || {}, playlists: lib.playlists || [] })));
    });
  }, []);

  // ---- persist per-user library (debounced) + global prefs ----
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!s.user) return;
    clearTimeout(saveTimer.current);
    const user = s.user;
    const lib = { liked: s.liked, playlists: s.playlists };
    saveTimer.current = setTimeout(() => backend.saveLibrary(user, lib), 600);
  }, [s.user, s.liked, s.playlists]);
  useEffect(() => {
    saveQuality(s.quality);
  }, [s.quality]);

  const playQueue = useCallback(
    (tracks: Track[], i = 0, openNp = false) => {
      if (!tracks.length) return;
      setS((p) => ({ ...p, queue: tracks, idx: i, queueOpen: false, npOpen: openNp ? true : p.npOpen, currentTime: 0 }));
      loadAndPlay(tracks[i], true);
    },
    [loadAndPlay]
  );

  const primeQueue = useCallback((tracks: Track[]) => {
    if (sRef.current.queue.length || !tracks.length) return;
    setS((p) => ({ ...p, queue: tracks, idx: 0 }));
    const a = audioRef.current;
    if (a && !a.src) {
      a.src = streamUrl(tracks[0], sRef.current.quality);
    }
  }, []);

  const togglePlayStop = useCallback((e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    const a = audioRef.current;
    const st = sRef.current;
    const cur = st.queue[st.idx];
    if (!a || !cur) return;
    if (!a.src) {
      a.src = streamUrl(cur, st.quality);
      a.load();
    }
    if (a.paused) {
      setS((p) => ({ ...p, loading: true }));
      a.play().catch(() => setS((p) => ({ ...p, loading: false })));
    } else {
      a.pause();
    }
  }, []);

  const seekTo = useCallback((pct: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = Math.max(0, Math.min(100, pct)) / 100 * a.duration;
  }, []);

  const prev = useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
    } else {
      advance(-1, true);
    }
  }, [advance]);

  const next = useCallback(() => advance(1, true), [advance]);

  const toggleQuality = useCallback(() => {
    const a = audioRef.current;
    const st = sRef.current;
    const quality: Quality = st.quality === "high" ? "standard" : "high";
    setS((p) => ({ ...p, quality, qualityFellBack: false }));
    const cur = st.queue[st.idx];
    if (!a || !cur || !a.src) return;
    // Hot-swap the source at the same position, preserving play state.
    const at = a.currentTime;
    const wasPlaying = !a.paused;
    pendingSeekRef.current = at;
    a.src = streamUrl(cur, quality);
    a.load();
    if (wasPlaying) {
      setS((p) => ({ ...p, loading: true }));
      a.play().catch(() => {});
    }
  }, []);

  // ---- auth ----
  const finishAuth = async (user: User) => {
    const lib = await backend.loadLibrary(user);
    setS((p) => ({ ...p, user, booted: true, authMode: null, authError: "", authBusy: false, tab: "home", liked: lib.liked || {}, playlists: lib.playlists || [] }));
  };
  const setAuthMode = useCallback((m: AuthMode) => setS((p) => ({ ...p, authMode: m, authError: "" })), []);
  const signup = useCallback((name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      setS((p) => ({ ...p, authError: "Enter a name, a valid email, and a password of at least 6 characters." }));
      return;
    }
    setS((p) => ({ ...p, authBusy: true, authError: "" }));
    backend
      .signup(name, email, password)
      .then(({ user, needsConfirm }) => {
        if (needsConfirm) setS((p) => ({ ...p, authBusy: false, authMode: "login", authError: "Account created — check your email to confirm, then log in." }));
        else if (user) finishAuth(user);
      })
      .catch((e) => setS((p) => ({ ...p, authBusy: false, authError: e.message })));
  }, []);
  const login = useCallback((email: string, password: string) => {
    if (!email.trim() || !password) {
      setS((p) => ({ ...p, authError: "Enter your email and password." }));
      return;
    }
    setS((p) => ({ ...p, authBusy: true, authError: "" }));
    backend
      .login(email, password)
      .then(finishAuth)
      .catch((e) => setS((p) => ({ ...p, authBusy: false, authError: e.message })));
  }, []);
  const logout = useCallback(() => {
    audioRef.current?.pause();
    backend.logout();
    setS((p) => ({ ...initialState, quality: p.quality }));
  }, []);

  // ---- playlists ----
  const createPlaylist = useCallback((name: string) => {
    const pl: Playlist = { id: newId(), name: name.trim() || "New Playlist", createdAt: Date.now(), tracks: [] };
    setS((p) => ({ ...p, playlists: [pl, ...p.playlists] }));
    return pl.id;
  }, []);
  const deletePlaylist = useCallback((id: string) => {
    setS((p) => ({
      ...p,
      playlists: p.playlists.filter((x) => x.id !== id),
      detail: p.detail && p.detail.kind === "userplaylist" && p.detail.playlistId === id ? null : p.detail,
    }));
  }, []);
  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    setS((p) => ({
      ...p,
      playlists: p.playlists.map((pl) => (pl.id === playlistId && !pl.tracks.some((t) => t.id === track.id) ? { ...pl, tracks: [...pl.tracks, track] } : pl)),
    }));
  }, []);
  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setS((p) => ({ ...p, playlists: p.playlists.map((pl) => (pl.id === playlistId ? { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) } : pl)) }));
  }, []);

  const openSheet = useCallback((sheet: Sheet) => setS((p) => ({ ...p, sheet })), []);
  const closeSheet = useCallback(() => setS((p) => ({ ...p, sheet: null })), []);

  const cur = s.queue[s.idx];
  const progressPct = s.duration > 0 ? Math.min(100, (s.currentTime / s.duration) * 100) : 0;

  const api = useMemo<PlayerApi>(() => {
    return {
      ...s,
      cur,
      progressPct,
      playQueue,
      primeQueue,
      togglePlayStop,
      next,
      prev,
      seekTo,
      openDetail: (ref) => setS((p) => ({ ...p, detail: ref, npOpen: false, queueOpen: false })),
      back: () => setS((p) => ({ ...p, detail: null })),
      toggleShuffle: () => setS((p) => ({ ...p, shuffle: !p.shuffle })),
      toggleRepeat: () => setS((p) => ({ ...p, repeat: !p.repeat })),
      toggleQuality,
      toggleCurLike: () =>
        setS((p) => {
          if (!cur) return p;
          const liked = { ...p.liked };
          if (liked[cur.id]) delete liked[cur.id];
          else liked[cur.id] = cur;
          return { ...p, liked };
        }),
      toggleDetailLike: () =>
        setS((p) => {
          if (!p.detail) return p;
          return { ...p, detailLiked: { ...p.detailLiked, [p.detail.id]: !p.detailLiked[p.detail.id] } };
        }),
      isLiked: (id: string) => !!sRef.current.liked[id],
      setLibTab: (t) => setS((p) => ({ ...p, libTab: t })),
      openNP: () => setS((p) => ({ ...p, npOpen: true })),
      closeNP: () => setS((p) => ({ ...p, npOpen: false })),
      toggleQueue: () => setS((p) => ({ ...p, queueOpen: !p.queueOpen })),
      openLegal: () => setS((p) => ({ ...p, legalOpen: true })),
      closeLegal: () => setS((p) => ({ ...p, legalOpen: false })),
      goTab: (t) => setS((p) => ({ ...p, tab: t, detail: null })),
      setAuthMode,
      signup,
      login,
      logout,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      openSheet,
      closeSheet,
    };
  }, [
    s,
    cur,
    progressPct,
    playQueue,
    primeQueue,
    togglePlayStop,
    next,
    prev,
    seekTo,
    toggleQuality,
    setAuthMode,
    signup,
    login,
    logout,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    openSheet,
    closeSheet,
  ]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function usePlayer(): PlayerApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
