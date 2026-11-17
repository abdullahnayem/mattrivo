import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost-light";

type BaseProps = {
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

function Arrow() {
  return (
    <svg className="btn-arrow" width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
      <path d="M0 5h14.5M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const classes = (variant: Variant, size: "md" | "sm", className?: string) =>
  cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, keyof BaseProps>) {
  return (
    <button type="button" className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  href,
  ...rest
}: BaseProps & { href: string } & Omit<ComponentProps<"a">, keyof BaseProps | "href">) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2 text-sm font-medium text-charcoal", className)}>
      <span className="link-underline">{children}</span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        <path d="M1 10L10 1M3 1h7v7" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </Link>
  );
}
