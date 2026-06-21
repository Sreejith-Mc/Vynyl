import { useState, type CSSProperties } from "react";
import { ChevronLeft } from "../icons";
import { usePlayer } from "../store";

const inputWrap: CSSProperties = {
  background: "#ECE5D8",
  borderRadius: 16,
  padding: "14px 16px",
  boxShadow: "inset 4px 4px 9px #d2c9b9,inset -4px -4px 9px #fff9ee",
  marginBottom: 14,
};
const inputStyle: CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 15,
  fontWeight: 600,
  color: "#3f3727",
};

export default function Auth() {
  const p = usePlayer();
  const isSignup = p.authMode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (isSignup) p.signup(name, email, password);
    else p.login(email, password);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div
      data-screen-label="Auth"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: "calc(20px + env(safe-area-inset-top)) 30px calc(36px + env(safe-area-inset-bottom))",
        background: "radial-gradient(120% 90% at 50% 18%,#F2EADB 0%,#E7DECC 60%,#DDD3BF 100%)",
        animation: "vyScreenIn .35s ease",
      }}
    >
      <div className="vy-press" onClick={() => p.setAuthMode(null)} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer", flex: "none" }}>
        <ChevronLeft />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#3f3727", letterSpacing: "-.6px", marginBottom: 6 }}>
          {isSignup ? "Create account" : "Welcome back"}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#9b9079", marginBottom: 26 }}>
          {isSignup ? "Your likes and playlists, saved on this device." : "Log in to pick up where you left off."}
        </div>

        {isSignup && (
          <div style={inputWrap}>
            <input style={inputStyle} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKey} />
          </div>
        )}
        <div style={inputWrap}>
          <input style={inputStyle} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKey} />
        </div>
        <div style={inputWrap}>
          <input style={inputStyle} type="password" autoComplete={isSignup ? "new-password" : "current-password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey} />
        </div>

        {p.authError && <div style={{ fontSize: 13, fontWeight: 600, color: "#F2542D", margin: "2px 2px 14px" }}>{p.authError}</div>}

        <div
          className="vy-press"
          onClick={p.authBusy ? undefined : submit}
          style={{
            marginTop: 8,
            padding: 18,
            borderRadius: 18,
            textAlign: "center",
            background: "linear-gradient(145deg,#FF8458,#EE4A22)",
            boxShadow: "8px 8px 18px #cba893,-7px -7px 16px #fffaf2,inset 0 1px 2px rgba(255,255,255,.4)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
            opacity: p.authBusy ? 0.7 : 1,
          }}
        >
          {p.authBusy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
        </div>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: 13.5, fontWeight: 600, color: "#9b9079" }}>
          {isSignup ? "Already have an account? " : "New to Vynyl? "}
          <span className="vy-press" onClick={() => p.setAuthMode(isSignup ? "login" : "signup")} style={{ color: "#F2542D", fontWeight: 800, cursor: "pointer" }}>
            {isSignup ? "Log in" : "Sign up"}
          </span>
        </div>
      </div>
    </div>
  );
}
