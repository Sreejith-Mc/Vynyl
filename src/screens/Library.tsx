import { useCatalog } from "../catalog";
import { Cover } from "../components/Cover";
import { ACCENT, ARTISTS, LIB_TABS } from "../data";
import { ChevronRight, PlusIcon } from "../icons";
import { usePlayer } from "../store";

interface Row {
  key: string;
  title: string;
  sub: string;
  color: string;
  artwork?: string;
  radius: number | string;
  glyph: string;
  onTap: () => void;
}

export default function Library() {
  const p = usePlayer();
  const cat = useCatalog();
  const likedTracks = Object.values(p.liked);

  let rows: Row[] = [];
  if (p.libTab === "Playlists") {
    rows.push({
      key: "liked",
      title: "Liked Songs",
      sub: likedTracks.length + " songs",
      color: "linear-gradient(145deg,#F2542D,#FF8458)",
      radius: 14,
      glyph: "♥",
      onTap: () => p.openDetail({ kind: "liked", id: "liked", title: "Liked Songs", subtitle: "", color: "#F2542D", artwork: "" }),
    });
    p.playlists.forEach((pl) =>
      rows.push({
        key: pl.id,
        title: pl.name,
        sub: pl.tracks.length + " songs · Playlist",
        color: pl.tracks[0]?.color || "#8A6A8C",
        artwork: pl.tracks[0]?.artwork,
        radius: 14,
        glyph: pl.tracks.length ? "" : "♪",
        onTap: () =>
          p.openDetail({ kind: "userplaylist", id: pl.id, title: pl.name, subtitle: "Your playlist", color: pl.tracks[0]?.color || "#8A6A8C", artwork: pl.tracks[0]?.artwork || "", playlistId: pl.id }),
      })
    );
    cat.made.forEach((pl) =>
      rows.push({
        key: pl.id,
        title: pl.title,
        sub: pl.sub + " · Playlist",
        color: pl.color,
        artwork: pl.artwork,
        radius: 14,
        glyph: "",
        onTap: () => p.openDetail({ kind: "playlist", id: pl.id, title: pl.title, subtitle: pl.sub, color: pl.color, artwork: pl.artwork, query: pl.query }),
      })
    );
  } else if (p.libTab === "Artists") {
    ARTISTS.forEach(([n, c]) =>
      rows.push({
        key: n,
        title: n,
        sub: "Artist",
        color: c,
        radius: "50%",
        glyph: n[0],
        onTap: () => p.openDetail({ kind: "playlist", id: "artist-" + n, title: n, subtitle: "Artist", color: c, artwork: "", query: n }),
      })
    );
  } else if (p.libTab === "Albums") {
    cat.newReleases.forEach((a) =>
      rows.push({
        key: a.id,
        title: a.title,
        sub: a.artist + " · Album",
        color: a.color,
        artwork: a.artwork,
        radius: 14,
        glyph: "",
        onTap: () => p.openDetail({ kind: "album", id: a.id, title: a.title, subtitle: a.artist, color: a.color, artwork: a.artwork, collectionId: a.id }),
      })
    );
  } else {
    likedTracks.forEach((t, i) =>
      rows.push({
        key: t.id,
        title: t.title,
        sub: t.artist + " · Downloaded",
        color: t.color,
        artwork: t.artwork,
        radius: 14,
        glyph: "",
        onTap: () => p.playQueue(likedTracks, i, true),
      })
    );
  }

  return (
    <div data-screen-label="Library" style={{ animation: "vyScreenIn .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 18px" }}>
        <div style={{ fontSize: 25, fontWeight: 800, color: "#3f3727", letterSpacing: "-.5px" }}>Your Library</div>
        <div className="vy-press" onClick={() => p.openSheet({ type: "createPlaylist" })} title="New playlist" style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#7a715e", cursor: "pointer" }}>
          <PlusIcon />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", margin: "0 -22px 22px", padding: "2px 22px 4px" }}>
        {LIB_TABS.map((name) => {
          const active = p.libTab === name;
          return (
            <div key={name} className="vy-press" onClick={() => p.setLibTab(name)} style={{ flex: "none", padding: "9px 18px", borderRadius: 13, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: active ? "#fff" : "#7a715e", boxShadow: active ? "inset 0 0 0 999px " + ACCENT + ", 4px 4px 9px #cdc4b4" : "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4" }}>
              {name}
            </div>
          );
        })}
      </div>

      {rows.map((r) => (
        <div key={r.key} className="vy-press" onClick={r.onTap} style={{ display: "flex", alignItems: "center", gap: 15, padding: "10px 0", cursor: "pointer" }}>
          {r.artwork ? (
            <Cover artwork={r.artwork} color={r.color} size={56} radius={r.radius} style={{ boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4" }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: r.radius, background: r.color, boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
              {r.glyph}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</div>
          </div>
          <ChevronRight />
        </div>
      ))}

      {p.libTab === "Downloads" && likedTracks.length === 0 && (
        <div style={{ fontSize: 14, fontWeight: 600, color: "#bcb29d", padding: "12px 0" }}>Like songs to see them here.</div>
      )}
    </div>
  );
}
