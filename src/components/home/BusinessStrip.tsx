"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const ITEMS = [
  { img: "/images/clinic.jpg", label: "Clinics" },
  { img: "/images/salon.jpg", label: "Salons" },
  { img: "/images/cafe.jpg", label: "Cafés & restaurants" },
  { img: "/images/owner.jpg", label: "Retail shops" },
  { img: "/images/caller.jpg", label: "Trading & B2B" },
  { img: "/images/dubai-day.jpg", label: "Real estate" },
  { img: "/images/team.jpg", label: "Professional services" },
];

export default function BusinessStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;
      const el = track.current;
      // endless drift, sped up and skewed by scroll velocity
      const loop = gsap.to(el, { xPercent: -50, ease: "none", duration: 45, repeat: -1 });
      const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          skewTo(gsap.utils.clamp(-8, 8, v / -300));
          loop.timeScale(1 + Math.min(4, Math.abs(v) / 400));
          gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true, delay: 0.1 });
        },
      });
    },
    { scope: root },
  );

  const row = [...ITEMS, ...ITEMS];
  return (
    <section ref={root} className="overflow-hidden bg-paper section-y">
      <div className="container-x flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="display max-w-xl text-[clamp(2rem,4vw,3.4rem)]">Built for businesses like yours.</h2>
        <p className="text-[17px] text-muted">Across all seven emirates.</p>
      </div>
      <div className="mt-12">
        <div ref={track} className="flex w-max gap-5 will-change-transform">
          {row.map((it, i) => (
            <figure key={i} className="group relative h-[clamp(260px,46vh,420px)] w-[clamp(220px,24vw,330px)] shrink-0 overflow-hidden rounded-2xl">
              <Image quality={90} src={it.img} alt={it.label} fill sizes="330px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 text-[20px] font-semibold text-paper">{it.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
