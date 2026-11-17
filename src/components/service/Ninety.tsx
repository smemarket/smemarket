"use client";
import { useRef } from "react";
import type { Service } from "@/lib/site";
import { SERVICE_EXTRA } from "@/lib/service-extra";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";

/** The first 90 days (or weeks, for the website): a line draws across as you scroll, each stop lighting up. Ends in a channel marquee. */
export default function Ninety({ s }: { s: Service }) {
  const x = SERVICE_EXTRA[s.slug];
  const root = useRef<HTMLElement>(null);
  const once = s.billing === "once";

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 80%", end: "bottom 55%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((el) => {
        gsap.fromTo(el, { backgroundColor: "#e8e2d5", color: "#15130f" }, { backgroundColor: "#d4ff3f", ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "top 60%", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-paper section-y">
      <div className="container-x">
        <p className="label">{once ? "The project" : "Your first 90 days"}</p>
        <SplitHeading className="display mt-4 max-w-3xl text-section">{once ? "Four weeks from first call to launch." : "What happens in your first three months."}</SplitHeading>

        <div data-steps className="relative mt-14">
          <div className="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-rule md:block">
            <div data-line className="h-full origin-left bg-ink" />
          </div>
          <Reveal className="grid gap-8 md:grid-cols-3 md:gap-6" stagger={0.12}>
            {x.ninety.map((n) => (
              <div key={n.m} data-reveal className="relative">
                <span data-stop className="relative z-10 inline-flex h-11 items-center rounded-full bg-paper-2 px-5 text-[15px] font-semibold">
                  {n.m}
                </span>
                <h3 className="mt-6 text-[clamp(1.4rem,2.2vw,1.8rem)] font-semibold tracking-tight">{n.t}</h3>
                <p className="mt-2 max-w-sm text-[17px] leading-relaxed text-ink-2">{n.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* channels */}
      <div className="mt-[clamp(4rem,10vh,7rem)] border-y border-rule py-6">
        <p className="container-x mb-4 text-[15px] font-semibold text-muted">{once ? "Built in" : "Where we work for you"}</p>
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {[...x.channels, ...x.channels, ...x.channels, ...x.channels].map((c, i) => (
            <span key={i} className="shrink-0 whitespace-nowrap text-[clamp(2rem,4.4vw,3.8rem)] font-semibold tracking-tight">
              {c}
              <span className="mx-6 text-ink/20">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
