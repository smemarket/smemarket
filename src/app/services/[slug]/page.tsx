import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";
import { OG_IMAGE, SERVICES, SITE, getService, midSentence, waLink } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Character from "@/components/ui/Character";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { ScrollOpen, Sweep } from "@/components/ui/Transitions";
import Swipe from "@/components/ui/Swipe";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Faq from "@/components/home/Faq";
import ServiceHero from "@/components/service/ServiceHero";
import Problems from "@/components/service/Problems";
import Deliverables from "@/components/service/Deliverables";
import Rhythm from "@/components/service/Rhythm";
import KpiBoard from "@/components/service/KpiBoard";
import WhoFor from "@/components/service/WhoFor";
import Ninety from "@/components/service/Ninety";
import Compare from "@/components/service/Compare";
import Pair from "@/components/service/Pair";
import { SERVICE_EXTRA } from "@/lib/service-extra";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: `${s.name} for UAE SMEs`,
    description: `${s.promise} The KPI we report every month: ${s.kpi}.`,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.name} | SME Market`, description: s.promise, url: `/services/${s.slug}`, images: [OG_IMAGE] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const sp = SPECIALIST[s.slug];
  const per = s.billing === "month" ? "per month" : "one-time";

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.promise,
    serviceType: s.name,
    areaServed: "AE",
    provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
    offers: { "@type": "Offer", price: s.price, priceCurrency: "AED", description: per },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <ServiceHero s={s} />

      {/* the photo opens up as it arrives */}
      <div className="container-x pb-6">
        <ScrollOpen className="relative h-[340px] md:h-[clamp(320px,62vh,620px)]">
          <Image quality={90} src={s.image} alt={s.name} fill sizes="(min-width:1280px) 1240px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 grid gap-2.5 p-5 text-paper md:grid-cols-3 md:gap-4 md:p-6 md:gap-8 md:p-10">
            {s.bullets.map((b, i) => (
              <p key={b} className="border-t border-paper/30 pt-2.5 text-[14px] md:pt-4 md:text-[15px] leading-snug md:text-[17px]">
                <span className="mr-2 font-semibold text-lime">0{i + 1}</span>
                {b}
              </p>
            ))}
          </div>
        </ScrollOpen>
      </div>

      <div className="pt-8 md:pt-[clamp(3rem,8vh,6rem)]">
        <Problems s={s} />
      </div>
      <WhoFor s={s} />
      <Deliverables s={s} />
      <Rhythm s={s} />
      <Ninety s={s} />
      <Compare s={s} />
      <KpiBoard s={s} />
      <Pair s={s} />

      {/* enquire */}
      <Sweep from="bg-paper-2" to="bg-paper">
        <section id="enquire" className="scroll-mt-20 section-y">
          <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="flex flex-col">
              <p className="label">Get started</p>
              <SplitHeading className="display mt-4 text-section">{`Talk to us about ${midSentence(s.name)}.`}</SplitHeading>
              <p className="mt-5 max-w-md text-[18px] text-ink-2">Our {sp.role.toLowerCase()} replies within one business day with next steps.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={waLink(`Hi SME Market, I'm interested in ${s.name}.`)} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-[16px] font-semibold text-white transition hover:scale-[1.02]">
                  <WhatsAppIcon className="size-5" /> WhatsApp us
                </a>
                <a href={SITE.phoneHref} className="flex h-14 items-center justify-center gap-2.5 rounded-full border border-ink/30 px-6 text-[16px] font-semibold transition hover:bg-ink hover:text-paper">
                  <Phone className="size-4" /> {SITE.phone}
                </a>
              </div>
              <div className="relative mt-10 hidden flex-1 lg:block">
                <Character who={sp.who} mood={sp.mood} body={sp.body} size={300} className="absolute bottom-0 left-0" />
              </div>
            </div>
            <div className="rounded-[28px] bg-card p-6 shadow-[0_40px_80px_-60px_rgba(21,19,15,.6)] md:p-9">
              <EnquiryForm defaultServices={[s.slug]} meta={{ source: `service:${s.slug}` }} submitLabel="Send my enquiry" />
            </div>
          </div>
        </section>
      </Sweep>

      <div>
        <Faq tone="bg-paper-2" items={[...s.faq, ...SERVICE_EXTRA[s.slug].faq]} title={`${s.name}: common questions.`} greeting={`Hi! Ask us anything about ${midSentence(s.name)}. Tap a question below.`} />
      </div>

      {/* other services */}
      <section className="bg-paper pt-[clamp(4rem,10vh,6rem)] pb-[clamp(5rem,12vh,8rem)]">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <SplitHeading className="display text-[clamp(1.8rem,3.4vw,2.8rem)]">Works even better together.</SplitHeading>
            <Link href="/pricing" className="hidden shrink-0 items-center gap-2 text-[16px] font-medium underline-offset-4 hover:underline sm:inline-flex">
              Build your plan <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <Reveal className="mt-8">
            <Swipe bp="lg" itemWidth="72%" desktop="lg:grid lg:grid-cols-5 lg:gap-3">
              {others.map((o) => (
                <Link key={o.slug} data-reveal href={`/services/${o.slug}`} className="group block overflow-hidden rounded-2xl bg-card">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image quality={90} src={o.image} alt="" fill sizes="(min-width:1024px) 240px, 70vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                  </span>
                  <span className="flex items-center justify-between gap-3 p-4">
                    <span>
                      <span className="block text-[17px] font-semibold leading-tight">{o.name}</span>
                      <span className="block text-[14px] text-muted">{o.sub}</span>
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </Link>
              ))}
            </Swipe>
          </Reveal>
        </div>
      </section>
    </>
  );
}
