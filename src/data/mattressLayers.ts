import type { LayerId } from "./products";

export type MattressLayer = {
  id: LayerId;
  number: string;
  title: string;
  short: string;
  description: string;
  material: { label: string; value: string }[];
  /** Thickness in the illustration (px in a 900-wide viewBox), not real centimetres. */
  thickness: number;
};

/**
 * An illustrative hybrid construction. Not every mattrivo mattress uses every
 * layer. Replace material values with manufacturer-confirmed data.
 */
export const mattressLayers: MattressLayer[] = [
  {
    id: "cover",
    number: "01",
    title: "Breathable Mattress Cover",
    short: "Cover",
    description: "A soft, breathable fabric surface designed to create a comfortable first layer.",
    material: [
      { label: "Material", value: "Knitted fabric, fine woven texture" },
      { label: "Finish", value: "Quilted, with a stitched border" },
      { label: "Specification", value: "Fibre content to be confirmed" },
    ],
    thickness: 9,
  },
  {
    id: "quilt",
    number: "02",
    title: "Quilted Comfort Layer",
    short: "Quilting",
    description: "An additional cushioning layer for a softer, more inviting feel.",
    material: [
      { label: "Material", value: "Soft fibre filling" },
      { label: "Construction", value: "Stitched in a quilted pattern" },
      { label: "Specification", value: "Fill weight to be confirmed" },
    ],
    thickness: 24,
  },
  {
    id: "comfort-foam",
    number: "03",
    title: "Comfort Foam",
    short: "Comfort foam",
    description: "A cushioning layer designed to contribute to the mattress’s overall comfort feel.",
    material: [
      { label: "Material", value: "Open-cell comfort foam, shown as memory foam" },
      { label: "Character", value: "Slow, contouring response" },
      { label: "Specification", value: "Density and depth to be confirmed" },
    ],
    thickness: 34,
  },
  {
    id: "support-foam",
    number: "04",
    title: "Support Foam / Transition Layer",
    short: "Transition",
    description: "A transition layer between the upper comfort materials and the spring system.",
    material: [
      { label: "Material", value: "Higher-density support foam" },
      { label: "Character", value: "Firmer, more structured than the comfort layer" },
      { label: "Specification", value: "Density and depth to be confirmed" },
    ],
    thickness: 26,
  },
  {
    id: "pocket-springs",
    number: "05",
    title: "Individual Pocket Springs",
    short: "Pocket springs",
    description: "Individually wrapped springs designed to respond independently.",
    material: [
      { label: "Material", value: "Steel coils in individual fabric pockets" },
      { label: "Behaviour", value: "Each spring moves on its own" },
      { label: "Specification", value: "Spring count and gauge to be confirmed" },
    ],
    thickness: 76,
  },
  {
    id: "base",
    number: "06",
    title: "Support Base",
    short: "Base",
    description: "Provides the structural foundation for the mattress.",
    material: [
      { label: "Material", value: "Dense structural foam" },
      { label: "Underside", value: "Durable base fabric" },
      { label: "Specification", value: "To be confirmed per product" },
    ],
    thickness: 24,
  },
];
