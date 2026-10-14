import test from "node:test";
import assert from "node:assert/strict";

test("review URLs use the deployment origin and stay out of search indexes", async () => {
  const keys = ["SITE_URL", "VERCEL_URL", "VERCEL_ENV"] as const;
  const original = keys.map((key) => process.env[key]);
  const cases = [
    { env: {}, url: "http://localhost:3000", noindex: true },
    {
      env: { VERCEL_URL: "review.vercel.app", VERCEL_ENV: "preview" },
      url: "https://review.vercel.app",
      noindex: true,
    },
    {
      env: { VERCEL_URL: "review.vercel.app", VERCEL_ENV: "production" },
      url: "https://review.vercel.app",
      noindex: true,
    },
    {
      env: { SITE_URL: "https://trust.example", VERCEL_ENV: "preview" },
      url: "https://trust.example",
      noindex: true,
    },
    {
      env: { SITE_URL: "https://trust.example", VERCEL_ENV: "production" },
      url: "https://trust.example",
      noindex: false,
    },
  ];
  try {
    for (const [index, item] of cases.entries()) {
      for (const key of keys) delete process.env[key];
      Object.assign(process.env, item.env);
      const config = await import(
        new URL(`../src/lib/site-config.ts?case=${index}`, import.meta.url).href
      );
      assert.equal(config.siteUrl, item.url);
      assert.equal(config.preventIndexing, item.noindex);
    }
  } finally {
    keys.forEach((key, index) => {
      if (original[index] === undefined) delete process.env[key];
      else process.env[key] = original[index];
    });
  }
});
