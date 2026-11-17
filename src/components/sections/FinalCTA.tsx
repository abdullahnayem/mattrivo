"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { media } from "@/data/media";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden" aria-labelledby="final-title">
      <motion.div className="absolute inset-0 -z-10 scale-[1.16]" style={{ y }}>
        <Image
          src={media.finalAtticBedroom}
          alt="A serene attic bedroom with pale timber beams, a wide upholstered bed and soft daylight"
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[50%_60%]"
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(75%_85%_at_50%_50%,rgba(35,30,28,0.58),rgba(35,30,28,0.32))]"
        aria-hidden="true"
      />

      <div className="shell flex min-h-[78svh] flex-col items-center justify-center py-28 text-center text-ivory">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-ivory/80">
            <span className="h-px w-6 bg-ivory/60" aria-hidden="true" />
            Rest, reconsidered
            <span className="h-px w-6 bg-ivory/60" aria-hidden="true" />
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            id="final-title"
            className="mt-6 font-serif text-[clamp(3rem,7vw,6.2rem)] font-normal leading-[0.98] tracking-[-0.01em]"
          >
            Make room for <em>better rest.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ivory/85">
            Explore a thoughtfully considered collection designed around your comfort.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#finder" variant="light" arrow>
              Find Your Mattress
            </ButtonLink>
            <ButtonLink href="/#bestsellers" variant="ghost-light">
              Explore Our Collection
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
