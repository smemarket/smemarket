"use client";
import { useRef } from "react";
import clsx from "clsx";
import type { Service } from "@/lib/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitHeading } from "@/components/ui/Reveal";

const TONES = ["bg-[#e9f1c9]", "bg-[#f6dcd2]", "bg-[#dbe6ef]", "bg-[#f6e3b5]", "bg-[#d5ece4]", "bg-[#e3dcf2]"];

/** "What you get": cards that pin and stack on top of each other as you scroll, the ones behind easing back. */
export default function Deliverables({ s }: { s: Service }) {
  const root = useRef<HTMLElement>(null);
  const monthly = s.billing === "month";

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card.firstElementChild, { scale: 1, filter: "brightness(1)" }, {
          scale: 0.92,
          filter: "brightness(0.85)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 85%", end: "top 25%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper section-y">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="label">What you get</p>
          <SplitHeading className="display mt-4 text-section">{monthly ? "Done for you, every month." : "Done for you, start to finish."}</SplitHeading>
          <p className="mt-5 max-w-md text-[18px] text-ink-2">Our agents do the heavy lifting. Our team checks every piece before it reaches your customers.</p>
          <ul className="mt-8 hidden space-y-2 lg:block">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[16px] text-ink-2">
                <span className="mt-2 h-px w-4 shrink-0 bg-ink/40" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {s.deliverables.map((d, i) => (
            <div key={d.title} data-stack className="sticky" style={{ top: `calc(110px + ${i * 18}px)` }}>
              <article className={clsx("relative flex min-h-[260px] origin-top flex-col justify-between overflow-hidden rounded-[28px] p-7 shadow-[0_-12px_40px_-24px_rgba(21,19,15,.35)] md:min-h-[300px] md:p-10", TONES[i % TONES.length])}>
                <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[clamp(7rem,14vw,11rem)] font-semibold leading-none tracking-tighter text-ink/[0.07]">0{i + 1}</span>
                <p className="relative text-[14px] font-semibold uppercase tracking-wide text-ink/55">
                  {String(i + 1).padStart(2, "0")} / {String(s.deliverables.length).padStart(2, "0")}
                </p>
                <div className="relative mt-10">
                  <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight">{d.title}</h3>
                  <p className="mt-3 max-w-lg text-[18px] leading-relaxed text-ink-2">{d.body}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
