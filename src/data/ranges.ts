/**
 * Three-range comparison. All values are proposed, for discussion, and editable.
 * Prices shown are for a UK Double (135 × 190 cm).
 */
export const comparisonSize = "UK Double · 135 × 190 cm";

export const comparisonRanges = [
  { productId: "essential", name: "Essential", linkLabel: "Explore Essential", highlight: false },
  {
    productId: "comfort-hybrid",
    name: "Comfort Hybrid",
    linkLabel: "Explore Comfort",
    highlight: true,
    label: "Our launch pick",
  },
  { productId: "premium-pillowtop", name: "Premium Pillowtop", linkLabel: "Explore Premium", highlight: false },
] as const;

export type ComparisonRow = {
  label: string;
  kind: "price" | "text" | "link";
  values: string[][];
};

export const comparisonRows: ComparisonRow[] = [
  { label: "Sample price", kind: "price", values: [["£179"], ["£299"], ["£399"]] },
  { label: "Proposed feel", kind: "text", values: [["Medium-firm"], ["Medium-firm"], ["Medium"]] },
  {
    label: "Proposed construction",
    kind: "text",
    values: [
      ["Sprung support", "Quilted comfort"],
      ["Pocket springs", "Foam comfort layer"],
      ["Pocket springs", "Cushioned pillowtop"],
    ],
  },
  { label: "Proposed depth", kind: "text", values: [["22 cm"], ["26 cm"], ["30 cm"]] },
  {
    label: "A good starting point for",
    kind: "text",
    values: [
      ["Everyday value", "Guest rooms"],
      ["Your everyday", "sleep upgrade"],
      ["A softer surface", "A little extra comfort"],
    ],
  },
];

export const comparisonFootnote =
  "These are proposed product specifications for discussion, rather than supplier-confirmed performance claims.";
