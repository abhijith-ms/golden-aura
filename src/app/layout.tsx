import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "@fontsource-variable/archivo";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { Header } from "@/components/header";
import { ScrollReveals } from "@/components/scroll-reveals";
import { Footer } from "@/components/shared";
import { LenisProvider } from "@/components/lenis-provider";
import { getContent } from "@/lib/content";
import { siteUrl as origin, preventIndexing } from "@/lib/site-config";

const headingFont = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-heading",
  weight: "400 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Golden Aura Trust — Chess is for everyone",
    template: "%s | Golden Aura Trust",
  },
  description:
    "Golden Aura Trust brings people together through chess tournaments, community events, and opportunities for women and emerging players in Bengaluru.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Golden Aura Trust",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Golden Aura Trust — Chess for everyone, above a gold chessboard",
      },
    ],
  },
  robots: preventIndexing
    ? { index: false, follow: false }
    : { index: true, follow: true },
  icons: { icon: "/images/golden-aura-logo.webp" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { site } = await getContent();
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: origin,
    email: site.email,
    telephone: site.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Bengaluru",
      addressCountry: "IN",
    },
    sameAs: [site.instagram],
  };
  return (
    <html lang="en" className={headingFont.variable} data-scroll-behavior="smooth">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LenisProvider>
          <Header />
          <main id="main">{children}</main>
          <ScrollReveals />
          <Footer site={site} />
        </LenisProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organisation).replace(/</g, "\\u003c"),
          }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            strategy="afterInteractive"
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
