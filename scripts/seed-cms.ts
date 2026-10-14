import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createClient } from "@sanity/client";
import { defaultContent } from "../src/lib/default-content.ts";
import type { Photo } from "../src/lib/types.ts";

assert(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.SANITY_WRITE_TOKEN,
  "Set the Trust's project ID and a server-only write token in .env.local first.",
);
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-10-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
const assets = new Map<string, string>();
async function upload(photo: Photo) {
  assert(
    photo.src.startsWith("/images/") && !photo.src.includes(".."),
    "Only selected public images can be imported",
  );
  let id = assets.get(photo.src);
  if (!id) {
    const asset = await client.assets.upload(
      "image",
      await fs.readFile(`public${photo.src}`),
      { filename: photo.src.split("/").pop() },
    );
    id = asset._id;
    assets.set(photo.src, id);
  }
  return {
    _type: "image",
    asset: { _type: "reference", _ref: id },
    alt: photo.alt,
  };
}
await client.createIfNotExists({
  _id: "siteSettings",
  _type: "siteSettings",
  ...defaultContent.site,
  impactStats: defaultContent.site.impactStats.map((p, i) => ({
    ...p,
    _key: String(i),
  })),
  team: defaultContent.site.team.map((p, i) => ({ ...p, _key: String(i) })),
  focusAreas: defaultContent.site.focusAreas.map((p, i) => ({
    ...p,
    _key: String(i),
  })),
});
for (const page of defaultContent.pages)
  await client.createIfNotExists({
    _id: `page-${page.slug}`,
    _type: "page",
    ...page,
  });
for (const event of defaultContent.events) {
  const { image, ...data } = event;
  await client.createIfNotExists({
    _id: `event-${event.slug}`,
    _type: "event",
    ...data,
    cover: await upload(image),
  });
}
for (const album of defaultContent.albums) {
  const photos = [];
  for (const [i, photo] of album.photos.entries())
    photos.push({ ...(await upload(photo)), _key: String(i) });
  await client.createIfNotExists({
    _id: `album-${album.slug}`,
    _type: "album",
    ...album,
    photos,
  });
}
for (const [i, member] of defaultContent.committee.entries()) {
  const { photo, ...data } = member;
  await client.createIfNotExists({
    _id: `committee-${member.slug}`,
    _type: "committeeMember",
    ...data,
    order: i,
    ...(photo ? { portrait: await upload(photo) } : {}),
  });
}
for (const [i, partner] of defaultContent.partners.entries()) {
  const { image, ...data } = partner;
  await client.createIfNotExists({
    _id: `partner-${i}`,
    _type: "partner",
    ...data,
    ...(image ? { logo: await upload({ src: image, alt: partner.name }) } : {}),
  });
}
console.log(
  `Imported bundled content and ${assets.size} images. Existing documents were preserved.`,
);
