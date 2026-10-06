import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (req.query.username as string) || "rathod-ramraj";
  try {
    const upstreamRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
    );
    if (!upstreamRes.ok) throw new Error(String(upstreamRes.status));
    const data = await upstreamRes.json();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "upstream_error", detail: String(err) });
  }
}
