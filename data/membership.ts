import { contact } from "@/config/site";

export type Plan = {
  id: string;
  name: string;
  commitment: string;
  price: string;
  cadence: string;
  summary: string;
  includes: string[];
  featured?: boolean;
  /** Where this plan's CTA leads. Configurable — no payment is implemented. */
  href: string;
  ctaLabel: string;
};

export const plans: Plan[] = [
  {
    id: "open",
    name: "OPEN FLOOR",
    commitment: "NO CONTRACT",
    price: "45",
    cadence: "PER MONTH",
    summary: "Full floor access. Train on your own terms, cancel whenever.",
    includes: [
      "24/7 floor access",
      "Full free-weight and rig access",
      "Recovery room",
      "Rolling monthly — cancel any time",
    ],
    href: contact.primary,
    ctaLabel: "ENQUIRE",
  },
  {
    id: "committed",
    name: "THE COMMITTED",
    commitment: "12 MONTHS",
    price: "35",
    cadence: "PER MONTH",
    summary:
      "For people who already know they'll be here. The floor, the programming, the room.",
    includes: [
      "Everything in Open Floor",
      "Written programming, updated monthly",
      "Quarterly strength testing",
      "2 guest passes per month",
    ],
    featured: true,
    href: contact.primary,
    ctaLabel: "JOIN THE GYM",
  },
  {
    id: "coached",
    name: "FULLY COACHED",
    commitment: "ROLLING",
    price: "180",
    cadence: "PER MONTH",
    summary: "A coach in the room. Assessment, plan, and eyes on every session.",
    includes: [
      "Everything in The Committed",
      "Weekly 1:1 coached session",
      "Movement assessment + review",
      "Direct line to your coach",
    ],
    href: contact.primary,
    ctaLabel: "SPEAK TO A COACH",
  },
];

export const facility = [
  { label: "TRAINING FLOOR", value: 18500, suffix: " SQ FT", animate: true },
  { label: "PLATFORMS & RIGS", value: 24, suffix: "", animate: true },
  { label: "FREE WEIGHT", value: 46, suffix: " TONNES", animate: true },
  { label: "OPEN", value: 0, suffix: "24/7", animate: false },
];
