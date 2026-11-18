"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Check, Plus, X } from "lucide-react";
import { SERVICES, MONTHLY_TOTAL, BUNDLE_PRICE, BUNDLE_SAVING, aed, waLink } from "@/lib/site";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import SectionHead from "@/components/ui/SectionHead";
import { usePlan, computePlan } from "@/components/plan/Plan";
import ServiceVisual, { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import Swipe from "@/components/ui/Swipe";

export default function BundleBuilder({ heading = true }: { heading?: boolean }) {
  const { items: sel, toggle, start } = usePlan();
  const calc = useMemo(() => computePlan(sel), [sel]);
  const startPlan = start;
  const summary = calc.summary;
  const n = sel.length;
  const site = calc.site ? " · + AED 5,000 one-time website" : "";
  const status =
    n === 0
      ? "Add a service to start your plan"
      : calc.bundle
        ? `All five monthly services · bundle price applied${site}`
        : calc.chosen.length > 0 && calc.toBundle <= 0
          ? `${n} service${n > 1 ? "s" : ""} · add the rest and pay less${site}`
          : calc.chosen.length > 0
            ? `${n} service${n > 1 ? "s" : ""} · add ${calc.missing.length} more to save ${aed(BUNDLE_SAVING)}${site}`
            : `${n} service${n > 1 ? "s" : ""}${site}`;

  return (
    <section id="bundle" className={clsx("relative z-10 bg-paper-2 section-y", heading && "-mt-10 rounded-t-[40px] md:rounded-t-[56px]")}>
      <div className="container-x">
        {heading && (
          <SectionHead
            eyebrow="Build your plan"
            title="Pick your services. Watch the price."
            intro={
              <>
                Add what you need. Take all five monthly services and pay <b>{aed(BUNDLE_PRICE)}</b> instead of {aed(MONTHLY_TOTAL)}.
              </>
            }
          />
        )}

        {/* cards and bar share a wrapper, so the bar only sticks while the cards are on screen */}
        <div className={clsx(heading && "mt-8 md:mt-12")}>
        <div>
          <Swipe bp="sm" itemWidth="80%" desktop="sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const on = sel.includes(s.slug);
            return (
              <button
                key={s.slug}
                onClick={(e) => toggle(s.slug, e.currentTarget)}
                aria-pressed={on}
                className={clsx(
                  "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition-[background-color,color,box-shadow,transform] duration-500 ease-out-expo",
                  on ? "bg-ink text-paper shadow-[0_24px_50px_-30px_rgba(21,19,15,.7)] ring-2 ring-lime" : "bg-card ring-1 ring-rule hover:-translate-y-1 hover:ring-rule-strong",
                )}
              >
                <div className={clsx("relative m-2 mb-0 flex h-[clamp(9rem,21vh,11rem)] w-[calc(100%-1rem)] items-center justify-center overflow-hidden rounded-xl text-ink", VISUAL_TONE[s.slug])}>
                  <div className="flex w-full justify-center pt-5 transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]">
                    <ServiceVisual slug={s.slug} />
                  </div>
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[12px] font-semibold text-ink backdrop-blur">{s.billing === "month" ? "Monthly" : "One-time"}</span>
                  <span className={clsx("absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[12px] font-semibold text-lime transition-all duration-500 ease-out-expo", on ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0")}>
                    <Check className="size-3.5" strokeWidth={3} /> In your plan
                  </span>
                </div>
                <div className="flex w-full flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[19px] font-semibold leading-snug">{s.name}</h3>
                    <p className="shrink-0 text-right text-[17px] font-semibold tabular-nums">
                      {aed(s.price)}
                      <span className={clsx("block text-[13px] font-normal transition-colors duration-500", on ? "text-paper/60" : "text-muted")}>{s.billing === "month" ? "per month" : "one-time"}</span>
                    </p>
                  </div>
                  <p className={clsx("mt-1 text-[15px] transition-colors duration-500", on ? "text-paper/65" : "text-muted")}>KPI: {s.kpi}</p>
                  <span
                    className={clsx(
                      "mt-5 flex h-11 items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition-all duration-300",
                      on ? "bg-paper/10 text-paper group-hover:bg-[#e0402a]/20" : "bg-paper-2 text-ink group-hover:bg-ink group-hover:text-paper",
                    )}
                  >
                    <span key={on ? "on" : "off"} className="flex animate-[fadeIn_.35s_ease] items-center gap-2">
                      {on ? (
                        <>
                          <X className="size-4" strokeWidth={2.5} /> Remove from plan
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" strokeWidth={2.5} /> Add to plan
                        </>
                      )}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
          </Swipe>
        </div>

        {/* sticky plan bar: one line of total, one line of status, one action */}
        <div className="sticky bottom-20 z-20 mt-5 md:mt-8 lg:bottom-5">
          <div className="flex items-center gap-3 rounded-[22px] bg-ink py-2.5 pl-5 pr-2.5 text-paper shadow-[0_24px_50px_-28px_rgba(21,19,15,.7)] sm:gap-4 sm:rounded-full sm:pl-7">
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-1.5 whitespace-nowrap sm:gap-2">
                <AnimatedPrice value={calc.monthly} />
                <span className="text-[15px] text-paper/60">
                  <span className="sm:hidden">/mo</span>
                  <span className="hidden sm:inline">/ month</span>
                </span>
                <span className={clsx("hidden text-[15px] text-paper/40 line-through transition-opacity duration-500 sm:inline", calc.bundle ? "opacity-100" : "opacity-0")}>{aed(MONTHLY_TOTAL)}</span>
              </p>
              <p key={status} className="truncate animate-[fadeIn_.4s_ease] text-[14px] text-paper/60">
                {status}
              </p>
            </div>
            <a
              href={waLink(`Hi SME Market, I'd like this plan: ${summary}`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send this plan on WhatsApp"
              className={clsx("grid size-11 shrink-0 place-items-center rounded-full bg-paper/10 sm:size-12 transition hover:bg-[#25D366]", sel.length === 0 && "pointer-events-none opacity-40")}
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <button
              onClick={startPlan}
              disabled={sel.length === 0}
              className="group flex h-11 shrink-0 items-center gap-2 rounded-full bg-lime px-4 sm:h-12 sm:px-5 text-[15px] font-semibold text-ink transition hover:brightness-95 disabled:opacity-40 sm:px-6"
            >
              <span className="hidden sm:inline">Start this plan</span>
              <span className="sm:hidden">Start</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    let raf = 0;
    const a = from.current;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 500);
      const cur = Math.round(a + (value - a) * (1 - Math.pow(1 - p, 3)));
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="text-[21px] font-semibold leading-tight tracking-tight tabular-nums sm:text-[28px]">{aed(v)}</span>;
}
