import type { CSSProperties } from "react";
import { useCatalog } from "../catalog";
import { Cover } from "../components/Cover";
import { fmt, greeting } from "../data";
import { usePlayer } from "../store";

const sectionTitle: CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#3f3727",
  letterSpacing: "-.3px",
};

const skel = "linear-gradient(110deg,#e3daccaa 30%,#efe8da 50%,#e3daccaa 70%)";

function RowSkeleton({ size = 142 }: { size?: number }) {
  return (
    <div style={{ display: "flex", gap: 16, overflowX: "hidden", margin: "0 -22px", padding: "4px 22px 8px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ flex: "none", width: size }}>
          <div style={{ width: size, height: size, borderRadius: 20, background: skel, backgroundSize: "200% 100%", animation: "vyShimmer 1.3s infinite" }} />
          <div style={{ height: 12, width: "80%", borderRadius: 6, background: "#e3daccaa", marginTop: 12 }} />
          <div style={{ height: 10, width: "55%", borderRadius: 6, background: "#e8e0d2", marginTop: 7 }} />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const p = usePlayer();
  const cat = useCatalog();

  return (
    <div data-screen-label="Home" style={{ animation: "vyScreenIn .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 22px" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#a89e89", letterSpacing: ".3px" }}>{greeting()}</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "#3f3727", letterSpacing: "-.5px", marginTop: 2 }}>Vynyl</div>
        </div>
        <div
          className="vy-press"
          onClick={() => p.goTab("profile")}
          style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(145deg,#F2542D,#FF8458)", boxShadow: "5px 5px 11px #cdbfae,-5px -5px 11px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}
        >
          A
        </div>
      </div>

      {/* recently played */}
      <div style={{ ...sectionTitle, marginBottom: 14 }}>Recently played</div>
      {cat.loading ? (
        <RowSkeleton />
      ) : (
        <div style={{ display: "flex", gap: 16, overflowX: "auto", margin: "0 -22px", padding: "4px 22px 8px" }}>
          {cat.recently.map((t, i) => (
            <div key={t.id} className="vy-press" onClick={() => p.playQueue(cat.recently, i, true)} style={{ flex: "none", width: 142, cursor: "pointer" }}>
              <Cover artwork={t.artwork} color={t.color} size={142} radius={20} dot style={{ boxShadow: "6px 6px 14px #c9c0b0,-6px -6px 14px #fffdf4" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#3f3727", marginTop: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artist}</div>
            </div>
          ))}
        </div>
      )}

      {/* made for you */}
      <div style={{ ...sectionTitle, margin: "26px 0 14px" }}>Made for you</div>
      {cat.loading ? (
        <RowSkeleton />
      ) : (
        <div style={{ display: "flex", gap: 16, overflowX: "auto", margin: "0 -22px", padding: "4px 22px 8px" }}>
          {cat.made.map((pl) => (
            <div key={pl.id} className="vy-press" onClick={() => p.openDetail({ kind: "playlist", id: pl.id, title: pl.title, subtitle: pl.sub, color: pl.color, artwork: pl.artwork, query: pl.query })} style={{ flex: "none", width: 142, cursor: "pointer" }}>
              <Cover artwork={pl.artwork} color={pl.color} size={142} radius={20} groove style={{ boxShadow: "6px 6px 14px #c9c0b0,-6px -6px 14px #fffdf4" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.45),transparent 55%)" }} />
                <div style={{ position: "absolute", left: 14, bottom: 14, right: 12, fontSize: 14, fontWeight: 800, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.4)", lineHeight: 1.15 }}>{pl.title}</div>
              </Cover>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89", marginTop: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* trending */}
      <div style={{ ...sectionTitle, margin: "26px 0 14px" }}>Trending now</div>
      <div style={{ background: "#ECE5D8", borderRadius: 22, padding: 8, boxShadow: "inset 5px 5px 11px #d2c9b9,inset -5px -5px 11px #fff9ee" }}>
        {cat.loading
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 12px" }}>
                <div style={{ width: 26, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#c2b6a0" }}>{i + 1}</div>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: skel, backgroundSize: "200% 100%", animation: "vyShimmer 1.3s infinite" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 12, width: "60%", borderRadius: 6, background: "#e3daccaa" }} />
                  <div style={{ height: 10, width: "40%", borderRadius: 6, background: "#e8e0d2", marginTop: 7 }} />
                </div>
              </div>
            ))
          : cat.charts.map((t, r) => (
              <div key={t.id} className="vy-press" onClick={() => p.playQueue(cat.charts, r, true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 12px", cursor: "pointer" }}>
                <div style={{ width: 26, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#c2b6a0" }}>{r + 1}</div>
                <Cover artwork={t.artwork} color={t.color} size={50} radius={13} style={{ boxShadow: "3px 3px 7px #cdc4b4,-3px -3px 7px #fffdf4" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artist}</div>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#bcb29d" }}>{fmt(t.len)}</div>
              </div>
            ))}
      </div>

      {/* new releases */}
      <div style={{ ...sectionTitle, margin: "26px 0 14px" }}>New releases</div>
      {cat.loading ? (
        <RowSkeleton />
      ) : (
        <div style={{ display: "flex", gap: 16, overflowX: "auto", margin: "0 -22px", padding: "4px 22px 8px" }}>
          {cat.newReleases.map((al) => (
            <div key={al.id} className="vy-press" onClick={() => p.openDetail({ kind: "album", id: al.id, title: al.title, subtitle: al.artist, color: al.color, artwork: al.artwork, collectionId: al.id })} style={{ flex: "none", width: 142, cursor: "pointer" }}>
              <Cover artwork={al.artwork} color={al.color} size={142} radius={20} style={{ boxShadow: "6px 6px 14px #c9c0b0,-6px -6px 14px #fffdf4" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#3f3727", marginTop: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{al.title}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{al.artist}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
