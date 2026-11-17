import type { FinderAnswers } from "@/lib/recommendation";

export type FinderGlyph =
  | "me"
  | "partner"
  | "child"
  | "guest"
  | "side"
  | "back"
  | "front"
  | "combination"
  | "firm-1"
  | "firm-2"
  | "firm-3"
  | "firm-4"
  | "unsure"
  | "hot"
  | "warm"
  | "cool"
  | "pet"
  | "solo"
  | "pressure"
  | "support"
  | "value"
  | "natural"
  | "motion"
  | "size"
  | "budget";

export type FinderStep = {
  key: keyof FinderAnswers;
  question: string;
  hint?: string;
  columns?: 2 | 3 | 4 | 5;
  options: { value: string; label: string; detail?: string; glyph: FinderGlyph; meta?: number[] }[];
};

export const finderSteps: FinderStep[] = [
  {
    key: "who",
    question: "Who will use the mattress?",
    columns: 4,
    options: [
      { value: "me", label: "Just me", glyph: "me" },
      { value: "partner", label: "Me and a partner", glyph: "partner" },
      { value: "child", label: "A child or teenager", glyph: "child" },
      { value: "guest", label: "Guests", detail: "For a spare room", glyph: "guest" },
    ],
  },
  {
    key: "position",
    question: "What is your sleeping position?",
    hint: "Choose the position you usually wake up in.",
    columns: 4,
    options: [
      { value: "side", label: "Side", glyph: "side" },
      { value: "back", label: "Back", glyph: "back" },
      { value: "front", label: "Front", glyph: "front" },
      { value: "combination", label: "A bit of everything", glyph: "combination" },
    ],
  },
  {
    key: "firmness",
    question: "Which firmness do you prefer?",
    columns: 5,
    options: [
      { value: "softer", label: "Softer", glyph: "firm-1" },
      { value: "medium", label: "Medium", glyph: "firm-2" },
      { value: "medium-firm", label: "Medium-firm", glyph: "firm-3" },
      { value: "firm", label: "Firm", glyph: "firm-4" },
      { value: "unsure", label: "Not sure", detail: "We will suggest one", glyph: "unsure" },
    ],
  },
  {
    key: "hot",
    question: "Do you tend to sleep hot?",
    columns: 3,
    options: [
      { value: "often", label: "Yes, often", glyph: "hot" },
      { value: "sometimes", label: "Sometimes", glyph: "warm" },
      { value: "rarely", label: "Rarely", glyph: "cool" },
    ],
  },
  {
    key: "share",
    question: "Do you share your bed?",
    columns: 3,
    options: [
      { value: "partner", label: "Yes, with a partner", glyph: "partner" },
      { value: "sometimes", label: "Sometimes", detail: "A child or a pet", glyph: "pet" },
      { value: "no", label: "No", glyph: "solo" },
    ],
  },
  {
    key: "priority",
    question: "What matters most to you?",
    columns: 5,
    options: [
      { value: "pressure", label: "Pressure relief", glyph: "pressure" },
      { value: "support", label: "Even support", glyph: "support" },
      { value: "value", label: "Value", glyph: "value" },
      { value: "natural", label: "Natural materials", glyph: "natural" },
      { value: "motion", label: "Less movement", detail: "From a partner", glyph: "motion" },
    ],
  },
  {
    key: "size",
    question: "Which mattress size do you need?",
    hint: "Measure your bed frame. UK sizes differ from European sizes.",
    columns: 5,
    options: [
      { value: "single", label: "Single", detail: "90 × 190 cm", glyph: "size", meta: [90, 190] },
      { value: "small-double", label: "Small Double", detail: "120 × 190 cm", glyph: "size", meta: [120, 190] },
      { value: "double", label: "Double", detail: "135 × 190 cm", glyph: "size", meta: [135, 190] },
      { value: "king", label: "King", detail: "150 × 200 cm", glyph: "size", meta: [150, 200] },
      { value: "super-king", label: "Super King", detail: "180 × 200 cm", glyph: "size", meta: [180, 200] },
    ],
  },
  {
    key: "budget",
    question: "What is your budget?",
    columns: 4,
    options: [
      { value: "under-250", label: "Under £250", glyph: "budget", meta: [1] },
      { value: "250-450", label: "£250 – £450", glyph: "budget", meta: [2] },
      { value: "450-plus", label: "£450 and above", glyph: "budget", meta: [3] },
      { value: "flexible", label: "Flexible", detail: "Show me the best fit", glyph: "budget", meta: [0] },
    ],
  },
];
