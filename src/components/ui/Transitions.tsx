"use client";
import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Scroll-driven section seams. One family (shapes that morph and open with scroll),
 * a different move at every seam so nothing repeats.
 */

/** A dome that rises above a section and flattens as it scrolls into place. */
export function DomeTop({ fill = "fill-paper-2" }: { fill?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "path",
        { attr: { d: "M0,100 Q50,0 100,100 Z" } },
        { attr: { d: "M0,100 Q50,100 100,100 Z" }, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 35%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full h-[9vw] min-h-14">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full">
        <path className={fill} d="M0,100 Q50,100 100,100 Z" />
      </svg>
    </div>
  );
}

/** Liquid wave hanging below a dark section; it travels sideways as you scroll. */
export function WaveBottom({ fill = "fill-ink" }: { fill?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("g", { x: 0 }, { x: -100, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: ref },
  );
  // two periods of a smooth wave, 100 units each, so shifting by 100 loops seamlessly
  const d = "M0,0 V45 C12.5,95 37.5,95 50,45 C62.5,-5 87.5,-5 100,45 C112.5,95 137.5,95 150,45 C162.5,-5 187.5,-5 200,45 V0 Z";
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-full z-10 h-[6vw] min-h-10 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full">
        <g>
          <path className={fill} d={d} />
        </g>
      </svg>
    </div>
  );
}

/** Wraps a card so it zooms up into place, or opens like a letterbox. */
export function ScrollOpen({ children, variant = "zoom", className }: { children: React.ReactNode; variant?: "zoom" | "letterbox"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const st = { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: true };
      if (variant === "zoom") {
        gsap.fromTo(ref.current, { scale: 0.82, borderRadius: 80 }, { scale: 1, borderRadius: 24, ease: "none", scrollTrigger: st });
      } else {
        gsap.fromTo(ref.current, { clipPath: "inset(38% 6% 38% 6% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: st });
      }
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={clsx("overflow-hidden rounded-3xl will-change-transform", className)}>
      {children}
    </div>
  );
}

/** The dark section above hangs down in a soft curve that draws back up as you scroll. */
export function Drape({ fill = "fill-ink" }: { fill?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "path",
        { attr: { d: "M0,0 H100 V0 Q50,100 0,0 Z" } },
        { attr: { d: "M0,0 H100 V0 Q50,0 0,0 Z" }, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 20%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-20 h-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 top-0 block h-[min(7vw,76px)] w-full">
        <path className={fill} d="M0,0 H100 V0 Q50,100 0,0 Z" />
      </svg>
    </div>
  );
}

/** Wraps a section so its top edge arrives on a slant and levels out. */
export function Slant({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { clipPath: "polygon(0% 14vw, 100% 0%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 0vw, 100% 0%, 100% 100%, 0% 100%)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}

/** Wraps a section so it arrives as an inset, round-topped panel that widens to full bleed. */
export function Widen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(0% 7% 0% 7% round 56px 56px 0px 0px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}

/** The background quietly tints from the previous section's colour into this one's as you scroll. */
export function Sweep({ children, from = "bg-paper", to = "bg-paper-2" }: { children: React.ReactNode; from?: string; to?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-sweep]",
        { opacity: 0 },
        { opacity: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 30%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={clsx("relative", from)}>
      <div data-sweep aria-hidden className={clsx("absolute inset-0", to)} />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Wraps a section so it tips up from a backward tilt to flat, like a page laid down. */
export function Fold({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { rotateX: 14, scale: 0.94, opacity: 0.4, transformOrigin: "50% 0%" },
        { rotateX: 0, scale: 1, opacity: 1, ease: "none", clearProps: "transform", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 40%", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div className="overflow-x-clip" style={{ perspective: "1400px" }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}
