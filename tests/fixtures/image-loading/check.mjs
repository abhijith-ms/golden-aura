import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3032";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const result = await (await fetch(base + "/__qa/status")).json();
assert(result.released && result.failed, "Exercise the delayed and failing images, then release the held response");
const stageRequests = result.requests.filter((request) => request.path.includes("q=90"));
assert(stageRequests.some((request) => request.path.includes("women-at-board.webp")));
const coffee = stageRequests.filter((request) => request.path.includes("coffee-community.webp"));
assert(coffee.some((request) => request.status === 503), "The fixture failed the replacement");
assert(coffee.some((request) => request.status === 200), "Retry loaded the replacement");
assert(!result.requests.some((request) => /^\/images\/(open-2025-players|women-at-board|coffee-community)\.webp/.test(request.path)), "There are no redundant original-photo backdrop requests");
console.log("Gallery fixture checks passed: delayed request, failure, retry, and no raw backdrop downloads.");
