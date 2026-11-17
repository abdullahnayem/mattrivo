"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { mainNav } from "@/data/navigation";
import { useUI } from "@/lib/store";
import { cn, ease } from "@/lib/utils";

export function MobileMenu() {
  const { panel, close, open } = useUI();
  const [expanded, setExpanded] = useState<string | null>("Mattresses");

  return (
    <Drawer open={panel === "menu"} onClose={close} title="Menu" side="left" width="max-w-[400px]">
      <nav aria-label="Mobile" className="px-6 py-4">
        <ul>
          {mainNav.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.05 }}
              className="border-b border-line"
            >
              {item.menu ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between py-5 text-left font-serif text-[1.75rem] leading-none text-charcoal"
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      strokeWidth={1.4}
                      className={cn("transition-transform duration-500", expanded === item.label && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded === item.label && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="overflow-hidden"
                      >
                        {item.menu.links.map((l) => (
                          <li key={l.label}>
                            <Link href={l.href} onClick={close} className="flex items-baseline justify-between gap-4 py-2.5 pl-1">
                              <span className="text-[15px] text-charcoal">{l.label}</span>
                              {l.note && <span className="text-right text-[12px] text-muted">{l.note}</span>}
                            </Link>
                          </li>
                        ))}
                        <li className="h-4" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-5 font-serif text-[1.75rem] leading-none text-charcoal"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => open("account")} className="btn btn-secondary btn-sm">
            <User size={15} strokeWidth={1.5} />
            <span>Account</span>
          </button>
          <button type="button" onClick={() => open("wishlist")} className="btn btn-secondary btn-sm">
            <Heart size={15} strokeWidth={1.5} />
            <span>Wishlist</span>
          </button>
        </div>
        <Link href="/#finder" onClick={close} className="btn btn-primary mt-3 w-full">
          <span>Find Your Mattress</span>
        </Link>
      </nav>
    </Drawer>
  );
}
