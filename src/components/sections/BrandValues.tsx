import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { brandValues } from "@/data/content";
import { media } from "@/data/media";

export function BrandValues() {
  return (
    <section id="our-story" className="section-y bg-white/60" aria-labelledby="values-title">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <RevealImage
            src={media.valuesSunlit}
            alt="Soft morning light through blinds across white bedding"
            sizes="(min-width: 1024px) 38vw, 100vw"
            parallax={6}
            className="aspect-[4/5] rounded-[2px] lg:sticky lg:top-[calc(var(--header-h)+40px)]"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <Reveal>
            <Eyebrow>The mattrivo difference</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="values-title" className="h-section mt-5 max-w-[15ch]">
              Thoughtful comfort. Considered in every detail.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="lede mt-7 max-w-lg">
              mattrivo began with a simple belief: choosing a mattress should feel calm and clear. We design a small collection
              with care, describe it honestly, and let comfort speak for itself.
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-x-10 sm:grid-cols-2">
            {brandValues.map((v, i) => (
              <Reveal as="li" key={v.title} delay={0.1 + i * 0.08} className="border-t border-charcoal/15 py-8">
                <span className="font-serif text-[1.05rem] italic text-sage">{v.number}</span>
                <h3 className="mt-3 font-serif text-[1.75rem] leading-tight text-charcoal">{v.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-graphite">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
