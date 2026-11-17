"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { PolicyText } from "@/components/ui/PolicyText";
import { footerNav, legalLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { ease } from "@/lib/utils";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <div>
      <p className="font-serif text-[2rem] leading-[1.1] text-plum sm:text-[2.4rem]">A little more comfort in your inbox.</p>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-graphite">
        Occasional notes on sleep, new arrivals and thoughtful offers. Unsubscribe at any time.
      </p>
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="mt-7 max-w-md border-l-2 border-sage pl-4 text-[14px] leading-relaxed text-charcoal"
            role="status"
          >
            Thank you. You are on the list. (Demonstration: not yet connected to an email provider.)
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0 }}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
            }}
            className="mt-7 max-w-md"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex items-center gap-2 border-b border-charcoal/40 focus-within:border-charcoal">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="Your email address"
                autoComplete="email"
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? "newsletter-error" : undefined}
                className="h-12 min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
              />
              <button type="submit" className="group flex h-12 items-center gap-2 text-[13.5px] font-semibold text-charcoal">
                Subscribe
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  <path d="M0 5h14.5M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
            {state === "error" && (
              <p id="newsletter-error" className="mt-2 text-[13px] text-[#a1452f]">
                Please enter a valid email address.
              </p>
            )}
            <p className="mt-3 text-[11.5px] text-muted">
              By subscribing you agree to our{" "}
              <Link href="/info/privacy-policy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="shell pb-10 pt-20 lg:pt-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="w-[150px]" />
            <div className="mt-10">
              <Newsletter />
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:pl-10">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h3 className="eyebrow">{col.heading}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-[14px] text-graphite transition-colors hover:text-plum">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 grid gap-6 border-t border-charcoal/10 pt-8 text-[12.5px] text-graphite md:grid-cols-3 md:items-center">
          <ul className="flex gap-6">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="transition-colors hover:text-plum" aria-label={`mattrivo on ${s.label}`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="md:text-center">
            Payment methods: <PolicyText text="{{to be confirmed}}" />
          </p>
          <p className="flex items-center gap-2 md:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
              United Kingdom · GBP £
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} mattrivo. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-charcoal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
