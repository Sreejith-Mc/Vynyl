import { CatalogProvider } from "./catalog";
import { BottomNav, MiniPlayer, StatusBar } from "./components/Shell";
import Detail from "./screens/Detail";
import Home from "./screens/Home";
import Legal from "./screens/Legal";
import Library from "./screens/Library";
import NowPlaying from "./screens/NowPlaying";
import Profile from "./screens/Profile";
import Queue from "./screens/Queue";
import Search from "./screens/Search";
import Splash from "./screens/Splash";
import { PlayerProvider, usePlayer } from "./store";

function Shell() {
  const p = usePlayer();

  const activeScreen = () => {
    if (p.detail) return <Detail />;
    switch (p.tab) {
      case "home":
        return <Home />;
      case "search":
        return <Search />;
      case "library":
        return <Library />;
      case "profile":
        return <Profile />;
    }
  };

  return (
    <div className="vy-stage">
      <div className="vy-phone">
        {p.booted ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <StatusBar />
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "6px 22px 178px" }}>{activeScreen()}</div>
            <MiniPlayer />
            <BottomNav />
          </div>
        ) : (
          <Splash />
        )}

        {p.npOpen && <NowPlaying />}
        {p.queueOpen && <Queue />}
        {p.legalOpen && <Legal />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <CatalogProvider>
        <Shell />
      </CatalogProvider>
    </PlayerProvider>
  );
}
