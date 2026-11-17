"use client";

import Link from "next/link";
import { useId } from "react";
import { MattressRender, sanitizeId } from "@/components/mattress/art";
import { getProduct } from "@/data/products";
import { comparisonRanges, comparisonRows } from "@/data/ranges";
import { cn } from "@/lib/utils";

function MiniRender({ productId }: { productId: string }) {
  const id = sanitizeId(useId());
  const p = getProduct(productId)!;
  return <MattressRender id={id} variant={p.render} depthCm={p.depthCm} label={false} className="h-auto w-full" />;
}

/**
 * The three-range comparison. A real table for assistive tech; on small
 * screens it scrolls horizontally with the attribute column pinned.
 */
export function ComparisonTable() {
  return (
    <div className="no-scrollbar -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0">
      <table className="w-full min-w-[600px] border-separate border-spacing-0 overflow-hidden rounded-[10px] border border-line bg-[#fdfcf9] text-left">
        <caption className="sr-only">
          Comparison of the Essential, Comfort Hybrid and Premium Pillowtop ranges for a UK Double
        </caption>
        <colgroup>
          <col className="w-[19%] md:w-[22%]" />
          {comparisonRanges.map((r) => (
            <col key={r.productId} className={cn("w-[26%]", r.highlight && "bg-lavender")} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 border-b border-line bg-[#fdfcf9] px-5 py-7 align-bottom text-[12.5px] font-normal text-muted md:static md:px-7"
            >
              The details
            </th>
            {comparisonRanges.map((r) => (
              <th
                key={r.productId}
                scope="col"
                className={cn(
                  "group border-b border-line px-5 pb-6 pt-5 align-bottom font-normal md:px-7",
                  r.highlight && "bg-lavender",
                )}
              >
                <div className="mb-4 w-[150px] max-w-full transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-translate-y-1">
                  <MiniRender productId={r.productId} />
                </div>
                <span className="block font-serif text-[1.65rem] leading-tight text-plum">{r.name}</span>
                {"label" in r && r.label ? (
                  <span className="mt-1.5 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-plum/80">
                    <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
                    {r.label}
                  </span>
                ) : (
                  <span className="mt-1.5 block h-[16px]" aria-hidden="true" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label} className="group/row">
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-line bg-[#fdfcf9] px-5 py-6 align-middle text-[12.5px] font-normal text-muted transition-colors group-hover/row:text-charcoal md:static md:px-7"
              >
                {row.label}
              </th>
              {row.values.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "border-b border-line px-5 py-6 align-middle transition-colors md:px-7",
                    comparisonRanges[ci].highlight ? "bg-lavender group-hover/row:bg-[#e6dfe7]" : "group-hover/row:bg-cream/70",
                  )}
                >
                  {row.kind === "price" ? (
                    <span className="font-serif text-[2.6rem] leading-none text-plum">{cell[0]}</span>
                  ) : (
                    <span className="block text-[14.5px] leading-relaxed text-charcoal">
                      {cell.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 bg-[#fdfcf9] px-5 py-6 text-[12.5px] font-normal text-muted md:static md:px-7"
            >
              Take a closer look
            </th>
            {comparisonRanges.map((r) => {
              const p = getProduct(r.productId)!;
              return (
                <td key={r.productId} className={cn("px-5 py-6 md:px-7", r.highlight && "bg-lavender")}>
                  <Link href={`/mattresses/${p.slug}`} className="group inline-flex items-center gap-2 text-[14.5px] text-plum">
                    <span className="link-underline">{r.linkLabel}</span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      <path d="M1 10L10 1M3 1h7v7" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </Link>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
