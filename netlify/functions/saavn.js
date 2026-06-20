// Netlify serverless proxy for the deployed PWA. Mirrors the Vite dev /saavn
// proxy so JioSaavn calls work from the hosted app without CORS issues.
//
// netlify.toml rewrites /saavn/<path>?<query> -> this function, and we forward
// it to https://www.jiosaavn.com/<path>?<query>.

export const handler = async (event) => {
  const prefix = "/.netlify/functions/saavn/";
  let path = "";
  if (event.path && event.path.startsWith(prefix)) path = event.path.slice(prefix.length);
  else if (event.path && event.path.includes("/saavn/")) path = event.path.split("/saavn/")[1];

  const qs = event.rawQuery ? "?" + event.rawQuery : "";
  const target = `https://www.jiosaavn.com/${path}${qs}`;

  try {
    const upstream = await fetch(target, {
      headers: { Referer: "https://www.jiosaavn.com/", "User-Agent": "Mozilla/5.0" },
    });
    const body = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
      body,
    };
  } catch {
    return { statusCode: 502, body: '{"error":"proxy_failed"}' };
  }
};
