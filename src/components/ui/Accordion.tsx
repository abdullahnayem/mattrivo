"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { cn, ease } from "@/lib/utils";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

export function Accordion({
  items,
  defaultOpen,
  className,
  itemClassName,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
  itemClassName?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const uid = useId();

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${uid}-${item.id}`;
        return (
          <div key={item.id} id={`faq-${item.id}`} className={cn("scroll-mt-28 border-b border-line", itemClassName)}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-serif text-[1.3rem] leading-snug text-charcoal transition-colors group-hover:text-plum sm:text-[1.45rem]">
                  {item.title}
                </span>
                <span
                  className="relative grid size-8 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-charcoal/40"
                  aria-hidden="true"
                >
                  <span className="absolute h-px w-3 bg-charcoal" />
                  <motion.span
                    className="absolute h-3 w-px bg-charcoal"
                    animate={{ scaleY: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.35, ease }}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl pb-7 pr-12">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
