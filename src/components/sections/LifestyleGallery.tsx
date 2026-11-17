"use client";

import { RevealImage, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { media } from "@/data/media";
import { cn } from "@/lib/utils";

const photos = [
  {
    src: media.galleryMorning,
    alt: "Sunlight falling across rumpled white linen in a calm bedroom",
    area: "[grid-area:a]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
    parallax: 4,
    from: "bottom" as const,
  },
  {
    src: media.galleryRetriever,
    alt: "A golden retriever puppy resting its head on soft white bedding",
    area: "[grid-area:b]",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    parallax: 7,
    from: "bottom" as const,
  },
  {
    src: media.galleryChild,
    alt: "A young child asleep under a striped blanket in a cosy family bedroom",
    area: "[grid-area:c]",
    sizes: "(min-width: 1024px) 34vw, 100vw",
    parallax: 3,
    from: "right" as const,
  },
  {
    src: media.galleryCouple,
    alt: "A couple laughing together in a bright bed with white linen",
    area: "[grid-area:d]",
    sizes: "(min-width: 1024px) 34vw, 100vw",
    parallax: 5,
    from: "bottom" as const,
  },
  {
    src: media.galleryLinen,
    alt: "Close-up of soft, natural cream linen",
    area: "[grid-area:e]",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    parallax: 8,
    from: "bottom" as const,
  },
  {
    src: media.galleryEvening,
    alt: "A bedside lamp glowing warmly beside a soft taupe duvet in the evening",
    area: "[grid-area:f]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
    parallax: 4,
    from: "left" as const,
  },
];

export function LifestyleGallery() {
  return (
    <section id="life" className="section-y bg-ivory pt-0" aria-labelledby="life-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Life with mattrivo"
          title={<span id="life-title">Comfort is part of everyday life.</span>}
          description="From slow Sunday mornings to the little moments that make a house feel like home."
          titleClassName="max-w-[13ch]"
        />

        <div
          className={cn(
            "mt-14 grid gap-2.5 lg:mt-20",
            "grid-cols-2 [grid-template-areas:'a_a'_'b_e'_'c_c'_'d_d'_'f_f'] [grid-auto-rows:minmax(0,auto)]",
            "lg:grid-cols-12 lg:[grid-template-areas:'a_a_a_a_a_b_b_b_c_c_c_c'_'a_a_a_a_a_b_b_b_c_c_c_c'_'a_a_a_a_a_b_b_b_c_c_c_c'_'a_a_a_a_a_b_b_b_d_d_d_d'_'a_a_a_a_a_e_e_e_d_d_d_d'_'f_f_f_f_f_e_e_e_d_d_d_d'_'f_f_f_f_f_e_e_e_d_d_d_d'_'f_f_f_f_f_e_e_e_g_g_g_g'] lg:[grid-auto-rows:clamp(56px,6.4vw,96px)]",
          )}
        >
          {photos.map((p, i) => (
            <RevealImage
              key={p.alt}
              src={p.src}
              alt={p.alt}
              sizes={p.sizes}
              parallax={p.parallax}
              from={p.from}
              delay={[0, 0.15, 0.3, 0.1, 0.25, 0.05][i]}
              className={cn(
                p.area,
                "group rounded-[2px] [&_img]:transition-transform [&_img]:duration-[1.6s] [&_img]:ease-[var(--ease-soft)] hover:[&_img]:scale-[1.04]",
                i === 0 && "aspect-[4/3] lg:aspect-auto",
                (i === 1 || i === 4) && "aspect-[3/4] lg:aspect-auto",
                (i === 2 || i === 3 || i === 5) && "aspect-[3/2] lg:aspect-auto",
              )}
            />
          ))}
          <Reveal className="hidden items-end justify-end lg:flex lg:[grid-area:g]" delay={0.3}>
            <p className="flex items-center gap-3 font-serif text-[1.35rem] italic text-graphite">
              <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
              Better moments begin with better rest.
            </p>
          </Reveal>
        </div>
        <p className="mt-6 flex items-center gap-3 font-serif text-[1.25rem] italic text-graphite lg:hidden">
          <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
          Better moments begin with better rest.
        </p>
      </div>
    </section>
  );
}
