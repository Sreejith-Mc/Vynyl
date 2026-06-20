import { ACCENT, MUTED, fmt, qualityLabel } from "../data";
import { BigPause, BigPlay, ChevronDown, HeartFilled, HeartOutline, NextIcon, PrevIcon, QueueIcon, RepeatIcon, ShuffleIcon } from "../icons";
import { usePlayer } from "../store";

export default function NowPlaying() {
  const p = usePlayer();
  const cur = p.cur;
  if (!cur) return null;
  const curLiked = !!p.liked[cur.id];
  const pct = p.progressPct;

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    p.seekTo(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <div
      data-screen-label="Now Playing"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "radial-gradient(120% 90% at 50% 12%,#F1E9DA 0%,#E6DCCA 65%,#DCD2BE 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 26px 30px",
        animation: "vySheetUp .42s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: "none" }}>
        <div className="vy-press" onClick={p.closeNP} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer" }}>
          <ChevronDown />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#a89e89", letterSpacing: 1, textTransform: "uppercase" }}>Now Playing</div>
        <div className="vy-press" onClick={p.toggleQueue} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer" }}>
          <QueueIcon />
        </div>
      </div>

      {/* vinyl */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: 268,
            height: 268,
            borderRadius: "50%",
            background: "repeating-radial-gradient(circle at center,#1b1917 0 2px,#262320 2px 4.5px)",
            boxShadow: "16px 16px 38px #beb5a3,-14px -14px 32px #fff8ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "vySpin 11s linear infinite",
            animationPlayState: p.playing ? "running" : "paused",
          }}
        >
          <div style={{ position: "absolute", top: 14, left: "30%", width: "40%", height: "42%", borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,rgba(255,255,255,.22),transparent 70%)" }} />
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: "50%",
              background: cur.artwork
                ? `url("${cur.artwork}") center/cover, ${cur.color}`
                : `radial-gradient(circle at 34% 30%,rgba(255,255,255,.28),transparent 60%),${cur.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 0 6px rgba(0,0,0,.12)",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#1b1917", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.2)" }} />
          </div>
        </div>
      </div>

      {/* title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: "none", marginTop: 8 }}>
        <div style={{ minWidth: 0, flex: 1, paddingRight: 14 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#3f3727", letterSpacing: "-.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.title}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#a89e89", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.artist}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
          <div className="vy-press" onClick={() => p.openSheet({ type: "addToPlaylist", track: cur })} title="Add to playlist" style={{ width: 50, height: 50, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#5a5141" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h11M4 12h11M4 17h7M17 14v6M14 17h6" />
            </svg>
          </div>
          <div className="vy-press" onClick={p.toggleCurLike} style={{ width: 50, height: 50, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: ACCENT }}>
            {curLiked ? <HeartFilled size={24} /> : <HeartOutline size={24} />}
          </div>
        </div>
      </div>

      {/* seek */}
      <div style={{ flex: "none", marginTop: 22 }}>
        <div onClick={onSeek} style={{ height: 8, borderRadius: 8, background: "#ECE5D8", boxShadow: "inset 3px 3px 6px #d2c9b9,inset -3px -3px 6px #fff9ee", cursor: "pointer", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, background: "linear-gradient(90deg,#FF8458,#EE4A22)", borderRadius: 8 }} />
          <div style={{ position: "absolute", top: "50%", left: `${pct}%`, width: 16, height: 16, borderRadius: "50%", background: "#fff", transform: "translate(-50%,-50%)", boxShadow: "0 2px 5px rgba(180,90,50,.5)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9, fontSize: 12, fontWeight: 700, color: "#a89e89" }}>
          <span>{fmt(p.currentTime)}</span>
          <span>{fmt(p.duration || cur.len)}</span>
        </div>
      </div>

      {/* quality / lossless toggle */}
      <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14 }}>
        <div
          className="vy-press"
          onClick={p.toggleQuality}
          title="Toggle audio quality"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 15px",
            borderRadius: 12,
            cursor: "pointer",
            background: "#ECE5D8",
            boxShadow: p.quality === "high" ? `inset 0 0 0 999px ${ACCENT}, 3px 3px 7px #cdc4b4` : "3px 3px 7px #cdc4b4,-3px -3px 7px #fff9ee",
            color: p.quality === "high" ? "#fff" : "#7a715e",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".3px",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.quality === "high" ? "#fff" : "#bcb29d" }} />
          {qualityLabel(p.quality)}
        </div>
        {p.qualityFellBack && <div style={{ fontSize: 10.5, fontWeight: 600, color: "#bcb29d", marginTop: 6 }}>320 kbps unavailable for this track — using 160</div>}
      </div>

      {/* controls */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
        <div className="vy-press" onClick={p.toggleShuffle} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: p.shuffle ? ACCENT : MUTED }}>
          <ShuffleIcon />
        </div>
        <div className="vy-press" onClick={p.prev} style={{ width: 54, height: 54, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3f3727" }}>
          <PrevIcon />
        </div>
        <div
          className="vy-press"
          onClick={() => p.togglePlayStop()}
          style={{ width: 78, height: 78, borderRadius: "50%", background: "linear-gradient(145deg,#FF8458,#EE4A22)", boxShadow: "8px 8px 18px #c9a48f,-7px -7px 16px #fffaf2,inset 0 1px 2px rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
        >
          {p.loading ? (
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: "3px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "vySpin .8s linear infinite" }} />
          ) : p.playing ? (
            <BigPause />
          ) : (
            <BigPlay />
          )}
        </div>
        <div className="vy-press" onClick={p.next} style={{ width: 54, height: 54, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3f3727" }}>
          <NextIcon />
        </div>
        <div className="vy-press" onClick={p.toggleRepeat} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: p.repeat ? ACCENT : MUTED }}>
          <RepeatIcon />
        </div>
      </div>
    </div>
  );
}
