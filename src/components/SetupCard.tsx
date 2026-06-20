/** Shown when no Jamendo Client ID is configured yet. */
export function SetupCard() {
  return (
    <div style={{ animation: "vyScreenIn .4s ease", padding: "20px 4px" }}>
      <div
        style={{
          background: "#ECE5D8",
          borderRadius: 22,
          padding: 22,
          boxShadow: "6px 6px 14px #c9c0b0,-6px -6px 14px #fffdf4",
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 800, color: "#3f3727", letterSpacing: "-.3px" }}>Almost there 🎧</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#8a7f6a", marginTop: 10, lineHeight: 1.55 }}>
          Vynyl now streams full-length tracks (with FLAC lossless) from Jamendo's free catalog. Add a free Client ID to switch it on:
        </div>
        <ol style={{ margin: "16px 0 6px", paddingLeft: 20, color: "#5a5141", fontSize: 13.5, fontWeight: 600, lineHeight: 1.7 }}>
          <li>
            Sign up at{" "}
            <span style={{ color: "#F2542D", fontWeight: 800 }}>devportal.jamendo.com</span>
          </li>
          <li>Create an app, copy its <b>Client ID</b></li>
          <li>
            Paste it into <code style={{ background: "#e3daccaa", padding: "1px 6px", borderRadius: 6 }}>.env</code> as{" "}
            <code style={{ background: "#e3daccaa", padding: "1px 6px", borderRadius: 6 }}>VITE_JAMENDO_CLIENT_ID</code>
          </li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  );
}
