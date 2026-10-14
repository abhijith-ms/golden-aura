import type { Event } from "./types";

export function orderEvents(events: Event[]): Event[] {
  const editions = ["namma-bengaluru-open-2024", "namma-bengaluru-open-2025"];
  return [
    ...editions.flatMap((slug) => events.filter((event) => event.slug === slug)),
    ...events.filter((event) => !editions.includes(event.slug)),
  ];
}

export function safeLink(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function eventStatus(event: Event, now = new Date()): Event["status"] {
  const ended =
    event.endDate && new Date(`${event.endDate}T23:59:59+05:30`) < now;
  return event.status === "upcoming" && ended ? "completed" : event.status;
}

export function eventAction(event: Event, now = new Date()) {
  const status = eventStatus(event, now);
  if (status === "upcoming" && event.registrationOpen) {
    const url = safeLink(event.registrationUrl);
    if (url) return { label: "Register for this event", href: url };
  }
  const archive = safeLink(event.archiveUrl);
  if (status === "completed" && archive)
    return { label: "Visit the tournament archive", href: archive };
  return { label: "Enquire about this event", href: "/contact" };
}
