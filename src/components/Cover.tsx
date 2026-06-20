import type { CSSProperties, ReactNode } from "react";

interface CoverProps {
  artwork?: string;
  color: string;
  size: number | string;
  radius?: number | string;
  style?: CSSProperties;
  /** show the faux-record groove overlay (only used when there's no artwork) */
  groove?: boolean;
  /** show a center "record hole" dot (only used when there's no artwork) */
  dot?: boolean;
  children?: ReactNode;
}

/**
 * A square album/track cover. Renders real artwork when available, otherwise
 * falls back to the warm gradient tint used while images load.
 */
export function Cover({ artwork, color, size, radius = 20, style, groove, dot, children }: CoverProps) {
  const hasArt = !!artwork;
  const background = hasArt
    ? `url("${artwork}") center/cover no-repeat, ${color}`
    : `radial-gradient(circle at 32% 28%,rgba(255,255,255,.3),transparent 60%),${color}`;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: radius,
        background,
        overflow: "hidden",
        flex: "none",
        ...style,
      }}
    >
      {!hasArt && groove && (
        <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 70% 75%,rgba(0,0,0,.16) 0 1.5px,transparent 1.5px 5px)" }} />
      )}
      {!hasArt && dot && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(20,18,16,.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.85)" }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
