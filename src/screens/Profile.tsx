import type { CSSProperties } from "react";
import { SETTINGS, qualityLabel } from "../data";
import { usePlayer } from "../store";

const statCard: CSSProperties = {
  flex: 1,
  background: "#ECE5D8",
  borderRadius: 18,
  padding: 16,
  boxShadow: "inset 4px 4px 9px #d2c9b9,inset -4px -4px 9px #fff9ee",
  textAlign: "center",
};

const STATS: [string, string][] = [
  ["128", "Playlists"],
  ["2.3k", "Following"],
  ["94h", "This month"],
];

export default function Profile() {
  const p = usePlayer();
  return (
    <div data-screen-label="Profile" style={{ animation: "vyScreenIn .4s ease" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "16px 0 26px" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(145deg,#F2542D,#FF8458)",
            boxShadow: "7px 7px 16px #c9c0b0,-7px -7px 16px #fffdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 34,
          }}
        >
          A
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#3f3727", marginTop: 16 }}>Alex Rivera</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#a89e89", marginTop: 3 }}>Vynyl Premium</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {STATS.map(([n, l]) => (
          <div key={l} style={statCard}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#3f3727" }}>{n}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#a89e89", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#ECE5D8", borderRadius: 22, padding: "6px 8px", boxShadow: "6px 6px 14px #c9c0b0,-6px -6px 14px #fffdf4" }}>
        {SETTINGS.map((s, i) => {
          const isQuality = s.label === "Audio quality";
          const value = isQuality ? qualityLabel(p.quality) : s.value;
          return (
          <div
            key={s.label}
            className="vy-press"
            onClick={isQuality ? p.toggleQuality : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: "14px 12px",
              cursor: "pointer",
              borderTop: i === 0 ? "none" : "1px solid rgba(160,148,124,.18)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "#ECE5D8",
                boxShadow: "3px 3px 6px #d2c9b9,-3px -3px 6px #fff9ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8a7f6a",
                fontSize: 16,
              }}
            >
              {s.icon}
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#3f3727" }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isQuality && p.quality === "high" ? "#F2542D" : "#bcb29d" }}>{value}</div>
          </div>
          );
        })}
      </div>

      <div className="vy-press" style={{ textAlign: "center", margin: "24px 0 8px", fontSize: 14, fontWeight: 700, color: "#F2542D", cursor: "pointer" }}>
        Log out
      </div>
    </div>
  );
}
