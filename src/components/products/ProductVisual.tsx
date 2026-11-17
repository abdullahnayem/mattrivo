"use client";

import Image from "next/image";
import { useId } from "react";
import { MattressRender, sanitizeId } from "@/components/mattress/art";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Studio render of the mattress, with an optional lifestyle photo revealed on hover. */
export function ProductVisual({
  product,
  hoverImage = true,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: Product;
  hoverImage?: boolean;
  className?: string;
  sizes?: string;
}) {
  const id = sanitizeId(useId());
  return (
    <div className={cn("relative overflow-hidden bg-[#efebe4]", className)}>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(80% 70% at 50% 40%, #f8f6f1 0%, #ece7df 70%, #e4ded4 100%)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-[2%] transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.035]">
        <MattressRender id={id} variant={product.render} depthCm={product.depthCm} className="h-auto w-full" />
      </div>
      {hoverImage && (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-soft)] group-hover:opacity-100">
          <Image
            src={product.lifestyle}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            className="scale-[1.06] object-cover transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-100"
          />
        </div>
      )}
    </div>
  );
}

export function FirmnessScale({ scale, label, className }: { scale: number; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-[3px] w-20 rounded-full bg-line" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 rounded-full bg-forest" style={{ width: `${(scale / 10) * 100}%` }} />
        <span
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest bg-ivory"
          style={{ left: `${(scale / 10) * 100}%` }}
        />
      </div>
      <span className="text-[13px] text-graphite">
        <span className="sr-only">Firmness: </span>
        {label}
      </span>
    </div>
  );
}
