export type Program = {
  id: string;
  index: string;
  title: string;
  discipline: string;
  description: string;
  /** Short bullet facts shown when the program is the active one. */
  meta: { label: string; value: string }[];
  /** Drives the accent hue shift and the 3D prop shown alongside the program. */
  prop: "dumbbell" | "barbell" | "kettlebell" | "plate";
};

export const programs: Program[] = [
  {
    id: "strength",
    index: "01",
    title: "STRENGTH",
    discipline: "Maximal force",
    description:
      "Low reps. Long rests. Heavy intent. A linear and block-periodised approach to the squat, press, pull and deadlift — coached to the millimetre, loaded without ego.",
    meta: [
      { label: "SESSIONS", value: "3—4 / WEEK" },
      { label: "BLOCK", value: "12 WEEKS" },
      { label: "FOCUS", value: "1—5 REPS" },
    ],
    prop: "barbell",
  },
  {
    id: "mass",
    index: "02",
    title: "BUILD MASS",
    discipline: "Hypertrophy",
    description:
      "Volume you can actually recover from. Controlled eccentrics, full ranges and a progression model that adds work before it adds weight. Size is a by-product of consistency.",
    meta: [
      { label: "SESSIONS", value: "4—5 / WEEK" },
      { label: "BLOCK", value: "10 WEEKS" },
      { label: "FOCUS", value: "6—15 REPS" },
    ],
    prop: "dumbbell",
  },
  {
    id: "cardio",
    index: "03",
    title: "CARDIO",
    discipline: "Engine work",
    description:
      "Zone 2 that builds the base and intervals that break the ceiling. Rower, bike, sled and track — programmed around your lifting so one never eats the other.",
    meta: [
      { label: "SESSIONS", value: "2—4 / WEEK" },
      { label: "BLOCK", value: "ONGOING" },
      { label: "FOCUS", value: "AEROBIC BASE" },
    ],
    prop: "plate",
  },
  {
    id: "functional",
    index: "04",
    title: "FUNCTIONAL",
    discipline: "Transfer",
    description:
      "Carry, crawl, throw, hinge, brace. Strength that leaves the building with you — built on loaded carries, unilateral work and honest positional control.",
    meta: [
      { label: "SESSIONS", value: "2—3 / WEEK" },
      { label: "BLOCK", value: "8 WEEKS" },
      { label: "FOCUS", value: "CIRCUITS" },
    ],
    prop: "kettlebell",
  },
  {
    id: "personal",
    index: "05",
    title: "PERSONAL",
    discipline: "One to one",
    description:
      "A coach in the room, every set. Full assessment, a written plan, and someone who notices the rep before it breaks down. The fastest route from where you are to where you're going.",
    meta: [
      { label: "SESSIONS", value: "BY ARRANGEMENT" },
      { label: "BLOCK", value: "ROLLING" },
      { label: "FOCUS", value: "1:1 COACHED" },
    ],
    prop: "dumbbell",
  },
];
