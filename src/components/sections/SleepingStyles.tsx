"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sleepingStyles } from "@/data/content";
import { cn, ease } from "@/lib/utils";

const presetFor = (id: string) => (id === "couples" ? { who: "partner", share: "partner" } : { position: id });

function explore(id: string) {
  window.dispatchEvent(new CustomEvent("mattrivo:finder-preset", { detail: presetFor(id) }));
  document.getElementById("finder")?.scrollIntoView({ behavior: "smooth" });
}

function Arrow() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
      <path d="M0 5h14.5M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function SleepingStyles() {
  const [active, setActive] = useState(0);

  return (
    <section id="sleeping-styles" className="section-y bg-ivory" aria-labelledby="styles-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Comfort is personal"
          title={<span id="styles-title">Made for the way you sleep.</span>}
          aside={
            <p className="max-w-xs text-[14px] leading-relaxed text-muted">
              General guidance to help you start. Comfort is individual, so treat it as a starting point rather than a rule.
            </p>
          }
        />
      </div>

      {/* Desktop: expanding editorial panels */}
      <Reveal className="shell mt-14 hidden lg:block">
        <div className="flex h-[min(640px,72vh)] gap-2" onMouseLeave={() => undefined}>
          {sleepingStyles.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={s.id}
                className="relative cursor-pointer overflow-hidden rounded-[2px]"
                animate={{ flexGrow: isActive ? 2.4 : 1 }}
                transition={{ duration: 0.9, ease }}
                style={{ flexBasis: 0 }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="50vw"
                  placeholder="blur"
                  className={cn(
                    "object-cover transition-transform duration-[1.6s] ease-[var(--ease-soft)]",
                    isActive ? "scale-100" : "scale-[1.08]",
                  )}
                  style={{ objectPosition: s.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/10 to-charcoal/0" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/75">0{i + 1}</p>
                  <h3 className="mt-2 whitespace-nowrap font-serif text-[2rem] leading-none">{s.title}</h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.6, ease } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      >
                        <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ivory/85">{s.description}</p>
                        <button
                          type="button"
                          onClick={() => explore(s.id)}
                          className="mt-5 inline-flex items-center gap-3 border-b border-ivory/50 pb-1 text-[13px] font-semibold transition-colors hover:border-ivory"
                        >
                          Find mattresses for {s.title.toLowerCase()}
                          <Arrow />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* Mobile and tablet: swipeable tiles */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
        {sleepingStyles.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => explore(s.id)}
            className="relative aspect-[3/4] w-[78vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-[2px] text-left"
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="80vw"
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: s.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
              <h3 className="font-serif text-[1.8rem] leading-none">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ivory/85">{s.description}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-semibold">
                Explore <Arrow />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
