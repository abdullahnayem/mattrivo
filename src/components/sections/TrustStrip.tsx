import { Layers, Moon, Ruler, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: Ruler, title: "Thoughtful Craftsmanship", body: "Quilting and finishing checked against a clear specification." },
  { icon: Layers, title: "Considered Materials", body: "Every layer described honestly, with its purpose explained." },
  { icon: Truck, title: "UK Delivery", body: "Delivered to UK addresses. Timescales confirmed at checkout." },
  { icon: Moon, title: "Sleep Trial", body: "A proposed 90-night trial. Terms to be confirmed." },
];

export function TrustStrip() {
  return (
    <section id="trust" aria-label="Why mattrivo" className="border-b border-line bg-ivory">
      <ul className="shell grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {items.map(({ icon: Icon, title, body }, i) => (
          <Reveal
            as="li"
            key={title}
            delay={i * 0.06}
            className="flex items-start gap-4 py-7 sm:py-9 lg:px-8 lg:first:pl-0 lg:last:pr-0"
          >
            <Icon size={20} strokeWidth={1.2} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
            <div>
              <h3 className="text-[14px] font-semibold text-charcoal">{title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
