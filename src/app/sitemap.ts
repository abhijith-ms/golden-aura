import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/site-config";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { events } = await getContent();
  return [
    "",
    "/about",
    "/committee",
    "/events",
    "/gallery",
    "/partners",
    "/contact",
    "/privacy",
    ...events.map((e) => `/events/${e.slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
