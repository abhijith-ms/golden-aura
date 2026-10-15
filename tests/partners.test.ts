import test from "node:test";
import assert from "node:assert/strict";
import { defaultContent } from "../src/lib/default-content.ts";
import { partnerGroups } from "../src/lib/partners.ts";

test("Partners page combines relationships without duplicates or the two removed names", () => {
  const groups = partnerGroups(defaultContent.partners);
  assert.deepEqual(groups.map((group) => group.partners.length), [11, 7, 7]);
  const names = groups.flatMap((group) => group.partners.map((partner) => partner.name));
  assert.equal(new Set(names).size, names.length);
  assert(!names.includes("Mysore Sandal Soap"));
  assert(!names.includes("Karnataka Olympic Association"));
  assert(groups[0].partners.some((partner) => partner.name === "WestBridge Capital"));
  assert(groups[0].partners.some((partner) => partner.name === "ACT Fibernet"));
  assert(groups[2].partners.some((partner) => partner.name === "International Chess Federation (FIDE)"));
  assert(groups[2].partners.some((partner) => partner.name === "Karnataka State Chess Association"));
  assert(defaultContent.partners.some((partner) => partner.name === "Mysore Sandal Soap"));
  assert(partnerGroups([]).every((group) => !group.partners.length));
});
