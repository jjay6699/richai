import { createReadStream, existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const backendBase = (process.env.BACKEND_API_URL || "https://healthai.up.railway.app").replace(/\/$/, "");
const port = Number(process.env.PORT || 3000);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".json", "application/json; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"]
]);

const sendFile = async (response, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": mimeTypes.get(ext) || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
};

const proxyApiRequest = async (request, response, pathname, search = "") => {
  const url = `${backendBase}${pathname}${search}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (!value) continue;
    if (key.toLowerCase() === "host") continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const needsBody = request.method && !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body: needsBody ? request : undefined,
    duplex: needsBody ? "half" : undefined
  });

  const responseHeaders = {};
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") return;
    responseHeaders[key] = value;
  });

  response.writeHead(upstream.status, responseHeaders);

  if (!upstream.body) {
    response.end();
    return;
  }

  Readable.fromWeb(upstream.body).pipe(response);
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const pathname = requestUrl.pathname;

    if (pathname.startsWith("/api/")) {
      await proxyApiRequest(request, response, pathname, requestUrl.search);
      return;
    }

    const normalizedPath = pathname === "/" ? "/index.html" : pathname;
    const assetPath = path.join(distDir, normalizedPath.replace(/^\/+/, ""));

    if (existsSync(assetPath) && !assetPath.endsWith(path.sep)) {
      await sendFile(response, assetPath);
      return;
    }

    await sendFile(response, path.join(distDir, "index.html"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: message }));
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
