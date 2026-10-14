import "server-only";
import { createClient } from "@sanity/client";
import { defaultContent } from "./default-content";
import type { Content } from "./types";
import { eventStatus } from "./events";

export const cmsConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const client = cmsConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-10-01",
      useCdn: false,
      perspective: "published",
    })
  : null;

export async function getContent(): Promise<Content> {
  if (!client) return defaultContent;
  const content = await client.fetch<Content>(
    `{
    "site": *[_type == "siteSettings"][0]{name,legalName,email,phones,address,instagram,heroTitle,heroIntro,aboutIntro,registrationDetails,team,focusAreas,impactStats},
    "pages": *[_type == "page"]{slug,eyebrow,title,intro,body,sections,closing},
    "events": *[_type == "event"] | order(year desc, _createdAt desc){slug,title,shortTitle,year,dateLabel,startDate,endDate,venue,format,status,registrationOpen,registrationUrl,prizeFund,description,"image":{"src":coalesce(cover.asset->url, image.src),"alt":coalesce(cover.alt,image.alt)},rules,brochureUrl,resultsUrl,archiveUrl,"attendees":attendees[]{name,title,country,"photo":{"src":portrait.asset->url,"alt":portrait.alt}}},
    "albums": *[_type == "album"] | order(_createdAt asc){slug,title,description,"photos":photos[]{"src":coalesce(asset->url,src),alt}},
    "partners": *[_type == "partner"] | order(_createdAt asc){name,description,event,category,"image":logo.asset->url},
    "committee": *[_type == "committeeMember"] | order(order asc){slug,name,role,affiliation,group,"photo":{"src":portrait.asset->url,"alt":portrait.alt}}
  }`,
    {},
    { next: { revalidate: 300, tags: ["content"] } },
  );
  if (
    !content.site ||
    !Array.isArray(content.events) ||
    !Array.isArray(content.albums) ||
    !Array.isArray(content.committee)
  ) {
    throw new Error(
      "CMS content is incomplete. Run the documented import before connecting production.",
    );
  }
  return {
    ...content,
    committee: content.committee.map((member) => ({
      ...member,
      photo: member.photo?.src ? member.photo : undefined,
    })),
    events: content.events.map((event) => ({
      ...event,
      status: eventStatus(event),
      attendees: event.attendees?.map((person) => ({
        ...person,
        photo: person.photo?.src ? person.photo : undefined,
      })),
    })),
  };
}
