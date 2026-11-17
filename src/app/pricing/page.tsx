import type { Metadata } from "next";
import { FAQ } from "@/lib/site";
import BundleBuilder from "@/components/home/BundleBuilder";
import Faq from "@/components/home/Faq";
import { Fold, Slant } from "@/components/ui/Transitions";
import PricingHero from "@/components/pricing/PricingHero";
import ServiceIndex from "@/components/pricing/ServiceIndex";
import Billing from "@/components/pricing/Billing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Build your growth plan: pick single services or bundle all five monthly services and save every month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <BundleBuilder />
      <div className="bg-paper-2">
        <Slant>
          <ServiceIndex />
        </Slant>
      </div>
      <Billing />
      <div className="bg-ink">
        <Fold>
          <Faq items={FAQ} />
        </Fold>
      </div>
    </>
  );
}
