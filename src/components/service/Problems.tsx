"use client";
import { useRef } from "react";
import type { Service } from "@/lib/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import Character, { type Cast } from "@/components/ui/Character";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";

const OWNER: Cast[] = ["karim", "maya", "ben"];

/** Dark band that opens from a rounded inset as it arrives: the problems this service fixes, set large. */
export default function Problems({ s }: { s: Service }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        root.current,
        { clipPath: "inset(0% 4% 0% 4% round 56px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-ink section-y text-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[15px] font-medium text-lime">Sound familiar?</p>
          <SplitHeading className="display mt-4 text-section">The problems we fix first.</SplitHeading>
          <p className="mt-5 max-w-sm text-[18px] text-paper/65">If any of these sound like your week, you&apos;re in the right place.</p>
          <div className={`mt-10 hidden w-fit overflow-hidden rounded-[28px] text-ink lg:block ${VISUAL_TONE[s.slug]}`}>
            <Character who={OWNER[Number(s.num) % OWNER.length]} mood="stressed" body="Device" size={240} className="translate-y-3" />
          </div>
        </div>
        <Reveal className="divide-y divide-rule-dark border-y border-rule-dark" stagger={0.12}>
          {s.pain.map((p, i) => (
            <div key={p.title} data-reveal className="group grid gap-3 py-8 sm:grid-cols-[72px_1fr] md:py-10">
              <span className="text-[15px] font-semibold text-paper/40 transition-colors duration-500 group-hover:text-lime">0{i + 1}</span>
              <div>
                <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{p.title}</h3>
                <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-paper/65">{p.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
