"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { media } from "@/data/media";
import { mainNav, type NavItem } from "@/data/navigation";
import { products } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useUI } from "@/lib/store";
import { cn, ease, formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/products/ProductVisual";

function MegaMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const menu = item.menu!;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease }}
      className="absolute inset-x-0 top-full border-b border-line bg-ivory shadow-[0_30px_60px_-40px_rgba(41,40,34,0.35)]"
    >
      <div className="shell grid grid-cols-12 gap-10 py-10">
        <div className="col-span-3">
          <p className="eyebrow">{menu.heading}</p>
          <ul className="mt-6 space-y-1">
            {menu.links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={onNavigate} className="group block py-2">
                  <span className="font-serif text-[1.45rem] leading-tight text-charcoal transition-colors group-hover:text-plum">
                    {l.label}
                  </span>
                  {l.note && <span className="mt-0.5 block text-[12.5px] text-muted">{l.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {menu.kind === "mattresses" ? (
          <div className="col-span-6 grid grid-cols-3 gap-5 border-l border-line pl-10">
            {products.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/mattresses/${p.slug}`} onClick={onNavigate} className="group">
                <ProductVisual product={p} hoverImage={false} className="aspect-[4/3] rounded-[3px]" />
                <p className="mt-3 text-[14px] font-medium text-charcoal">{p.name}</p>
                <p className="text-[12.5px] text-muted">From {formatPrice(Math.min(...Object.values(p.prices)))}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="col-span-6 border-l border-line pl-10">
            <p className="max-w-sm font-serif text-[1.9rem] leading-[1.15] text-plum">
              Comfort is personal. Start with the way you sleep.
            </p>
            <p className="lede mt-4 max-w-md text-[14.5px]">
              Side, back or front, sharing or sleeping warm. Our Mattress Finder asks eight short questions and explains every
              recommendation.
            </p>
            <Link href="/#finder" onClick={onNavigate} className="mt-6 inline-block text-sm font-semibold text-charcoal">
              <span className="link-underline">Start the Mattress Finder</span>
            </Link>
          </div>
        )}

        <Link href="/#finder" onClick={onNavigate} className="group relative col-span-3 block overflow-hidden rounded-[3px]">
          <div className="relative aspect-[4/5]">
            <Image
              src={media.menuFeature}
              alt="Morning sunlight across a freshly made bed"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-105"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/0 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 text-ivory">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/80">Mattress Finder</p>
              <p className="mt-2 font-serif text-[1.5rem] leading-tight">Find your comfort in eight questions</p>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { open } = useUI();
  const cart = useCart();
  const wish = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpenMenu(null), [pathname]);

  const solid = scrolled || !isHome || openMenu !== null;

  const enter = (label: string | null) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const iconBtn =
    "relative grid size-10 place-items-center rounded-full text-charcoal transition-colors hover:bg-charcoal/[0.06]";

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] -mb-[var(--header-h)] transition-[background-color,border-color,box-shadow] duration-500",
        solid ? "border-b border-line bg-ivory/95 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={leave}
    >
      <div className="shell flex h-[var(--header-h)] items-center gap-6">
        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" className={cn(iconBtn, "-ml-2")} aria-label="Open menu" onClick={() => open("menu")}>
            <Menu size={21} strokeWidth={1.4} />
          </button>
        </div>

        <Logo className="w-[118px] lg:w-[132px]" />

        <nav aria-label="Main" className="mx-auto hidden h-full lg:block">
          <ul className="flex h-full items-center">
            {mainNav.map((item, i) => (
              <li key={item.label} className="flex h-full items-center" onMouseEnter={() => enter(item.menu ? item.label : null)}>
                {i > 0 && <span className="mx-1 h-3 w-px bg-charcoal/15" aria-hidden="true" />}
                {item.menu ? (
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    className={cn(
                      "relative px-4 py-2 text-[13.5px] font-medium tracking-[0.01em] transition-colors",
                      openMenu === item.label ? "text-plum" : "text-charcoal hover:text-plum",
                    )}
                  >
                    {item.label}
                    <motion.span
                      className="absolute inset-x-4 -bottom-0.5 h-px origin-left bg-plum"
                      initial={false}
                      animate={{ scaleX: openMenu === item.label ? 1 : 0 }}
                      transition={{ duration: 0.4, ease }}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-[13.5px] font-medium tracking-[0.01em] text-charcoal transition-colors hover:text-plum"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
          <button type="button" className={iconBtn} aria-label="Search" onClick={() => open("search")}>
            <Search size={19} strokeWidth={1.4} />
          </button>
          <button type="button" className={cn(iconBtn, "hidden sm:grid")} aria-label="Account" onClick={() => open("account")}>
            <User size={19} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            className={cn(iconBtn, "hidden sm:grid")}
            aria-label={`Wishlist, ${wish.ids.length} items`}
            onClick={() => open("wishlist")}
          >
            <Heart size={19} strokeWidth={1.4} />
            {wish.ids.length > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-plum" aria-hidden="true" />}
          </button>
          <button type="button" className={iconBtn} aria-label={`Shopping bag, ${cart.count} items`} onClick={() => open("cart")}>
            <ShoppingBag size={19} strokeWidth={1.4} />
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.span
                  key={cart.count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="absolute -right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-semibold text-white"
                >
                  {cart.count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <div onMouseEnter={() => enter(openMenu)} onMouseLeave={leave} className="hidden lg:block">
            <MegaMenu item={mainNav.find((n) => n.label === openMenu)!} onNavigate={() => setOpenMenu(null)} />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
