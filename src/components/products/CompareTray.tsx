"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useId } from "react";
import { MattressRender, sanitizeId } from "@/components/mattress/art";
import { Modal } from "@/components/ui/Modal";
import { DEFAULT_SIZE, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useComparison } from "@/hooks/useComparison";
import { useUI } from "@/lib/store";
import { ease, formatPrice } from "@/lib/utils";

function Thumb({ product }: { product: Product }) {
  const id = sanitizeId(useId());
  return <MattressRender id={id} variant={product.render} depthCm={product.depthCm} label={false} className="h-auto w-full" />;
}

export function CompareTray() {
  const compare = useComparison();
  const { panel } = useUI();
  const show = compare.items.length > 0 && panel !== "compare";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.55, ease }}
          className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-6 sm:pb-5"
          role="region"
          aria-label="Mattress comparison"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-lg border border-line bg-ivory/95 p-3 shadow-[0_24px_48px_-24px_rgba(41,40,34,0.45)] backdrop-blur sm:gap-5 sm:p-4">
            <p className="hidden pl-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:block">Compare</p>
            <ul className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
              {compare.items.map((p) => (
                <li
                  key={p.id}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-2"
                >
                  <span className="w-10">
                    <Thumb product={p} />
                  </span>
                  <span className="text-[12.5px] font-medium">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => compare.toggle(p.id)}
                    aria-label={`Remove ${p.name} from comparison`}
                    className="grid size-6 place-items-center rounded-full text-muted hover:text-charcoal"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={compare.clear}
              className="hidden text-[12.5px] text-muted hover:text-charcoal sm:block"
            >
              Clear
            </button>
            <button type="button" onClick={compare.open} disabled={compare.items.length < 2} className="btn btn-primary btn-sm">
              <span>{compare.items.length < 2 ? "Add one more" : `Compare ${compare.items.length}`}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CompareModal() {
  const { panel, close } = useUI();
  const compare = useComparison();
  const cart = useCart();
  const items = compare.items;

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    {
      label: "Price (Double)",
      render: (p) => <span className="font-serif text-3xl text-plum">{formatPrice(p.prices[DEFAULT_SIZE])}</span>,
    },
    { label: "Type", render: (p) => p.type },
    { label: "Feel", render: (p) => p.firmness.label },
    { label: "Depth", render: (p) => `${p.depthCm} cm` },
    { label: "Construction", render: (p) => p.construction.join(", ") },
    { label: "Good for", render: (p) => p.goodFor.join(", ") },
  ];

  return (
    <Modal open={panel === "compare"} onClose={close} title="Side by side" className="max-w-5xl">
      <div className="overflow-x-auto px-6 pb-8 pt-6 sm:px-9">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
          <thead>
            <tr>
              <th className="w-36 pb-4 align-bottom text-[12px] font-normal text-muted">Proposed specifications</th>
              {items.map((p) => (
                <th key={p.id} className="px-4 pb-4 align-bottom font-normal">
                  <div className="w-36">
                    <Thumb product={p} />
                  </div>
                  <span className="mt-2 block font-serif text-2xl text-charcoal">{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="py-4 pr-4 text-[12.5px] font-normal text-muted">
                  {r.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-4 align-top text-charcoal">
                    {r.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td />
              {items.map((p) => (
                <td key={p.id} className="px-4 pt-5">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => cart.add(p.id, DEFAULT_SIZE)}>
                    <span>Add Double to basket</span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="mt-6 text-[12px] text-muted">
          Demonstration prices and proposed specifications, not supplier-confirmed claims.
        </p>
      </div>
    </Modal>
  );
}
