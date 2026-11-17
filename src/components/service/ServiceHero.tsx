"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, BarChart3, Check, Sparkles, UserCheck } from "lucide-react";
import type { Service } from "@/lib/site";
import { waLink } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { SplitHeading } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Character from "@/components/ui/Character";
import ServiceVisual, { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import { AddToPlan } from "@/components/plan/Plan";

/** Service page opener: the pitch on the left, the specialist who owns it on the right. */
export default function ServiceHero({ s }: { s: Service }) {
  const root = useRef<HTMLElement>(null);
  const sp = SPECIALIST[s.slug];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-h-fade]", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.2)
        .fromTo("[data-h-panel]", { clipPath: "inset(100% 0% 0% 0% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.2, ease: "expo.inOut" }, 0)
        .from("[data-h-peep]", { yPercent: 40, duration: 1.3, ease: "expo.out" }, 0.55)
        .from("[data-h-card]", { y: 40, opacity: 0, scale: 0.94, duration: 1, ease: "expo.out" }, 0.7)
        .from("[data-h-chip]", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.12 }, 0.95);
      const cancel = onReveal(() => tl.play());
      // the card floats gently, the panel drifts as you scroll away
      gsap.to("[data-h-card]", { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
      gsap.to("[data-h-panel]", { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      return () => cancel();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-paper pb-14 pt-28 md:pt-36 lg:pb-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Link data-h-fade href="/#services" className="inline-flex items-center gap-2 text-[15px] font-medium text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> All services
          </Link>
          <p data-h-fade className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-rule bg-card px-3.5 py-1.5 text-[14px] font-medium">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-lime">{s.num}</span>
            {s.sub}
          </p>
          <SplitHeading as="h1" immediate className="display mt-5 text-[clamp(2.8rem,min(6.4vw,11vh),6rem)]">
            {s.name}
          </SplitHeading>
          <p data-h-fade className="mt-5 max-w-xl text-[20px] leading-relaxed text-ink-2">
            {s.promise}
          </p>
          <div data-h-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AddToPlan slug={s.slug} size="lg" />
            <Button href={waLink(`Hi SME Market, I'm interested in ${s.name}.`)} size="lg" variant="outline" icon={<WhatsAppIcon />}>
              Ask on WhatsApp
            </Button>
          </div>
          <ul data-h-fade className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-2">
            <li className="flex items-center gap-2">
              <BarChart3 className="size-4" /> We report: <span className="font-semibold text-ink">{s.kpi}</span>
            </li>
            <li className="flex items-center gap-2">
              <UserCheck className="size-4" /> Every move approved by our team
            </li>
          </ul>
        </div>

        <div data-h-panel className={`relative h-[min(560px,70vh)] min-h-[420px] overflow-hidden rounded-[32px] text-ink lg:h-[min(640px,74vh)] ${VISUAL_TONE[s.slug]}`}>
          <div data-h-card className="absolute left-1/2 top-[8%] w-[300px] -translate-x-1/2 sm:left-[9%] sm:translate-x-0">
            <div className="origin-top-left scale-[1.05] sm:scale-125 lg:scale-[1.4]">
              <ServiceVisual slug={s.slug} />
            </div>
          </div>
          <div data-h-peep className="absolute -bottom-3 -right-6 sm:right-0">
            <Character who={sp.who} mood={sp.mood} body={sp.body} size={330} className="h-[260px] w-[260px] sm:h-[330px] sm:w-[330px]" />
          </div>
          <div data-h-chip className="absolute bottom-[22%] left-5 hidden w-[230px] rounded-2xl bg-card p-4 shadow-[0_18px_40px_-22px_rgba(21,19,15,.55)] sm:block">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink/50">
              <Sparkles className="size-3.5" /> AI agent
            </p>
            <p className="mt-1 text-[14px] font-medium leading-snug">{s.rhythm[1]?.agents ?? s.rhythm[0].agents}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold">
              <Check className="size-3.5" strokeWidth={3} /> Approved by our team
            </p>
          </div>
          <div data-h-chip className="absolute right-5 top-5 hidden rounded-2xl bg-ink px-4 py-3 text-paper shadow-[0_18px_40px_-22px_rgba(21,19,15,.6)] sm:block">
            <p className="text-[12px] text-paper/55">We report</p>
            <p className="text-[15px] font-semibold">{s.kpi}</p>
          </div>
          <p data-h-chip className="absolute bottom-5 left-5 rounded-full bg-card px-4 py-2 text-[14px] font-semibold shadow-[0_14px_30px_-18px_rgba(21,19,15,.5)]">
            Your {sp.role.toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}
