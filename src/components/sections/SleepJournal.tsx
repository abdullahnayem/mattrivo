import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles } from "@/data/articles";
import { cn } from "@/lib/utils";

export function SleepJournal() {
  return (
    <section id="journal" className="section-y border-t border-line bg-ivory" aria-labelledby="journal-title">
      <div className="shell">
        <SectionHeading
          eyebrow="A little more about sleep"
          title={<span id="journal-title">Explore the world of better rest.</span>}
          titleClassName="max-w-[14ch]"
          aside={
            <Link href="/journal/memory-foam-vs-hybrid" className="text-[13.5px] font-semibold text-charcoal">
              <span className="link-underline">Visit the Sleep Journal</span>
            </Link>
          }
        />

        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-12 lg:mt-20">
          {articles.map((a, i) => (
            <Reveal
              key={a.slug}
              delay={i * 0.1}
              className={cn(i === 0 ? "md:col-span-6" : "md:col-span-3", i === 2 && "md:mt-24")}
            >
              <article className="group">
                <Link href={`/journal/${a.slug}`} className="block">
                  <div className={cn("relative overflow-hidden rounded-[2px]", i === 0 ? "aspect-[5/4]" : "aspect-[3/4]")}>
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                      placeholder="blur"
                      className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {a.category}
                    <span className="h-px w-4 bg-sage" aria-hidden="true" />
                    {a.readingTime}
                  </p>
                  <h3
                    className={cn(
                      "mt-3 font-serif leading-[1.12] text-charcoal transition-colors group-hover:text-plum",
                      i === 0 ? "text-[2rem] sm:text-[2.3rem]" : "text-[1.55rem]",
                    )}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-graphite">{a.excerpt}</p>
                  <span className="mt-5 inline-block text-[13px] font-semibold text-charcoal">
                    <span className="link-underline">Read article</span>
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
