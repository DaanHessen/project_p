/**
 * Static server for the built site with a history fallback, so a hard refresh
 * on /cv serves the app instead of a 404. No dependencies, so the Pi needs
 * nothing but Node.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.env.STATIC_ROOT ?? "dist");
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  // normalize() collapses any ../ before it can escape the root.
  const candidate = join(root, normalize(urlPath));
  if (!candidate.startsWith(root)) return null;

  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
  } catch {
    // fall through to the SPA fallback
  }
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname,
  );
  const file = (await resolveFile(urlPath)) ?? join(root, "index.html");
  const ext = extname(file);

  res.setHeader("Content-Type", types[ext] ?? "application/octet-stream");
  res.setHeader(
    "Cache-Control",
    file.endsWith("index.html")
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  );

  createReadStream(file)
    .on("error", () => {
      res.statusCode = 404;
      res.end("Not found");
    })
    .pipe(res);
});

server.listen(port, host, () => {
  console.log(`serving ${root} on http://${host}:${port}`);
});
