export const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const preventIndexing =
  !process.env.SITE_URL ||
  process.env.VERCEL_ENV === "preview" ||
  siteUrl.startsWith("http://localhost");
