"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, UserCheck, Sparkles, ArrowUpRight, Check, Megaphone, Star, FileText, Mail, Bot, BarChart3, CalendarCheck } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/lib/site";

/** Agent activity the floaters cycle through. */
const CHIPS = [
  { icon: <WhatsAppIcon className="size-4" />, t: "New enquiry answered", s: "in 9 seconds" },
  { icon: <Search className="size-4" />, t: "Now #3 on Google Maps", s: "“dentist in JLT”" },
  { icon: <UserCheck className="size-4" />, t: "Approved by your team", s: "4 Instagram posts" },
  { icon: <TrendingUp className="size-4" />, t: "+18 enquiries", s: "this month" },
  { icon: <Megaphone className="size-4" />, t: "Ad budget rebalanced", s: "moved to the best campaign" },
  { icon: <Star className="size-4" />, t: "Review reply drafted", s: "for a new 5★ Google review" },
  { icon: <FileText className="size-4" />, t: "Blog post published", s: "“best gym in Al Barsha”" },
  { icon: <Mail className="size-4" />, t: "Outreach sent", s: "12 personal emails to clinics" },
  { icon: <Bot className="size-4" />, t: "Mentioned by ChatGPT", s: "“top salons in Dubai”" },
  { icon: <BarChart3 className="size-4" />, t: "Weekly report ready", s: "sent to your WhatsApp" },
  { icon: <CalendarCheck className="size-4" />, t: "Booking confirmed", s: "Thursday, 4:30 pm" },
];

/** Four floater slots near the edges; each new floater lands at one of its slot's spots. */
const SLOTS = [
  { depth: 28, spots: ["left-[2.5%] top-[22%]", "left-[4%] top-[15%]", "left-[1.5%] top-[31%]"] },
  { depth: 16, spots: ["right-[2.5%] top-[26%]", "right-[4%] top-[17%]", "right-[1.5%] top-[35%]"] },
  { depth: 36, spots: ["left-[3.5%] top-[62%]", "left-[1.5%] top-[71%]", "left-[4%] top-[53%]"] },
  { depth: 22, spots: ["right-[3.5%] top-[66%]", "right-[1.5%] top-[56%]", "right-[4%] top-[75%]"] },
];

type Slot = { msg: number; spot: number; out: boolean; n: number };
const OUT_MS = 550;

/** Each slot swaps its floater on its own clock, so something is always changing somewhere. */
function useChipCycle() {
  const [slots, setSlots] = useState<Slot[]>(() => SLOTS.map((_, i) => ({ msg: i, spot: 0, out: false, n: 0 })));
  const live = useRef(slots);
  live.current = slots;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

    const swap = (s: number) => {
      setSlots((p) => p.map((x, i) => (i === s ? { ...x, out: true } : x)));
      later(() => {
        const cur = live.current;
        const used = new Set(cur.map((x) => x.msg));
        const msg = pick(CHIPS.map((_, k) => k).filter((k) => !used.has(k)));
        const spot = pick(SLOTS[s].spots.map((_, k) => k).filter((k) => k !== cur[s].spot));
        setSlots((p) => p.map((x, i) => (i === s ? { msg, spot, out: false, n: x.n + 1 } : x)));
        later(() => swap(s), 4200 + Math.random() * 3800);
      }, OUT_MS);
    };
    // first swaps start after the intro, staggered so no two slots change together
    [4200, 6300, 7900, 9800].forEach((d, s) => later(() => swap(s), d));
    return () => timers.forEach((id) => clearTimeout(id));
  }, []);

  return slots;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);
  const slots = useChipCycle();

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1800);
      setCount(Math.round(6 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      let cancel = () => {};
      if (!reduced) {
        // set the start state now, play once the loader or page wipe lifts
        const intro = gsap.timeline({ paused: true });
        intro
          .from("[data-line]", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.15)
          .from("[data-fade]", { y: 18, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.6)
          .from("[data-chip]", { y: 40, opacity: 0, scale: 0.9, duration: 1, ease: "back.out(1.6)", stagger: 0.18 }, 1);
        cancel = onReveal(() => intro.play());
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: -10, duration: 2.4 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
      }

      // Not scrubbed: the first small scroll plays the whole change, scrolling back to the top reverses it.
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
      tl.to("[data-frame]", { clipPath: "inset(9% 5% 9% 5% round 28px)", duration: 1.1 }, 0)
        .to("[data-photo]", { scale: 1, duration: 1.1 }, 0)
        .to("[data-content]", { y: -80, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
        .to("[data-chips]", { y: -140, opacity: 0, duration: 0.55, ease: "power2.in" }, 0)
        .fromTo("[data-end]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.45);
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top+=20 top",
        onEnter: () => tl.timeScale(1).play(),
        onLeaveBack: () => tl.timeScale(1.4).reverse(),
      });
      return () => {
        cancel();
        st.kill();
      };
    },
    { scope: root },
  );

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    root.current?.querySelectorAll<HTMLElement>("[data-chip]").forEach((el) => {
      const d = Number(el.dataset.depth || 20);
      gsap.to(el, { x: -dx * d * 2, y: -dy * d, duration: 1, ease: "power3.out" });
    });
    const wrap = root.current?.querySelector("[data-photo-wrap]");
    if (wrap) gsap.to(wrap, { x: dx * -18, y: dy * -12, duration: 1.4, ease: "power3.out" });
  };

  return (
    <section ref={root} onPointerMove={onMove} className="relative h-[112svh] bg-paper">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div data-frame className="absolute inset-0 overflow-hidden bg-ink" style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}>
          <div data-photo-wrap className="absolute -inset-6">
            <div className="absolute inset-0">
              <Image quality={90} data-photo src="/images/hero-szr.jpg" alt="Business towers along Sheikh Zayed Road, Dubai, at golden hour" fill priority sizes="100vw" className="scale-[1.18] object-cover object-[50%_35%]" />
            </div>
          </div>
          <div className="absolute inset-0 bg-ink/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_50%_52%,rgba(21,19,15,.7),transparent_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/85 to-transparent" />

          <div data-content className="container-x relative z-10 flex h-full flex-col items-center justify-center-safe pb-10 pt-24 text-center text-paper">
            <div data-fade className="mb-6 xl:hidden [@media(max-height:720px)]:hidden">
              <MobileTicker />
            </div>
            <p data-fade className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-ink/40 px-4 py-1.5 text-[14px] font-medium backdrop-blur">
              <Sparkles className="size-4 text-lime" />
              <span className="sm:hidden">AI growth for UAE SMEs</span>
              <span className="hidden sm:inline">AI-powered growth for UAE small and medium businesses</span>
            </p>
            <h1 className="display mt-6 text-hero !leading-[1.04] tracking-[-0.045em]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                  More <RotatingWord words={["customers.", "enquiries.", "bookings.", "reviews."]} />
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">Zero extra staff.</span>
              </span>
            </h1>
            <p data-fade className="mt-6 max-w-[34rem] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-relaxed text-paper/85">
              AI agents run your SEO, ads, social media, outreach and WhatsApp enquiries every day. Our team checks every move before it goes live.
            </p>
            <div data-fade className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/assessment" className="group flex h-14 items-center gap-3 whitespace-nowrap rounded-full bg-lime pl-6 pr-2 text-[16px] font-semibold sm:pl-7 sm:text-[17px] text-ink shadow-[0_20px_50px_-15px_rgba(212,255,63,.55)] transition hover:scale-[1.03]">
                Get my free growth score
                <span className="grid size-10 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
              <Button href={waLink()} variant="outline-paper" size="lg" icon={<WhatsAppIcon />} className="!rounded-full">
                Talk to us on WhatsApp
              </Button>
            </div>
            <ul data-fade className="mt-10 hidden max-w-[760px] flex-wrap sm:flex items-center justify-center gap-x-6 gap-y-2.5 text-[15px] text-paper/80">
              {["6 services, one team", "Every move approved by our team", "One clear number per service"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-lime" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div data-chips className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
            {slots.map((sl, s) => {
              const c = CHIPS[sl.msg];
              return (
                <div key={s} data-chip data-depth={SLOTS[s].depth} className={`absolute ${SLOTS[s].spots[sl.spot]}`}>
                  <div data-float>
                    <div
                      key={sl.n}
                      className={`flex items-center gap-3 rounded-2xl border border-paper/15 bg-ink/55 py-3 pl-3 pr-5 text-paper shadow-2xl backdrop-blur-xl ${
                        sl.out ? "animate-[chipOut_.55s_cubic-bezier(.4,0,1,1)_both]" : sl.n ? "animate-[chipIn_.9s_cubic-bezier(.34,1.56,.64,1)_both]" : ""
                      }`}
                    >
                      <span className="grid size-9 place-items-center rounded-xl bg-lime text-ink">{c.icon}</span>
                      <span className="text-left">
                        <span className="block text-[15px] font-semibold leading-tight">{c.t}</span>
                        <span className="block text-[13px] text-paper/60">{c.s}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div data-end className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center text-paper opacity-0">
            <div>
              <p className="text-[clamp(5rem,14vw,11rem)] font-semibold leading-none tracking-tight text-lime">{count}</p>
              <p className="display mx-auto mt-2 max-w-xl text-[clamp(1.6rem,3.2vw,2.6rem)]">AI agents on your business. One team checking every move.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Cycles through words with a slide-up. The box animates to the exact width of the current
 * word, so the centred line re-balances smoothly instead of jumping or leaving a gap.
 */
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const measure = () => setWidths(refs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [words]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);

  const prev = (i - 1 + words.length) % words.length;
  return (
    <span
      className="relative inline-block whitespace-nowrap text-left align-bottom text-lime transition-[width] duration-700 ease-out-expo"
      style={{ width: widths[i] ? `${widths[i]}px` : undefined }}
    >
      {/* invisible copy keeps the line height and the width before measuring */}
      <span className="invisible">{words[i]}</span>
      {words.map((w, k) => (
        <span
          key={w}
          ref={(el) => {
            refs.current[k] = el;
          }}
          aria-hidden={k !== i}
          className="absolute left-0 top-0 transition-[opacity,transform] duration-700 ease-out-expo"
          style={{ opacity: k === i ? 1 : 0, transform: `translateY(${k === i ? 0 : k === prev ? -55 : 55}%)` }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/** Phones: the agent notifications cycle through one glass card above the headline. */
function MobileTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % CHIPS.length), 2600);
    return () => clearInterval(id);
  }, []);
  const c = CHIPS[i];
  return (
    <div className="relative h-[60px] w-[280px] overflow-hidden rounded-2xl border border-paper/15 bg-ink/55 text-left text-paper shadow-2xl backdrop-blur-xl">
      <div key={i} className="absolute inset-0 flex animate-[tickerIn_.6s_cubic-bezier(.16,1,.3,1)_both] items-center gap-3 px-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-lime text-ink">{c.icon}</span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold leading-tight">{c.t}</span>
          <span className="block truncate text-[13px] text-paper/60">{c.s}</span>
        </span>
      </div>
      <span key={`bar-${i}`} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-lime/70 [animation:grow_2.6s_linear_both]" />
    </div>
  );
}
