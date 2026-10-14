import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { defaultContent } from "../src/lib/default-content.ts";
import { committeeGroups } from "../src/lib/types.ts";
test("the bundled content references existing web assets and unique event routes", () => {
  const images = [
    ...defaultContent.events.map((event) => event.image.src),
    ...defaultContent.albums.flatMap((album) =>
      album.photos.map((photo) => photo.src),
    ),
    ...defaultContent.partners.flatMap((partner) =>
      partner.image ? [partner.image] : [],
    ),
    ...defaultContent.committee.flatMap((member) => member.photo ? [member.photo.src] : []),
  ];
  for (const image of images)
    assert(existsSync(`public${image}`), `Missing selected asset: ${image}`);
  assert.equal(
    new Set(defaultContent.events.map((event) => event.slug)).size,
    defaultContent.events.length,
  );
  assert.equal(defaultContent.site.impactStats.length, 3);
});
test("the 2025 committee has unique profiles, source groups and an honest missing-portrait fallback", () => {
  assert.equal(defaultContent.committee.length, 26);
  assert.equal(new Set(defaultContent.committee.map((member) => member.slug)).size, 26);
  for (const member of defaultContent.committee) {
    assert(committeeGroups.includes(member.group));
    assert(member.name && member.role);
  }
  assert.equal(defaultContent.committee.find((member) => member.name === "M Raju")?.photo, undefined);
});
