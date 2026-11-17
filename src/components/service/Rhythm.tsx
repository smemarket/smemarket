"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Check, Sparkles } from "lucide-react";
import type { Service } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import { prefersReducedMotion } from "@/lib/gsap";
import { Avatar } from "@/components/ui/Character";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "How it runs": one step at a time, the agent's part types out, then our team signs it off.
 * Autoplays on a timer while on screen; a click picks a step and holds it until the cursor leaves.
 */
export default function Rhythm({ s }: { s: Service }) {
  const sp = SPECIALIST[s.slug];
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const r = s.rhythm[step];
  const done = typed >= r.agents.length;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // type the agent's line out
  useEffect(() => {
    if (!visible) return;
    if (prefersReducedMotion()) {
      setTyped(r.agents.length);
      return;
    }
    setTyped(0);
    const id = setInterval(() => setTyped((t) => (t >= r.agents.length ? t : t + 1)), 22);
    return () => clearInterval(id);
  }, [step, visible, r.agents.length]);

  const pick = (i: number) => {
    setStep(i);
    setHeld(true);
  };

  return (
    <section ref={root} onMouseLeave={() => setHeld(false)} className="bg-paper-2 section-y">
      <div className="container-x">
        <SectionHead eyebrow="How it runs" title="Our agents do the work. Our team checks it." />

        <div className="mt-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {s.rhythm.map((x, i) => (
            <button
              key={x.when}
              onClick={() => pick(i)}
              className={clsx("relative shrink-0 overflow-hidden rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300", i === step ? "bg-ink text-paper" : "bg-card text-ink-2 hover:text-ink")}
            >
              {x.when}
              {i === step && visible && !held && (
                <span key={`${step}`} onAnimationEnd={() => !prefersReducedMotion() && setStep((p) => (p + 1) % s.rhythm.length)} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-lime [animation:grow_6s_linear_both]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* the agent */}
          <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-7 text-paper md:p-9">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-paper/60">
              <Sparkles className="size-4 text-lime" /> AI agents · {r.when}
            </p>
            <p className="mt-8 text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-snug tracking-tight">
              {r.agents.slice(0, typed)}
              {!done && <span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] animate-pulse bg-lime" />}
            </p>
            <div className="mt-8 h-1 overflow-hidden rounded-full bg-paper/10">
              <div className="h-full rounded-full bg-paper/60 transition-[width] duration-200" style={{ width: `${(typed / r.agents.length) * 100}%` }} />
            </div>
          </div>

          {/* our team */}
          <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] bg-card p-7 md:p-9">
            <div className="flex items-center gap-3">
              <Avatar who={sp.who} mood={sp.mood} body={sp.body} size={52} tone="bg-paper-2" />
              <div>
                <p className="text-[16px] font-semibold">Our team</p>
                <p className="text-[14px] text-muted">{sp.role}</p>
              </div>
            </div>
            <p key={step} className="mt-8 animate-[fadeIn_.5s_ease] text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-snug tracking-tight">
              {r.team}
            </p>
            <p className={clsx("mt-8 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-500 ease-out-expo", done ? "translate-y-0 bg-ink text-paper opacity-100" : "translate-y-2 bg-paper-2 text-muted opacity-60")}>
              <Check className="size-4" /> {done ? "Checked and signed off" : "Waiting for the draft"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
