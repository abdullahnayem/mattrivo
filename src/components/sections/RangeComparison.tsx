import { ComparisonTable } from "@/components/products/ComparisonTable";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { comparisonFootnote, comparisonSize } from "@/data/ranges";

export function RangeComparison() {
  return (
    <section id="compare" className="section-y bg-ivory" aria-labelledby="compare-title">
      <div className="shell">
        <SectionHeading
          eyebrow="A little clarity"
          title={<span id="compare-title">Three ranges. Side by side.</span>}
          description="Find the right balance of comfort, construction and value."
          aside={
            <span className="inline-flex items-center rounded-full border border-line bg-[#fdfcf9] px-4 py-2 text-[12.5px] text-graphite">
              {comparisonSize}
            </span>
          }
        />
        <Reveal className="mt-12 lg:mt-16" delay={0.1}>
          <ComparisonTable />
        </Reveal>
        <p className="mt-6 text-[12px] text-muted">{comparisonFootnote}</p>
      </div>
    </section>
  );
}
