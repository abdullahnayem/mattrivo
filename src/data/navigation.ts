export type NavLink = { label: string; href: string; note?: string };
export type NavItem = {
  label: string;
  href: string;
  menu?: { heading: string; links: NavLink[]; kind: "mattresses" | "comfort" };
};

export const mainNav: NavItem[] = [
  {
    label: "Mattresses",
    href: "/#bestsellers",
    menu: {
      kind: "mattresses",
      heading: "Mattresses",
      links: [
        { label: "All Mattresses", href: "/#bestsellers", note: "Four considered designs" },
        { label: "Essential", href: "/mattresses/essential", note: "Sprung · Medium-firm" },
        { label: "Comfort Hybrid", href: "/mattresses/comfort-hybrid", note: "Pocket springs · Medium-firm" },
        { label: "Premium Pillowtop", href: "/mattresses/premium-pillowtop", note: "Pillowtop · Medium" },
      ],
    },
  },
  {
    label: "Shop by Comfort",
    href: "/#sleeping-styles",
    menu: {
      kind: "comfort",
      heading: "Shop by Comfort",
      links: [
        { label: "Side Sleepers", href: "/#sleeping-styles", note: "Give at the shoulders and hips" },
        { label: "Back Sleepers", href: "/#sleeping-styles", note: "Even, balanced support" },
        { label: "Front Sleepers", href: "/#sleeping-styles", note: "Keeps the hips level" },
        { label: "Couples", href: "/#sleeping-styles", note: "Less movement transfer" },
        { label: "Hot Sleepers", href: "/#finder", note: "Breathable spring cores" },
      ],
    },
  },
  { label: "Mattress Finder", href: "/#finder" },
  { label: "Our Story", href: "/#our-story" },
  { label: "Sleep Journal", href: "/#journal" },
];

export const footerNav = [
  {
    heading: "Shop",
    links: [
      { label: "All Mattresses", href: "/#bestsellers" },
      { label: "Essential", href: "/mattresses/essential" },
      { label: "Comfort Hybrid", href: "/mattresses/comfort-hybrid" },
      { label: "Premium Pillowtop", href: "/mattresses/premium-pillowtop" },
      { label: "Mattress Finder", href: "/#finder" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Mattress Guide", href: "/journal/memory-foam-vs-hybrid" },
      { label: "Sleep Journal", href: "/#journal" },
      { label: "Compare Ranges", href: "/#compare" },
      { label: "Our Materials", href: "/#materials" },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Delivery", href: "/#faq-delivery" },
      { label: "Sleep Trial", href: "/#faq-trial" },
      { label: "Returns", href: "/#faq-returns" },
      { label: "Warranty", href: "/#faq-warranty" },
      { label: "FAQs", href: "/#faq" },
      { label: "Contact", href: "/info/contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/#our-story" },
      { label: "Our Approach", href: "/#construction" },
      { label: "Sustainability", href: "/#materials" },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/info/privacy-policy" },
  { label: "Cookie Policy", href: "/info/cookie-policy" },
  { label: "Terms and Conditions", href: "/info/terms-and-conditions" },
  { label: "Accessibility", href: "/info/accessibility" },
];
