import { usePlayer } from "../store";

export default function Splash() {
  const p = usePlayer();
  return (
    <div
      data-screen-label="Splash"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(40px + env(safe-area-inset-top)) 40px calc(40px + env(safe-area-inset-bottom))",
        textAlign: "center",
        background: "radial-gradient(120% 90% at 50% 18%,#F2EADB 0%,#E7DECC 60%,#DDD3BF 100%)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "repeating-radial-gradient(circle at center,#1c1a18 0 2px,#262320 2px 4.5px)",
          boxShadow: "14px 14px 34px #c0b7a5,-12px -12px 30px #fff8ec",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "vySpin 9s linear infinite",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(145deg,#FF8458,#EE4A22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 2px 6px rgba(255,255,255,.3)",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#F2EADB" }} />
        </div>
      </div>

      <div style={{ fontSize: 46, fontWeight: 800, color: "#3f3727", letterSpacing: "-1.5px", marginTop: 42 }}>Vynyl</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#9b9079", marginTop: 10, lineHeight: 1.5, maxWidth: 280 }}>
        Every song ever made.
        <br />
        Wrapped in warmth.
      </div>

      <div
        className="vy-press"
        onClick={() => p.setAuthMode("signup")}
        style={{
          marginTop: 46,
          width: "100%",
          maxWidth: 300,
          padding: 19,
          borderRadius: 20,
          background: "linear-gradient(145deg,#FF8458,#EE4A22)",
          boxShadow: "8px 8px 18px #cba893,-7px -7px 16px #fffaf2,inset 0 1px 2px rgba(255,255,255,.4)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
          letterSpacing: ".2px",
        }}
      >
        Get started
      </div>
      <div className="vy-press" onClick={() => p.setAuthMode("login")} style={{ marginTop: 18, fontSize: 13.5, fontWeight: 700, color: "#a89e89", cursor: "pointer" }}>
        Log in
      </div>
      <div style={{ marginTop: 26, fontSize: 11.5, fontWeight: 600, color: "#a89e89", lineHeight: 1.5, maxWidth: 280 }}>
        By continuing you agree to our{" "}
        <span onClick={p.openLegal} style={{ color: "#8a7f6a", fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>
          Terms &amp; Privacy Policy
        </span>
        .
      </div>
    </div>
  );
}
