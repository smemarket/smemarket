"use client";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Check, ShoppingBag } from "lucide-react";
import { MONTHLY, MONTHLY_TOTAL, BUNDLE_PRICE, BUNDLE_SAVING, aed, waLink } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { usePlan } from "@/components/plan/Plan";
import { SplitHeading } from "@/components/ui/Reveal";
import { Avatar } from "@/components/ui/Character";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/** Pricing opener: your five specialists line up, and the price drops from separate to bundled. */
export default function PricingHero() {
  const root = useRef<HTMLElement>(null);
  const { items, setAll, openDrawer } = usePlan();
  const [price, setPrice] = useState(BUNDLE_PRICE);
  const allIn = MONTHLY.every((s) => items.includes(s.slug));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const n = { v: MONTHLY_TOTAL };
      setPrice(MONTHLY_TOTAL);
      const tl = gsap.timeline({ paused: true });
      tl.from("[data-p-fade]", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.2)
        .from("[data-p-card]", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.15)
        .from("[data-p-row]", { x: 30, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }, 0.5)
        .from("[data-p-strike]", { scaleX: 0, duration: 0.6, ease: "power2.inOut" }, 1.25)
        .to(n, { v: BUNDLE_PRICE, duration: 1.2, ease: "power3.inOut", onUpdate: () => setPrice(Math.round(n.v / 50) * 50) }, 1.3)
        .from("[data-p-save]", { y: 12, opacity: 0, duration: 0.6, ease: "back.out(1.8)" }, 2.2);
      const cancel = onReveal(() => tl.play());
      return () => cancel();
    },
    { scope: root },
  );

  const addAll = () => {
    const keep = items.filter((x) => !MONTHLY.some((m) => m.slug === x));
    setAll([...MONTHLY.map((m) => m.slug), ...keep]);
    openDrawer();
  };

  return (
    <section ref={root} className="bg-paper pb-16 pt-28 md:pt-36 lg:pb-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,500px)] lg:gap-20">
        <div>
          <p data-p-fade className="label">Pricing</p>
          <SplitHeading as="h1" immediate className="display mt-4 text-[clamp(2.6rem,min(5.6vw,10vh),5.2rem)]">
            Your whole growth team. One monthly price.
          </SplitHeading>
          <p data-p-fade className="mt-6 max-w-xl text-[20px] leading-relaxed text-ink-2">
            Pick single services or take all five monthly services as one plan. No packages to decode, no hidden extras.
          </p>
          <div data-p-fade className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/pricing#bundle" size="lg" arrow>
              Build your own plan
            </Button>
            <Button href={waLink("Hi SME Market, I have a question about pricing.")} size="lg" variant="outline" icon={<WhatsAppIcon />}>
              Ask about pricing
            </Button>
          </div>
        </div>

        <div data-p-card className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-paper shadow-[0_50px_100px_-50px_rgba(21,19,15,.8)] md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-lime">The bundle</p>
            <p className="text-[14px] text-paper/50">All five monthly services</p>
          </div>

          <ul className="mt-6 space-y-1">
            {MONTHLY.map((s) => {
              const sp = SPECIALIST[s.slug];
              return (
                <li key={s.slug} data-p-row className="flex items-center gap-3 rounded-xl px-1 py-2">
                  <Avatar who={sp.who} mood={sp.mood} body={sp.body} size={40} tone="bg-paper" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-semibold">{s.name}</span>
                    <span className="block truncate text-[13px] text-paper/50">{sp.role}</span>
                  </span>
                  <span className="shrink-0 text-[14px] tabular-nums text-paper/45">{aed(s.price)}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-rule-dark pt-5">
            <p className="flex items-center gap-2 text-[15px] text-paper/50">
              Separately
              <span className="relative tabular-nums">
                {aed(MONTHLY_TOTAL)}
                <span data-p-strike className="absolute inset-x-[-2px] top-1/2 h-[2px] origin-left bg-stamp" />
              </span>
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-[clamp(2.6rem,5vw,3.6rem)] font-semibold leading-none tracking-tight tabular-nums">{aed(price)}</span>
              <span className="text-[16px] text-paper/60">/ month</span>
            </p>
            <p data-p-save className="mt-3 inline-block rounded-full bg-lime px-3 py-1 text-[14px] font-semibold text-ink">
              You keep {aed(BUNDLE_SAVING)} every month
            </p>
          </div>

          <button
            onClick={allIn ? openDrawer : addAll}
            className={clsx("mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold transition-all duration-500 ease-out-expo active:scale-[0.98]", allIn ? "bg-paper/10 text-paper hover:bg-paper/20" : "bg-lime text-ink hover:brightness-95")}
          >
            {allIn ? (
              <>
                <Check className="size-5" /> All five are in your plan · View plan
              </>
            ) : (
              <>
                <ShoppingBag className="size-5" /> Add all five to my plan
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
