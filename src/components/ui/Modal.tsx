"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, ease } from "@/lib/utils";
import { useEscape } from "./Drawer";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  hideTitle?: boolean;
};

export function Modal({ open, onClose, title, children, className, hideTitle }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEscape(open, onClose);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-charcoal/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            tabIndex={-1}
            className={cn(
              "relative max-h-[92svh] w-full overflow-y-auto rounded-t-xl bg-ivory outline-none sm:rounded-lg",
              className ?? "max-w-xl",
            )}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
          >
            <div
              className={cn(
                "flex items-start justify-between gap-6 px-6 pt-6 sm:px-9 sm:pt-8",
                hideTitle && "absolute right-0 top-0 z-10",
              )}
            >
              {!hideTitle && <h2 className="font-serif text-3xl leading-tight text-plum">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-cream"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
