export type Piece = {
  id: "dumbbell" | "barbell" | "kettlebell" | "plate";
  name: string;
  spec: string;
  description: string;
  purpose: string;
};

export const equipment: Piece[] = [
  {
    id: "dumbbell",
    name: "DUMBBELL",
    spec: "2.5 — 60 KG · RUBBER HEX",
    description:
      "Paired, urethane-coated and racked in 2.5kg steps all the way up. The most honest tool in the room: nothing to hide behind when one side is weaker than the other.",
    purpose: "UNILATERAL STRENGTH · HYPERTROPHY",
  },
  {
    id: "barbell",
    name: "OLYMPIC BAR",
    spec: "20 KG · 28 MM · 190K PSI",
    description:
      "Needle-bearing sleeves, medium-depth knurl, no centre knurl. Whip tuned for pulling rather than jerking, because most of the work here is squats and deadlifts.",
    purpose: "MAXIMAL STRENGTH · POWER",
  },
  {
    id: "kettlebell",
    name: "KETTLEBELL",
    spec: "8 — 48 KG · CAST",
    description:
      "Single-piece cast, powder-coated, competition-profile handle. The offset load is the point — it teaches the hips to do the work the lower back keeps volunteering for.",
    purpose: "BALLISTICS · CONDITIONING",
  },
  {
    id: "plate",
    name: "COMPETITION PLATE",
    spec: "±10 G · 450 MM",
    description:
      "Calibrated steel discs, colour-coded and true to within ten grams. When a session is built on percentages, the plates have to be telling the truth.",
    purpose: "CALIBRATED LOADING",
  },
];
