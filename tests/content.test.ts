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
    ...defaultContent.events.flatMap((event) => event.attendees?.flatMap((person) => person.photo ? [person.photo.src] : []) || []),
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
test("official 2025 partners are distinct from chess-community affiliations", () => {
  const official = defaultContent.partners.filter((partner) => partner.category === "official");
  assert.deepEqual(official.map((partner) => partner.name), ["WestBridge Capital", "Akshayakalpa Organic", "Mysore Sandal Soap"]);
  assert(official.every((partner) => partner.image && partner.event.includes("2025")));
  assert.equal(defaultContent.partners.filter((partner) => partner.category === "community").length, 2);
});
test("the first-edition archive preserves featured names, federations and distinct FIDE titles", () => {
  const event = defaultContent.events.find((event) => event.slug === "namma-bengaluru-open-2024")!;
  assert.equal(event.status, "completed");
  assert.equal(event.attendees?.length, 14);
  assert.equal(new Set(event.attendees?.map((person) => person.name)).size, 14);
  assert.equal(event.attendees?.filter((person) => person.title === "GM").length, 8);
  assert.equal(event.attendees?.find((person) => person.name === "Janelle Mae Frayna")?.title, "WGM");
  assert.equal(event.attendees?.find((person) => person.name === "Diajeng Theresa Singgih")?.title, "WIM");
  assert(event.attendees?.every((person) => person.country && person.photo));
  assert(defaultContent.events.filter((other) => other.slug !== event.slug).every((other) => !other.attendees?.length));
});
