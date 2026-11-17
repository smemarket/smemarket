"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { midSentence, type Service } from "@/lib/site";
import { SplitHeading } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

const LINE = [18, 22, 20, 28, 26, 34, 33, 41, 39, 48, 52, 58];

/** The one number we hold ourselves to, and what else your dashboard tracks. Chart draws itself on arrival. */
export default function KpiBoard({ s }: { s: Service }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [pick, setPick] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...LINE);
  const shape = LINE.map((v, i) => (pick % 2 ? v * (0.7 + ((i * 7) % 5) / 12) : v)); // each metric gets its own curve
  const pts = shape.map((v, i) => `${(i / (shape.length - 1)) * 100},${100 - (v / max) * 82}`).join(" ");

  return (
    <section className="bg-paper section-y">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="label">How you&apos;ll know it&apos;s working</p>
          <SplitHeading className="display mt-4 text-section">One number we answer for, every month.</SplitHeading>
          <p className="mt-5 max-w-lg text-[18px] text-ink-2">
            For {midSentence(s.name)}, that&apos;s <span className="font-semibold text-ink">{midSentence(s.kpi)}</span>. It sits at the top of your dashboard, updated in real time, next to everything else we track.
          </p>
          <div className="mt-8">
            <Button href="/assessment" size="lg" arrow>
              See where you stand today
            </Button>
          </div>
        </div>

        <div ref={box} className="overflow-hidden rounded-[28px] bg-ink text-paper shadow-[0_40px_80px_-50px_rgba(21,19,15,.7)]">
          <div className="flex items-center justify-between border-b border-rule-dark px-6 py-4">
            <span className="text-[14px] text-paper/55">Your dashboard · {s.short}</span>
            <span className="text-[13px] text-paper/45">Updated in real time</span>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-paper/55">{s.dashboard[pick]}</p>
            <svg key={pick} viewBox="0 0 100 100" preserveAspectRatio="none" className={clsx("mt-4 h-40 w-full overflow-visible md:h-48", on ? "animate-[wipeIn_1.4s_cubic-bezier(.65,0,.35,1)_both]" : "[clip-path:inset(0_100%_0_0)]")}>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(242,238,230,.08)" vectorEffect="non-scaling-stroke" />
              ))}
              <polyline points={pts} fill="none" stroke="#d4ff3f" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <ul className="grid grid-cols-2 border-t border-rule-dark">
            {s.dashboard.map((m, i) => (
              <li key={m} className={clsx(i % 2 && "border-l border-rule-dark", i > 1 && "border-t border-rule-dark")}>
                <button onClick={() => setPick(i)} className={clsx("flex w-full items-center justify-between gap-2 px-5 py-4 text-left text-[15px] transition-colors duration-300", pick === i ? "bg-paper/10 text-paper" : "text-paper/60 hover:text-paper")}>
                  {m}
                  <ArrowUpRight className={clsx("size-4 shrink-0 transition-transform duration-300", pick === i && "rotate-45")} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
