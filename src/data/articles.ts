import type { StaticImageData } from "next/image";
import { media } from "./media";

export type Article = {
  slug: string;
  category: string;
  readingTime: string;
  title: string;
  excerpt: string;
  image: StaticImageData;
  imageAlt: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "memory-foam-vs-hybrid",
    category: "Mattress guide",
    readingTime: "6 min read",
    title: "Memory Foam vs Hybrid: Understanding the Difference",
    excerpt:
      "Two of the most popular constructions, and two very different feelings. Here is how to tell which one suits the way you sleep.",
    image: media.journalFoamHybrid,
    imageAlt: "A freshly slept-in bed with white cotton bedding and a grey upholstered headboard",
    body: [
      {
        paragraphs: [
          "Walk into any mattress showroom and the choice quickly narrows to two families: all-foam and hybrid. Both can be excellent. They simply feel different, and that difference matters more than any label.",
        ],
      },
      {
        heading: "How memory foam feels",
        paragraphs: [
          "Memory foam responds slowly to pressure and warmth, so it gradually contours to the shape of your body. Many people describe the feeling as sinking in, or being held.",
          "Because the material absorbs energy, movement tends to stay where it starts. That can be helpful if you share a bed with a restless sleeper.",
        ],
      },
      {
        heading: "How a hybrid feels",
        paragraphs: [
          "A hybrid places comfort layers of foam or fibre above a core of pocket springs. You still get cushioning on the surface, but with more bounce and a quicker response when you change position.",
          "The open structure of a spring core also lets air move through the mattress, which some warmer sleepers prefer.",
        ],
      },
      {
        heading: "Which should you choose?",
        paragraphs: [
          "If you love a close, contouring feel and sleep fairly still, foam may suit you. If you move between positions, like a little lift or tend to sleep warm, a hybrid is often a good place to start.",
          "Whichever you choose, give your body a few weeks to adjust. A new mattress can feel unfamiliar at first, even when it is the right one.",
        ],
      },
    ],
  },
  {
    slug: "choosing-mattress-firmness",
    category: "Comfort",
    readingTime: "5 min read",
    title: "How to Choose Your Mattress Firmness",
    excerpt:
      "Firmness is personal, but your sleeping position is a reliable place to begin. A calm, practical guide to finding your feel.",
    image: media.journalFirmness,
    imageAlt: "A woman stretching on a white bed in front of tall sunlit windows",
    body: [
      {
        paragraphs: [
          "Firmness describes how a mattress feels when you first lie on it. It is different from support, which is about how well the mattress keeps your spine in a comfortable, natural line.",
        ],
      },
      {
        heading: "Start with your sleeping position",
        paragraphs: [
          "Side sleepers usually need a little give at the shoulders and hips, so a medium feel is a sensible starting point.",
          "Back sleepers often prefer medium-firm, which supports the lower back while still cushioning the surface.",
          "Front sleepers tend to suit medium-firm to firm, which helps stop the hips sinking too far.",
        ],
      },
      {
        heading: "Then consider your build",
        paragraphs: [
          "Lighter sleepers may find a firm mattress feels harder than expected, while heavier sleepers may prefer a little more firmness for the same sense of support.",
        ],
      },
      {
        heading: "Sharing a bed",
        paragraphs: [
          "If you and your partner prefer different feels, a medium-firm pocket spring mattress is often a good compromise, as each spring responds independently.",
        ],
      },
    ],
  },
  {
    slug: "uk-mattress-sizes",
    category: "Buying guide",
    readingTime: "4 min read",
    title: "A Guide to UK Mattress Sizes",
    excerpt:
      "From Single to Super King, every UK size with exact dimensions, plus a few tips to make sure your new mattress fits your frame.",
    image: media.journalSizes,
    imageAlt: "A softly lit bedroom with tall French windows and a bed in the foreground",
    body: [
      {
        paragraphs: [
          "UK mattress sizes differ from European and American sizes, so it is worth checking measurements before you order, especially if your bed frame was bought abroad.",
        ],
      },
      {
        heading: "Standard UK sizes",
        paragraphs: [
          "Single: 90 × 190 cm. Small Double: 120 × 190 cm. Double: 135 × 190 cm. King: 150 × 200 cm. Super King: 180 × 200 cm.",
        ],
      },
      {
        heading: "Choosing the right size",
        paragraphs: [
          "For couples, a King gives each person noticeably more room than a Double. If you share with a child or pet in the mornings, a Super King can be worth the extra space.",
          "Measure the inside of your bed frame and allow for the mattress depth too, particularly with deeper pillowtop designs and fitted sheets.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
