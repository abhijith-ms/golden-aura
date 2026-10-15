import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { defaultContent } from "../src/lib/default-content.ts";
import { committeeGroups } from "../src/lib/types.ts";
import { countryFlags } from "../src/lib/countries.ts";
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
test("the committee has unique profiles, source groups and an honest missing-portrait fallback", () => {
  assert.equal(defaultContent.committee.length, 24);
  assert.equal(new Set(defaultContent.committee.map((member) => member.slug)).size, 24);
  assert(!defaultContent.committee.some((member) => ["D K Shivakumar", "Sowmya M U"].includes(member.name)));
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
  assert.equal(defaultContent.partners.filter((partner) => partner.category === "community").length, 4);
  assert.equal(defaultContent.partners.filter((partner) => partner.category === "institutional").length, 9);
  assert.equal(defaultContent.partners.filter((partner) => partner.category === "government").length, 7);
  assert.equal(new Set(defaultContent.partners.map((partner) => partner.name)).size, defaultContent.partners.length);
  for (const name of ["Birla A1 Cement", "ACT Fibernet", "Fortis", "MSIL", "Nandini", "United World Academy", "Crestwood High", "Hatti Kaapi", "St Francis College", "Government of Karnataka", "Sports Authority of India", "Department of Youth Empowerment & Sports, Karnataka"])
    assert(defaultContent.partners.some((partner) => partner.name === name && partner.image), name);
  assert.equal(defaultContent.partners.find((partner) => partner.name === "Karnataka Olympic Association")?.image, undefined);
});
test("the original Trust mission and message of support remain separate from committee membership", () => {
  const about = defaultContent.pages.find((page) => page.slug === "about")!;
  assert.deepEqual(about.sections?.map((section) => section.title), ["Inclusivity & Engagement", "Strengthening the Chess Ecosystem", "Chess Beyond the Board", "Fostering a Lasting Impact"]);
  assert(about.body?.includes("Karnataka State Chess Association") && about.closing?.includes("educational institution"));
  const message = defaultContent.pages.find((page) => page.slug === "support-message")!;
  assert(message.intro.includes("D K Shivakumar") && message.intro.includes("2025"));
  assert(message.body?.includes("Dear Friends of Chess"));
  for (const year of ["2024", "2025"])
    assert.equal(defaultContent.events.find((event) => event.slug === `namma-bengaluru-open-${year}`)?.title, `Namma Bengaluru International Grandmasters Open Chess Tournament ${year}`);
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

test("the committee introduction is timeless and each featured country has a flag", () => {
  const page = defaultContent.pages.find((page) => page.slug === "committee")!;
  assert(!/2025/.test(page.eyebrow + page.intro));
  for (const person of defaultContent.events.flatMap((event) => event.attendees || [])) {
    assert(countryFlags[person.country], person.country);
    assert(existsSync(`public${countryFlags[person.country]}`));
  }
  const event = defaultContent.events.find((event) => event.slug === "namma-bengaluru-open-2024")!;
  assert.equal(event.startDate, "2024-01-18");
  assert.equal(event.endDate, "2024-01-26");
  assert.equal(event.venue, "Sri Kanteerava Indoor Stadium, Bengaluru");
});

test("new asset imports keep the metadata required by the preparation script", () => {
  const assets = JSON.parse(readFileSync("scripts/assets.json", "utf8"));
  for (const asset of assets) {
    assert(asset.album && asset.source && asset.file);
    if (asset.album === "feedback" || asset.album === "flags") assert(existsSync(`public/images/${asset.file}`));
  }
});
