import type { Metadata } from "next";
import { SERVICES, FAQ } from "@/lib/site";
import BundleBuilder from "@/components/home/BundleBuilder";
import { ServiceCard } from "@/components/home/ServicesGrid";
import Faq from "@/components/home/Faq";
import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Build your growth plan: pick single services or bundle all five monthly services and save every month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-paper pt-32 md:pt-40">
        <div className="container-x">
          <SectionHead as="h1" eyebrow="Pricing" title="Simple prices. No packages to decode." intro="Five monthly services and one website build. Pick what you need, or take all five monthly services and save AED 5,000 every month." />
        </div>
      </section>
      <BundleBuilder heading={false} />
      <section className="bg-paper-2 py-24">
        <div className="container-x">
          <SectionHead eyebrow="Every service" title="What each service includes." />
          <Reveal className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} s={s} />
            ))}
          </Reveal>
        </div>
      </section>
      <Faq items={FAQ} />
    </>
  );
}
