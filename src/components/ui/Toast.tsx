"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useUI } from "@/lib/store";
import { ease } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismissToast } = useUI();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[95] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-4 rounded-md bg-charcoal py-3.5 pl-4 pr-3 text-ivory shadow-[0_18px_40px_-18px_rgba(41,40,34,0.6)]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ivory/10">
              <Check size={14} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.body && <p className="truncate text-[13px] text-ivory/70">{t.body}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  dismissToast(t.id);
                }}
                className="shrink-0 text-[13px] font-semibold underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="grid size-7 shrink-0 place-items-center rounded-full text-ivory/60 hover:text-ivory"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
