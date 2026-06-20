import { useEffect, useState } from "react";
import { Cover } from "../components/Cover";
import { ACCENT, MUTED, fmt, type Track } from "../data";
import { ChevronLeft, DotsVertical, HeartFilled, HeartOutline, PlayIcon, ShuffleIcon } from "../icons";
import { albumTracks, searchTracks } from "../saavn";
import { usePlayer } from "../store";

export default function Detail() {
  const p = usePlayer();
  const detail = p.detail;
  const [fetched, setFetched] = useState<Track[]>([]);
  const [fetching, setFetching] = useState(true);

  // Liked + user playlists come straight from the store so they stay live as
  // you like/add tracks; albums and curated playlists are fetched on open.
  const live =
    detail?.kind === "userplaylist"
      ? p.playlists.find((x) => x.id === detail.playlistId)?.tracks ?? []
      : detail?.kind === "liked"
        ? Object.values(p.liked)
        : null;

  useEffect(() => {
    if (!detail || detail.kind === "userplaylist" || detail.kind === "liked") return;
    let alive = true;
    setFetching(true);
    (async () => {
      const t = detail.kind === "playlist" ? await searchTracks(detail.query, 25) : await albumTracks(detail.collectionId, detail.title + " " + detail.subtitle);
      if (alive) {
        setFetched(t);
        setFetching(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.id, detail?.kind]);

  const tracks = live ?? fetched;
  const loading = live ? false : fetching;

  if (!detail) return null;
  const liked = !!p.detailLiked[detail.id];
  const desc = detail.kind === "liked" ? "The songs you've loved" : detail.subtitle;
  const meta = `${tracks.length} songs${detail.kind === "album" ? " · Album" : detail.kind === "liked" ? "" : " · Playlist"}`;
  const isUserPlaylist = detail.kind === "userplaylist";

  return (
    <div data-screen-label="Detail" style={{ animation: "vyScreenIn .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 18px" }}>
        <div className="vy-press" onClick={p.back} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer" }}>
          <ChevronLeft />
        </div>
        <div
          className="vy-press"
          onClick={isUserPlaylist ? () => p.deletePlaylist(detail.playlistId) : undefined}
          title={isUserPlaylist ? "Delete playlist" : undefined}
          style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: isUserPlaylist ? "#F2542D" : "#5a5141", cursor: "pointer" }}
        >
          {isUserPlaylist ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          ) : (
            <DotsVertical />
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <Cover artwork={detail.artwork} color={detail.color} size={172} radius={24} groove style={{ boxShadow: "9px 9px 20px #c4bba9,-9px -9px 20px #fff9ee" }} />
        <div style={{ fontSize: 24, fontWeight: 800, color: "#3f3727", marginTop: 18, textAlign: "center", letterSpacing: "-.4px" }}>{detail.title}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#a89e89", marginTop: 6, textAlign: "center", padding: "0 20px", lineHeight: 1.45 }}>{desc}</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#bcb29d", marginTop: 10 }}>{loading ? "Loading…" : meta}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginBottom: 24 }}>
        <div className="vy-press" onClick={p.toggleDetailLike} style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: ACCENT }}>
          {liked ? <HeartFilled /> : <HeartOutline stroke={ACCENT} size={22} />}
        </div>
        <div
          className="vy-press"
          onClick={() => tracks.length && p.playQueue(tracks, 0, true)}
          style={{ width: 66, height: 66, borderRadius: "50%", background: "linear-gradient(145deg,#FF8458,#EE4A22)", boxShadow: "7px 7px 16px #cba893,-6px -6px 14px #fffaf2,inset 0 1px 2px rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: tracks.length ? 1 : 0.5 }}
        >
          <PlayIcon />
        </div>
        <div className="vy-press" onClick={p.toggleShuffle} style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: p.shuffle ? ACCENT : MUTED }}>
          <ShuffleIcon />
        </div>
      </div>

      {loading
        ? [0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0" }}>
              <div style={{ width: 24, textAlign: "center", color: "#c2b6a0" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, width: "55%", borderRadius: 6, background: "#e3daccaa" }} />
                <div style={{ height: 10, width: "35%", borderRadius: 6, background: "#e8e0d2", marginTop: 7 }} />
              </div>
            </div>
          ))
        : tracks.map((t, r) => {
            const isCur = p.cur?.id === t.id;
            return (
              <div key={t.id + r} className="vy-press" onClick={() => p.playQueue(tracks, r, true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", cursor: "pointer" }}>
                <div style={{ width: 24, textAlign: "center", fontSize: 14, fontWeight: 700, color: isCur ? ACCENT : "#c2b6a0" }}>{isCur ? "▶" : r + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isCur ? ACCENT : "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artist}</div>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#bcb29d" }}>{fmt(t.len)}</div>
              </div>
            );
          })}
      {!loading && tracks.length === 0 && <div style={{ fontSize: 14, fontWeight: 600, color: "#bcb29d", textAlign: "center", padding: "12px 0" }}>Nothing here yet.</div>}
    </div>
  );
}
