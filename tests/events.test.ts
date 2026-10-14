import test from "node:test";
import assert from "node:assert/strict";
import { eventAction, eventStatus, safeLink } from "../src/lib/events.ts";
import type { Event } from "../src/lib/types.ts";
const event: Event = {
  slug: "test",
  title: "Test",
  shortTitle: "Test",
  year: "2026",
  dateLabel: "Future edition",
  venue: "Bengaluru",
  format: "OPEN",
  status: "upcoming",
  registrationOpen: true,
  registrationUrl: "https://registration.example.com",
  endDate: "2026-12-31",
  description: "Test event",
  image: { src: "/images/chess-hero.webp", alt: "Chess" },
};
test("registration requires an upcoming, open, unexpired event and safe link", () => {
  assert.equal(
    eventAction(event, new Date("2026-10-13")).label,
    "Register for this event",
  );
  for (const changes of [
    { status: "completed" },
    { status: "cancelled" },
    { registrationOpen: false },
    { registrationUrl: "javascript:alert(1)" },
    { endDate: "2025-01-01" },
  ])
    assert.notEqual(
      eventAction({ ...event, ...changes } as Event).label,
      "Register for this event",
    );
});
test("safe links reject dangerous protocols and protocol-relative URLs", () => {
  for (const value of [
    "javascript:alert(1)",
    "//evil.example",
    "/\\evil.example",
    "data:text/html,bad",
    "http://insecure.example",
  ])
    assert.equal(safeLink(value), undefined);
  assert.equal(safeLink("/events"), "/events");
  assert.equal(safeLink("https://example.com"), "https://example.com/");
});
test("expired upcoming events become completed while cancellations remain cancelled", () => {
  assert.equal(eventStatus({ ...event, endDate: "2025-01-01" }), "completed");
  assert.equal(
    eventStatus({ ...event, status: "cancelled", endDate: "2025-01-01" }),
    "cancelled",
  );
});
