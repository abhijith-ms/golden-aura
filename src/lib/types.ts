export type Photo = { src: string; alt: string };
export type EventAttendee = {
  name: string;
  title: "GM" | "IM" | "WGM" | "WIM" | "WFM";
  country: string;
  photo?: Photo;
};
export const committeeGroups = ["Core committee", "Chief arbiters", "Advisory board", "Tournament team"] as const;
export type CommitteeMember = {
  slug: string;
  name: string;
  role: string;
  affiliation?: string;
  group: (typeof committeeGroups)[number];
  photo?: Photo;
};
export type Event = {
  attendees?: EventAttendee[];
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  dateLabel: string;
  startDate?: string;
  endDate?: string;
  venue: string;
  format: string;
  status: "upcoming" | "completed" | "cancelled";
  registrationOpen: boolean;
  registrationUrl?: string;
  prizeFund?: string;
  description: string;
  image: Photo;
  rules?: string;
  brochureUrl?: string;
  resultsUrl?: string;
  archiveUrl?: string;
};
export type Album = {
  slug: string;
  title: string;
  description: string;
  photos: Photo[];
};
export type Partner = {
  category?: "official" | "community" | "institutional" | "government" | "support";
  name: string;
  description: string;
  event: string;
  image?: string;
};
export type PageCopy = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  body?: string;
  sections?: { title: string; description: string }[];
  closing?: string;
};
export type SiteSettings = {
  impactStats: { value: string; label: string }[];
  name: string;
  legalName: string;
  email: string;
  phones: string[];
  address: string;
  instagram: string;
  heroTitle: string;
  heroIntro: string;
  aboutIntro: string;
  registrationDetails?: string;
  team: { name: string; role: string }[];
  focusAreas: { title: string; description: string; label: string }[];
};
export type Content = {
  site: SiteSettings;
  pages: PageCopy[];
  events: Event[];
  albums: Album[];
  partners: Partner[];
  committee: CommitteeMember[];
};
