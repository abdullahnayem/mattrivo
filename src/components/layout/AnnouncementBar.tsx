import Link from "next/link";
import { site } from "@/data/site";

export function AnnouncementBar() {
  return (
    <div className="relative z-[61] bg-plum text-ivory">
      <div className="shell flex h-9 items-center justify-center">
        <p className="truncate text-center text-[12px] tracking-[0.02em] text-ivory/90">
          {site.announcement.replace(" Explore our sleep collection.", " ")}
          <Link
            href="/#bestsellers"
            className="underline decoration-ivory/40 underline-offset-4 transition-colors hover:decoration-ivory"
          >
            Explore our sleep collection.
          </Link>
        </p>
      </div>
    </div>
  );
}
