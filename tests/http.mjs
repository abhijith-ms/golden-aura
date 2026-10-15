import assert from "node:assert/strict";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const base = process.argv[2] || "http://localhost:3000";
assert(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "Run these checks against the local fixture only",
);
for (const path of [
  "/",
  "/about",
  "/committee",
  "/events",
  "/gallery",
  "/partners",
  "/contact",
  "/privacy",
  "/studio",
  "/events/namma-bengaluru-open-2025",
  "/events/namma-bengaluru-open-2024",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${path} has one main heading`,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
}
for (const path of ["/not-a-real-page", "/events/not-an-event"])
  assert.equal((await fetch(base + path)).status, 404);
const committee = await (await fetch(base + "/committee")).text();
assert(committee.includes("MESSAGE OF SUPPORT") && !committee.includes("Hon. President"));
assert(!committee.includes('id="leadership"') && !committee.includes("View the 2025 committee archive"));
assert(committee.includes("MESSAGE FROM THE ORGANIZING SECRETARY"));
const home = await (await fetch(base + "/")).text();
assert(home.includes('id="participant-feedback"') && home.includes("Video-306.mp4"));
const archived = await (
  await fetch(base + "/events/namma-bengaluru-open-2025")
).text();
assert(
  archived.includes("registration closed") &&
    !archived.includes("Register for this event"),
);
const robots = await (await fetch(base + "/robots.txt")).text();
assert(robots.includes("Disallow: /"), "Local previews are not indexed");
const post = (body, origin = base) =>
  fetch(base + "/api/enquiry", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
assert.equal((await post({}, "https://foreign.example")).status, 403);
assert.equal((await post({})).status, 400);
const webhook = await fetch(base + "/api/revalidate", {
  method: "POST",
  body: "{}",
});
if (process.env.QA_WEBHOOK_SECRET) {
  assert.equal(webhook.status, 401);
  const body = '{"_type":"page"}';
  const signature = await encodeSignatureHeader(
    body,
    Date.now(),
    process.env.QA_WEBHOOK_SECRET,
  );
  assert.equal(
    (
      await fetch(base + "/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: signature },
        body,
      })
    ).status,
    200,
  );
} else assert.equal(webhook.status, 503);
console.log(
  "Local HTTP checks passed: routes, metadata, 404s, archive actions, security headers, and API boundaries.",
);
