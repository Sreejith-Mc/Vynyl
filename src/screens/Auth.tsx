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

const COPY = {
  signup: { title: "Create account", sub: "Your likes and playlists, saved to your account.", btn: "Sign up" },
  login: { title: "Welcome back", sub: "Log in to pick up where you left off.", btn: "Log in" },
  forgot: { title: "Reset password", sub: "Enter your email and we'll send a reset link.", btn: "Send reset link" },
  reset: { title: "Set a new password", sub: "Choose a new password for your account.", btn: "Update password" },
} as const;

export default function Auth() {
  const p = usePlayer();
  const mode = (p.authMode ?? "login") as keyof typeof COPY;
  const copy = COPY[mode];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (mode === "signup") p.signup(name, email, password);
    else if (mode === "login") p.login(email, password);
    else if (mode === "forgot") p.requestReset(email);
    else if (mode === "reset") p.submitNewPassword(password);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };
  const back = () => p.setAuthMode(mode === "login" || mode === "signup" ? null : "login");

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
      <div className="vy-press" onClick={back} style={{ width: 42, height: 42, borderRadius: "50%", background: "#ECE5D8", boxShadow: "4px 4px 9px #cdc4b4,-4px -4px 9px #fffdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5141", cursor: "pointer", flex: "none" }}>
        <ChevronLeft />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#3f3727", letterSpacing: "-.6px", marginBottom: 6 }}>{copy.title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#9b9079", marginBottom: 26 }}>{copy.sub}</div>

        {mode === "signup" && (
          <div style={inputWrap}>
            <input style={inputStyle} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKey} />
          </div>
        )}
        {mode !== "reset" && (
          <div style={inputWrap}>
            <input style={inputStyle} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKey} />
          </div>
        )}
        {mode !== "forgot" && (
          <div style={inputWrap}>
            <input
              style={inputStyle}
              type="password"
              autoComplete={mode === "signup" || mode === "reset" ? "new-password" : "current-password"}
              placeholder={mode === "reset" ? "New password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKey}
            />
          </div>
        )}

        {mode === "login" && (
          <div className="vy-press" onClick={() => p.setAuthMode("forgot")} style={{ alignSelf: "flex-end", fontSize: 13, fontWeight: 700, color: "#a89e89", cursor: "pointer", margin: "-2px 2px 14px" }}>
            Forgot password?
          </div>
        )}

        {p.authError && <div style={{ fontSize: 13, fontWeight: 600, color: "#F2542D", margin: "2px 2px 14px", lineHeight: 1.4 }}>{p.authError}</div>}

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
          {p.authBusy ? "Please wait…" : copy.btn}
        </div>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: 13.5, fontWeight: 600, color: "#9b9079" }}>
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <span className="vy-press" onClick={() => p.setAuthMode("login")} style={{ color: "#F2542D", fontWeight: 800, cursor: "pointer" }}>
                Log in
              </span>
            </>
          )}
          {mode === "login" && (
            <>
              New to Vynyl?{" "}
              <span className="vy-press" onClick={() => p.setAuthMode("signup")} style={{ color: "#F2542D", fontWeight: 800, cursor: "pointer" }}>
                Sign up
              </span>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <span className="vy-press" onClick={() => p.setAuthMode("login")} style={{ color: "#F2542D", fontWeight: 800, cursor: "pointer" }}>
              Back to log in
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
