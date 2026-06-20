import { Cover } from "../components/Cover";
import { fmt } from "../data";
import { ChevronDown, QueueHandle } from "../icons";
import { usePlayer } from "../store";

export default function Queue() {
  const p = usePlayer();
  const cur = p.cur;
  if (!cur) return null;

  // Up next = the rest of the current queue after the playing track, wrapping.
  const n = p.queue.length;
  const upNext: number[] = [];
  for (let k = 1; k < n; k++) upNext.push((p.idx + k) % n);

  return (
    <div
      data-screen-label="Queue"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "radial-gradient(120% 90% at 50% 12%,#F1E9DA 0%,#E6DCCA 70%,#DCD2BE 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 24px 30px",
        animation: "vySheetUp .4s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: "none", marginBottom: 24 }}>
        <div className="vy-press" onClick={p.toggleQueue} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer" }}>
          <ChevronDown />
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#3f3727" }}>Up Next</div>
        <div style={{ width: 42, height: 42 }} />
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#a89e89", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 12 }}>Now playing</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 10, borderRadius: 16, background: "#ECE5D8", boxShadow: "inset 3px 3px 7px #d2c9b9,inset -3px -3px 7px #fff9ee", marginBottom: 22 }}>
        <Cover artwork={cur.artwork} color={cur.color} size={48} radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F2542D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.title}</div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.artist}</div>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 18, opacity: p.playing ? 1 : 0.4 }}>
          <div style={{ width: 3, height: 8, background: "#F2542D", borderRadius: 2, animation: "vyPulse 1s ease infinite", animationPlayState: p.playing ? "running" : "paused" }} />
          <div style={{ width: 3, height: 16, background: "#F2542D", borderRadius: 2, animation: "vyPulse .7s ease infinite", animationPlayState: p.playing ? "running" : "paused" }} />
          <div style={{ width: 3, height: 11, background: "#F2542D", borderRadius: 2, animation: "vyPulse .85s ease infinite", animationPlayState: p.playing ? "running" : "paused" }} />
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#a89e89", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 6 }}>Next from your queue</div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", margin: "0 -6px", padding: "0 6px" }}>
        {upNext.map((i) => {
          const t = p.queue[i];
          return (
            <div key={t.id + i} className="vy-press" onClick={() => p.playQueue(p.queue, i, true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", cursor: "pointer" }}>
              <QueueHandle />
              <Cover artwork={t.artwork} color={t.color} size={46} radius={12} style={{ boxShadow: "2px 2px 5px #cdc4b4" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artist}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#bcb29d" }}>{fmt(t.len)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
