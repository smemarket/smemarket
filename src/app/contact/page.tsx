import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Gauge, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { SITE, SERVICES, waLink, mailLink } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import EnquiryForm from "@/components/forms/EnquiryForm";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { Avatar } from "@/components/ui/Character";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import Faq from "@/components/home/Faq";
import { FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to the SME Market team. WhatsApp or call ${SITE.phone}, or email ${SITE.email}.`,
  alternates: { canonical: "/contact" },
};

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

const NEXT = [
  { t: "You send a message", d: "Here, on WhatsApp, by phone or email. Whatever's easiest for you." },
  { t: "Our team replies", d: "Within one business day, with a couple of questions about your business." },
  { t: "You get a free plan", d: "What to fix first and which services fit. No obligation to sign up." },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-paper pb-12 pt-24 md:pb-16 md:pt-36">
        <div className="container-x">
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="label">Contact</p>
              <SplitHeading as="h1" immediate className="display mt-4 text-[clamp(2.8rem,min(6.6vw,11vh),6.2rem)]">
                Talk to our team.
              </SplitHeading>
              <p className="mt-4 max-w-xl animate-[pageIn_.8s_cubic-bezier(.16,1,.3,1)_.3s_both] text-[18px] md:mt-5 md:text-[20px] leading-relaxed text-ink-2">
                Tell us about your business and what you need. We reply within one business day.
              </p>
            </div>
            {/* the team, one chat away */}
            <div className="animate-[pageIn_.8s_cubic-bezier(.16,1,.3,1)_.45s_both] lg:justify-self-end">
              <div className="flex -space-x-3">
                {SERVICES.map((s, i) => {
                  const sp = SPECIALIST[s.slug];
                  return (
                    <span key={s.slug} className="rounded-full ring-4 ring-paper transition-transform duration-500 ease-out-expo hover:-translate-y-1.5" style={{ zIndex: 10 - i }}>
                      <Avatar who={sp.who} mood={sp.mood} body={sp.body} size={58} tone={VISUAL_TONE[s.slug]} />
                    </span>
                  );
                })}
              </div>
              <p className="mt-3 text-[15px] text-muted">Your growth team, one message away.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:mt-14 md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
            <Reveal className="grid content-start gap-3 md:gap-4" stagger={0.08}>
              <a
                data-reveal
                href={waLink("Hi SME Market, I'd like to talk about growing my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[150px] flex-col justify-between gap-6 overflow-hidden rounded-[24px] bg-ink p-6 text-paper md:min-h-[220px] md:rounded-[28px] md:p-8"
              >
                <span className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#25D366] md:size-14 text-white transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105">
                    <WhatsAppIcon className="size-7" />
                  </span>
                  <ArrowUpRight className="size-6 text-paper/60 transition-transform duration-300 group-hover:rotate-45 group-hover:text-paper" />
                </span>
                <span>
                  <span className="block text-[15px] text-paper/60">WhatsApp · fastest reply</span>
                  <span className="mt-1 block text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">{SITE.phone}</span>
                </span>
              </a>

              <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                <a data-reveal href={SITE.phoneHref} className="group flex flex-col justify-between gap-5 rounded-[24px] bg-[#f6e3b5] p-5 text-ink md:gap-8 md:rounded-[28px] md:p-6">
                  <span className="flex items-start justify-between">
                    <Phone className="size-6" />
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <span>
                    <span className="block text-[14px] text-ink/60">Call us</span>
                    <span className="block text-[18px] font-semibold">{SITE.phone}</span>
                  </span>
                </a>
                <a data-reveal href={mailLink()} className="group flex min-w-0 flex-col justify-between gap-5 rounded-[24px] bg-[#dbe6ef] p-5 text-ink md:gap-8 md:rounded-[28px] md:p-6">
                  <span className="flex items-start justify-between">
                    <Mail className="size-6" />
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] text-ink/60">Email us</span>
                    <span className="block truncate text-[18px] font-semibold">{SITE.email}</span>
                  </span>
                </a>
              </div>

              <div data-reveal className="group relative hidden min-h-[220px] overflow-hidden rounded-[28px] sm:block">
                <Image quality={90} src="/images/dubai-day.jpg" alt="Dubai" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 flex items-start gap-3 p-6 text-[15px] leading-relaxed text-paper">
                  <MapPin className="mt-0.5 size-5 shrink-0" />
                  <span>
                    <span className="block font-semibold">{SITE.legal}</span>
                    {SITE.address} · Licence {SITE.licence}
                    <span className="block text-paper/70">Serving all seven emirates</span>
                  </span>
                </p>
              </div>
            </Reveal>

            <div className="min-w-0 animate-[pageIn_.9s_cubic-bezier(.16,1,.3,1)_.35s_both] lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[28px] bg-card p-6 shadow-[0_40px_80px_-60px_rgba(21,19,15,.6)] ring-1 ring-rule md:p-9">
                <p className="text-[15px] font-semibold text-muted">Send us a message</p>
                <p className="display mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)]">We&apos;ll take it from here.</p>
                <div className="mt-6">
                  <EnquiryForm type="contact" meta={{ source: "contact" }} />
                </div>
              </div>
              <Link href="/assessment" className="group mt-4 flex items-center gap-4 rounded-[28px] bg-lime p-5 text-ink transition hover:brightness-95 md:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-lime">
                  <Gauge className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold">Not ready to talk yet?</span>
                  <span className="block text-[15px] text-ink/70">Get your free growth score in 2 minutes instead.</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* coverage */}
      <section className="overflow-hidden bg-ink py-10 text-paper md:py-14">
        <p className="container-x mb-5 text-[15px] font-semibold text-lime">Serving all seven emirates</p>
        <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-4">
          {[...EMIRATES, ...EMIRATES, ...EMIRATES].map((e, i) => (
            <span key={i} className="shrink-0 whitespace-nowrap text-[clamp(2.2rem,5vw,4.4rem)] font-semibold tracking-tight">
              {e}
              <span className="mx-6 text-paper/20">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* what happens next */}
      <section className="bg-paper-2 section-y">
        <div className="container-x">
          <p className="label">After you send it</p>
          <SplitHeading className="display mt-4 text-section">What happens next.</SplitHeading>
          <Reveal className="relative mt-8 grid gap-3 md:mt-12 md:grid-cols-3 md:gap-4" stagger={0.12}>
            {NEXT.map((n, i) => (
              <div key={n.t} data-reveal className="relative flex gap-4 rounded-[24px] bg-card p-6 md:block md:rounded-[28px] md:p-8">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[16px] font-semibold text-lime md:size-11">{i + 1}</span>
                <div>
                  <h3 className="mt-1.5 text-[20px] font-semibold md:mt-8 md:text-[22px]">{n.t}</h3>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2 md:mt-2">{n.d}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Faq items={FAQ} title="Before you message us." greeting="Hi! Most people ask one of these first. Tap any question." />
    </>
  );
}
