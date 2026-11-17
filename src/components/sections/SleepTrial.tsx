"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { media } from "@/data/media";
import { policies } from "@/data/site";
import { ease } from "@/lib/utils";

export function SleepTrial() {
  const nights = policies.trial.nights;
  return (
    <section id="sleep-trial" className="relative bg-cream" aria-labelledby="trial-title">
      <div className="grid lg:min-h-[700px] lg:grid-cols-12">
        <div className="relative order-2 flex items-center lg:order-1 lg:col-span-5">
          <div className="w-full px-[var(--gutter)] py-16 lg:py-24 lg:pl-[max(var(--gutter),calc((100vw-1440px)/2+var(--gutter)))] lg:pr-14">
            <Reveal>
              <Eyebrow>Sleep with confidence</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="trial-title" className="h-section mt-5">
                Love the way you sleep.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-3 font-serif text-[1.6rem] italic leading-snug text-graphite">Try your new mattress at home.</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex items-end gap-5 border-y border-charcoal/12 py-6">
                <motion.span
                  className="font-serif text-[6.5rem] leading-[0.8] text-plum sm:text-[8rem]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease, delay: 0.3 }}
                >
                  {nights}
                </motion.span>
                <span className="pb-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-forest">Night</span>
                  <span className="block font-serif text-[1.7rem] leading-tight text-charcoal">Sleep Trial</span>
                </span>
                <span className="mb-2 ml-auto self-start rounded-full border border-coral/50 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#b04a32]">
                  Proposed
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <p className="lede mt-8 max-w-md">
                Take the time to discover how the right comfort feels, in the place that matters most — your home.
              </p>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <ButtonLink href="/#bestsellers" arrow>
                  Explore Our Mattresses
                </ButtonLink>
                <Link href="/#faq-trial" className="text-[13px] text-graphite">
                  Your comfort matters.{" "}
                  <span className="link-underline font-semibold text-charcoal">Discover our trial policy</span>
                </Link>
              </div>
            </Reveal>
            <p className="mt-8 max-w-md text-[11.5px] leading-relaxed text-muted">{policies.trial.terms}</p>
          </div>
        </div>

        <RevealImage
          src={media.trialFamily}
          alt="A family relaxing together on a large bed with white linen in a bright, airy bedroom"
          sizes="(min-width: 1024px) 58vw, 100vw"
          parallax={5}
          from="right"
          position="45% 40%"
          className="order-1 aspect-[4/3] lg:order-2 lg:col-span-7 lg:aspect-auto"
        />
      </div>
    </section>
  );
}
