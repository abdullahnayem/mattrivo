/**
 * FAQ copy. Segments wrapped in {{double braces}} are unconfirmed business
 * details. They render as visible, editable placeholders until confirmed.
 */
export type Faq = { id: string; question: string; answer: string[] };

export const faqs: Faq[] = [
  {
    id: "choose",
    question: "How do I choose the right mattress?",
    answer: [
      "Start with how you sleep. Your usual sleeping position, whether you share your bed and whether you tend to sleep warm all point towards a particular feel and construction.",
      "Our Mattress Finder asks eight short questions and recommends up to three mattresses, with a plain-English reason for each.",
    ],
  },
  {
    id: "foam-vs-hybrid",
    question: "What is the difference between memory foam and hybrid?",
    answer: [
      "A memory foam mattress uses layers of foam throughout. It contours closely to the body and tends to absorb movement well.",
      "A hybrid combines a pocket spring core with foam or fibre comfort layers. The springs add a more responsive, buoyant feel and allow air to move through the core.",
    ],
  },
  {
    id: "firmness",
    question: "Which mattress firmness is right for me?",
    answer: [
      "As a general guide, side sleepers often prefer a medium feel that lets the shoulders and hips settle. Back sleepers tend to suit medium-firm, and front sleepers usually prefer medium-firm to firm so the hips stay level.",
      "Personal preference and body weight matter too, so treat this as a starting point rather than a rule.",
    ],
  },
  {
    id: "size",
    question: "What mattress size should I choose?",
    answer: [
      "UK sizes are Single (90 × 190 cm), Small Double (120 × 190 cm), Double (135 × 190 cm), King (150 × 200 cm) and Super King (180 × 200 cm).",
      "Always measure your bed frame before ordering, as European sizes differ from UK sizes.",
    ],
  },
  {
    id: "delivery",
    question: "How long does delivery take?",
    answer: [
      "We deliver across the UK. Delivery timescales are {{to be confirmed}} and charges are {{to be confirmed}}. You will see your delivery options at checkout before you pay.",
    ],
  },
  {
    id: "trial",
    question: "How does the sleep trial work?",
    answer: [
      "We are proposing a {{90-night}} sleep trial so you can get to know your mattress at home.",
      "Eligibility, any minimum use period, and how collections and refunds work are {{to be confirmed}}. Full terms will be published here before launch.",
    ],
  },
  {
    id: "returns",
    question: "Can I return a mattress?",
    answer: [
      "Your statutory rights under UK consumer law always apply. Our own returns and collection process is {{to be confirmed}}.",
    ],
  },
  {
    id: "warranty",
    question: "What warranty is included?",
    answer: ["Warranty length and coverage are {{to be confirmed}} for each mattress and will be shown on every product page."],
  },
  {
    id: "care",
    question: "How should I care for my mattress?",
    answer: [
      "Let your mattress air for a few hours after unpacking. Use a breathable mattress protector, and rotate the mattress head to toe every few weeks for the first three months, then every three months after that.",
      "Spot clean with a damp cloth and mild detergent. Avoid soaking the fabric.",
    ],
  },
  {
    id: "removal",
    question: "Do you offer old mattress removal?",
    answer: ["An old mattress removal service is {{to be confirmed}}. If it is offered, you will be able to add it at checkout."],
  },
];
