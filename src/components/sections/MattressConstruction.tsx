"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExplodedMattress, type ExplodeMode } from "@/components/mattress/ExplodedMattress";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { mattressLayers } from "@/data/mattressLayers";
import { cn, ease } from "@/lib/utils";

export function MattressConstruction() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, margin: "0px 0px -25% 0px" });
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<ExplodeMode>("exploded");
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t1 = window.setTimeout(() => setEntered(true), 250);
    const t2 = window.setTimeout(() => setActive((a) => (a === null ? 0 : a)), 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [inView]);

  const shown = mode === "exploded" ? (hover ?? active) : null;
  const layer = shown !== null ? mattressLayers[shown] : null;

  const select = (i: number) => {
    setMode("exploded");
    setActive(i);
  };
  const step = (dir: 1 | -1) => {
    const n = mattressLayers.length;
    select(((active ?? (dir === 1 ? -1 : 0)) + dir + n) % n);
  };

  return (
    <section id="construction" className="relative overflow-hidden bg-studio section-y" aria-labelledby="construction-title">
      {/* soft studio light */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 55% at 32% 48%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%), radial-gradient(40% 40% at 85% 10%, rgba(236,231,237,0.6), rgba(236,231,237,0) 70%)",
        }}
      />
      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Inside the mattrivo mattress</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="construction-title" className="h-section mt-5 max-w-[14ch]">
                Good sleep starts beneath the surface.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-5">
            <p className="lede max-w-md">
              Every layer has a purpose. Discover how thoughtful materials and carefully considered construction come together.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Visual */}
          <div ref={stageRef} className="relative min-w-0 lg:col-span-7 xl:col-span-8">
            <div className="-mx-[calc(var(--gutter)-4px)] sm:mx-0">
              <ExplodedMattress
                mode={mode}
                active={mode === "exploded" ? (hover ?? active) : null}
                entered={entered}
                onSelect={select}
                onHover={setHover}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-0">
              <button
                type="button"
                onClick={() => {
                  setMode("exploded");
                  setActive(null);
                }}
                className={cn(
                  "text-[13px] font-semibold tracking-wide transition-colors",
                  mode === "exploded" && active === null ? "text-plum" : "text-graphite hover:text-charcoal",
                )}
              >
                <span className="link-underline">View all layers</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("assembled");
                  setActive(null);
                }}
                className={cn(
                  "text-[13px] font-semibold tracking-wide transition-colors",
                  mode === "assembled" ? "text-plum" : "text-graphite hover:text-charcoal",
                )}
              >
                <span className="link-underline">Reset view</span>
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="min-w-0 lg:col-span-5 xl:col-span-4">
            {/* Mobile / tablet selector */}
            <div
              className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden"
              role="tablist"
              aria-label="Mattress layers"
            >
              {mattressLayers.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => select(i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors",
                    active === i ? "border-plum bg-plum text-ivory" : "border-line bg-ivory/70 text-charcoal",
                  )}
                >
                  <span className="tabular-nums opacity-70">{l.number}</span>
                  {l.short}
                </button>
              ))}
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="flex items-center justify-between border-b border-charcoal/15 pb-4">
                <p className="eyebrow">Layer {layer ? layer.number : "—"} / 06</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Previous layer"
                    onClick={() => step(-1)}
                    className="grid size-9 place-items-center rounded-full border border-line bg-ivory/60 transition-colors hover:border-charcoal/40"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next layer"
                    onClick={() => step(1)}
                    className="grid size-9 place-items-center rounded-full border border-line bg-ivory/60 transition-colors hover:border-charcoal/40"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="relative min-h-[300px] pt-7" aria-live="polite">
                <AnimatePresence mode="wait">
                  {layer ? (
                    <motion.div
                      key={layer.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <h3 className="font-serif text-[2rem] leading-[1.05] text-plum sm:text-[2.35rem]">{layer.title}</h3>
                      <p className="lede mt-4">{layer.description}</p>
                      <dl className="mt-7 divide-y divide-charcoal/10 border-y border-charcoal/10">
                        {layer.material.map((m) => (
                          <div key={m.label} className="grid grid-cols-[110px_1fr] gap-4 py-3 text-[13.5px]">
                            <dt className="text-muted">{m.label}</dt>
                            <dd className="text-charcoal">{m.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <h3 className="font-serif text-[2rem] leading-[1.05] text-plum sm:text-[2.35rem]">
                        Six layers, one considered whole.
                      </h3>
                      <p className="lede mt-4">
                        Select a numbered marker, hover over a layer or use the arrows to explore what each material contributes.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop index */}
              <ol className="mt-4 hidden border-t border-charcoal/10 lg:block">
                {mattressLayers.map((l, i) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      className="group flex w-full items-center gap-4 border-b border-charcoal/10 py-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "w-6 text-[12px] font-semibold tabular-nums transition-colors",
                          shown === i ? "text-plum" : "text-muted",
                        )}
                      >
                        {l.number}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[14px] transition-colors",
                          shown === i ? "text-plum" : "text-graphite group-hover:text-charcoal",
                        )}
                      >
                        {l.title}
                      </span>
                      <motion.span
                        className="h-px bg-plum"
                        animate={{ width: shown === i ? 28 : 0 }}
                        transition={{ duration: 0.45, ease }}
                      />
                    </button>
                  </li>
                ))}
              </ol>

              <p className="mt-6 text-[12px] leading-relaxed text-muted">
                Illustrative hybrid construction. Not every mattrivo mattress contains every layer shown, and material
                specifications will be confirmed by the manufacturer for each product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
