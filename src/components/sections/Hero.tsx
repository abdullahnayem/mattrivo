"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/data/media";
import { ease } from "@/lib/utils";

const lines = [
  { text: "Sleep better.", italic: false },
  { text: "Live beautifully.", italic: true },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-cream" aria-labelledby="hero-title">
      <div className="relative min-h-[calc(100svh-36px)] lg:min-h-[max(760px,calc(100svh-36px))]">
        {/* Photography */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[64svh] lg:inset-0 lg:h-auto"
          initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease, delay: 0.1 }}
        >
          <motion.div className="absolute inset-0" style={{ y: imgY }}>
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.14 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: 2.8, ease, delay: 0.1 }}
            >
              <Image
                src={media.heroBedroom}
                alt="A calm Scandinavian bedroom with a low oak platform bed, white linen and soft morning light"
                fill
                priority
                sizes="100vw"
                placeholder="blur"
                className="object-cover object-[62%_50%] lg:object-[50%_100%]"
              />
            </motion.div>
          </motion.div>
          {/* gentle light falloff behind the copy; no heavy overlay */}
          <div
            className="absolute inset-0 hidden lg:block"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(248,246,241,0.86) 0%, rgba(248,246,241,0.62) 26%, rgba(248,246,241,0.12) 46%, rgba(248,246,241,0) 60%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent lg:hidden"
            aria-hidden="true"
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          style={{ y: contentY }}
          className="shell relative z-10 flex min-h-[inherit] flex-col justify-end pb-12 pt-[calc(64svh-56px)] lg:justify-center lg:pb-28 lg:pt-[calc(var(--header-h)+40px)]"
        >
          <div className="max-w-[min(820px,100%)]">
            <motion.p
              className="eyebrow flex items-center gap-3 text-charcoal/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.7 }}
            >
              <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
              The art of better sleep
            </motion.p>

            <h1 id="hero-title" className="display mt-6 text-[clamp(3.2rem,7.6vw,7.25rem)]">
              {lines.map((l, i) => (
                <span key={l.text} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={l.italic ? "block italic" : "block"}
                    initial={reduce ? false : { y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.2, ease, delay: 0.85 + i * 0.14 }}
                  >
                    {l.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="lede mt-7 max-w-[30rem] text-[1.0625rem] text-charcoal/80"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 1.25 }}
            >
              Thoughtfully designed mattresses that bring together comfort, considered materials and a better night’s rest.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-3 xs:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 1.4 }}
            >
              <ButtonLink href="/#finder" arrow>
                Find Your Mattress
              </ButtonLink>
              <ButtonLink href="/#bestsellers" variant="secondary">
                Explore Our Collection
              </ButtonLink>
            </motion.div>
          </div>

          <motion.p
            className="mt-14 text-[12px] tracking-[0.06em] text-graphite lg:absolute lg:bottom-10 lg:left-[var(--gutter)] lg:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.8 }}
          >
            Considered Comfort <span className="mx-2 text-sage">·</span> Thoughtful Design{" "}
            <span className="mx-2 text-sage">·</span> Made for Everyday Living
          </motion.p>
        </motion.div>

        <motion.a
          href="#trust"
          aria-label="Scroll to content"
          className="absolute bottom-10 right-[var(--gutter)] z-10 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/70 lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-charcoal/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-charcoal/60"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
