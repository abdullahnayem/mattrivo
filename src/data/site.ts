/**
 * Business settings in one place. Anything not yet confirmed by the business is
 * flagged `confirmed: false` and rendered with a visible "to be confirmed" style,
 * so nothing unverified reads as a promise.
 */
export const site = {
  name: "mattrivo",
  market: "United Kingdom",
  currency: "GBP",
  locale: "en-GB",
  announcement: "Thoughtfully made for better nights. Explore our sleep collection.",
  email: "hello@mattrivo.co.uk",
  social: [
    { label: "Instagram", href: "#" },
    { label: "Pinterest", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};

export type Policy = {
  label: string;
  value: string;
  confirmed: boolean;
};

export const policies = {
  trial: {
    label: "Sleep trial",
    nights: 90,
    value: "90-night sleep trial",
    confirmed: false,
    terms: "Trial length, eligibility, minimum use period, collection and refund conditions are to be confirmed by mattrivo.",
  },
  delivery: {
    label: "Delivery",
    value: "Delivery timescales and charges",
    confirmed: false,
  },
  returns: {
    label: "Returns",
    value: "Returns and collection process",
    confirmed: false,
  },
  warranty: {
    label: "Warranty",
    value: "Warranty length and coverage",
    confirmed: false,
  },
  removal: {
    label: "Old mattress removal",
    value: "Old mattress removal service",
    confirmed: false,
  },
  vat: {
    label: "VAT",
    value: "Whether displayed prices include VAT",
    confirmed: false,
  },
  payments: {
    label: "Payment methods",
    value: "Accepted payment methods",
    confirmed: false,
  },
} as const;
