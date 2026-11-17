import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const more = articles.filter((a) => a.slug !== slug);

  return (
    <article className="bg-ivory pt-[calc(var(--header-h)+48px)]">
      <header className="shell max-w-4xl text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <Link href="/#journal" className="hover:text-charcoal">
            Sleep Journal
          </Link>
          <span className="h-px w-4 bg-sage" aria-hidden="true" />
          {article.category}
          <span className="h-px w-4 bg-sage" aria-hidden="true" />
          {article.readingTime}
        </p>
        <h1 className="display mt-6 text-[clamp(2.6rem,5.5vw,4.6rem)]">{article.title}</h1>
        <p className="lede mx-auto mt-6 max-w-2xl">{article.excerpt}</p>
      </header>
      <div className="shell mt-14">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2px]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className="object-cover"
          />
        </div>
      </div>
      <div className="shell max-w-[46rem] py-20">
        {article.body.map((block, i) => (
          <section key={i} className="mt-10 first:mt-0">
            {block.heading && <h2 className="font-serif text-[2rem] leading-tight text-plum">{block.heading}</h2>}
            {block.paragraphs.map((p, j) => (
              <p key={j} className="mt-4 text-[1.0625rem] leading-[1.8] text-graphite first:mt-4">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="mt-14 border-t border-line pt-6 text-[13px] text-muted">
          General guidance only. Comfort is personal, and this article is not medical advice.
        </p>
      </div>
      <aside className="border-t border-line bg-cream">
        <div className="shell grid gap-8 py-16 md:grid-cols-2">
          {more.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="group flex gap-5">
              <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-[2px]">
                <Image src={a.image} alt="" fill sizes="112px" className="object-cover" placeholder="blur" />
              </div>
              <div>
                <p className="eyebrow">{a.category}</p>
                <p className="mt-2 font-serif text-[1.5rem] leading-tight text-charcoal group-hover:text-plum">{a.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </article>
  );
}
