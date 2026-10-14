import { defineField, defineType } from "sanity";
import { committeeGroups } from "@/lib/types";
const text = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => (required ? rule.required() : rule),
  });
const paragraph = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 4,
    validation: (rule) => (required ? rule.required() : rule),
  });
const link = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "url",
    validation: (rule) => rule.uri({ scheme: ["https"] }),
  });
const image = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [text("alt", "Image description")],
  });
const slug = defineField({
  name: "slug",
  title: "URL name",
  type: "string",
  description:
    "Lowercase words separated by hyphens. Keep stable after publishing.",
  validation: (rule) => rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const schemaTypes = [
  defineType({
    name: "siteSettings",
    title: "Trust & homepage",
    type: "document",
    fields: [
      text("name", "Display name"),
      text("legalName", "Legal organisation name"),
      defineField({
        name: "email",
        title: "Public contact email",
        type: "string",
        validation: (rule) => rule.required().email(),
      }),
      defineField({
        name: "phones",
        title: "Public telephone numbers",
        type: "array",
        of: [{ type: "string" }],
        validation: (rule) => rule.required().min(1),
      }),
      paragraph("address", "Office address"),
      link("instagram", "Instagram profile"),
      paragraph("heroTitle", "Homepage headline"),
      paragraph("heroIntro", "Homepage introduction"),
      paragraph("aboutIntro", "Trust introduction"),
      paragraph(
        "registrationDetails",
        "Approved registration information",
        false,
      ),
      defineField({
        name: "team",
        title: "Trust team / committees",
        type: "array",
        of: [
          {
            type: "object",
            fields: [text("name", "Name"), text("role", "Confirmed role")],
          },
        ],
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "focusAreas",
        title: "Three areas of focus",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              text("title", "Heading"),
              paragraph("description", "Description"),
              text("label", "Short label"),
            ],
          },
        ],
        validation: (rule) => rule.required().length(3),
      }),
      defineField({
        name: "impactStats",
        title: "Homepage figures (confirmed values only)",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              text("value", "Figure"),
              paragraph("label", "Description"),
            ],
          },
        ],
        validation: (rule) => rule.required().length(3),
      }),
    ],
    preview: {
      prepare: () => ({ title: "Golden Aura Trust · site settings" }),
    },
  }),
  defineType({
    name: "page",
    title: "Page introductions",
    type: "document",
    fields: [
      defineField({
        name: "slug",
        title: "Page",
        type: "string",
        options: {
          list: ["about", "committee", "support-message", "events", "gallery", "partners", "contact"],
        },
        validation: (rule) => rule.required(),
      }),
      text("eyebrow", "Small heading"),
      paragraph("title", "Page headline"),
      paragraph("intro", "Introduction"),
      paragraph("body", "Page body / message", false),
      defineField({
        name: "sections", title: "Trust mission pillars", type: "array",
        of: [{ type: "object", fields: [text("title", "Heading"), paragraph("description", "Description")] }],
      }),
      paragraph("closing", "Trust invitation", false),
    ],
    preview: { select: { title: "slug" } },
  }),
  defineType({
    name: "event",
    title: "Events",
    type: "document",
    fields: [
      slug,
      text("title", "Full event name"),
      text("shortTitle", "Short event name"),
      text("year", "Edition year"),
      text("dateLabel", "Display dates"),
      defineField({
        name: "startDate",
        title: "Start date (if known)",
        type: "date",
      }),
      defineField({
        name: "endDate",
        title: "End date (if known)",
        type: "date",
      }),
      text("venue", "Venue"),
      text("format", "Event format"),
      defineField({
        name: "status",
        title: "Status",
        type: "string",
        options: { list: ["upcoming", "completed", "cancelled"] },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "registrationOpen",
        title: "Registration is open",
        type: "boolean",
        initialValue: false,
      }),
      link("registrationUrl", "Registration link"),
      text("prizeFund", "Confirmed prize fund", false),
      paragraph("description", "Event introduction"),
      {
        ...image("cover", "Event photograph"),
        validation: (rule) => rule.required(),
      },
      paragraph("rules", "Eligibility, entry details & regulations", false),
      link("brochureUrl", "Brochure link"),
      link("resultsUrl", "Results link"),
      link("archiveUrl", "Official archive link"),
      defineField({
        name: "attendees",
        title: "Featured grandmasters & titled attendees",
        type: "array",
        of: [{
          type: "object",
          fields: [
            text("name", "Name"),
            defineField({ name: "title", title: "FIDE title", type: "string", options: { list: ["GM", "IM", "WGM", "WIM", "WFM"] }, validation: (rule) => rule.required() }),
            text("country", "Country / federation"),
            image("portrait", "Player portrait"),
          ],
        }],
      }),
    ],
    preview: {
      select: { title: "shortTitle", subtitle: "status", media: "cover" },
    },
  }),
  defineType({
    name: "album",
    title: "Photo albums",
    type: "document",
    fields: [
      slug,
      text("title", "Album title"),
      paragraph("description", "Album description"),
      defineField({
        name: "photos",
        title: "Photographs",
        type: "array",
        of: [
          {
            type: "image",
            options: { hotspot: true },
            fields: [text("alt", "Image description")],
          },
        ],
        validation: (rule) => rule.required().min(1),
      }),
    ],
  }),
  defineType({
    name: "committeeMember",
    title: "2025 organising committee",
    type: "document",
    fields: [
      slug,
      text("name", "Name"),
      text("role", "2025 tournament role"),
      text("affiliation", "Association / position in 2025", false),
      defineField({ name: "group", title: "Committee group", type: "string", options: { list: [...committeeGroups] }, validation: (rule) => rule.required() }),
      image("portrait", "Member portrait (leave empty to show initials)"),
      defineField({ name: "order", title: "Display order", type: "number", validation: (rule) => rule.required().integer().min(0) }),
    ],
    preview: { select: { title: "name", subtitle: "role", media: "portrait" } },
  }),
  defineType({
    name: "partner",
    title: "Partners & affiliations",
    type: "document",
    fields: [
      text("name", "Organisation name"),
      paragraph("description", "Approved relationship description"),
      text("event", "Event / relationship label"),
      defineField({ name: "category", title: "Partner category", type: "string", initialValue: "community", options: { list: [{ title: "Official tournament partner", value: "official" }, { title: "Chess community affiliation", value: "community" }, { title: "Corporate & institutional partner", value: "institutional" }, { title: "Government & civic supporter", value: "government" }, { title: "Tournament supporter", value: "support" }] } }),
      image("logo", "Organisation logo"),
    ],
  }),
];
