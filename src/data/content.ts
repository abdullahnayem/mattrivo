import type { StaticImageData } from "next/image";
import type { CollectionId } from "./products";
import { media } from "./media";

export const collections: {
  id: CollectionId;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
}[] = [
  {
    id: "hybrid",
    title: "Hybrid Mattresses",
    description: "Pocket springs and soft comfort layers, in balance.",
    image: media.collectionHybrid,
    alt: "Close-up of a quilted white mattress surface with a dark knitted border",
  },
  {
    id: "memory-foam",
    title: "Memory Foam",
    description: "Close, contouring comfort that moves with you.",
    image: media.collectionMemoryFoam,
    alt: "A bright bedroom with a low bed, linen cushions and a pale wooden floor",
  },
  {
    id: "pocket-sprung",
    title: "Pocket Sprung",
    description: "Individually wrapped springs, responsive and breathable.",
    image: media.collectionPocketSprung,
    alt: "The edge of a deep pocket sprung mattress with a quilted top",
  },
  {
    id: "natural",
    title: "Natural Comfort",
    description: "Natural fibre fillings and traditional finishing.",
    image: media.collectionNatural,
    alt: "Crisp white pillows against a slatted oak headboard with a striped throw",
  },
];

export const sleepingStyles: {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  position: string;
}[] = [
  {
    id: "side",
    title: "Side Sleepers",
    description: "A little give at the shoulders and hips, with steady support through the middle.",
    image: media.styleSide,
    alt: "A woman sleeping on her side under a navy blanket",
    position: "50% 40%",
  },
  {
    id: "back",
    title: "Back Sleepers",
    description: "Even, balanced support that keeps you comfortable from head to heel.",
    image: media.styleBack,
    alt: "A woman resting on her back in white bedding, smiling",
    position: "60% 50%",
  },
  {
    id: "front",
    title: "Front Sleepers",
    description: "A medium-firm feel that helps keep the hips level and comfortable.",
    image: media.styleFront,
    alt: "A woman sleeping on her front across white sheets",
    position: "50% 40%",
  },
  {
    id: "couples",
    title: "Couples",
    description: "Individually wrapped springs that help keep movement on your side of the bed.",
    image: media.styleCouples,
    alt: "A couple asleep together under a soft green duvet",
    position: "50% 55%",
  },
];

export const brandValues = [
  {
    number: "01",
    title: "Thoughtful Construction",
    body: "Every layer is there for a reason. We describe what each one does, and leave out what it does not.",
  },
  {
    number: "02",
    title: "Comfort-Led Design",
    body: "We start with how people actually sleep, then shape the feel around side, back, front and shared sleeping.",
  },
  {
    number: "03",
    title: "Honest Product Information",
    body: "Clear specifications, plain English and no inflated claims. If something is still being confirmed, we say so.",
  },
  {
    number: "04",
    title: "Considered Materials",
    body: "Fabrics, foams and fibres chosen for how they feel and how they last, with sourcing details shared as they are confirmed.",
  },
];

export type MaterialTopic = {
  id: string;
  title: string;
  body: string;
  status: string;
  image?: StaticImageData;
  alt?: string;
  visual?: "foam" | "springs";
};

export const materialTopics: MaterialTopic[] = [
  {
    id: "fabrics",
    title: "Mattress fabrics",
    body: "Soft knitted covers chosen for a comfortable, breathable first touch.",
    status: "Fibre composition to be confirmed with the manufacturer.",
    image: media.materialKnit,
    alt: "Macro detail of a soft knitted textile",
  },
  {
    id: "foam",
    title: "Foam",
    body: "Comfort and support foams selected for feel and resilience, layered with purpose.",
    status: "Foam certifications will be listed only once documentation is received.",
    visual: "foam",
  },
  {
    id: "springs",
    title: "Spring construction",
    body: "Steel coils sewn into individual fabric pockets so each spring can respond on its own.",
    status: "Spring count and wire gauge to be confirmed per product.",
    visual: "springs",
  },
  {
    id: "natural",
    title: "Natural materials",
    body: "Natural fibre fillings are used in our Natural Comfort range, not across the whole collection.",
    status: "Fibre types and sourcing to be confirmed before launch.",
    image: media.materialWool,
    alt: "Macro detail of soft natural fibre",
  },
  {
    id: "packaging",
    title: "Packaging",
    body: "Packaging designed to protect your mattress on its way to you, using as little material as practical.",
    status: "Packaging materials and recyclability to be confirmed.",
    image: media.materialPackaging,
    alt: "An open cardboard box on a pale surface",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    body: "Made by a specialist partner, with quilting and finishing checked against our specification.",
    status: "Manufacturing location and partner details to be confirmed.",
    image: media.materialQuilt,
    alt: "Close-up of a quilted mattress top with stitched patterning",
  },
  {
    id: "recycling",
    title: "Recycling",
    body: "We want every mattress to have a responsible next step at the end of its life.",
    status: "Recycling and removal options to be confirmed.",
    image: media.materialLinen,
    alt: "Macro detail of natural linen weave",
  },
];
