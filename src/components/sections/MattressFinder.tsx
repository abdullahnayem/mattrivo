"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FinderGlyph } from "@/components/finder/FinderGlyph";
import { ProductVisual } from "@/components/products/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { finderSteps } from "@/data/finder";
import { sizeLabel, type SizeId } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { recommend, type FinderAnswers } from "@/lib/recommendation";
import { useUI } from "@/lib/store";
import { cn, ease, formatPrice } from "@/lib/utils";

const colClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
};

export function MattressFinder() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const total = finderSteps.length;
  const done = step >= total;
  const current = finderSteps[Math.min(step, total - 1)];
  const value = answers[current.key];
  const results = useMemo(() => (done ? recommend(answers) : []), [done, answers]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const advancing = useRef(false);
  const choose = (v: string) => {
    setAnswers((a) => ({ ...a, [current.key]: v }));
    if (advancing.current) return;
    advancing.current = true;
    window.setTimeout(() => {
      advancing.current = false;
      setDir(1);
      setStep((s) => Math.min(s + 1, total));
    }, 300);
  };

  // Presets from elsewhere on the page (e.g. "Side Sleepers") pre-answer questions.
  useEffect(() => {
    const onPreset = (e: Event) => {
      const preset = (e as CustomEvent<Partial<FinderAnswers>>).detail;
      setAnswers((prev) => {
        const next = { ...prev, ...preset };
        const firstOpen = finderSteps.findIndex((s) => !next[s.key]);
        setDir(1);
        setStep(firstOpen === -1 ? total : firstOpen);
        return next;
      });
    };
    window.addEventListener("mattrivo:finder-preset", onPreset);
    return () => window.removeEventListener("mattrivo:finder-preset", onPreset);
  }, [total]);

  const restart = () => {
    setAnswers({});
    go(0);
  };

  const progress = Math.min(step, total) / total;

  return (
    <section id="finder" className="section-y bg-cream" aria-labelledby="finder-title">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <Reveal>
              <Eyebrow>Find your comfort</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="finder-title" className="h-section mt-5 max-w-[12ch]">
                Your sleep. Your preferences. Your mattress.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="lede mt-6 max-w-sm">
                Eight short questions. We match your answers against each mattress’s proposed feel and construction, then explain
                every suggestion in plain English.
              </p>
            </Reveal>

            {/* Answer recap */}
            <ol className="mt-10 hidden border-t border-charcoal/10 lg:block">
              {finderSteps.map((s, i) => {
                const ans = s.options.find((o) => o.value === answers[s.key]);
                return (
                  <li key={s.key} className="border-b border-charcoal/10">
                    <button
                      type="button"
                      disabled={!ans && i > step}
                      onClick={() => go(i)}
                      className="flex w-full items-center gap-4 py-2.5 text-left text-[13px] disabled:cursor-default"
                    >
                      <span className={cn("w-5 tabular-nums", i === step && !done ? "font-semibold text-plum" : "text-muted")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("flex-1 truncate", i === step && !done ? "text-plum" : "text-graphite")}>
                        {s.question}
                      </span>
                      {ans && <span className="shrink-0 text-charcoal">{ans.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-md border border-line bg-ivory">
            {/* Progress */}
            <div className="flex items-center gap-5 border-b border-line px-5 py-4 sm:px-8">
              <p className="eyebrow shrink-0 tabular-nums">
                {done ? "Your results" : `Question ${String(step + 1).padStart(2, "0")} of ${String(total).padStart(2, "0")}`}
              </p>
              <div
                className="relative h-[2px] flex-1 bg-line"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={Math.min(step, total)}
                aria-label="Finder progress"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-forest"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.7, ease }}
                />
                <motion.span
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral"
                  animate={{ left: `${progress * 100}%` }}
                  transition={{ duration: 0.7, ease }}
                />
              </div>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {!done ? (
                  <motion.div
                    key={current.key}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.45, ease }}
                    className="px-5 py-8 sm:px-8 sm:py-10"
                  >
                    <fieldset>
                      <legend className="font-serif text-[1.9rem] leading-tight text-charcoal sm:text-[2.4rem]">
                        {current.question}
                      </legend>
                      {current.hint && <p className="mt-2 text-[14px] text-muted">{current.hint}</p>}
                      <div className={cn("mt-8 grid grid-cols-2 gap-2.5", colClass[current.columns ?? 4])}>
                        {current.options.map((o) => {
                          const selected = value === o.value;
                          return (
                            <label
                              key={o.value}
                              className={cn(
                                "group relative flex cursor-pointer flex-col items-start gap-4 rounded-[5px] border p-4 transition-all duration-300 sm:p-5",
                                selected
                                  ? "border-plum bg-white shadow-[0_10px_30px_-18px_rgba(63,30,63,0.5)]"
                                  : "border-line bg-white/40 hover:border-charcoal/30 hover:bg-white",
                              )}
                            >
                              <input
                                type="radio"
                                name={current.key}
                                value={o.value}
                                checked={selected}
                                onChange={() => choose(o.value)}
                                className="sr-only"
                              />
                              <span
                                className={cn(
                                  "transition-colors",
                                  selected ? "text-plum" : "text-graphite group-hover:text-charcoal",
                                )}
                              >
                                <FinderGlyph glyph={o.glyph} meta={o.meta} />
                              </span>
                              <span>
                                <span className="block text-[14px] font-semibold leading-snug text-charcoal">{o.label}</span>
                                {o.detail && <span className="mt-0.5 block text-[12px] text-muted">{o.detail}</span>}
                              </span>
                              <span
                                className={cn(
                                  "absolute right-3 top-3 grid size-5 place-items-center rounded-full border transition-all",
                                  selected ? "border-plum bg-plum text-ivory" : "border-line text-transparent",
                                )}
                                aria-hidden="true"
                              >
                                <Check size={11} strokeWidth={2.2} />
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  </motion.div>
                ) : (
                  <Results key="results" results={results} size={(answers.size ?? "double") as SizeId} onRestart={restart} />
                )}
              </AnimatePresence>
            </div>

            {!done && (
              <div className="flex items-center justify-between border-t border-line px-5 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="text-[13.5px] font-semibold text-charcoal disabled:opacity-30"
                >
                  <span className="link-underline">Back</span>
                </button>
                <button type="button" className="btn btn-primary btn-sm" disabled={!value} onClick={() => go(step + 1)}>
                  <span>{step === total - 1 ? "See my matches" : "Continue"}</span>
                </button>
              </div>
            )}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            Recommendations use simple, transparent rules based on proposed product attributes. Your answers stay in your browser
            and are not stored.
          </p>
        </div>
      </div>
    </section>
  );
}

function Results({ results, size, onRestart }: { results: ReturnType<typeof recommend>; size: SizeId; onRestart: () => void }) {
  const cart = useCart();
  const { openQuickView } = useUI();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-serif text-[1.9rem] leading-tight text-charcoal sm:text-[2.4rem]">
          {results.length > 1 ? "Here’s where we would start." : "Here’s our suggestion."}
        </h3>
        <button type="button" onClick={onRestart} className="flex items-center gap-2 text-[13px] font-semibold text-charcoal">
          <RotateCcw size={14} strokeWidth={1.6} />
          <span className="link-underline">Start again</span>
        </button>
      </div>

      <ol className="mt-8 space-y-4">
        {results.map((r, i) => (
          <motion.li
            key={r.product.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.14 }}
            className={cn(
              "grid gap-5 rounded-[5px] border p-4 sm:grid-cols-[200px_1fr] sm:gap-7 sm:p-5",
              i === 0 ? "border-plum/40 bg-white" : "border-line bg-white/50",
            )}
          >
            <ProductVisual
              product={r.product}
              hoverImage={false}
              className="aspect-[4/3] rounded-[3px] sm:aspect-auto sm:h-full"
            />
            <div className="flex flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p
                    className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", i === 0 ? "text-plum" : "text-muted")}
                  >
                    {i === 0 ? "Our closest match" : "Also worth considering"}
                  </p>
                  <p className="mt-1 font-serif text-[1.8rem] leading-tight text-charcoal">{r.product.name}</p>
                  <p className="text-[13px] text-muted">
                    {r.product.type} · {r.product.firmness.label} · {r.product.depthCm} cm
                  </p>
                </div>
                <p className="text-right">
                  <span className="block text-lg font-semibold tabular-nums">{formatPrice(r.price)}</span>
                  <span className="text-[12px] text-muted">{sizeLabel(size)}</span>
                </p>
              </div>
              {r.reasons.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {r.reasons.map((reason) => (
                    <li key={reason} className="flex gap-3 text-[14px] leading-relaxed text-graphite">
                      <Check size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-forest" />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
              {r.note && <p className="mt-3 text-[13px] text-[#9a5a3c]">{r.note}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-5">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => cart.add(r.product.id, size)}>
                  <span>Add {sizeLabel(size)} to basket</span>
                </button>
                <button type="button" className="text-[13px] font-semibold" onClick={() => openQuickView(r.product.id, size)}>
                  <span className="link-underline">Quick view</span>
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
