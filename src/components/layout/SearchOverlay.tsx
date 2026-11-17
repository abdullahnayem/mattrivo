"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEscape } from "@/components/ui/Drawer";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { products } from "@/data/products";
import { useUI } from "@/lib/store";
import { ease, formatPrice } from "@/lib/utils";

const suggestions = ["Hybrid", "Side sleepers", "Pillowtop", "Sizes", "Sleep trial"];

export function SearchOverlay() {
  const { panel, close } = useUI();
  const isOpen = panel === "search";
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEscape(isOpen, close);

  useEffect(() => {
    if (isOpen) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return null;
    const words = term.split(/\s+/);
    const match = (text: string) => words.every((w) => text.toLowerCase().includes(w.replace(/s$/, "")));
    return {
      products: products.filter((p) =>
        match(
          [
            p.name,
            p.type,
            p.tagline,
            p.description,
            p.firmness.label,
            ...p.construction,
            ...p.attributes.positions.map((x) => `${x} sleepers`),
          ].join(" "),
        ),
      ),
      articles: articles.filter((a) => match([a.title, a.excerpt, a.category].join(" "))),
      faqs: faqs.filter((f) => match([f.question, ...f.answer].join(" "))),
    };
  }, [q]);

  const empty = results && !results.products.length && !results.articles.length && !results.faqs.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default bg-charcoal/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease }}
            className="relative max-h-[88svh] overflow-y-auto bg-ivory"
          >
            <div className="shell py-6 sm:py-9">
              <div className="flex items-center gap-4 border-b border-charcoal/25 pb-4">
                <Search size={22} strokeWidth={1.3} className="text-graphite" aria-hidden="true" />
                <label htmlFor="site-search" className="sr-only">
                  Search mattrivo
                </label>
                <input
                  id="site-search"
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search mattresses, guides and help"
                  className="min-w-0 flex-1 bg-transparent font-serif text-[1.7rem] text-charcoal placeholder:text-muted/70 focus:outline-none sm:text-[2.2rem]"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="grid size-10 place-items-center rounded-full hover:bg-cream"
                >
                  <X size={20} strokeWidth={1.4} />
                </button>
              </div>

              {!results && (
                <div className="flex flex-wrap items-center gap-2 pt-6">
                  <span className="mr-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">Popular</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQ(s)}
                      className="rounded-full border border-line px-4 py-2 text-[13px] text-charcoal transition-colors hover:border-charcoal/40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {results && (
                <div className="grid gap-10 pt-8 md:grid-cols-3" aria-live="polite">
                  {empty && (
                    <p className="text-graphite md:col-span-3">No results for “{q}”. Try “hybrid”, “firmness” or “delivery”.</p>
                  )}
                  {results.products.length > 0 && (
                    <section>
                      <h3 className="eyebrow mb-4">Mattresses</h3>
                      <ul className="space-y-1">
                        {results.products.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/mattresses/${p.slug}`}
                              onClick={close}
                              className="group flex items-baseline justify-between gap-4 py-2"
                            >
                              <span className="font-serif text-[1.4rem] text-charcoal group-hover:text-plum">{p.name}</span>
                              <span className="text-[13px] tabular-nums text-muted">from {formatPrice(p.prices.single)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {results.articles.length > 0 && (
                    <section>
                      <h3 className="eyebrow mb-4">Sleep Journal</h3>
                      <ul className="space-y-3">
                        {results.articles.map((a) => (
                          <li key={a.slug}>
                            <Link
                              href={`/journal/${a.slug}`}
                              onClick={close}
                              className="group flex items-start justify-between gap-3 text-[14.5px] text-charcoal"
                            >
                              <span className="group-hover:text-plum">{a.title}</span>
                              <ArrowUpRight size={15} strokeWidth={1.4} className="mt-1 shrink-0 text-muted" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {results.faqs.length > 0 && (
                    <section>
                      <h3 className="eyebrow mb-4">Help</h3>
                      <ul className="space-y-3">
                        {results.faqs.map((f) => (
                          <li key={f.id}>
                            <Link
                              href={`/#faq-${f.id}`}
                              onClick={close}
                              className="group flex items-start justify-between gap-3 text-[14.5px] text-charcoal"
                            >
                              <span className="group-hover:text-plum">{f.question}</span>
                              <ArrowUpRight size={15} strokeWidth={1.4} className="mt-1 shrink-0 text-muted" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
