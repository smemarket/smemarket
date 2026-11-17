import { CalendarClock, CreditCard, Gift, Megaphone } from "lucide-react";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import Character from "@/components/ui/Character";

const POINTS = [
  { icon: CalendarClock, t: "Monthly services, billed monthly", d: "SEO, ads, outreach, social media and the enquiry desk are billed each month." },
  { icon: CreditCard, t: "Your website, paid once", d: "The website redesign is a one-time project, not a subscription." },
  { icon: Megaphone, t: "Ad spend goes straight to the platforms", d: "You pay Meta, Google and TikTok directly, so you always see exactly what's spent." },
  { icon: Gift, t: "Starting costs nothing", d: "Your growth score and first recommendations are free, before you commit to anything." },
];

/** Plain-language billing promises, on ink, with one of our team leaning on the heading. */
export default function Billing() {
  return (
    <section className="relative overflow-hidden bg-ink section-y text-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative">
          <p className="text-[15px] font-medium text-lime">How billing works</p>
          <SplitHeading className="display mt-4 text-section">No small print. Just how it works.</SplitHeading>
          <div className="mt-10 hidden w-fit rounded-[28px] bg-[#f6e3b5] text-ink lg:block">
            <Character who="faisal" mood="thinking" body="Paper" size={260} className="translate-y-2" />
          </div>
        </div>
        <Reveal className="grid gap-px overflow-hidden rounded-[28px] bg-rule-dark sm:grid-cols-2" stagger={0.1}>
          {POINTS.map(({ icon: I, t, d }) => (
            <div key={t} data-reveal className="group bg-ink p-7 transition-colors duration-500 hover:bg-ink-2 md:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-paper/10 text-lime transition-transform duration-500 ease-out-expo group-hover:-rotate-6">
                <I className="size-5" />
              </span>
              <h3 className="mt-8 text-[22px] font-semibold leading-snug">{t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-paper/65">{d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
