import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "light";
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", tone === "light" && "text-ivory/80", className)}>
      <span className={cn("h-px w-6", tone === "light" ? "bg-ivory/60" : "bg-sage")} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  aside,
  titleClassName,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  aside?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "items-center text-center lg:flex-col lg:items-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Reveal>
          <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className={cn("h-section mt-5", titleClassName)}>{title}</h2>
        </Reveal>
        {description && (
          <Reveal delay={0.16}>
            <p className={cn("lede mt-6 max-w-xl", align === "center" && "mx-auto")}>{description}</p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  );
}
