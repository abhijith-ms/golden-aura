import assert from "node:assert/strict";

const base = "http://localhost:3001";
for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
  assert.equal((await fetch(`${base}/api/enquiry`, { method })).status, 405);
}
const home = await fetch(base);
assert.equal(home.status, 200);
assert((await home.text()).includes('<script src="/__hero-qa.js"></script>'));
const bootstrap = await fetch(`${base}/__hero-qa.js`);
assert.equal(bootstrap.status, 200);
assert.match(bootstrap.headers.get("content-type"), /javascript/);
const corrupt = await fetch(`${base}/models/queen.glb`, { headers: { referer: `${base}/?qa-fault=corrupt` } });
assert.equal(await corrupt.text(), "invalid glb fixture");
const malformed = await fetch(`${base}/`, { headers: { referer: "invalid url" } });
assert.equal(malformed.status, 400);
console.log("Read-only QA fixture checks passed; no mutating requests reach the site.");
