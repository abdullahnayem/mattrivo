import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/data/site";

const pages: Record<string, { title: string; intro: string }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "How mattrivo collects, uses and protects personal data under UK GDPR and the Data Protection Act 2018.",
  },
  "cookie-policy": {
    title: "Cookie Policy",
    intro: "Which cookies and similar technologies this website uses, and how to manage your preferences.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    intro: "The terms that apply when you order from mattrivo, including delivery, cancellation and returns.",
  },
  accessibility: {
    title: "Accessibility",
    intro: "Our commitment to making this website usable for everyone, and how to contact us if something is difficult to use.",
  },
  contact: {
    title: "Contact",
    intro: "Questions about a mattress, an order or our sleep trial? We would be glad to help.",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pages[slug] ? { title: pages[slug].title } : {};
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <section className="bg-ivory pb-28 pt-[calc(var(--header-h)+72px)]">
      <div className="shell max-w-3xl">
        <p className="eyebrow">mattrivo</p>
        <h1 className="display mt-5 text-[clamp(2.6rem,5vw,4rem)]">{page.title}</h1>
        <p className="lede mt-6">{page.intro}</p>
        {slug === "contact" ? (
          <p className="mt-10 text-[15px] text-graphite">
            Email{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-charcoal">
              {site.email}
            </a>
            . Telephone, opening hours and registered address: <span className="placeholder-chip">to be confirmed</span>.
          </p>
        ) : (
          <div className="mt-10 rounded-[4px] border border-dashed border-coral/60 bg-white/60 p-6 text-[14px] leading-relaxed text-graphite">
            This page is a placeholder. The final {page.title.toLowerCase()} must be written or approved by mattrivo and its legal
            advisers before launch.
          </div>
        )}
        <Link href="/" className="mt-12 inline-block text-[13.5px] font-semibold">
          <span className="link-underline">Return to the homepage</span>
        </Link>
      </div>
    </section>
  );
}
