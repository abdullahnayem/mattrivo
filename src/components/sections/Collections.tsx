"use client";

import Link from "next/link";
import { RevealImage, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/data/content";
import { cn } from "@/lib/utils";

/** Selecting a collection filters the Bestsellers grid below via the URL hash. */
export function Collections() {
  return (
    <section id="collections" className="section-y bg-ivory" aria-labelledby="collections-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Explore our collection"
          title={<span id="collections-title">Find the comfort that feels right.</span>}
          description="Different sleepers, different preferences. Explore a collection designed around the way you rest."
        />

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-7">
          {collections.map((c, i) => (
            <li key={c.id} className={cn(i % 2 === 1 && "mt-10 lg:mt-16")}>
              <Link
                href={`/?collection=${c.id}#bestsellers`}
                scroll={false}
                className="group block"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("mattrivo:filter", { detail: c.id }));
                  document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative overflow-hidden rounded-[2px]">
                  <RevealImage
                    src={c.image}
                    alt={c.alt}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="aspect-[3/4]"
                    imgClassName="transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                    delay={i * 0.1}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-charcoal/0 transition-colors duration-700 group-hover:bg-charcoal/[0.06]" />
                </div>
                <Reveal delay={0.15 + i * 0.1}>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-[1.45rem] leading-tight text-charcoal transition-colors group-hover:text-plum sm:text-[1.7rem]">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{c.description}</p>
                    </div>
                    <span
                      className="mt-2 hidden size-9 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:border-plum group-hover:bg-plum group-hover:text-ivory sm:grid"
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
                        <path d="M1 10L10 1M3 1h7v7" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </div>
                </Reveal>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
