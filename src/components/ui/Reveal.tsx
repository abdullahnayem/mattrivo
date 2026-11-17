"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionProps } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode } from "react";
import { cn, ease } from "@/lib/utils";

/** Fade-up on first view. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p" | "span";
}) {
  const Comp = motion[as] as React.ComponentType<MotionProps & { className?: string; children?: ReactNode }>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

/** Image revealed through a rising clip-path mask, with optional scroll parallax. */
export function RevealImage({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  delay = 0,
  parallax = 0,
  priority,
  position,
  from = "bottom",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  parallax?: number;
  priority?: boolean;
  position?: string;
  from?: "bottom" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-parallax}%`, `${parallax}%`]);
  const hidden = from === "left" ? "inset(0% 100% 0% 0%)" : from === "right" ? "inset(0% 0% 0% 100%)" : "inset(100% 0% 0% 0%)";

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.25, ease, delay }}
    >
      <motion.div className="absolute inset-0" style={parallax && !reduce ? { y, scale: 1 + parallax / 50 } : undefined}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease, delay }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            className={cn("object-cover", imgClassName)}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
