import { products, sizeLabel, type Product, type SizeId, type SleepPosition } from "@/data/products";
import { formatPrice } from "./utils";

export type FinderAnswers = {
  who?: "me" | "partner" | "child" | "guest";
  position?: SleepPosition;
  firmness?: "softer" | "medium" | "medium-firm" | "firm" | "unsure";
  hot?: "often" | "sometimes" | "rarely";
  share?: "partner" | "sometimes" | "no";
  priority?: "pressure" | "support" | "value" | "natural" | "motion";
  size?: SizeId;
  budget?: "under-250" | "250-450" | "450-plus" | "flexible";
};

export type Recommendation = {
  product: Product;
  score: number;
  reasons: string[];
  note?: string;
  price: number;
};

const FIRMNESS_TARGET: Record<Exclude<NonNullable<FinderAnswers["firmness"]>, "unsure">, number> = {
  softer: 4,
  medium: 5,
  "medium-firm": 6.25,
  firm: 7.75,
};

const POSITION_TARGET: Record<SleepPosition, number> = {
  side: 5,
  back: 6.25,
  front: 7,
  combination: 5.75,
};

const POSITION_LABEL: Record<SleepPosition, string> = {
  side: "side sleepers",
  back: "back sleepers",
  front: "front sleepers",
  combination: "combination sleepers",
};

const BUDGET_RANGE: Record<Exclude<NonNullable<FinderAnswers["budget"]>, "flexible">, [number, number]> = {
  "under-250": [0, 250],
  "250-450": [250, 450],
  "450-plus": [450, Infinity],
};

type Reason = { weight: number; text: string };

/**
 * Transparent, rule-based scoring against product attributes. Each rule adds or
 * removes points and, where it is a genuine fit, contributes a plain-English
 * reason. No percentages are produced or displayed.
 */
export function recommend(answers: FinderAnswers, limit = 3): Recommendation[] {
  const size = answers.size ?? "double";

  const scored = products.map((product) => {
    let score = 0;
    const reasons: Reason[] = [];
    let note: string | undefined;
    const a = product.attributes;
    const price = product.prices[size];

    // Firmness: stated preference first, otherwise inferred from position.
    const target =
      answers.firmness && answers.firmness !== "unsure"
        ? FIRMNESS_TARGET[answers.firmness]
        : answers.position
          ? POSITION_TARGET[answers.position]
          : 6;
    const diff = Math.abs(product.firmness.scale - target);
    score += Math.max(-3, 3 - diff * 1.6);
    if (diff <= 1) {
      reasons.push({
        weight: 3 - diff,
        text:
          answers.firmness && answers.firmness !== "unsure"
            ? `Its ${product.firmness.label.toLowerCase()} feel sits close to the firmness you prefer.`
            : `A ${product.firmness.label.toLowerCase()} feel is a sensible starting point for ${
                answers.position ? POSITION_LABEL[answers.position] : "most sleepers"
              }.`,
      });
    }

    // Sleeping position
    if (answers.position && a.positions.includes(answers.position)) {
      score += 2;
      const detail =
        answers.position === "side"
          ? "its comfort layers are intended to cushion the shoulders and hips"
          : answers.position === "front"
            ? "its firmer support helps keep the hips level"
            : answers.position === "back"
              ? "it balances surface comfort with even support"
              : "it responds easily as you change position";
      reasons.push({ weight: 2, text: `Proposed for ${POSITION_LABEL[answers.position]}, as ${detail}.` });
    }

    // Temperature
    if (answers.hot === "often" || answers.hot === "sometimes") {
      const w = answers.hot === "often" ? 1.4 : 0.7;
      score += (a.airflow - 2) * 2 * w;
      if (a.airflow === 3) {
        reasons.push({
          weight: 2 * w,
          text: product.attributes.naturalFibres
            ? "Natural fibre fillings and an open spring core allow air to move through the mattress."
            : "An open pocket spring core allows air to circulate, which many warmer sleepers prefer.",
        });
      }
    }

    // Sharing
    const shares = answers.share === "partner" || answers.who === "partner";
    if (shares || answers.share === "sometimes") {
      const w = shares ? 1.3 : 0.6;
      score += (a.motionIsolation - 2) * 2 * w;
      if (a.motionIsolation === 3) {
        reasons.push({
          weight: 2.2 * w,
          text: "Individually wrapped springs respond independently, designed to reduce movement across the bed.",
        });
      }
    }

    // Who
    if (answers.who === "guest" || answers.who === "child") {
      score += (3 - a.valueTier) * 1.2;
      if (a.valueTier === 1) {
        reasons.push({
          weight: 2,
          text:
            answers.who === "guest"
              ? "A practical, well-priced choice for a guest room."
              : "A practical, well-priced choice for a growing child’s room.",
        });
      }
    }

    // Priority
    switch (answers.priority) {
      case "pressure":
        score += (a.pressureRelief - 2) * 2.2;
        if (a.pressureRelief === 3)
          reasons.push({
            weight: 3,
            text: "Its generous comfort layers are designed to ease pressure at the shoulders and hips.",
          });
        break;
      case "support":
        score += (a.support - 2) * 2.2;
        if (a.support === 3)
          reasons.push({ weight: 3, text: "A pocket spring core gives consistent, responsive support across the surface." });
        break;
      case "value":
        score += (2 - a.valueTier) * 2.2;
        if (a.valueTier === 1) reasons.push({ weight: 3, text: "The most accessible price in the collection." });
        break;
      case "natural":
        score += a.naturalFibres ? 4.5 : -0.5;
        if (a.naturalFibres)
          reasons.push({ weight: 4, text: "Uses natural fibre comfort fillings, finished with traditional tufting." });
        break;
      case "motion":
        score += (a.motionIsolation - 2) * 2.2;
        if (a.motionIsolation === 3 && !reasons.some((r) => r.text.includes("independently")))
          reasons.push({ weight: 3, text: "Individually wrapped springs help keep movement on your side of the bed." });
        break;
    }

    // Budget
    if (answers.budget && answers.budget !== "flexible") {
      const [min, max] = BUDGET_RANGE[answers.budget];
      if (price <= max && price >= min) {
        score += 3;
        reasons.push({ weight: 1.5, text: `At ${formatPrice(price)} for a ${sizeLabel(size)}, it sits within your budget.` });
      } else if (price < min) {
        score += 1;
      } else {
        score -= Math.min(5, (price - max) / 60);
        note = `Above your budget at ${formatPrice(price)} for a ${sizeLabel(size)}.`;
      }
    }

    const ordered = reasons.sort((x, y) => y.weight - x.weight).map((r) => r.text);
    return { product, score, reasons: Array.from(new Set(ordered)).slice(0, 3), note, price };
  });

  const sorted = scored.sort((x, y) => y.score - x.score);
  const best = sorted[0]?.score ?? 0;
  // Keep the closest match plus anything reasonably close to it.
  return sorted.filter((r, i) => i === 0 || (r.score >= best - 5 && r.reasons.length > 0)).slice(0, limit);
}
