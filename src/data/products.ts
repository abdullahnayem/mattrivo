import type { StaticImageData } from "next/image";
import { media } from "./media";

export type SizeId = "single" | "small-double" | "double" | "king" | "super-king";
export type SleepPosition = "side" | "back" | "front" | "combination";
export type CollectionId = "hybrid" | "memory-foam" | "pocket-sprung" | "natural";
export type LayerId = "cover" | "quilt" | "comfort-foam" | "support-foam" | "pocket-springs" | "base";

export const UK_SIZES: { id: SizeId; label: string; dims: string }[] = [
  { id: "single", label: "Single", dims: "90 × 190 cm" },
  { id: "small-double", label: "Small Double", dims: "120 × 190 cm" },
  { id: "double", label: "Double", dims: "135 × 190 cm" },
  { id: "king", label: "King", dims: "150 × 200 cm" },
  { id: "super-king", label: "Super King", dims: "180 × 200 cm" },
];

export const sizeLabel = (id: SizeId) => UK_SIZES.find((s) => s.id === id)?.label ?? id;
export const sizeDims = (id: SizeId) => UK_SIZES.find((s) => s.id === id)?.dims ?? "";

/** Visual recipe for the illustrated product render. */
export type RenderVariant = {
  fabric: string;
  border: string;
  tape: string;
  pillowtop?: boolean;
  tufted?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  type: string;
  collections: CollectionId[];
  tagline: string;
  description: string;
  /** Demonstration prices in GBP. Not verified commercial prices. */
  prices: Record<SizeId, number>;
  /** Only populate when a genuine, verifiable previous price exists. */
  previousPrices?: Partial<Record<SizeId, number>>;
  firmness: { label: string; scale: number };
  depthCm: number;
  construction: string[];
  layers: LayerId[];
  goodFor: string[];
  attributes: {
    positions: SleepPosition[];
    airflow: 1 | 2 | 3;
    motionIsolation: 1 | 2 | 3;
    pressureRelief: 1 | 2 | 3;
    support: 1 | 2 | 3;
    naturalFibres: boolean;
    valueTier: 1 | 2 | 3;
  };
  /** Leave undefined until verified reviews are connected. */
  rating?: { average: number; count: number };
  badge?: string;
  render: RenderVariant;
  lifestyle: StaticImageData;
};

export const products: Product[] = [
  {
    id: "essential",
    slug: "essential",
    name: "Essential",
    type: "Sprung mattress",
    collections: [],
    tagline: "Everyday comfort, honestly priced.",
    description:
      "A dependable sprung mattress with a quilted comfort surface. A sensible choice for everyday sleep, guest rooms and first homes.",
    prices: { single: 129, "small-double": 159, double: 179, king: 209, "super-king": 249 },
    firmness: { label: "Medium-firm", scale: 6.5 },
    depthCm: 22,
    construction: ["Sprung support", "Quilted comfort"],
    layers: ["cover", "quilt", "support-foam", "base"],
    goodFor: ["Everyday value", "Guest rooms"],
    attributes: {
      positions: ["back", "front"],
      airflow: 2,
      motionIsolation: 1,
      pressureRelief: 1,
      support: 2,
      naturalFibres: false,
      valueTier: 1,
    },
    render: { fabric: "#f7f4ee", border: "#e9e3d8", tape: "#cfc6b8" },
    lifestyle: media.productLifeEssential,
  },
  {
    id: "comfort-hybrid",
    slug: "comfort-hybrid",
    name: "Comfort Hybrid",
    type: "Hybrid mattress",
    collections: ["hybrid", "pocket-sprung"],
    tagline: "Your everyday sleep upgrade.",
    description:
      "Individually wrapped pocket springs beneath a foam comfort layer, for a balanced medium-firm feel that suits most sleepers and couples.",
    prices: { single: 219, "small-double": 269, double: 299, king: 349, "super-king": 409 },
    firmness: { label: "Medium-firm", scale: 6 },
    depthCm: 26,
    construction: ["Pocket springs", "Foam comfort layer"],
    layers: ["cover", "quilt", "comfort-foam", "support-foam", "pocket-springs", "base"],
    goodFor: ["Your everyday sleep upgrade"],
    attributes: {
      positions: ["side", "back", "combination"],
      airflow: 3,
      motionIsolation: 3,
      pressureRelief: 2,
      support: 3,
      naturalFibres: false,
      valueTier: 2,
    },
    badge: "Our launch pick",
    render: { fabric: "#f8f6f1", border: "#e6e2d9", tape: "#a3ad98" },
    lifestyle: media.productLifeHybrid,
  },
  {
    id: "premium-pillowtop",
    slug: "premium-pillowtop",
    name: "Premium Pillowtop",
    type: "Pillowtop hybrid",
    collections: ["hybrid", "memory-foam", "pocket-sprung"],
    tagline: "A softer surface, a little extra comfort.",
    description:
      "Pocket springs topped with a cushioned pillowtop and a memory foam comfort layer, for a more generous, enveloping medium feel.",
    prices: { single: 299, "small-double": 359, double: 399, king: 469, "super-king": 539 },
    firmness: { label: "Medium", scale: 5 },
    depthCm: 30,
    construction: ["Pocket springs", "Cushioned pillowtop"],
    layers: ["cover", "quilt", "comfort-foam", "support-foam", "pocket-springs", "base"],
    goodFor: ["A softer surface", "A little extra comfort"],
    attributes: {
      positions: ["side", "combination"],
      airflow: 2,
      motionIsolation: 3,
      pressureRelief: 3,
      support: 2,
      naturalFibres: false,
      valueTier: 2,
    },
    render: { fabric: "#fbfaf6", border: "#ece7ed", tape: "#5b3a5b", pillowtop: true },
    lifestyle: media.productLifePillowtop,
  },
  {
    id: "natural-comfort",
    slug: "natural-comfort",
    name: "Natural Comfort",
    type: "Natural fibre mattress",
    collections: ["natural", "pocket-sprung"],
    tagline: "Considered materials, quietly luxurious.",
    description:
      "Pocket springs layered with natural fibre comfort fillings, hand-finished with traditional tufting. Fibre specification to be confirmed with the manufacturer.",
    prices: { single: 599, "small-double": 719, double: 799, king: 899, "super-king": 1049 },
    firmness: { label: "Medium", scale: 5.5 },
    depthCm: 28,
    construction: ["Pocket springs", "Natural fibre fillings"],
    layers: ["cover", "quilt", "pocket-springs", "base"],
    goodFor: ["Natural materials", "Breathable comfort"],
    attributes: {
      positions: ["side", "back", "combination"],
      airflow: 3,
      motionIsolation: 2,
      pressureRelief: 2,
      support: 3,
      naturalFibres: true,
      valueTier: 3,
    },
    render: { fabric: "#f1ebe0", border: "#e2d9ca", tape: "#b8b89f", tufted: true },
    lifestyle: media.productLifeNatural,
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id || p.slug === id);

export const DEFAULT_SIZE: SizeId = "double";

export const collectionLabels: Record<CollectionId | "all", string> = {
  all: "All",
  hybrid: "Hybrid",
  "memory-foam": "Memory Foam",
  "pocket-sprung": "Pocket Sprung",
  natural: "Natural",
};
