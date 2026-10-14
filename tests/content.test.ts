import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { defaultContent } from "../src/lib/default-content.ts";
test("the bundled content references existing web assets and unique event routes", () => {
  const images = [
    ...defaultContent.events.map((event) => event.image.src),
    ...defaultContent.albums.flatMap((album) =>
      album.photos.map((photo) => photo.src),
    ),
    ...defaultContent.partners.flatMap((partner) =>
      partner.image ? [partner.image] : [],
    ),
  ];
  for (const image of images)
    assert(existsSync(`public${image}`), `Missing selected asset: ${image}`);
  assert.equal(
    new Set(defaultContent.events.map((event) => event.slug)).size,
    defaultContent.events.length,
  );
  assert.equal(defaultContent.site.impactStats.length, 3);
});
