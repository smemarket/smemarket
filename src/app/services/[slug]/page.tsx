import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bot, UserCheck, Check } from "lucide-react";
import { SERVICES, SITE, getService, waLink } from "@/lib/site";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { AddToPlan } from "@/components/plan/Plan";
import Faq from "@/components/home/Faq";

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
    openGraph: { title: `${s.name} | SME Market`, description: s.promise },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
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

      {/* Hero */}
      <section className="bg-paper pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <Link href="/#services" className="inline-flex items-center gap-2 text-[15px] font-medium text-muted hover:text-ink">
              <ArrowLeft className="size-4" /> All services
            </Link>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-ink text-paper">
                <Icon name={s.icon} className="size-5" />
              </span>
              <span className="label">{s.sub}</span>
            </div>
            <h1 className="display mt-6 text-[clamp(2.4rem,min(4.8vw,8.5vh),4.6rem)]">{s.name}</h1>
            <p className="mt-5 max-w-xl text-[21px] leading-relaxed text-ink-2">{s.promise}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <AddToPlan slug={s.slug} size="lg" />
              <Button href={waLink(`Hi SME Market, I'm interested in ${s.name}.`)} size="lg" variant="outline" icon={<WhatsAppIcon />}>
                Ask on WhatsApp
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-card p-3 lg:mt-14">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image quality={90} src={s.image} alt={s.name} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-[15px] font-semibold">What&apos;s included</p>
              <ul className="mt-4 space-y-3">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[16px] leading-snug text-ink-2">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime">
                      <Check className="size-3 text-ink" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 rounded-xl bg-ink p-5 text-paper">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-lime">KPI we report</p>
              <p className="mt-1 text-[17px] font-medium">{s.kpi}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-x">
          <SectionHead eyebrow="The problem" title="Why this matters for your business." />
          <Reveal className="mt-12 grid gap-5 md:grid-cols-3">
            {s.pain.map((p) => (
              <div key={p.title} data-reveal className="rounded-2xl bg-card p-7">
                <h3 className="text-[21px] font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-ink-2">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x">
          <SectionHead eyebrow="What you get" title="Done for you, every month." />
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.deliverables.map((d, i) => (
              <div key={d.title} data-reveal className="rounded-2xl border border-rule bg-card p-7">
                <span className="grid size-9 place-items-center rounded-full bg-ink text-[15px] font-semibold text-paper">{i + 1}</span>
                <h3 className="mt-5 text-[20px] font-semibold">{d.title}</h3>
                <p className="mt-2 text-[16px] text-ink-2">{d.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Who does what */}
      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Who does what" title="Our agents do the work. Our team checks it." />
          <div className="mt-12 overflow-hidden rounded-2xl bg-card">
            <div className="hidden grid-cols-[160px_1fr_1fr] gap-6 border-b border-rule px-7 py-4 text-[15px] font-semibold md:grid">
              <span>When</span>
              <span className="flex items-center gap-2">
                <Bot className="size-4" /> AI agents
              </span>
              <span className="flex items-center gap-2">
                <UserCheck className="size-4" /> Our team
              </span>
            </div>
            {s.rhythm.map((r) => (
              <div key={r.when} className="grid gap-2 border-b border-rule px-7 py-6 last:border-0 md:grid-cols-[160px_1fr_1fr] md:gap-6">
                <span className="text-[17px] font-semibold">{r.when}</span>
                <p className="text-ink-2">
                  <span className="font-medium text-ink md:hidden">Agents: </span>
                  {r.agents}
                </p>
                <p className="text-ink-2">
                  <span className="font-medium text-ink md:hidden">Team: </span>
                  {r.team}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquire */}
      <section id="enquire" className="scroll-mt-20 bg-paper py-24 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="Get started" title={`Talk to us about ${s.name.toLowerCase()}.`} intro={`Our team replies within one business day with next steps. Prefer to talk now? Call ${SITE.phone}.`} />
            {s.billing === "month" && (
              <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-paper-2 px-5 py-4 text-[16px] font-medium hover:bg-rule">
                Or bundle all five monthly services and save every month <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
          <div className="rounded-2xl border border-rule bg-card p-6 md:p-9">
            <EnquiryForm defaultServices={[s.slug]} meta={{ source: `service:${s.slug}` }} submitLabel={`Enquire about ${s.short}`} />
          </div>
        </div>
      </section>

      <Faq items={s.faq} title={`${s.name}: common questions.`} />

      {/* Related */}
      <section className="bg-paper pt-24">
        <div className="container-x">
          <p className="label">Other services</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="group flex flex-col justify-between gap-6 rounded-2xl border border-rule bg-card p-5 transition hover:border-ink">
                <span className="flex items-center justify-between">
                  <Icon name={o.icon} className="size-5" />
                  <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold">{o.name}</span>
                  <span className="block text-[15px] text-muted">{o.sub}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
