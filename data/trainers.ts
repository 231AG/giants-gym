export type Trainer = {
  id: string;
  /** Placeholder data — replace name/specialty/credential with real coach details. */
  name: string;
  specialty: "Strength" | "Hypertrophy" | "Functional Training";
  credential: string;
  years: string;
  line: string;
  /** Profile action destination — a bio page, a booking link, or mailto:. */
  href: string;
};

export const trainers: Trainer[] = [
  {
    id: "coach-01",
    name: "ADA OKONJO",
    specialty: "Strength",
    credential: "CSCS · National-level platform",
    years: "11 YRS",
    line: "Believes the bar tells the truth. Builds squats that hold up under pressure.",
    href: "#join",
  },
  {
    id: "coach-02",
    name: "MARCUS REID",
    specialty: "Hypertrophy",
    credential: "MSc Sport Science",
    years: "08 YRS",
    line: "Obsessive about range of motion. Will make you slow the eccentric down.",
    href: "#join",
  },
  {
    id: "coach-03",
    name: "LENA VOSS",
    specialty: "Functional Training",
    credential: "SFG II · Kettlebell",
    years: "09 YRS",
    line: "Carries, crawls and conditioning. Coaches the positions nobody films.",
    href: "#join",
  },
  {
    id: "coach-04",
    name: "TOMÁS ARAYA",
    specialty: "Strength",
    credential: "Powerlifting · Rehab-led",
    years: "13 YRS",
    line: "Takes the long way round injuries. Nobody leaves his floor moving worse.",
    href: "#join",
  },
];
