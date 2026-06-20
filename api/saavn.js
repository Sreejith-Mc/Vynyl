// Serverless proxy for the deployed PWA. Mirrors the Vite dev `/saavn` proxy
// so JioSaavn calls work from the hosted app without CORS issues.
//
// vercel.json rewrites /saavn/<path>?<query>  ->  /api/saavn?__path=<path>&<query>
// and this forwards it to https://www.jiosaavn.com/<path>?<query>.

export default async function handler(req, res) {
  const { __path = "", ...rest } = req.query;
  const path = Array.isArray(__path) ? __path.join("/") : __path;
  const qs = new URLSearchParams(rest).toString();
  const target = `https://www.jiosaavn.com/${path}${qs ? "?" + qs : ""}`;

  try {
    const upstream = await fetch(target, {
      headers: { Referer: "https://www.jiosaavn.com/", "User-Agent": "Mozilla/5.0" },
    });
    const body = await upstream.text();
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(upstream.status).send(body);
  } catch {
    res.status(502).json({ error: "proxy_failed" });
  }
}
