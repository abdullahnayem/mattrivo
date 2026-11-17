"use client";

import { getProduct } from "@/data/products";
import { MAX_COMPARE, useStore } from "@/lib/store";

export function useComparison() {
  const { state, dispatch, notify } = useStore();
  return {
    ids: state.compare,
    items: state.compare.map((id) => getProduct(id)).filter((p) => p !== undefined),
    has: (id: string) => state.compare.includes(id),
    max: MAX_COMPARE,
    toggle(id: string) {
      if (!state.compare.includes(id) && state.compare.length >= MAX_COMPARE) {
        notify({ title: `Compare up to ${MAX_COMPARE} mattresses`, body: "Remove one to add another." });
        return;
      }
      dispatch({ type: "toggleCompare", productId: id });
    },
    clear: () => dispatch({ type: "clearCompare" }),
    open: () => dispatch({ type: "panel", panel: "compare" }),
  };
}
