"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useId, useState } from "react";
import { LayerArt, MattressDefs, sanitizeId, type Proj } from "@/components/mattress/art";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { materialTopics } from "@/data/content";
import { cn, ease } from "@/lib/utils";

/** Macro "close-ups" drawn from the same material system as the construction view. */
function MaterialMacro({ kind }: { kind: "foam" | "springs" }) {
  const id = sanitizeId(useId());
  if (kind === "foam") {
    return (
      <svg
        viewBox="0 0 600 750"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`${id}-foam`} patternUnits="userSpaceOnUse" width="560" height="560">
            <image href="/textures/foam-comfort.jpg" width="560" height="560" />
          </pattern>
          <radialGradient id={`${id}-light`} cx="38%" cy="30%" r="85%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#3b3127" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        <rect width="600" height="750" fill={`url(#${id}-foam)`} />
        <rect width="600" height="750" fill={`url(#${id}-light)`} />
      </svg>
    );
  }
  const p: Proj = { ox: -260, oy: 0, L: { x: 1500, y: 300 }, D: { x: 560, y: -330 } };
  return (
    <svg
      viewBox="0 0 600 750"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full bg-[#5a534a]"
      aria-hidden="true"
    >
      <MattressDefs id={id} p={p} />
      <g transform="translate(0 260)">
        <LayerArt id={id} p={p} y={0} h={260} layer="pocket-springs" />
      </g>
      <rect width="600" height="750" fill="#3b3127" opacity="0.06" />
    </svg>
  );
}

export function Sustainability() {
  const [active, setActive] = useState(0);
  const topic = materialTopics[active];

  return (
    <section id="materials" className="section-y bg-ivory" aria-labelledby="materials-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Materials & responsibility"
          title={<span id="materials-title">Better materials begin with better choices.</span>}
          description="We will only describe what we can evidence. Where a detail is still being confirmed with our manufacturer, we say so plainly."
          titleClassName="max-w-[15ch]"
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ul className="border-t border-line" role="tablist" aria-label="Materials">
              {materialTopics.map((t, i) => (
                <li key={t.id} className="border-b border-line">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    aria-controls="material-panel"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span
                      className={cn("w-6 text-[12px] tabular-nums transition-colors", active === i ? "text-plum" : "text-muted")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-serif text-[1.5rem] leading-tight transition-colors sm:text-[1.7rem]",
                        active === i ? "text-plum" : "text-charcoal/70 group-hover:text-charcoal",
                      )}
                    >
                      {t.title}
                    </span>
                    <motion.span
                      className="h-px bg-plum"
                      animate={{ width: active === i ? 32 : 0 }}
                      transition={{ duration: 0.5, ease }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7" id="material-panel" role="tabpanel">
            <div className="grid gap-8 sm:grid-cols-[1.1fr_1fr] sm:items-end">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-cream">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={topic.id}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
                    transition={{ duration: 0.9, ease }}
                  >
                    {topic.image ? (
                      <Image
                        src={topic.image}
                        alt={topic.alt ?? ""}
                        fill
                        sizes="(min-width: 1024px) 32vw, 100vw"
                        className="object-cover"
                        placeholder="blur"
                      />
                    ) : (
                      <MaterialMacro kind={topic.visual!} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <Reveal>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <p className="eyebrow">
                      {String(active + 1).padStart(2, "0")} / {String(materialTopics.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-serif text-[2rem] leading-tight text-plum">{topic.title}</h3>
                    <p className="lede mt-4">{topic.body}</p>
                    <p className="mt-6 border-l-2 border-coral/60 pl-4 text-[13px] leading-relaxed text-graphite">
                      <span className="block text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Evidence status
                      </span>
                      {topic.status}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
