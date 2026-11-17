import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/mattrivo-logo-trim.png";
import { cn } from "@/lib/utils";

/** The mattrivo wordmark, used exactly as supplied. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="mattrivo home" className={cn("inline-block shrink-0", className)}>
      <Image src={logo} alt="mattrivo" priority className="h-auto w-full" sizes="200px" />
    </Link>
  );
}
