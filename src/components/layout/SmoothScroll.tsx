"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4, immediate });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  return true;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // wait for layout, then jump to the anchor
      const t = setTimeout(() => scrollToId(hash, true), 60);
      return () => clearTimeout(t);
    }
    lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}
