import type { MetadataRoute } from "next";
import { siteUrl, preventIndexing } from "@/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(preventIndexing
        ? { disallow: "/" }
        : { allow: "/", disallow: ["/studio/", "/api/"] }),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
