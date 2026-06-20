import type { CSSProperties } from "react";

export const SignalIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="#4a4234">
    <rect x="0" y="7" width="3" height="5" rx="1" />
    <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" />
    <rect x="9" y="2" width="3" height="10" rx="1" />
    <rect x="13.5" y="0" width="3" height="12" rx="1" />
  </svg>
);

export const WifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#4a4234" strokeWidth="1.6">
    <path d="M1 4.5C3 2 6 1 8 1s5 1 7 3.5M3.5 7C5 5.5 6.5 5 8 5s3 .5 4.5 2M6 9.3c.6-.5 1.2-.8 2-.8s1.4.3 2 .8" />
  </svg>
);

export const BatteryIcon = () => (
  <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
    <rect x="1" y="1" width="20" height="10" rx="3" stroke="#4a4234" strokeWidth="1.4" />
    <rect x="3" y="3" width="14" height="6" rx="1.5" fill="#4a4234" />
    <rect x="22.5" y="4" width="2" height="4" rx="1" fill="#4a4234" />
  </svg>
);

export const SearchIcon = ({ stroke = "#a89e89", size = 20 }: { stroke?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth="2">
    <circle cx="9" cy="9" r="6.5" />
    <path d="M14 14l4 4" strokeLinecap="round" />
  </svg>
);

export const PlayIcon = ({ fill = "#fff", size = 26 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <path d="M7 5.5v13l11-6.5z" />
  </svg>
);

export const PauseIcon = ({ fill = "#3f3727", size = 18 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <rect x="6" y="5" width="4" height="14" rx="1.4" />
    <rect x="14" y="5" width="4" height="14" rx="1.4" />
  </svg>
);

export const PlaySmall = ({ fill = "#3f3727", size = 18 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <path d="M7 5.5v13l11-6.5z" />
  </svg>
);

export const HeartFilled = ({ fill = "#F2542D", size = 22 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.3 5 5.6 5 7.7 5 9.2 6.2 12 9c2.8-2.8 4.3-4 6.4-4 3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
  </svg>
);

export const HeartOutline = ({ stroke = "#F2542D", size = 24 }: { stroke?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
    <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.3 5 5.6 5 7.7 5 9.2 6.2 12 9c2.8-2.8 4.3-4 6.4-4 3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
  </svg>
);

export const ShuffleIcon = ({ color = "currentColor", size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

export const RepeatIcon = ({ color = "currentColor", size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4" />
  </svg>
);

export const PrevIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3f3727">
    <path d="M7 5v14h2.5V5zM20 5l-9 7 9 7z" />
  </svg>
);

export const NextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3f3727">
    <path d="M17 5v14h-2.5V5zM4 5l9 7-9 7z" />
  </svg>
);

export const BigPause = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
    <rect x="6" y="5" width="4.5" height="14" rx="1.5" />
    <rect x="13.5" y="5" width="4.5" height="14" rx="1.5" />
  </svg>
);

export const BigPlay = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
    <path d="M7 5v14l12-7z" />
  </svg>
);

export const ChevronLeft = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5l-5 5 5 5" />
  </svg>
);

export const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#c2b6a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4l5 5-5 5" />
  </svg>
);

export const ChevronDown = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const DotsVertical = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="#5a5141">
    <circle cx="10" cy="4" r="1.7" />
    <circle cx="10" cy="10" r="1.7" />
    <circle cx="10" cy="16" r="1.7" />
  </svg>
);

export const QueueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h12M4 12h12M4 18h8M19 7v10M16 14l3 3 3-3" />
  </svg>
);

export const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 4v12M4 10h12" />
  </svg>
);

export const HomeIcon = ({ style }: { style?: CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

export const NavSearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

export const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h10M4 10h10M4 15h6M18 4v12.5" />
    <circle cx="18" cy="17" r="2.4" fill="currentColor" stroke="none" />
  </svg>
);

export const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);

export const QueueHandle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2b6a0" strokeWidth="2" strokeLinecap="round">
    <path d="M5 8h14M5 12h14M5 16h14" />
  </svg>
);
