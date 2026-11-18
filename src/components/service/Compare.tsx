import clsx from "clsx";
import { Check, Minus } from "lucide-react";
import { aed, type Service } from "@/lib/site";
import { SplitHeading } from "@/components/ui/Reveal";
import Swipe from "@/components/ui/Swipe";

/** Doing it yourself vs a typical agency vs us. Qualitative, no invented numbers. */
export default function Compare({ s }: { s: Service }) {
  const ROWS: [string, string, string, string][] = [
    ["Who does the work", "You, between everything else", "An account manager, a few hours a week", "AI agents, every day"],
    ["Who checks it", "Nobody", "Whoever has time", "Our team, before anything goes live"],
    ["How often it happens", "When you get to it", "Weekly or monthly", "Daily, around the clock"],
    ["What you see", "Guesswork", "A report once a month", "A live dashboard and one clear KPI"],
    ["What it costs", "Your evenings", "A retainer, often plus extras", `${aed(s.price)} ${s.billing === "month" ? "a month" : "one-time"}`],
  ];
  const COLS = ["Doing it yourself", "A typical agency", "SME Market"];
  return (
    <section className="bg-paper-2 section-y">
      <div className="container-x">
        <p className="label">Why us</p>
        <SplitHeading className="display mt-4 max-w-3xl text-section">The work of a full team, without hiring one.</SplitHeading>

        {/* phones: one card per option, ours first, instead of a five-row table */}
        <div className="mt-8 md:hidden">
          <Swipe desktop="">
            {[2, 1, 0].map((c) => (
              <div key={c} className={clsx("h-full rounded-[24px] p-6", c === 2 ? "bg-ink text-paper" : "bg-card ring-1 ring-rule")}>
                <p className={clsx("text-[15px] font-semibold", c === 2 ? "text-lime" : "text-muted")}>{COLS[c]}</p>
                <ul className="mt-4 space-y-3.5">
                  {ROWS.map((r) => (
                    <li key={r[0]} className="flex gap-2.5">
                      {c === 2 ? <Check className="mt-1 size-4 shrink-0 text-lime" strokeWidth={3} /> : <Minus className="mt-1 size-4 shrink-0 text-muted" />}
                      <span>
                        <span className={clsx("block text-[13px]", c === 2 ? "text-paper/55" : "text-muted")}>{r[0]}</span>
                        <span className={clsx("text-[16px] leading-snug", c === 2 ? "font-medium" : "text-ink-2")}>{r[c + 1]}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Swipe>
        </div>

        <div className="mt-12 hidden overflow-hidden rounded-[28px] bg-card ring-1 ring-rule md:block">
          <div className="hidden grid-cols-[1fr_1fr_1fr_1.15fr] border-b border-rule md:grid">
            <span />
            {COLS.map((c, i) => (
              <span key={c} className={clsx("px-6 py-5 text-[15px] font-semibold", i === 2 ? "bg-ink text-lime" : "text-muted")}>
                {c}
              </span>
            ))}
          </div>
          {ROWS.map(([k, a, b, us]) => (
            <div key={k} className="grid border-b border-rule last:border-0 md:grid-cols-[1fr_1fr_1fr_1.15fr]">
              <span className="px-6 pb-2 pt-5 text-[16px] font-semibold md:py-5">{k}</span>
              <span className="flex items-start gap-2 px-6 py-1.5 text-[16px] text-muted md:py-5">
                <Minus className="mt-1 size-4 shrink-0 md:hidden" />
                <span>
                  <span className="text-[13px] font-semibold md:hidden">You: </span>
                  {a}
                </span>
              </span>
              <span className="flex items-start gap-2 px-6 py-1.5 text-[16px] text-muted md:py-5">
                <Minus className="mt-1 size-4 shrink-0 md:hidden" />
                <span>
                  <span className="text-[13px] font-semibold md:hidden">Agency: </span>
                  {b}
                </span>
              </span>
              <span className="mx-3 mb-4 mt-2 flex items-start gap-2 rounded-xl bg-ink px-4 py-3 text-[16px] font-medium text-paper md:m-0 md:rounded-none md:px-6 md:py-5">
                <Check className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={3} />
                {us}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
