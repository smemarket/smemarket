import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Character, { type Body, type Cast } from "@/components/ui/Character";
import { Reveal } from "@/components/ui/Reveal";
import Swipe from "@/components/ui/Swipe";

const STEPS: { who: Cast; mood: "excited" | "thinking" | "happy"; body: Body; tone: string; when: string; t: string; d: string }[] = [
  { who: "zara", mood: "excited", body: "Device", tone: "bg-[#e9f1c9]", when: "Today", t: "Take the free growth score", d: "Ten quick questions on your phone. See what to fix first." },
  { who: "faisal", mood: "thinking", body: "Paper", tone: "bg-[#f6e3b5]", when: "Same week", t: "Pick your services", d: "One service or all five. Build your plan in a minute." },
  { who: "tom", mood: "happy", body: "PointingUp", tone: "bg-[#dbe6ef]", when: "Within days", t: "Agents get to work", d: "You approve the plan and the first creative before anything goes live." },
  { who: "hana", mood: "excited", body: "Coffee", tone: "bg-[#f6dcd2]", when: "Every month", t: "Watch the numbers grow", d: "Live dashboard plus a one-page report you'll actually read." },
];

export default function Process() {
  return (
    <section id="how" className="scroll-mt-20 bg-paper-2 section-y pt-[calc(clamp(4rem,11vh,8rem)_+_6vw)]">
      <div className="container-x">
        <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1fr_1fr] lg:grid-rows-2" stagger={0.09}>
          {/* heading tile */}
          <div data-reveal className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 text-paper lg:row-span-2 lg:p-10">
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-lime/15 blur-3xl" />
            <div className="relative">
              <p className="text-[15px] font-medium text-lime">How it works</p>
              <h2 className="display mt-4 text-section">Four steps. Day one is free.</h2>
              <p className="mt-5 text-[17px] text-paper/70">From your first click to your first monthly report, in days, not months.</p>
            </div>
            <Link href="/assessment" className="group relative mt-10 flex h-14 w-fit items-center gap-3 rounded-full bg-lime pl-6 pr-2 text-[16px] font-semibold text-ink">
              Start with step one
              <span className="grid size-10 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>

          <Swipe bp="lg" outer="lg:contents" desktop="lg:contents">
          {STEPS.map((s, i) => (
            <article key={s.who} data-reveal className="group flex h-full overflow-hidden rounded-3xl bg-card transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-35px_rgba(21,19,15,.45)]">
              <div className={clsx("relative flex w-[42%] shrink-0 items-end justify-center overflow-hidden", s.tone)}>
                <span className="absolute left-4 top-3 text-[40px] font-semibold leading-none tracking-tight text-ink/15">0{i + 1}</span>
                <Character who={s.who} mood={s.mood} body={s.body} size={170} className="origin-bottom translate-y-1 transition-transform duration-500 group-hover:scale-[1.05]" />
              </div>
              <div className="flex flex-col justify-center p-6">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{s.when}</p>
                <h3 className="mt-1.5 text-[20px] font-semibold leading-snug">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.d}</p>
              </div>
            </article>
          ))}
          </Swipe>
        </Reveal>
      </div>
    </section>
  );
}
