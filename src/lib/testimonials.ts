import type { Cast } from "@/components/ui/Character";

/**
 * ⚠️  PLACEHOLDER TESTIMONIALS. DO NOT LAUNCH WITH THESE. ⚠️
 * These quotes, names and results are written examples, not real clients.
 * They display on the site with no visible "sample" label, so publishing them
 * as-is would present invented reviews as real (misleading to customers and a
 * legal risk under UAE consumer-protection rules).
 * Replace every item with a real, consented testimonial, then set `sample: false`.
 */
export type Testimonial = {
  sample: boolean;
  who: Cast;
  tone: string;
  name: string;
  role: string;
  place: string;
  service: string;
  result: string;
  resultLabel: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    sample: true,
    who: "rashid",
    tone: "bg-[#e9f1c9]",
    name: "Rashid",
    role: "Owner, fit-out company",
    place: "Al Quoz, Dubai",
    service: "Paid ads",
    result: "AED 46",
    resultLabel: "per enquiry, down from AED 140",
    quote: "We used to boost posts and hope. Now every month I see exactly what an enquiry costs us, and it keeps going down.",
  },
  {
    sample: true,
    who: "noor",
    tone: "bg-[#f6dcd2]",
    name: "Noor",
    role: "Founder, beauty salon",
    place: "Sharjah",
    service: "Enquiry desk",
    result: "9 sec",
    resultLabel: "average first reply on WhatsApp",
    quote: "Clients used to wait hours for a reply. Now they get one in seconds, and their team follows up. Our weekends are fully booked.",
  },
  {
    sample: true,
    who: "james",
    tone: "bg-[#dbe6ef]",
    name: "James",
    role: "Director, consultancy",
    place: "DIFC, Dubai",
    service: "SDR and outreach",
    result: "14",
    resultLabel: "qualified meetings in two months",
    quote: "I don't have time to prospect. They find the right people, write to them properly, and hand me warm conversations.",
  },
  {
    sample: true,
    who: "lina",
    tone: "bg-[#f6e3b5]",
    name: "Lina",
    role: "Owner, café",
    place: "Dubai Marina",
    service: "Social media",
    result: "3×",
    resultLabel: "monthly reach on Instagram",
    quote: "Our Instagram was dead for a year. Now it posts every week, and I approve the whole month in ten minutes.",
  },
  {
    sample: true,
    who: "sami",
    tone: "bg-[#e3dcf2]",
    name: "Sami",
    role: "Managing partner, trading company",
    place: "Abu Dhabi",
    service: "SEO",
    result: "Top 3",
    resultLabel: "on Google Maps for our main search",
    quote: "Buyers now find us on Google and even in ChatGPT answers. The monthly report is one page and I actually read it.",
  },
  {
    sample: true,
    who: "aisha",
    tone: "bg-[#d5ece4]",
    name: "Aisha",
    role: "Practice manager, dental clinic",
    place: "JLT, Dubai",
    service: "Website redesign",
    result: "2×",
    resultLabel: "booking requests from the website",
    quote: "The new site is fast on a phone and every page has a WhatsApp button. Patients book without calling.",
  },
];

if (process.env.NODE_ENV === "production" && TESTIMONIALS.some((t) => t.sample)) {
  console.warn("[SME Market] Placeholder testimonials are still in src/lib/testimonials.ts. Replace them with real ones before launch.");
}
