"use client";

import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store";

export function useWishlist() {
  const { state, dispatch, notify } = useStore();
  return {
    ids: state.wishlist,
    items: state.wishlist.map((id) => getProduct(id)).filter((p) => p !== undefined),
    has: (id: string) => state.wishlist.includes(id),
    toggle(id: string) {
      const adding = !state.wishlist.includes(id);
      dispatch({ type: "toggleWish", productId: id });
      const product = getProduct(id);
      if (product)
        notify({
          title: adding ? "Saved to your wishlist" : "Removed from your wishlist",
          body: product.name,
          action: adding ? { label: "View", onClick: () => dispatch({ type: "panel", panel: "wishlist" }) } : undefined,
        });
    },
  };
}
