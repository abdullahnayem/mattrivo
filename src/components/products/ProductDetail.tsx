"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { PolicyText } from "@/components/ui/PolicyText";
import { Reveal } from "@/components/ui/Reveal";
import { mattressLayers } from "@/data/mattressLayers";
import { DEFAULT_SIZE, getProduct, products, sizeLabel, type SizeId } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useComparison } from "@/hooks/useComparison";
import { useWishlist } from "@/hooks/useWishlist";
import { cn, formatPrice } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { QtyControl, SizeSelector } from "./ProductQuickView";
import { FirmnessScale, ProductVisual } from "./ProductVisual";

export function ProductDetail({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const wish = useWishlist();
  const compare = useComparison();
  const layers = mattressLayers.filter((l) => product.layers.includes(l.id));
  const others = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="bg-ivory pt-[calc(var(--header-h)+24px)]">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="py-4 text-[12.5px] text-muted">
            <ol className="flex gap-2">
              <li>
                <Link href="/" className="hover:text-charcoal">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#bestsellers" className="hover:text-charcoal">
                  Mattresses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-charcoal">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-3 lg:col-span-7">
              <ProductVisual product={product} hoverImage={false} className="aspect-[5/4] rounded-[3px]" sizes="60vw" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-[3px] sm:aspect-[16/10]">
                <Image
                  src={product.lifestyle}
                  alt={`${product.name} styled in a calm bedroom`}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
                <p className="eyebrow">{product.type}</p>
                <h1 className="display mt-4 text-[clamp(2.8rem,5vw,4.2rem)]">{product.name}</h1>
                <p className="mt-3 font-serif text-[1.45rem] italic text-graphite">{product.tagline}</p>
                <div className="mt-6 flex items-baseline justify-between border-y border-line py-5">
                  <p className="text-[1.75rem] font-semibold tabular-nums">{formatPrice(product.prices[size])}</p>
                  <p className="text-[12.5px] text-muted">{sizeLabel(size)} · Demonstration price</p>
                </div>
                <p className="lede mt-6">{product.description}</p>

                <div className="mt-6 flex items-center justify-between text-[13.5px]">
                  <FirmnessScale scale={product.firmness.scale} label={product.firmness.label} />
                  <span className="text-graphite">{product.depthCm} cm deep</span>
                </div>

                <div className="mt-8">
                  <SizeSelector value={size} onChange={setSize} prices={product.prices} />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <QtyControl value={qty} onChange={(n) => setQty(Math.max(1, Math.min(10, n)))} />
                  <button type="button" className="btn btn-primary flex-1" onClick={() => cart.add(product.id, size, qty)}>
                    <span>Add to basket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => wish.toggle(product.id)}
                    aria-pressed={wish.has(product.id)}
                    aria-label="Save to wishlist"
                    className="grid size-[52px] shrink-0 place-items-center rounded-[6px] border border-line transition-colors hover:border-charcoal/40"
                  >
                    <Heart size={18} strokeWidth={1.4} className={cn(wish.has(product.id) && "fill-plum text-plum")} />
                  </button>
                </div>
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-[13px] text-graphite">
                  <input
                    type="checkbox"
                    checked={compare.has(product.id)}
                    onChange={() => compare.toggle(product.id)}
                    className="size-4 accent-[#3b5042]"
                  />
                  Add to comparison
                </label>

                <ul className="mt-8 space-y-2 border-t border-line pt-6 text-[13px] text-graphite">
                  <li>
                    Delivery: <PolicyText text="{{to be confirmed}}" />
                  </li>
                  <li>
                    Sleep trial: <PolicyText text="{{proposed 90 nights, terms to be confirmed}}" />
                  </li>
                  <li>
                    Warranty: <PolicyText text="{{to be confirmed}}" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Proposed construction</p>
            <h2 className="h-section mt-5">What’s inside.</h2>
            <p className="lede mt-5 max-w-sm">
              The layers below are a proposed specification for the {product.name}. Materials will be confirmed by the
              manufacturer.
            </p>
            <Link href="/#construction" className="mt-6 inline-block text-[13.5px] font-semibold">
              <span className="link-underline">Explore the interactive breakdown</span>
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Accordion
              defaultOpen={layers[0]?.id}
              items={layers.map((l) => ({
                id: l.id,
                title: (
                  <span className="flex items-baseline gap-4">
                    <span className="font-sans text-[12px] font-semibold text-muted">{l.number}</span>
                    {l.title}
                  </span>
                ),
                content: (
                  <div className="text-[15px] leading-relaxed text-graphite">
                    <p>{l.description}</p>
                    <dl className="mt-4 grid gap-2 text-[13.5px] sm:grid-cols-3">
                      {l.material.map((m) => (
                        <div key={m.label}>
                          <dt className="text-muted">{m.label}</dt>
                          <dd className="text-charcoal">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="shell">
          <Reveal>
            <h2 className="h-section">You may also consider</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
