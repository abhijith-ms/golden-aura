import type { Content, Photo } from "./types";
import { committee } from "./committee.ts";
import { firstEditionAttendees } from "./first-edition-attendees.ts";

const photo = (file: string, alt: string): Photo => ({
  src: `/images/${file}.webp`,
  alt,
});
export const defaultContent: Content = {
  committee,
  site: {
    impactStats: [
      { value: "02", label: "International editions\nin Bengaluru" },
      { value: "03", label: "Areas of focus.\nOne shared purpose." },
      { value: "64", label: "Squares that connect us.\nEveryone is welcome." },
    ],
    name: "Golden Aura Trust",
    legalName: "The Golden Aura Trust (R)",
    email: "auragolden4@gmail.com",
    phones: ["+91 94818 60073", "+91 94484 60072"],
    address:
      "No. 216, 9th Main, 3rd Cross, BCC Layout, Vijayanagara II, Bengaluru – 560040",
    instagram: "https://www.instagram.com/goldenaura_chess/",
    heroTitle: "Chess for\neveryone.",
    heroIntro:
      "International tournaments. Local communities. Golden Aura Trust brings people together through chess — wherever your journey begins.",
    aboutIntro:
      "A chessboard brings people together. We help that connection grow into opportunity — through international tournaments, community events, and wider access to the game.",
    team: [
      { name: "Sowmya M U", role: "Trust team" },
      { name: "Arvind Shastry", role: "Trust team" },
      { name: "Gautham Upadhyaya", role: "Trust team" },
    ],
    focusAreas: [
      {
        title: "A seat for everyone.",
        description:
          "Community chess that connects people across ages, backgrounds, and abilities. A welcoming place to learn, play, and belong.",
        label: "SOCIO-CHESS",
      },
      {
        title: "A city on the world stage.",
        description:
          "Bringing international competition to Bengaluru and creating opportunities for emerging players to meet experienced talent.",
        label: "BENGALURU & BEYOND",
      },
      {
        title: "More women at the board.",
        description:
          "Building visibility, participation, and competitive opportunities for women and girls in chess.",
        label: "WOMEN IN CHESS",
      },
    ],
  },
  pages: [
    {
      slug: "committee",
      eyebrow: "THE 2025 ORGANISING COMMITTEE",
      title: "People behind\nthe tournament.",
      intro: "Chess organisers, players, arbiters and advisers came together to deliver the second Namma Bengaluru International Grandmasters Open. These are the people and roles from the 2025 edition.",
    },
    {
      slug: "about",
      eyebrow: "THE TRUST",
      title: "The Trust.",
      intro:
        "Rooted in Bengaluru. Connected by chess. We bring people together through a shared belief in the possibilities of the game.",
      body: "Golden Aura Trust works to make chess more accessible and inclusive. Our work centres on socio-chess activities, Bengaluru as a global chess hub, and women in chess.\nWe collaborate with the Karnataka State Chess Association and Bengaluru Urban District Chess Association, and bring together experience in tournament organisation, chess, and community building.",
    },
    {
      slug: "events",
      eyebrow: "AT THE BOARD",
      title: "Tournaments.",
      intro:
        "International competition and neighbourhood gatherings. Explore the events that bring our chess community together.",
    },
    {
      slug: "gallery",
      eyebrow: "MOMENTS THAT MATTER",
      title: "At the board.",
      intro:
        "A glimpse of the concentration, connections, and celebrations beyond the sixty-four squares.",
    },
    {
      slug: "partners",
      eyebrow: "A SHARED PURPOSE",
      title: "Better together.",
      intro:
        "Help bring chess to more people. Partner with the Trust to support competition, community, and opportunity.",
    },
    {
      slug: "contact",
      eyebrow: "YOUR NEXT MOVE",
      title: "Let’s talk chess.",
      intro:
        "Player, parent, coach, or potential partner — we would love to hear from you.",
    },
  ],
  events: [
    {
      slug: "namma-bengaluru-open-2025",
      title: "2nd Namma Bengaluru International Grandmasters Open",
      shortTitle: "Namma Bengaluru Open",
      year: "2025",
      dateLabel: "10–18 April 2025",
      startDate: "2025-04-10",
      endDate: "2025-04-18",
      venue: "Koramangala Indoor Stadium, Bengaluru",
      format: "INTERNATIONAL GRANDMASTERS OPEN",
      status: "completed",
      registrationOpen: false,
      prizeFund: "₹55 lakh",
      description:
        "An international stage in the heart of Bengaluru. The second edition brought grandmasters, titled players, and emerging talent together across tournament sections.",
      image: photo(
        "open-2025-hall",
        "Players competing at the 2025 Namma Bengaluru Open",
      ),
      archiveUrl: "https://nammabigchess.com/",
      rules:
        "The 2025 competition has concluded. Consult the official tournament archive for the edition’s categories, eligibility, schedule, and regulations.",
    },
    {
      slug: "namma-bengaluru-blitz-2025",
      title: "Namma Bengaluru International Open Blitz",
      shortTitle: "Namma Bengaluru Blitz",
      year: "2025",
      dateLabel: "14 April 2025",
      startDate: "2025-04-14",
      endDate: "2025-04-14",
      venue: "Koramangala Indoor Stadium, Bengaluru",
      format: "FIDE-RATED BLITZ",
      status: "completed",
      registrationOpen: false,
      prizeFund: "₹4 lakh",
      description:
        "Fast decisions and fierce competition. The open blitz event formed part of the second Namma Bengaluru International Grandmasters Open.",
      image: photo(
        "open-2025-players",
        "Players concentrating at the 2025 tournament",
      ),
      archiveUrl: "https://nammabigchess.com/",
    },
    {
      slug: "namma-bengaluru-open-2024",
      attendees: firstEditionAttendees,
      title: "1st Bengaluru International Grandmasters Open",
      shortTitle: "The first international edition",
      year: "2024",
      dateLabel: "2024 edition",
      venue: "Bengaluru",
      format: "INTERNATIONAL GRANDMASTERS OPEN",
      status: "completed",
      registrationOpen: false,
      description:
        "The first edition brought Indian and international chess players together in Bengaluru, establishing a foundation for the Trust’s international tournament programme.",
      image: photo(
        "open-2024-players",
        "Players at the first Bengaluru Grandmasters Open",
      ),
      archiveUrl: "https://nammabigchess.com/",
    },
    {
      slug: "chess-and-coffee",
      title: "Chess & Coffee",
      shortTitle: "Chess & Coffee",
      year: "2025",
      dateLabel: "Past community gatherings",
      venue: "Neighbourhood cafés, Bengaluru",
      format: "COMMUNITY CHESS",
      status: "completed",
      registrationOpen: false,
      description:
        "A conversation, a coffee, and a game. Our neighbourhood gatherings create a relaxed space for people to discover chess and meet others who love it.",
      image: photo(
        "coffee-community",
        "People playing at a Chess and Coffee gathering",
      ),
    },
  ],
  albums: [
    {
      slug: "open-2025",
      title: "Namma Bengaluru Open 2025",
      description: "International competition at Koramangala Indoor Stadium.",
      photos: [
        photo("open-2025-hall", "The playing hall at the 2025 Open"),
        photo(
          "open-2025-players",
          "Tournament players concentrating at their boards",
        ),
        photo("boris-savchenko", "Boris Savchenko at the 2025 Open"),
        photo("iniyan-panneerselvam", "Iniyan Panneerselvam at the board"),
        photo("ethan-vaz", "Ethan Vaz playing at the 2025 Open"),
      ],
    },
    {
      slug: "community",
      title: "Chess & Coffee",
      description: "New connections over a familiar game.",
      photos: [
        photo("coffee-community", "The Chess and Coffee community"),
        photo("coffee-venue", "A café prepared for a chess gathering"),
        photo("coffee-board", "Coffee beside a chessboard"),
        photo(
          "women-at-board",
          "A player concentrating at a community gathering",
        ),
      ],
    },
    {
      slug: "open-2024",
      title: "The first edition · 2024",
      description: "Where the international tournament journey began.",
      photos: [
        photo(
          "open-2024-highlight",
          "A participant at the first international edition",
        ),
        photo("open-2024-trophy", "The first edition tournament trophy"),
        photo("open-2024-players", "Players competing at the first edition"),
        photo("open-2024-game", "A game at the first edition"),
        photo("open-2024-venue", "The first edition venue"),
      ],
    },
    {
      slug: "amateurs",
      title: "Karnataka amateur championship",
      description: "Competition and recognition for the chess community.",
      photos: [
        photo("amateur-awards", "Championship prize presentation"),
        photo("amateur-community", "Participants at the amateur championship"),
        photo("amateur-players", "Young players at a prize presentation"),
        photo("amateur-presentation", "Recognising a championship participant"),
      ],
    },
    {
      slug: "press",
      title: "The 2025 tournament launch",
      description:
        "Launching the second Namma Bengaluru international edition.",
      photos: [
        photo(
          "press-launch",
          "The chess king unveiled at the tournament launch",
        ),
        photo("press-poster", "The 2025 tournament poster launch"),
      ],
    },
  ],
  partners: [
    {
      name: "Karnataka State Chess Association",
      category: "community",
      description: "Connected to Karnataka’s chess community.",
      event: "Chess community",
      image: "/images/ksca.webp",
    },
    {
      name: "Bengaluru Urban District Chess Association",
      category: "community",
      description: "Connected to grassroots chess in Bengaluru.",
      event: "Chess community",
      image: "/images/budca.webp",
    },
    {
      name: "WestBridge Capital",
      category: "official",
      description: "Official partner of the second Namma Bengaluru International Grandmasters Open.",
      event: "Official partner · 2025",
      image: "/images/westbridge-capital.webp",
    },
    {
      name: "Akshayakalpa Organic",
      category: "official",
      description: "Part of the official partner line-up for the 2025 international tournament.",
      event: "Official partner · 2025",
      image: "/images/akshayakalpa-organic.webp",
    },
    {
      name: "Mysore Sandal Soap",
      category: "official",
      description: "An official partner supporting the 2025 Namma Bengaluru Open.",
      event: "Official partner · 2025",
      image: "/images/mysore-sandal-soap.webp",
    },
  ],
};
