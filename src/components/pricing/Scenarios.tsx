"use client";
import clsx from "clsx";
import { Check, ShoppingBag } from "lucide-react";
import { MONTHLY, BUNDLE_PRICE, aed, getService } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import { usePlan } from "@/components/plan/Plan";
import { Avatar } from "@/components/ui/Character";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";

const PLANS = [
  { k: "Just getting started", who: "You're busy, enquiries slip through, and your profiles look quiet.", slugs: ["enquiry-desk", "social-media-management"], tone: "bg-[#d5ece4]" },
  { k: "Ready for more leads", who: "The basics work. Now you want more people finding and choosing you.", slugs: ["seo-optimisation", "paid-ads", "enquiry-desk"], tone: "bg-[#f6dcd2]" },
  { k: "Ready to scale", who: "You want every channel running, every day, at the lowest monthly price.", slugs: MONTHLY.map((m) => m.slug), tone: "bg-ink text-paper", bundle: true },
];

/** Three honest starting points, priced from the real numbers, each one tap from the cart. */
export default function Scenarios() {
  const { items, setAll, openDrawer } = usePlan();
  return (
    <section className="bg-paper section-y">
      <div className="container-x">
        <p className="label">Not sure where to start?</p>
        <SplitHeading className="display mt-4 max-w-3xl text-section">Which plan fits you?</SplitHeading>
        <Reveal className="mt-12 grid gap-4 lg:grid-cols-3" stagger={0.1}>
          {PLANS.map((p) => {
            const list = p.slugs.map((x) => getService(x)!);
            const price = p.bundle ? BUNDLE_PRICE : list.reduce((a, s) => a + s.price, 0);
            const inPlan = p.slugs.every((x) => items.includes(x));
            const dark = p.bundle;
            return (
              <div key={p.k} data-reveal className={clsx("flex flex-col rounded-[28px] p-7 md:p-8", p.tone, !dark && "text-ink")}>
                <div className="flex -space-x-2.5">
                  {list.map((s) => {
                    const sp = SPECIALIST[s.slug];
                    return (
                      <span key={s.slug} className={clsx("rounded-full ring-4", dark ? "ring-ink" : "ring-card/0")}>
                        <Avatar who={sp.who} mood={sp.mood} body={sp.body} size={46} tone={VISUAL_TONE[s.slug]} />
                      </span>
                    );
                  })}
                </div>
                <h3 className="mt-6 text-[26px] font-semibold tracking-tight">{p.k}</h3>
                <p className={clsx("mt-2 text-[16px] leading-relaxed", dark ? "text-paper/65" : "text-ink-2")}>{p.who}</p>
                <ul className="mt-6 space-y-2">
                  {list.map((s) => (
                    <li key={s.slug} className="flex items-center gap-2.5 text-[16px] font-medium">
                      <Check className={clsx("size-4 shrink-0", dark && "text-lime")} strokeWidth={3} />
                      {s.name}
                    </li>
                  ))}
                </ul>
                <div className={clsx("mt-auto border-t pt-6", dark ? "border-rule-dark" : "border-ink/10")}>
                  <p className="mt-6 text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-tight tabular-nums">
                    {aed(price)}
                    <span className={clsx("text-[16px] font-normal", dark ? "text-paper/55" : "text-ink/55")}> / month</span>
                  </p>
                  <button
                    onClick={() => {
                      if (inPlan) return openDrawer();
                      setAll(Array.from(new Set([...items, ...p.slugs])));
                      openDrawer();
                    }}
                    className={clsx("mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-300 active:scale-[0.98]", dark ? "bg-lime text-ink hover:brightness-95" : "bg-ink text-paper hover:bg-ink-3")}
                  >
                    {inPlan ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
                    {inPlan ? "In your plan · View" : "Add this plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
