"use client";
import { useRef } from "react";
import { onReveal } from "@/lib/reveal";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";

type Tagish = "div" | "section" | "h1" | "h2" | "h3" | "p" | "span" | "ul";
type Poly = React.FC<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;

/**
 * Fades/slides children marked with [data-reveal] in the moment the group enters the screen.
 * Uses IntersectionObserver (not scroll positions), so it never fires late after layout shifts.
 */
export function Reveal({ children, className, as = "div", stagger = 0.08, start }: { children: React.ReactNode; className?: string; as?: Tagish; stagger?: number; start?: string }) {
  const Tag = as as unknown as Poly;
  const ref = useRef<HTMLElement>(null);
  const margin = start === "top bottom" ? "0px 0px 0px 0px" : "0px 0px -6% 0px";
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const items = el.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      // already on screen at load: leave it visible
      if (el.getBoundingClientRect().top < window.innerHeight * 0.94) return;
      gsap.set(items, { y: 30, opacity: 0, transition: "none" });
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap.to(items, { y: 0, opacity: 1, duration: 0.75, ease: "expo.out", stagger, clearProps: "transform,opacity,transition" });
        },
        { rootMargin: margin },
      );
      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Headline that reveals line by line, words rising from a mask. */
export function SplitHeading({ children, className, as = "h2", delay = 0, immediate = false }: { children: React.ReactNode; className?: string; as?: Tagish; delay?: number; immediate?: boolean }) {
  const Tag = as as unknown as Poly;
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const split = SplitText.create(ref.current, { type: "lines,words", mask: "lines", linesClass: "pt-[0.06em] pb-[0.16em] -mb-[0.16em]" });
      const tween = gsap.from(split.words, {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.04,
        delay,
        paused: immediate,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 86%", once: true },
      });
      // page-top headlines wait for the loader or page transition to lift
      const cancel = immediate ? onReveal(() => tween.play()) : () => {};
      return () => {
        cancel();
        split.revert();
      };
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Small section eyebrow above a heading. */
export function Label({ children, className = "" }: { no?: string; children: React.ReactNode; className?: string }) {
  return <p className={`label ${className}`}>{children}</p>;
}
