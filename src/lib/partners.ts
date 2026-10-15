import type { Partner } from "./types";

// Keep the source categories intact; these groups are for the Partners page.
export function partnerGroups(partners: Partner[]) {
  return [
    {
      title: "Official & corporate partners.",
      description: "Official, corporate and institutional partners of the 2025 International Open.",
      partners: partners.filter((partner) => (partner.category === "official" || partner.category === "institutional") && partner.name !== "Mysore Sandal Soap"),
    },
    {
      title: "Government & civic supporters.",
      description: "Organisations acknowledged in the tournament impact report.",
      partners: partners.filter((partner) => partner.category === "government"),
    },
    {
      title: "Tournament supporters.",
      description: "Chess bodies and tournament supporters · 2025",
      partners: partners.filter((partner) => (!partner.category || partner.category === "community" || partner.category === "support") && partner.name !== "Karnataka Olympic Association"),
    },
  ];
}
