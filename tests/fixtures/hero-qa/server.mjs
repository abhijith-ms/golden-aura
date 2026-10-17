// Read-only localhost fixture: inject diagnostics into the existing production build.
import http from "node:http";
import { readFileSync } from "node:fs";

const bootstrap = readFileSync(new URL("./bootstrap.js", import.meta.url));
const upstream = new URL(process.argv[2] || "http://127.0.0.1:3000");
if (upstream.protocol !== "http:" || !["localhost", "127.0.0.1"].includes(upstream.hostname)) throw new Error("Local production fixture only");

http.createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
  if (!request.url?.startsWith("/") || request.url.startsWith("//")) { response.writeHead(400).end(); return; }
  if (request.url === "/__hero-qa.js") {
    response.writeHead(200, { "content-type": "application/javascript", "cache-control": "no-store" }).end(bootstrap);
    return;
  }
  let referer;
  try { referer = new URL(request.headers.referer || "http://localhost:3001"); }
  catch { response.writeHead(400).end(); return; }
  const fault = referer.searchParams.get("qa-fault");
  if (request.url === "/models/queen.glb" && fault === "corrupt") {
    response.writeHead(200, { "content-type": "model/gltf-binary" }).end("invalid glb fixture");
    return;
  }
  const forward = () => {
    const remote = http.request(new URL(request.url, upstream), {
      method: request.method,
      headers: { ...request.headers, host: upstream.host, "accept-encoding": "identity" },
    }, (result) => {
      const headers = { ...result.headers, "cache-control": "no-store" };
      if (headers["content-type"]?.includes("text/html") && request.method === "GET") {
        delete headers["content-length"];
        delete headers["content-encoding"];
        let html = "";
        result.setEncoding("utf8").on("data", (chunk) => { html += chunk; }).on("end", () => {
          response.writeHead(result.statusCode, headers).end(html.replace("<head>", '<head><script src="/__hero-qa.js"></script>'));
        });
      } else {
        response.writeHead(result.statusCode, headers);
        result.pipe(response);
      }
    });
    remote.on("error", () => { if (!response.headersSent) response.writeHead(502); response.end(); });
    request.on("close", () => { if (!request.complete) remote.destroy(); });
    response.on("close", () => remote.destroy());
    remote.end();
  };
  if (request.url === "/models/queen.glb" && fault === "slow") {
    console.log("Delaying queen response by 12 seconds");
    const delay = setTimeout(forward, 12_000);
    response.on("close", () => { clearTimeout(delay); console.log("Delayed queen request closed"); });
  } else forward();
}).listen(3001, "0.0.0.0", () => console.log("Read-only hero QA fixture: http://localhost:3001"));
