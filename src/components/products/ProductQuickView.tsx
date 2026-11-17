"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { DEFAULT_SIZE, getProduct, UK_SIZES, type SizeId } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useUI } from "@/lib/store";
import { cn, ease, formatPrice } from "@/lib/utils";
import { FirmnessScale, ProductVisual } from "./ProductVisual";

export function SizeSelector({
  value,
  onChange,
  prices,
}: {
  value: SizeId;
  onChange: (s: SizeId) => void;
  prices: Record<SizeId, number>;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3">Size</legend>
      <div className="grid grid-cols-1 gap-1.5">
        {UK_SIZES.map((s) => {
          const selected = s.id === value;
          return (
            <label
              key={s.id}
              className={cn(
                "relative flex cursor-pointer items-center justify-between rounded-[4px] border px-4 py-3 text-[13.5px] transition-colors",
                selected ? "border-charcoal bg-white" : "border-line bg-ivory hover:border-charcoal/40",
              )}
            >
              <input
                type="radio"
                name="size"
                value={s.id}
                checked={selected}
                onChange={() => onChange(s.id)}
                className="sr-only"
              />
              <span className="flex items-baseline gap-3">
                <span className="font-semibold text-charcoal">{s.label}</span>
                <span className="text-[12px] text-muted">{s.dims}</span>
              </span>
              <span className="tabular-nums text-graphite">{formatPrice(prices[s.id])}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function QtyControl({
  value,
  onChange,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <div className="inline-flex h-11 items-center rounded-[4px] border border-line bg-ivory" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="grid h-full w-10 place-items-center text-charcoal disabled:opacity-30"
      >
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 10}
        aria-label="Increase quantity"
        className="grid h-full w-10 place-items-center text-charcoal disabled:opacity-30"
      >
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function ProductQuickView() {
  const { quickView, closeQuickView, open } = useUI();
  const product = quickView ? getProduct(quickView.productId) : undefined;
  const cart = useCart();
  const wish = useWishlist();
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"render" | "photo">("render");

  useEffect(() => {
    if (quickView) {
      setSize(quickView.size ?? DEFAULT_SIZE);
      setQty(1);
      setView("render");
    }
  }, [quickView]);

  return (
    <Drawer
      open={!!product}
      onClose={closeQuickView}
      title={product?.name ?? "Quick view"}
      width="max-w-[520px]"
      footer={
        product && (
          <div className="flex items-center gap-3">
            <QtyControl value={qty} onChange={(n) => setQty(Math.max(1, Math.min(10, n)))} />
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => {
                cart.add(product.id, size, qty, { silent: true });
                closeQuickView();
                open("cart");
              }}
            >
              <span>Add to basket · {formatPrice(product.prices[size] * qty)}</span>
            </button>
          </div>
        )
      }
    >
      {product && (
        <div className="px-6 pb-8 sm:px-8">
          <div className="relative -mx-6 sm:-mx-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                {view === "render" ? (
                  <ProductVisual product={product} hoverImage={false} className="aspect-[5/4]" />
                ) : (
                  <div className="relative aspect-[5/4]">
                    <Image
                      src={product.lifestyle}
                      alt={`${product.name} styled in a bedroom`}
                      fill
                      sizes="520px"
                      className="object-cover"
                      placeholder="blur"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-6 flex gap-1.5 sm:left-8">
              {(["render", "photo"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
                    view === v ? "bg-charcoal text-ivory" : "bg-ivory/90 text-charcoal",
                  )}
                >
                  {v === "render" ? "Mattress" : "In the bedroom"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => wish.toggle(product.id)}
              aria-pressed={wish.has(product.id)}
              aria-label="Save to wishlist"
              className="absolute right-6 top-4 grid size-10 place-items-center rounded-full bg-ivory/90 sm:right-8"
            >
              <Heart size={17} strokeWidth={1.4} className={cn(wish.has(product.id) && "fill-plum text-plum")} />
            </button>
          </div>

          <div className="mt-7 flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow">{product.type}</p>
              <p className="mt-3 font-serif text-xl italic text-graphite">{product.tagline}</p>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-charcoal">{formatPrice(product.prices[size])}</p>
          </div>
          <p className="lede mt-4 text-[15px]">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line text-[13px]">
            <div className="bg-ivory p-4">
              <dt className="text-muted">Feel</dt>
              <dd className="mt-2">
                <FirmnessScale scale={product.firmness.scale} label={product.firmness.label} />
              </dd>
            </div>
            <div className="bg-ivory p-4">
              <dt className="text-muted">Depth</dt>
              <dd className="mt-1.5 text-charcoal">{product.depthCm} cm</dd>
            </div>
            <div className="col-span-2 bg-ivory p-4">
              <dt className="text-muted">Construction</dt>
              <dd className="mt-1.5 text-charcoal">{product.construction.join(" · ")}</dd>
            </div>
          </dl>

          <div className="mt-7">
            <SizeSelector value={size} onChange={setSize} prices={product.prices} />
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-muted">
            Demonstration prices and proposed specifications. Delivery, trial and warranty terms are to be confirmed.
          </p>
          <Link
            href={`/mattresses/${product.slug}`}
            onClick={closeQuickView}
            className="mt-5 inline-block text-sm font-semibold text-charcoal"
          >
            <span className="link-underline">View full details</span>
          </Link>
        </div>
      )}
    </Drawer>
  );
}
