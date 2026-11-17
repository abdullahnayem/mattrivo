"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { TextLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collectionLabels, products, type CollectionId } from "@/data/products";
import { cn, ease } from "@/lib/utils";

type Filter = CollectionId | "all";
const filters: Filter[] = ["all", "hybrid", "memory-foam", "pocket-sprung", "natural"];

export function Bestsellers() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("collection") as Filter | null;
    if (fromUrl && filters.includes(fromUrl)) setFilter(fromUrl);
    const onFilter = (e: Event) => setFilter((e as CustomEvent<Filter>).detail);
    window.addEventListener("mattrivo:filter", onFilter);
    return () => window.removeEventListener("mattrivo:filter", onFilter);
  }, []);

  const shown = products.filter((p) => filter === "all" || p.collections.includes(filter));

  return (
    <section id="bestsellers" className="section-y border-t border-line bg-white/50" aria-labelledby="bestsellers-title">
      <div className="shell">
        <SectionHeading
          eyebrow="The mattrivo collection"
          title={<span id="bestsellers-title">Thoughtfully designed. Beautifully comfortable.</span>}
          titleClassName="max-w-[24ch]"
          aside={
            <p className="max-w-xs text-[14px] leading-relaxed text-muted">
              Four considered designs, each with a clear purpose. Choose a size in quick view or on the product page.
            </p>
          }
        />

        <div className="mt-12 flex flex-col gap-6 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <LayoutGroup id="filters">
            <div
              role="tablist"
              aria-label="Filter mattresses"
              className="no-scrollbar -mx-[var(--gutter)] flex gap-1 overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative shrink-0 px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    filter === f ? "text-plum" : "text-graphite hover:text-charcoal",
                  )}
                >
                  {collectionLabels[f]}
                  {filter === f && (
                    <motion.span
                      layoutId="filter-underline"
                      className="absolute inset-x-3.5 -bottom-[21px] h-[2px] bg-plum"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>
          <p className="text-[12.5px] text-muted">
            {shown.length} {shown.length === 1 ? "mattress" : "mattresses"} · Prices shown for a UK Double · Demonstration prices
          </p>
        </div>

        <motion.div layout className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 flex justify-center">
          <TextLink href="/#compare">Explore all mattresses and compare ranges</TextLink>
        </div>
      </div>
    </section>
  );
}
