"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProduct } from "@/data/products";
import { reviews } from "@/data/reviews";
import { cn, ease, formatDate } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} strokeWidth={1.2} className={i < rating ? "fill-plum text-plum" : "text-plum/30"} />
      ))}
    </span>
  );
}

export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [bounds, setBounds] = useState({ max: 0, step: 0 });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      if (!track || !vp) return;
      const card = track.children[0] as HTMLElement | undefined;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      setBounds({ max: Math.max(0, track.scrollWidth - vp.clientWidth), step: (card?.offsetWidth ?? 0) + gap });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const lastIndex = bounds.step ? Math.ceil(bounds.max / bounds.step) : 0;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(lastIndex, i));
    setIndex(clamped);
    animate(x, -Math.min(bounds.max, clamped * bounds.step), { duration: 0.8, ease });
  };

  return (
    <section id="reviews" className="section-y overflow-hidden bg-cream" aria-labelledby="reviews-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Real experiences"
          title={<span id="reviews-title">Better nights, shared.</span>}
          aside={
            <div className="flex items-center gap-4">
              <p className="max-w-[15rem] text-[12px] leading-relaxed text-muted">
                Sample reviews for presentation. These will be replaced with verified customer reviews.
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Previous reviews"
                  className="grid size-11 place-items-center rounded-full border border-charcoal/20 transition-colors hover:border-charcoal disabled:opacity-30"
                >
                  <ChevronLeft size={18} strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  disabled={index >= lastIndex}
                  aria-label="Next reviews"
                  className="grid size-11 place-items-center rounded-full border border-charcoal/20 transition-colors hover:border-charcoal disabled:opacity-30"
                >
                  <ChevronRight size={18} strokeWidth={1.4} />
                </button>
              </div>
            </div>
          }
        />

        <div ref={viewportRef} className="mt-14 lg:mt-16">
          <motion.div
            ref={trackRef}
            className="flex cursor-grab gap-5 active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -bounds.max, right: 0 }}
            dragElastic={0.08}
            onDragEnd={() => {
              const i = Math.round(-x.get() / (bounds.step || 1));
              goTo(i);
            }}
          >
            {reviews.map((r, i) => {
              const product = getProduct(r.productId);
              return (
                <motion.figure
                  key={r.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                  className={cn(
                    "flex w-[86vw] max-w-[440px] shrink-0 select-none flex-col border-t border-charcoal/20 pt-7 sm:w-[420px]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <span className="rounded-full bg-ivory px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Sample review
                    </span>
                  </div>
                  <p className="mt-6 font-serif text-[1.55rem] leading-tight text-plum">“{r.title}”</p>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-graphite">{r.body}</blockquote>
                  <figcaption className="mt-8 flex items-end justify-between gap-4 text-[13px]">
                    <span>
                      <span className="block font-semibold text-charcoal">{r.name}</span>
                      <span className="text-muted">
                        {r.location} · {product?.name}, {r.size}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-muted">
                      <time dateTime={r.date}>{formatDate(r.date)}</time>
                      <span className="block text-[11.5px]">{r.verified ? "Verified buyer" : "Not verified"}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-10 flex gap-2" aria-hidden="true">
          {Array.from({ length: lastIndex + 1 }, (_, i) => (
            <button key={i} type="button" tabIndex={-1} onClick={() => goTo(i)} className="py-2">
              <span
                className={cn("block h-[2px] transition-all duration-500", i === index ? "w-10 bg-plum" : "w-5 bg-charcoal/20")}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
