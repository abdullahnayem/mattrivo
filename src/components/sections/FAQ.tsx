"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { PolicyText } from "@/components/ui/PolicyText";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";

export function FAQ() {
  const [openId, setOpenId] = useState<string | undefined>("choose");

  // Deep links such as /#faq-trial open the matching question.
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#faq-(.+)$/);
      if (m && faqs.some((f) => f.id === m[1])) setOpenId(m[1]);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="faq" className="section-y bg-cream" aria-labelledby="faq-title">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <Reveal>
              <Eyebrow>Questions, answered</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="faq-title" className="h-section mt-5 max-w-[10ch]">
                Helpful to know.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="lede mt-6 max-w-sm">
                Can’t find what you are looking for? Write to us at{" "}
                <a href={`mailto:${site.email}`} className="link-underline text-charcoal">
                  {site.email}
                </a>
                .
              </p>
              <p className="mt-6 flex max-w-sm items-start gap-3 text-[12.5px] leading-relaxed text-muted">
                <span className="placeholder-chip mt-0.5 shrink-0">highlighted</span>
                Details shown like this are awaiting confirmation from mattrivo and will be finalised before launch.
              </p>
              <Link href="/#finder" className="mt-8 inline-block text-[13.5px] font-semibold text-charcoal">
                <span className="link-underline">Try the Mattress Finder</span>
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Accordion
            key={openId}
            defaultOpen={openId}
            items={faqs.map((f) => ({
              id: f.id,
              title: f.question,
              content: (
                <div className="space-y-3 text-[15px] leading-relaxed text-graphite">
                  {f.answer.map((para, i) => (
                    <p key={i}>
                      <PolicyText text={para} />
                    </p>
                  ))}
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
