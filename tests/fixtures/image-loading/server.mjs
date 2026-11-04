import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";

// Local browser fixture: hold one gallery image and fail the next once.
const upstream = new URL(process.argv[2] || "http://127.0.0.1:3031");
const port = Number(process.argv[3] || 3032);
assert(upstream.protocol === "http:" && ["127.0.0.1", "localhost"].includes(upstream.hostname));
assert(Number.isInteger(port) && port > 0 && port < 65536);
const viewer = process.argv[4] === "viewer";
const requests = [];
const held = [];
let released = false;
let failed = false;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, upstream);
  if (url.origin !== upstream.origin) {
    res.writeHead(400).end();
    return;
  }
  if (url.pathname === "/__qa/status" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ held: held.length, released, failed, requests }));
    return;
  }
  if (url.pathname === "/__qa/release" && req.method === "POST") {
    released = true;
    for (const forward of held.splice(0)) forward();
    res.end("Released");
    return;
  }
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405).end();
    return;
  }
  const record = { path: req.url, status: null };
  requests.push(record);
  const stageImage = url.pathname === "/_next/image" && url.searchParams.get("q") === (viewer ? "95" : "90");
  if (stageImage && url.searchParams.get("url") === "/images/coffee-community.webp" && !failed) {
    failed = true;
    record.status = 503;
    res.writeHead(503, { "Cache-Control": "no-store" }).end("Deliberate gallery image failure");
    return;
  }
  const forward = () => {
    if (res.destroyed) return;
    const request = http.request(url, {
      method: req.method,
      headers: { ...req.headers, host: upstream.host },
    }, (response) => {
      record.status = response.statusCode;
      res.writeHead(response.statusCode, {
        ...response.headers,
        ...(url.pathname === "/_next/image" ? { "cache-control": "no-store" } : {}),
      });
      response.pipe(res);
    });
    request.on("error", () => {
      record.status = 502;
      if (res.destroyed) return;
      if (!res.headersSent) res.writeHead(502);
      res.end("Local preview unavailable");
    });
    res.on("close", () => request.destroy());
    request.end();
  };
  if (stageImage && url.searchParams.get("url") === "/images/women-at-board.webp" && !released) {
    held.push(forward);
  } else forward();
});

server.on("upgrade", (req, client, head) => {
  const remote = net.connect(Number(upstream.port || 80), upstream.hostname, () => {
    const headers = [];
    for (let index = 0; index < req.rawHeaders.length; index += 2) {
      headers.push(`${req.rawHeaders[index]}: ${req.rawHeaders[index + 1]}`);
    }
    remote.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n${headers.join("\r\n")}\r\n\r\n`);
    remote.write(head);
    client.pipe(remote).pipe(client);
  });
  client.on("error", () => remote.destroy());
  client.on("close", () => remote.destroy());
  remote.on("error", () => client.destroy());
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Image-loading fixture: http://127.0.0.1:${port} -> ${upstream.origin}`);
});
