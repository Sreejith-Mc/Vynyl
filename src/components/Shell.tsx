import { ACCENT, MUTED } from "../data";
import {
  BatteryIcon,
  HomeIcon,
  LibraryIcon,
  NavSearchIcon,
  PauseIcon,
  PlaySmall,
  ProfileIcon,
  SignalIcon,
  WifiIcon,
} from "../icons";
import { usePlayer, type Tab } from "../store";
import { Cover } from "./Cover";

export function StatusBar() {
  return (
    <div
      style={{
        flex: "none",
        height: 46,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 26px",
        fontSize: 14,
        fontWeight: 700,
        color: "#4a4234",
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

export function MiniPlayer() {
  const p = usePlayer();
  if (!p.booted || !p.cur) return null;
  return (
    <div
      onClick={p.openNP}
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: "calc(70px + env(safe-area-inset-bottom))",
        zIndex: 20,
        background: "#ECE5D8",
        borderRadius: 20,
        padding: "9px 12px 21px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "7px 7px 16px #c4bba9,-7px -7px 16px #fff9ee",
        cursor: "pointer",
        animation: "vyFade .3s ease",
      }}
    >
      <Cover artwork={p.cur.artwork} color={p.cur.color} size={46} radius={13} style={{ boxShadow: "2px 2px 5px #cdc4b4" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#3f3727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.cur.title}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#a89e89", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.cur.artist}
        </div>
      </div>
      <div
        className="vy-press"
        onClick={(e) => p.togglePlayStop(e)}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "#ECE5D8",
          boxShadow: "3px 3px 7px #cdc4b4,-3px -3px 7px #fff9ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3f3727",
        }}
      >
        {p.playing ? <PauseIcon /> : <PlaySmall />}
      </div>
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 9,
          height: 3,
          borderRadius: 3,
          background: "rgba(180,170,150,.3)",
          overflow: "hidden",
        }}
      >
        <div style={{ height: "100%", width: `${p.progressPct}%`, background: "#F2542D", borderRadius: 3, transition: "width .25s linear" }} />
      </div>
    </div>
  );
}

const NAV: { tab: Tab; label: string; Icon: () => JSX.Element }[] = [
  { tab: "home", label: "Home", Icon: () => <HomeIcon /> },
  { tab: "search", label: "Search", Icon: NavSearchIcon },
  { tab: "library", label: "Library", Icon: LibraryIcon },
  { tab: "profile", label: "Profile", Icon: ProfileIcon },
];

export function BottomNav() {
  const p = usePlayer();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 25,
        height: "calc(64px + env(safe-area-inset-bottom))",
        background: "#ECE5D8",
        boxShadow: "0 -8px 22px rgba(196,187,169,.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        padding: "10px 8px env(safe-area-inset-bottom)",
      }}
    >
      {NAV.map(({ tab, label, Icon }) => {
        const active = p.tab === tab && !p.detail;
        return (
          <div
            key={tab}
            className="vy-press"
            onClick={() => p.goTab(tab)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
              color: active ? ACCENT : MUTED,
              width: 62,
            }}
          >
            <Icon />
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
