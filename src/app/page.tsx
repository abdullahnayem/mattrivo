import { Bestsellers } from "@/components/sections/Bestsellers";
import { BrandValues } from "@/components/sections/BrandValues";
import { Collections } from "@/components/sections/Collections";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { LifestyleGallery } from "@/components/sections/LifestyleGallery";
import { MattressConstruction } from "@/components/sections/MattressConstruction";
import { MattressFinder } from "@/components/sections/MattressFinder";
import { RangeComparison } from "@/components/sections/RangeComparison";
import { Reviews } from "@/components/sections/Reviews";
import { SleepingStyles } from "@/components/sections/SleepingStyles";
import { SleepJournal } from "@/components/sections/SleepJournal";
import { SleepTrial } from "@/components/sections/SleepTrial";
import { Sustainability } from "@/components/sections/Sustainability";
import { TrustStrip } from "@/components/sections/TrustStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Collections />
      <Bestsellers />
      <MattressFinder />
      <MattressConstruction />
      <SleepingStyles />
      <LifestyleGallery />
      <SleepTrial />
      <RangeComparison />
      <BrandValues />
      <Reviews />
      <Sustainability />
      <SleepJournal />
      <FAQ />
      <FinalCTA />
    </>
  );
}
