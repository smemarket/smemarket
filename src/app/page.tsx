import Hero from "@/components/home/Hero";
import BusinessStrip from "@/components/home/BusinessStrip";
import Pain from "@/components/home/Pain";
import ServiceList from "@/components/home/ServiceList";
import HumanLoop from "@/components/home/HumanLoop";
import BundleBuilder from "@/components/home/BundleBuilder";
import DashboardPreview from "@/components/home/DashboardPreview";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import FounderNote from "@/components/home/FounderNote";
import { FAQ } from "@/lib/site";
import { Drape, Slant, Sweep, Fold } from "@/components/ui/Transitions";

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessStrip />
      <Pain />
      <div className="bg-paper-2">
        <ServiceList />
      </div>
      <Drape fill="fill-ink" />
      <HumanLoop />
      <BundleBuilder />
      <div className="bg-paper-2">
        <DashboardPreview />
      </div>
      <Process />
      <div className="bg-paper-2">
        <Slant>
          <Testimonials />
        </Slant>
      </div>
      <Sweep from="bg-paper" to="bg-paper-2">
        <FounderNote />
      </Sweep>
      <div className="bg-paper-2">
        <Fold>
          <Faq items={FAQ} />
        </Fold>
      </div>
    </>
  );
}
