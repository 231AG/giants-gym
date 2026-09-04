/**
 * Single source of truth for brand-level copy and every outbound destination.
 * Swap the values here to re-point the site — no component edits required.
 */

export const site = {
  name: "GIANTS GYM",
  shortName: "GIANTS",
  tagline: "Build your giant.",
  description:
    "GIANTS GYM — a strength facility built for people who show up. Train hard. Stay consistent. Become stronger.",
  url: "https://giants.gym",
  locale: "en",
} as const;

/**
 * Membership / contact destinations. Every CTA in the site resolves through here,
 * so a real gym can point these at a booking system, CRM or phone number without
 * touching a single component.
 */
export const contact = {
  /** Where the primary CTA goes. Use an in-page anchor, a tel:, a mailto: or a URL. */
  primary: "#join",
  whatsapp: "https://wa.me/10000000000",
  phone: "+1 (000) 000-0000",
  phoneHref: "tel:+10000000000",
  email: "train@giants.gym",
  emailHref: "mailto:train@giants.gym",
  address: "Unit 04, Ironworks Yard, East Dock",
  hours: [
    { days: "MON — FRI", time: "05:00 — 23:00" },
    { days: "SATURDAY", time: "06:00 — 21:00" },
    { days: "SUNDAY", time: "08:00 — 20:00" },
  ],
} as const;

export const nav = [
  { label: "Training", href: "#training" },
  { label: "The Gym", href: "#space" },
  { label: "Membership", href: "#membership" },
] as const;

export const cta = {
  primary: { label: "JOIN THE GYM", href: contact.primary },
  secondary: { label: "EXPLORE TRAINING", href: "#training" },
} as const;

export const social = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Strava", href: "https://strava.com" },
] as const;
