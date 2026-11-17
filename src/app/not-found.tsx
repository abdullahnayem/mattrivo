import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-ivory pt-[var(--header-h)]">
      <div className="shell">
        <p className="eyebrow">Page not found</p>
        <h1 className="display mt-5 text-[clamp(2.8rem,6vw,5rem)]">This page is resting.</h1>
        <p className="lede mt-5 max-w-md">The page you were looking for has moved or no longer exists.</p>
        <ButtonLink href="/" className="mt-10" arrow>
          Back to the homepage
        </ButtonLink>
      </div>
    </section>
  );
}
