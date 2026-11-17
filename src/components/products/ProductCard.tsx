"use client";

import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DEFAULT_SIZE, sizeLabel, UK_SIZES, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useComparison } from "@/hooks/useComparison";
import { useWishlist } from "@/hooks/useWishlist";
import { useUI } from "@/lib/store";
import { cn, ease, formatPrice } from "@/lib/utils";
import { FirmnessScale, ProductVisual } from "./ProductVisual";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cart = useCart();
  const wish = useWishlist();
  const compare = useComparison();
  const { openQuickView } = useUI();
  const [added, setAdded] = useState(false);
  const wished = wish.has(product.id);
  const comparing = compare.has(product.id);
  const price = product.prices[DEFAULT_SIZE];
  const prev = product.previousPrices?.[DEFAULT_SIZE];

  const add = () => {
    cart.add(product.id, DEFAULT_SIZE);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
      className="group flex flex-col"
    >
      <div className="relative">
        <Link href={`/mattresses/${product.slug}`} aria-label={`${product.name}, view details`} className="block">
          <ProductVisual product={product} className="aspect-[5/4] rounded-[3px] sm:aspect-[4/5]" />
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-ivory/90 px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-plum">
            <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => wish.toggle(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-ivory/85 text-charcoal transition-colors hover:bg-ivory"
        >
          <motion.span
            key={String(wished)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Heart size={17} strokeWidth={1.4} className={cn(wished && "fill-plum text-plum")} />
          </motion.span>
        </button>

        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 rounded-[4px] bg-ivory/92 text-[13px] font-semibold text-charcoal opacity-100 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-soft)] hover:bg-ivory lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100"
        >
          Quick view
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{product.type}</p>
            <h3 className="mt-1.5 font-serif text-[1.7rem] leading-tight text-plum">
              <Link href={`/mattresses/${product.slug}`} className="hover:text-plum-soft">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="pt-4 text-right">
            <p className="text-[1.05rem] font-semibold tabular-nums text-charcoal">{formatPrice(price)}</p>
            {prev && <p className="text-[12px] text-muted line-through">{formatPrice(prev)}</p>}
            <p className="text-[11px] text-muted">{sizeLabel(DEFAULT_SIZE)}</p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="sr-only">Firmness</dt>
            <dd>
              <FirmnessScale scale={product.firmness.scale} label={product.firmness.label} />
            </dd>
            <dt className="sr-only">Depth</dt>
            <dd className="text-graphite">{product.depthCm} cm deep</dd>
          </div>
          <div className="flex items-center justify-between text-muted">
            <dt className="sr-only">Sizes</dt>
            <dd>{UK_SIZES.length} UK sizes · Single to Super King</dd>
          </div>
          <div className="text-muted">
            <dt className="sr-only">Reviews</dt>
            <dd>
              {product.rating
                ? `${product.rating.average} from ${product.rating.count} verified reviews`
                : "Verified reviews coming soon"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center gap-3 pt-5">
          <button
            type="button"
            onClick={add}
            className="btn btn-primary btn-sm flex-1"
            aria-label={`Add ${product.name}, ${sizeLabel(DEFAULT_SIZE)}, to basket`}
          >
            <motion.span
              key={String(added)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {added ? "Added" : "Add to basket"}
            </motion.span>
            {!added && <Plus size={15} strokeWidth={1.6} className="btn-arrow" />}
          </button>
          <label className="flex cursor-pointer select-none items-center gap-2 text-[12.5px] text-graphite">
            <input
              type="checkbox"
              checked={comparing}
              onChange={() => compare.toggle(product.id)}
              className="size-4 cursor-pointer appearance-none rounded-[3px] border border-charcoal/30 bg-ivory bg-center bg-no-repeat transition-colors checked:border-forest checked:bg-forest checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22><path d=%22M2.5 6.2l2.3 2.3 4.7-5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%221.6%22/></svg>')]"
            />
            Compare
          </label>
        </div>
      </div>
    </motion.article>
  );
}
