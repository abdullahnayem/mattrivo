/**
 * DEMO CONTENT. These are illustrative sample reviews written for the design
 * presentation. They are not real customers and must be replaced with verified
 * reviews from a review platform before launch.
 */
export type Review = {
  id: string;
  name: string;
  location: string;
  productId: string;
  size: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date; rendered in British format. */
  date: string;
  verified: boolean;
  demo: true;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Hannah R.",
    location: "Bristol",
    productId: "comfort-hybrid",
    size: "King",
    rating: 5,
    title: "Settled in within a week",
    body: "We took our time choosing and the finder pointed us straight to the Comfort Hybrid. It feels supportive without being hard, and neither of us notices the other turning over any more.",
    date: "2026-10-14",
    verified: false,
    demo: true,
  },
  {
    id: "r2",
    name: "Priya & Tom",
    location: "Leeds",
    productId: "premium-pillowtop",
    size: "Double",
    rating: 5,
    title: "Soft on top, steady underneath",
    body: "As a side sleeper I wanted something gentler on my shoulders. The pillowtop has that softer first feel, but I still feel held up through the middle.",
    date: "2026-09-28",
    verified: false,
    demo: true,
  },
  {
    id: "r3",
    name: "James M.",
    location: "Edinburgh",
    productId: "essential",
    size: "Single",
    rating: 4,
    title: "Ideal for the guest room",
    body: "Bought for our spare room. Guests have said it is comfortable and it looks smart on the bed. Exactly what we needed at a sensible price.",
    date: "2026-09-03",
    verified: false,
    demo: true,
  },
  {
    id: "r4",
    name: "Eilidh K.",
    location: "Brighton",
    productId: "natural-comfort",
    size: "Super King",
    rating: 5,
    title: "Quietly beautiful",
    body: "You can see the care in the tufting and the finish. It sleeps cooler than our old foam mattress and the bedroom finally feels calm.",
    date: "2026-08-19",
    verified: false,
    demo: true,
  },
  {
    id: "r5",
    name: "Sophie L.",
    location: "Manchester",
    productId: "comfort-hybrid",
    size: "Double",
    rating: 4,
    title: "A proper upgrade",
    body: "Our previous mattress had started to dip. This one feels even across the whole surface and the edges are sturdy enough to sit on to put socks on.",
    date: "2026-07-30",
    verified: false,
    demo: true,
  },
];
