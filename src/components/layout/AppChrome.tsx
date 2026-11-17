"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CompareModal, CompareTray } from "@/components/products/CompareTray";
import { ProductQuickView } from "@/components/products/ProductQuickView";
import { Toaster } from "@/components/ui/Toast";
import { StoreProvider } from "@/lib/store";
import { AnnouncementBar } from "./AnnouncementBar";
import { AccountDrawer, CartDrawer, CheckoutModal, WishlistDrawer } from "./CommercePanels";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileMenu />
        <SearchOverlay />
        <CartDrawer />
        <WishlistDrawer />
        <AccountDrawer />
        <CheckoutModal />
        <ProductQuickView />
        <CompareTray />
        <CompareModal />
        <Toaster />
      </MotionConfig>
    </StoreProvider>
  );
}
