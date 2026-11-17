"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setCovered } from "@/lib/reveal";
import { getLenis } from "./SmoothScroll";
import { stripBase } from "@/lib/image-loader";
import clsx from "clsx";
import { Check, Sparkles } from "lucide-react";
import Character from "@/components/ui/Character";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/*
 * One overlay, three jobs:
 *  1. First visit (or reload) on the home page: a short intro on ink, then the ink lifts off the hero.
 *  2. Moving between pages: the current page sinks back like a sheet being set down, a fresh paper sheet
 *     slides up over it, and the next page settles onto that sheet.
 *  3. Links to a section on the page you're already on: a smooth scroll, no overlay.
 */

const EASE = "expo.inOut";

/** Smoothly scrolls to an element id (or the top), clearing the fixed header. */
function glideTo(hash: string, immediate = false) {
  const el = hash ? document.getElementById(hash) : null;
  const lenis = getLenis();
  if (lenis)
    lenis.scrollTo(el ?? 0, { offset: el ? -80 : 0, duration: 1.3, immediate });
  else if (el) el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  // the intro only plays on a fresh load of the home page; decided on the server so there's no flash
  const [intro] = useState(() => pathname === "/");
  // 0: the AI agent is drafting · 1: our team has checked it
  const [step, setStep] = useState(0);

  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const arrived = useRef<(() => void) | null>(null);

  // resolve a pending page change once the new route has rendered
  useEffect(() => {
    if (!arrived.current) return;
    const done = arrived.current;
    arrived.current = null;
    requestAnimationFrame(() => requestAnimationFrame(done));
  }, [pathname]);

  /* ── 1. the home intro ── */
  useLayoutEffect(() => {
    const el = root.current!;
    el.classList.remove("intro-failsafe");
    if (!intro) {
      setCovered(false);
      return;
    }
    setCovered(true);
    window.scrollTo(0, 0);
    // smooth scroll starts up a beat later; hold the page still under the intro
    const hold = requestAnimationFrame(() => getLenis()?.stop());
    const finish = () => {
      getLenis()?.start();
      el.dataset.mode = "";
      el.style.visibility = "hidden";
    };

    if (prefersReducedMotion()) {
      cancelAnimationFrame(hold);
      const t = gsap.to("[data-intro]", {
        opacity: 0,
        duration: 0.4,
        delay: 0.3,
        onStart: () => setCovered(false),
        onComplete: finish,
      });
      return () => {
        t.kill();
      };
    }

    // two beats, each held long enough to read
    const tl = gsap.timeline();
    tl.from(
      "[data-intro-logo]",
      { opacity: 0, y: 12, duration: 0.7, ease: "power3.out" },
      0,
    )
      .from(
        "[data-intro-l1]",
        { yPercent: 110, duration: 0.8, ease: "expo.out" },
        0.1,
      )
      .from(
        "[data-intro-card]",
        { y: 30, opacity: 0, duration: 0.8, ease: "expo.out" },
        0.2,
      )
      .fromTo(
        "[data-intro-bar]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power1.inOut" },
        0.35,
      )
      .add(() => setStep(1), 1.15)
      .from(
        "[data-intro-l2]",
        { yPercent: 110, duration: 0.8, ease: "expo.out" },
        1.15,
      )
      .fromTo(
        "[data-intro-peep]",
        { yPercent: 100 },
        { yPercent: 0, duration: 0.8, ease: "expo.out" },
        1.1,
      )
      .to(
        "[data-intro-ui]",
        { yPercent: -6, opacity: 0, duration: 0.45, ease: "power3.in" },
        2.15,
      )
      .to(
        "[data-intro]",
        {
          yPercent: -100,
          borderBottomLeftRadius: "48px",
          borderBottomRightRadius: "48px",
          duration: 0.85,
          ease: EASE,
        },
        2.3,
      )
      .add(() => setCovered(false), 2.45)
      .add(finish);
    return () => {
      cancelAnimationFrame(hold);
      tl.kill();
    };
  }, [intro]);

  /* ── 2 & 3. link clicks ── */
  useEffect(() => {
    const el = root.current!;
    const reduced = () => prefersReducedMotion();

    const cover = () =>
      new Promise<void>((resolve) => {
        el.dataset.mode = "sheet";
        el.style.visibility = "visible";
        setCovered(true);
        const main = document.getElementById("main");
        const header = document.querySelector("header");
        if (reduced() || !main) {
          gsap.fromTo(
            "[data-sheet]",
            { y: 0, yPercent: 0, opacity: 0 },
            { opacity: 1, duration: 0.25, onComplete: resolve },
          );
          return;
        }
        document.body.classList.add("is-transitioning");
        gsap.set("[data-sheet]", {
          y: 0,
          yPercent: 100,
          opacity: 1,
          borderTopLeftRadius: "48px",
          borderTopRightRadius: "48px",
        });
        gsap
          .timeline({ onComplete: resolve })
          // the page you're leaving sinks back
          .to(
            main,
            {
              scale: 0.92,
              y: -24,
              borderRadius: "32px",
              transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
              duration: 0.8,
              ease: EASE,
            },
            0,
          )
          .to(
            header,
            { opacity: 0, y: -12, duration: 0.4, ease: "power2.in" },
            0,
          )
          .to("[data-dim]", { opacity: 1, duration: 0.8, ease: EASE }, 0)
          // a fresh sheet slides over it
          .to(
            "[data-sheet]",
            {
              yPercent: 0,
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              duration: 0.85,
              ease: EASE,
            },
            0.12,
          );
      });

    const uncover = () =>
      new Promise<void>((resolve) => {
        const main = document.getElementById("main");
        const header = document.querySelector("header");
        gsap.set([main, header], {
          clearProps: "transform,borderRadius,transformOrigin,opacity",
        });
        gsap.set("[data-dim]", { opacity: 0 });
        document.body.classList.remove("is-transitioning");
        setCovered(false);
        ScrollTrigger.refresh();
        // the new page settles onto the sheet
        gsap.fromTo(
          main,
          { y: 28 },
          { y: 0, duration: 0.9, ease: "expo.out", clearProps: "transform" },
        );
        gsap.fromTo(
          header,
          { opacity: 0, y: -12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
        );
        gsap.to("[data-sheet]", {
          opacity: 0,
          duration: reduced() ? 0.25 : 0.55,
          ease: "power2.out",
          onComplete: () => {
            el.style.visibility = "hidden";
            el.dataset.mode = "";
            busy.current = false;
            resolve();
          },
        });
      });

    const go = async (url: URL) => {
      busy.current = true;
      window.dispatchEvent(new Event("smem:navigate"));
      const path = stripBase(url.pathname);
      router.prefetch(path);
      await cover();
      const landed = new Promise<void>((r) => (arrived.current = r));
      router.push(path + url.search + url.hash, { scroll: false });
      // never hang on the sheet: settle after 4s even if the route is slow
      await Promise.race([landed, new Promise((r) => setTimeout(r, 4000))]);
      glideTo(url.hash.slice(1), true);
      await new Promise((r) => setTimeout(r, 100));
      await uncover();
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (
        !a ||
        !a.href ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.dataset.noTransition !== undefined
      )
        return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      if (busy.current) return;

      if (url.pathname === location.pathname) {
        // same page: close any open menus, then glide to the section (or the top)
        window.dispatchEvent(new Event("smem:navigate"));
        requestAnimationFrame(() =>
          requestAnimationFrame(() => glideTo(url.hash.slice(1))),
        );
        return;
      }
      go(url);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={root}
      aria-hidden
      data-mode={intro ? "intro" : ""}
      className="intro-failsafe group pointer-events-auto fixed inset-0 z-[200]"
      style={{ visibility: intro ? "visible" : "hidden" }}
    >
      {/* page change: dim behind, paper sheet in front */}
      <div
        data-dim
        className="absolute inset-0 hidden bg-ink/40 opacity-0 group-data-[mode=sheet]:block"
      />
      <div
        data-sheet
        className="absolute inset-0 hidden bg-paper shadow-[0_-30px_80px_-20px_rgba(21,19,15,.45)] group-data-[mode=sheet]:block"
      />

      {/* intro */}
      <div
        data-intro
        className="absolute inset-0 hidden overflow-hidden bg-ink text-paper group-data-[mode=intro]:block"
      >
        <div
          data-intro-ui
          className="flex h-full flex-col justify-between p-6 md:p-10"
        >
          <Image
            data-intro-logo
            src="/brand/logo-on-dark.png"
            alt=""
            width={160}
            height={40}
            priority
            className="h-7 w-auto self-start md:h-8"
          />
          <div className="flex flex-col items-center">
            <h2 className="display text-center text-[clamp(2.2rem,5.4vw,5rem)] leading-[1.05]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-intro-l1 className="block">
                  AI does the work.
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-intro-l2 className="block text-lime">
                  Our team checks it.
                </span>
              </span>
            </h2>

            {/* one task: drafted by an AI agent, approved by our team */}
            <div className="mt-8 flex items-end gap-3 md:mt-12 md:gap-4">
              <div
                data-intro-card
                className={clsx(
                  "relative h-[150px] w-[120px] overflow-hidden rounded-2xl text-ink md:h-[200px] md:w-[160px]",
                  VISUAL_TONE["enquiry-desk"],
                )}
              >
                <div data-intro-peep className="absolute inset-x-0 bottom-0">
                  <Character
                    who="leo"
                    mood="calm"
                    body="Coffee"
                    size={180}
                    style={{
                      width: "118%",
                      height: "auto",
                      aspectRatio: "1",
                      marginLeft: "-9%",
                    }}
                    className="translate-y-[6%]"
                  />
                </div>
              </div>
              <div
                data-intro-card
                className="w-[min(320px,58vw)] rounded-2xl bg-card p-4 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] md:p-5"
              >
                <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink/55">
                  {step === 0 ? (
                    <Sparkles className="size-3.5" />
                  ) : (
                    <Check className="size-3.5 text-ink" />
                  )}
                  <span key={step} className="animate-[fadeIn_.35s_ease]">
                    {step === 0 ? "AI agent drafting" : "Approved by our team"}
                  </span>
                </p>
                <p className="mt-2 flex items-start gap-2 text-[15px] font-medium leading-snug md:text-[16px]">
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-ink/60" />
                  Reply to Fatima: &ldquo;Yes, we have 3pm on Saturday.&rdquo;
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
                  <div
                    data-intro-bar
                    className="h-full origin-left rounded-full bg-ink"
                  />
                </div>
              </div>
            </div>
          </div>
          <p
            data-intro-line
            className="flex justify-between gap-4 border-t border-paper/15 pt-4 text-[14px] text-paper/55"
          >
            <span>AI agents for UAE businesses, checked by our team</span>
            <span className="hidden sm:block">SME Market</span>
          </p>
        </div>
      </div>
    </div>
  );
}
