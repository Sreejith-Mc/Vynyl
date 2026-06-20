import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PLAYLIST_DEFS, SHELF_QUERIES, type Album, type PlaylistMeta, type Track } from "./data";
import { JAMENDO_ENABLED, newAlbums, popularTracks, searchTracks } from "./jamendo";
import { usePlayer } from "./store";

interface Catalog {
  recently: Track[];
  charts: Track[];
  newReleases: Album[];
  made: PlaylistMeta[];
  loading: boolean;
  needsKey: boolean;
}

const empty: Catalog = { recently: [], charts: [], newReleases: [], made: [], loading: true, needsKey: false };
const Ctx = createContext<Catalog>(empty);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [cat, setCat] = useState<Catalog>(empty);
  const { primeQueue } = usePlayer();

  useEffect(() => {
    if (!JAMENDO_ENABLED) {
      setCat({ ...empty, loading: false, needsKey: true });
      return;
    }
    let alive = true;
    (async () => {
      const [recently, charts, newReleases, ...covers] = await Promise.all([
        searchTracks(SHELF_QUERIES.recently, 10),
        popularTracks(8),
        newAlbums(10),
        ...PLAYLIST_DEFS.map((d) => searchTracks(d.query, 1)),
      ]);
      if (!alive) return;

      const made: PlaylistMeta[] = PLAYLIST_DEFS.map((d, i) => ({
        id: d.id,
        title: d.title,
        sub: d.sub,
        query: d.query,
        artwork: (covers[i] as Track[])[0]?.artwork ?? "",
        color: (covers[i] as Track[])[0]?.color ?? "#C96F4A",
      }));

      setCat({ recently, charts, newReleases, made, loading: false, needsKey: false });

      if (charts.length) primeQueue(charts);
      else if (recently.length) primeQueue(recently);
    })();
    return () => {
      alive = false;
    };
  }, [primeQueue]);

  return <Ctx.Provider value={cat}>{children}</Ctx.Provider>;
}

export function useCatalog(): Catalog {
  return useContext(Ctx);
}
