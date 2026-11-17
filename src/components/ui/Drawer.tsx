"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, ease } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "right" | "left";
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
  label?: ReactNode;
};

export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

export function Drawer({ open, onClose, title, side = "right", children, footer, width = "max-w-[460px]", label }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-charcoal/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "absolute top-0 flex h-full w-full flex-col bg-ivory outline-none",
              width,
              side === "right" ? "right-0" : "left-0",
            )}
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
              <div className="flex items-baseline gap-3">
                <h2 className="font-serif text-[1.65rem] leading-none text-plum">{title}</h2>
                {label}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid size-10 place-items-center rounded-full text-charcoal transition-colors hover:bg-cream"
                aria-label={`Close ${title.toLowerCase()}`}
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <div className="border-t border-line bg-ivory px-6 py-5 sm:px-8">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
