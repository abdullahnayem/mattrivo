import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "mattrivo · Thoughtfully designed mattresses for better sleep",
    template: "%s · mattrivo",
  },
  description:
    "Thoughtfully designed mattresses that bring together comfort, considered materials and a better night’s rest. Designed for the UK.",
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f8f6f1",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
