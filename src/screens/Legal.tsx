import { useState } from "react";
import { ACCENT, MUTED } from "../data";
import { ChevronLeft } from "../icons";
import { CONTACT_EMAIL, LAST_UPDATED, LICENSES, PRIVACY, TERMS, type LegalSection } from "../legal";
import { usePlayer } from "../store";

type View = "Terms" | "Privacy" | "Licenses";
const TABS: View[] = ["Terms", "Privacy", "Licenses"];

function Sections({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((s) => (
        <div key={s.heading} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3f3727", marginBottom: 8 }}>{s.heading}</div>
          {s.body.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, fontWeight: 500, color: "#6f6553", lineHeight: 1.62, margin: "0 0 9px" }}>
              {p}
            </p>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Legal() {
  const p = usePlayer();
  const [view, setView] = useState<View>("Terms");

  return (
    <div
      data-screen-label="Legal"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background: "radial-gradient(120% 90% at 50% 12%,#F1E9DA 0%,#E6DCCA 70%,#DCD2BE 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "calc(18px + env(safe-area-inset-top)) 22px calc(26px + env(safe-area-inset-bottom))",
        animation: "vySheetUp .4s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "none", marginBottom: 18 }}>
        <div className="vy-press" onClick={p.closeLegal} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer" }}>
          <ChevronLeft />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#3f3727", letterSpacing: "-.3px" }}>Legal</div>
      </div>

      <div style={{ display: "flex", gap: 8, flex: "none", marginBottom: 18 }}>
        {TABS.map((t) => {
          const active = view === t;
          return (
            <div
              key={t}
              className="vy-press"
              onClick={() => setView(t)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "9px 0",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                color: active ? "#fff" : "#7a715e",
                boxShadow: active ? `inset 0 0 0 999px ${ACCENT}, 4px 4px 9px #cdc4b4` : "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4",
              }}
            >
              {t}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingRight: 2 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, marginBottom: 16, textTransform: "uppercase", letterSpacing: ".6px" }}>
          Last updated {LAST_UPDATED}
        </div>

        {view === "Terms" && <Sections sections={TERMS} />}
        {view === "Privacy" && <Sections sections={PRIVACY} />}
        {view === "Licenses" && (
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#6f6553", lineHeight: 1.62, margin: "0 0 16px" }}>
              Vynyl is built with the following open-source software, used under their respective licences:
            </p>
            {LICENSES.map((l) => (
              <div key={l.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid rgba(160,148,124,.18)" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#3f3727" }}>{l.name}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#bcb29d" }}>{l.license}</span>
              </div>
            ))}
            <p style={{ fontSize: 12.5, fontWeight: 500, color: "#a89e89", lineHeight: 1.6, margin: "20px 0 0" }}>
              Music, artwork, and metadata are provided by third-party services and belong to their respective owners. Vynyl is an independent project and is not affiliated with them.
            </p>
          </div>
        )}

        <div style={{ fontSize: 12, fontWeight: 600, color: "#bcb29d", marginTop: 18, lineHeight: 1.6 }}>
          Contact: {CONTACT_EMAIL}
        </div>
      </div>
    </div>
  );
}
