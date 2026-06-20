import { useEffect, useRef, useState } from "react";
import { Cover } from "../components/Cover";
import { GENRES, type Track } from "../data";
import { SearchIcon } from "../icons";
import { searchTracks } from "../saavn";
import { usePlayer } from "../store";

export default function Search() {
  const p = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqId.current;
    const handle = setTimeout(async () => {
      const r = await searchTracks(term, 25);
      if (id === reqId.current) {
        setResults(r);
        setLoading(false);
      }
    }, 300); // debounce
    return () => clearTimeout(handle);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div data-screen-label="Search" style={{ animation: "vyScreenIn .4s ease" }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: "#3f3727", letterSpacing: "-.5px", margin: "10px 0 18px" }}>Search</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#ECE5D8", borderRadius: 18, padding: "14px 18px", boxShadow: "inset 5px 5px 11px #d2c9b9,inset -5px -5px 11px #fff9ee", marginBottom: 24 }}>
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, artists, albums..."
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: "#3f3727" }}
        />
      </div>

      {hasQuery ? (
        <>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#a89e89", marginBottom: 12 }}>
            {loading ? "Searching…" : `Results for "${query.trim()}"`}
          </div>
          {results.map((t, i) => (
            <div key={t.id} className="vy-press" onClick={() => p.playQueue(results, i, true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 0", cursor: "pointer" }}>
              <Cover artwork={t.artwork} color={t.color} size={52} radius={13} style={{ boxShadow: "3px 3px 7px #cdc4b4,-3px -3px 7px #fffdf4" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artist}</div>
              </div>
            </div>
          ))}
          {!loading && results.length === 0 && <div style={{ fontSize: 14, fontWeight: 600, color: "#bcb29d", padding: "8px 0" }}>No songs match "{query.trim()}".</div>}
        </>
      ) : (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#3f3727", letterSpacing: "-.3px", marginBottom: 16 }}>Browse all</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {GENRES.map(([name, color]) => (
              <div key={name} className="vy-press" onClick={() => setQuery(name)} style={{ position: "relative", height: 96, borderRadius: 18, background: color, boxShadow: "5px 5px 12px #c9c0b0,-5px -5px 12px #fffdf4", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ position: "absolute", right: -12, bottom: -14, width: 64, height: 64, borderRadius: 13, background: "rgba(0,0,0,.18)", transform: "rotate(28deg)" }} />
                <div style={{ position: "absolute", left: 16, top: 15, fontSize: 16, fontWeight: 800, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.25)" }}>{name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
