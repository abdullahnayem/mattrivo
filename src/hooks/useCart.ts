"use client";

import { getProduct, sizeLabel, type SizeId } from "@/data/products";
import { useStore } from "@/lib/store";

export function useCart() {
  const { state, dispatch, notify } = useStore();

  const lines = state.cart
    .map((line) => {
      const product = getProduct(line.productId);
      return product ? { ...line, product, unitPrice: product.prices[line.size] } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);

  return {
    lines,
    count,
    subtotal,
    hydrated: state.hydrated,
    add(productId: string, size: SizeId, qty = 1, opts: { silent?: boolean } = {}) {
      dispatch({ type: "add", productId, size, qty });
      const product = getProduct(productId);
      if (!opts.silent && product) {
        notify({
          title: "Added to your basket",
          body: `${product.name} · ${sizeLabel(size)}`,
          action: { label: "View basket", onClick: () => dispatch({ type: "panel", panel: "cart" }) },
        });
      }
    },
    setQty: (productId: string, size: SizeId, qty: number) => dispatch({ type: "setQty", productId, size, qty }),
    remove: (productId: string, size: SizeId) => dispatch({ type: "remove", productId, size }),
  };
}
