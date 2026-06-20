import { useState } from "react";
import { usePlayer } from "../store";

export function Sheet() {
  const p = usePlayer();
  const sheet = p.sheet;
  const [name, setName] = useState("");
  if (!sheet) return null;

  const close = () => {
    setName("");
    p.closeSheet();
  };

  const create = () => {
    const id = p.createPlaylist(name);
    if (sheet.type === "addToPlaylist") p.addToPlaylist(id, sheet.track);
    close();
  };

  return (
    <div
      onClick={close}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 70,
        background: "rgba(40,34,26,.32)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "vyFade .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ECE5D8",
          borderRadius: "26px 26px 0 0",
          padding: "10px 22px 30px",
          boxShadow: "0 -10px 30px rgba(120,108,90,.35)",
          animation: "vySheetUp .32s cubic-bezier(.22,1,.36,1)",
          maxHeight: "78%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 5, background: "#cdc4b4", margin: "0 auto 16px" }} />

        <div style={{ fontSize: 18, fontWeight: 800, color: "#3f3727", marginBottom: 16 }}>
          {sheet.type === "createPlaylist" ? "New playlist" : "Add to playlist"}
        </div>

        {sheet.type === "addToPlaylist" && (
          <div style={{ overflowY: "auto", marginBottom: 8 }}>
            {p.playlists.length === 0 && <div style={{ fontSize: 13.5, fontWeight: 600, color: "#bcb29d", padding: "2px 0 14px" }}>No playlists yet — create one below.</div>}
            {p.playlists.map((pl) => {
              const has = pl.tracks.some((t) => t.id === sheet.track.id);
              return (
                <div
                  key={pl.id}
                  className="vy-press"
                  onClick={() => {
                    if (!has) p.addToPlaylist(pl.id, sheet.track);
                    close();
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", cursor: "pointer" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: "linear-gradient(145deg,#F2542D,#FF8458)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, flex: "none" }}>♪</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89" }}>{pl.tracks.length} songs</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: has ? "#bcb29d" : "#F2542D" }}>{has ? "Added" : "Add"}</div>
                </div>
              );
            })}
            <div style={{ height: 1, background: "rgba(160,148,124,.2)", margin: "8px 0 16px" }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, background: "#ECE5D8", borderRadius: 14, padding: "13px 15px", boxShadow: "inset 4px 4px 9px #d2c9b9,inset -4px -4px 9px #fff9ee" }}>
            <input
              autoFocus={sheet.type === "createPlaylist"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && create()}
              placeholder={sheet.type === "createPlaylist" ? "Playlist name" : "New playlist name"}
              style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: "#3f3727" }}
            />
          </div>
          <div
            className="vy-press"
            onClick={create}
            style={{ padding: "13px 20px", borderRadius: 14, background: "linear-gradient(145deg,#FF8458,#EE4A22)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "5px 5px 11px #cba893,-4px -4px 10px #fffaf2", flex: "none" }}
          >
            {sheet.type === "createPlaylist" ? "Create" : "Create & add"}
          </div>
        </div>
      </div>
    </div>
  );
}
