"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { MattressRender, sanitizeId } from "@/components/mattress/art";
import { QtyControl } from "@/components/products/ProductQuickView";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { PolicyText } from "@/components/ui/PolicyText";
import { DEFAULT_SIZE, sizeDims, sizeLabel, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useUI } from "@/lib/store";
import { ease, formatPrice } from "@/lib/utils";

function Thumb({ product }: { product: Product }) {
  const id = sanitizeId(useId());
  return (
    <div className="grid aspect-square w-[88px] shrink-0 place-items-center rounded-[3px] bg-[#efebe4] p-1.5">
      <MattressRender id={id} variant={product.render} depthCm={product.depthCm} label={false} className="h-auto w-full" />
    </div>
  );
}

export function CartDrawer() {
  const { panel, close, open } = useUI();
  const cart = useCart();

  return (
    <Drawer
      open={panel === "cart"}
      onClose={close}
      title="Your basket"
      label={
        cart.count > 0 ? (
          <span className="text-[13px] text-muted">
            {cart.count} {cart.count === 1 ? "item" : "items"}
          </span>
        ) : null
      }
      footer={
        cart.lines.length > 0 ? (
          <div>
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-graphite">Subtotal</dt>
                <dd className="font-semibold tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-6 text-[13px]">
                <dt className="text-muted">Delivery</dt>
                <dd className="text-right text-muted">
                  <PolicyText text="{{Calculated at checkout}}" />
                </dd>
              </div>
            </dl>
            <button type="button" className="btn btn-primary mt-5 w-full" onClick={() => open("checkout")}>
              <span>Continue to checkout</span>
            </button>
            <p className="mt-3 text-center text-[12px] text-muted">Demonstration prices. VAT treatment to be confirmed.</p>
          </div>
        ) : null
      }
    >
      {cart.lines.length === 0 ? (
        <div className="flex h-full flex-col items-start justify-center px-6 py-16 sm:px-8">
          <p className="font-serif text-[2rem] leading-tight text-plum">Your basket is empty.</p>
          <p className="lede mt-3">Not sure where to start? Our Mattress Finder takes a couple of minutes.</p>
          <Link href="/#finder" onClick={close} className="btn btn-primary mt-8">
            <span>Find Your Mattress</span>
          </Link>
          <Link href="/#bestsellers" onClick={close} className="mt-5 text-sm font-semibold">
            <span className="link-underline">Explore our collection</span>
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-line px-6 sm:px-8">
          <AnimatePresence initial={false}>
            {cart.lines.map((l) => (
              <motion.li
                key={`${l.productId}-${l.size}`}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.45, ease }}
                className="flex gap-4 overflow-hidden py-5"
              >
                <Thumb product={l.product} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/mattresses/${l.product.slug}`}
                        onClick={close}
                        className="font-serif text-[1.35rem] leading-tight text-charcoal hover:text-plum"
                      >
                        {l.product.name}
                      </Link>
                      <p className="text-[12.5px] text-muted">
                        {sizeLabel(l.size)} · {sizeDims(l.size)}
                      </p>
                    </div>
                    <p className="text-[14px] font-semibold tabular-nums">{formatPrice(l.unitPrice * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QtyControl
                      value={l.qty}
                      onChange={(n) => cart.setQty(l.productId, l.size, n)}
                      label={`Quantity of ${l.product.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => cart.remove(l.productId, l.size)}
                      className="flex items-center gap-1.5 text-[12.5px] text-muted hover:text-charcoal"
                    >
                      <Trash2 size={14} strokeWidth={1.4} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}

export function WishlistDrawer() {
  const { panel, close, openQuickView } = useUI();
  const wish = useWishlist();
  const cart = useCart();

  return (
    <Drawer open={panel === "wishlist"} onClose={close} title="Wishlist">
      {wish.items.length === 0 ? (
        <div className="px-6 py-16 sm:px-8">
          <Heart size={22} strokeWidth={1.3} className="text-plum" />
          <p className="mt-5 font-serif text-[2rem] leading-tight text-plum">Nothing saved yet.</p>
          <p className="lede mt-3">Tap the heart on any mattress to keep it here while you decide.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line px-6 sm:px-8">
          {wish.items.map((p) => (
            <li key={p.id} className="flex gap-4 py-5">
              <Thumb product={p} />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <p className="font-serif text-[1.35rem] leading-tight">{p.name}</p>
                  <p className="text-[14px] font-semibold tabular-nums">{formatPrice(p.prices[DEFAULT_SIZE])}</p>
                </div>
                <p className="text-[12.5px] text-muted">
                  {p.type} · {p.firmness.label}
                </p>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-3 text-[13px]">
                  <button type="button" className="font-semibold" onClick={() => cart.add(p.id, DEFAULT_SIZE)}>
                    <span className="link-underline">Add Double to basket</span>
                  </button>
                  <button
                    type="button"
                    className="text-graphite"
                    onClick={() => {
                      close();
                      openQuickView(p.id);
                    }}
                  >
                    Choose size
                  </button>
                  <button type="button" className="text-muted" onClick={() => wish.toggle(p.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

export function AccountDrawer() {
  const { panel, close, notify } = useUI();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <Drawer open={panel === "account"} onClose={close} title="Account">
      <form
        className="px-6 py-10 sm:px-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
          }
          setError("");
          close();
          notify({ title: "Accounts are not connected yet", body: "Sign-in will link to your e-commerce platform." });
        }}
      >
        <p className="font-serif text-[2rem] leading-tight text-plum">Welcome back.</p>
        <p className="lede mt-2">Sign in to view orders and saved mattresses.</p>
        <label htmlFor="acc-email" className="eyebrow mt-8 block">
          Email address
        </label>
        <input
          id="acc-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "acc-err" : undefined}
          className="mt-2 h-12 w-full rounded-[4px] border border-line bg-white px-4 text-[15px] focus:border-charcoal focus:outline-none"
          autoComplete="email"
        />
        {error && (
          <p id="acc-err" className="mt-2 text-[13px] text-[#a1452f]">
            {error}
          </p>
        )}
        <label htmlFor="acc-pass" className="eyebrow mt-5 block">
          Password
        </label>
        <input
          id="acc-pass"
          type="password"
          className="mt-2 h-12 w-full rounded-[4px] border border-line bg-white px-4 text-[15px] focus:border-charcoal focus:outline-none"
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary mt-7 w-full">
          <span>Sign in</span>
        </button>
        <p className="mt-6 text-[12.5px] leading-relaxed text-muted">
          Demonstration only. Customer accounts will be provided by the chosen platform (for example Shopify or WooCommerce).
        </p>
      </form>
    </Drawer>
  );
}

export function CheckoutModal() {
  const { panel, close, open } = useUI();
  const cart = useCart();
  return (
    <Modal open={panel === "checkout"} onClose={() => open("cart")} title="Checkout">
      <div className="px-6 pb-8 pt-4 sm:px-9 sm:pb-10">
        <p className="lede">
          This presentation build stops before payment. In production, this step hands your basket to the secure checkout of the
          chosen platform. No payment is taken or simulated here.
        </p>
        <div className="mt-6 rounded-[4px] border border-line bg-white p-5">
          <ul className="space-y-2 text-[14px]">
            {cart.lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-4">
                <span>
                  {l.qty} × {l.product.name}, {sizeLabel(l.size)}
                </span>
                <span className="tabular-nums">{formatPrice(l.qty * l.unitPrice)}</span>
              </li>
            ))}
          </ul>
          <div className="hairline my-4" />
          <div className="flex justify-between text-[14px] font-semibold">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPrice(cart.subtotal)}</span>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-muted">
          Delivery to a UK postcode (for example SW1A 1AA). Charges and timescales: <PolicyText text="{{to be confirmed}}" />.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-primary" onClick={close}>
            <span>Understood</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => open("cart")}>
            <span>Back to basket</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
