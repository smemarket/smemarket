"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Bot, UserCheck, Rocket, Check, Heart, MessageCircle, Send, Bookmark, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Character";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const STEPS = [
  { icon: Bot, short: "AI drafts", t: "AI drafts it", d: "The social agent writes the post, picks the photo and the best time to publish." },
  { icon: UserCheck, short: "Team checks", t: "Our team checks it", d: "Your account manager fixes anything off, then approves. Nothing goes out unchecked." },
  { icon: Rocket, short: "Goes live", t: "It goes live and works", d: "Published on time. Reach, saves and enquiries land in your dashboard." },
];

const CAPTION = "Weekend breakfast is back ☀️ Two coffees and a croissant for AED 19, Fri–Sat until noon at our Marina branch.";

export default function HumanLoop() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [cycle, setCycle] = useState(0);

  // caption types itself during the draft step
  useEffect(() => {
    if (step !== 0) {
      setTyped(CAPTION.length);
      return;
    }
    setTyped(0);
    let n = 0;
    const id = setInterval(() => {
      n += 2;
      setTyped(Math.min(CAPTION.length, n));
      if (n >= CAPTION.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [step]);

  const pick = (i: number) => {
    setStep(i);
    setCycle((c) => c + 1);
  };
  const next = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStep((x) => (x + 1) % 3);
    setCycle((c) => c + 1);
  };

  const shown = step === 0 ? CAPTION.slice(0, typed) : CAPTION;

  return (
    <section ref={root} className="bg-paper section-y">
      <div className="container-x grid w-full items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* steps */}
        <div>
          <p className="label">How we work</p>
          <h2 className="display mt-4 text-section">One post, three steps. Our team in the middle.</h2>
          {/* phones: three steps in one row, the active one explained below, so steps and post fit on one screen */}
          <div className="mt-6 lg:hidden">
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((s, i) => (
                <button key={s.t} onClick={() => pick(i)} className={clsx("flex flex-col items-start gap-2 rounded-xl border p-2.5 text-left transition-all duration-500", step === i ? "border-ink bg-card" : "border-rule opacity-60")}>
                  <span className={clsx("grid size-8 place-items-center rounded-lg transition-colors", step === i ? "bg-lime" : "bg-paper-2")}>
                    <s.icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-[14px] font-semibold leading-tight">{s.short}</span>
                  <span className="block h-1 w-full overflow-hidden rounded-full bg-ink/10">
                    {step === i && <span key={`m-${i}-${cycle}`} onAnimationEnd={next} className="block h-full origin-left rounded-full bg-ink [animation:grow_5.5s_linear_both]" />}
                  </span>
                </button>
              ))}
            </div>
            <p key={step} className="mt-3 min-h-[3em] animate-[fadeIn_.4s_ease] text-[15px] leading-snug text-ink-2">{STEPS[step].d}</p>
          </div>

          <div className="mt-10 hidden space-y-3 lg:block">
            {STEPS.map((s, i) => (
              <button
                key={s.t}
                onClick={() => pick(i)}
                className={clsx("flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-500 md:p-5", step === i ? "border-ink bg-card shadow-[0_20px_40px_-30px_rgba(21,19,15,.5)]" : "border-transparent opacity-50 hover:opacity-80")}
              >
                <span className={clsx("grid size-11 shrink-0 place-items-center rounded-xl transition-colors", step === i ? "bg-lime text-ink" : "bg-paper-2")}>
                  <s.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[18px] font-semibold md:text-[20px]">{s.t}</span>
                  <span className={clsx("grid transition-all duration-500", step === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <span className="overflow-hidden text-[16px] text-ink-2">{s.d}</span>
                  </span>
                  <span className={clsx("mt-4 h-1 overflow-hidden rounded-full bg-ink/10", step === i ? "block" : "hidden")}>
                    {step === i && (
                      <span
                        key={`p-${i}-${cycle}`}
                        onAnimationEnd={next}
                        className="block h-full origin-left rounded-full bg-ink [animation:grow_5.5s_linear_both]"
                      />
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* the post */}
        <div className="relative mx-auto w-full max-w-[min(440px,54vh)]">
          <div className="rounded-[28px] bg-ink p-2.5 shadow-[0_50px_90px_-45px_rgba(21,19,15,.7)]">
            <div className="overflow-hidden rounded-[20px] bg-card">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative size-8 overflow-hidden rounded-full ring-2 ring-[#e0402a] ring-offset-1">
                    <Image quality={90} src="/images/post-cafe.jpg" alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  <span className="text-[14px] font-semibold">yourcafe.dubai</span>
                </div>
                <span
                  className={clsx(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors duration-500",
                    step === 0 ? "bg-paper-2" : step === 1 ? "bg-[#f6e3b5]" : "bg-lime",
                  )}
                >
                  {step === 0 ? (
                    <>
                      <Sparkles className="size-3.5 animate-pulse" /> AI draft
                    </>
                  ) : step === 1 ? (
                    "In review"
                  ) : (
                    <>
                      <span className="size-1.5 rounded-full bg-ink" /> Live
                    </>
                  )}
                </span>
              </div>
              <div className="relative aspect-[16/10] lg:aspect-[4/3.3]">
                <Image quality={90} src="/images/post-cafe.jpg" alt="Café post: latte and croissant" fill sizes="440px" className={clsx("object-cover transition-all duration-700", step === 0 && "blur-[2px] saturate-50")} />
                {step === 0 && <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-paper/25 to-transparent" />}
                <div className={clsx("absolute left-3 right-3 top-3 flex items-center gap-3 rounded-2xl bg-card/95 p-3 shadow-xl backdrop-blur transition-all duration-500", step === 2 ? "translate-y-0 opacity-100 delay-500" : "-translate-y-4 opacity-0")}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">New enquiry · answered in 7s</span>
                    <span className="block truncate text-[13px] text-muted">“Is the offer on Friday too? Table for 4?”</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 pt-3">
                <Heart className={clsx("size-6 transition-colors", step === 2 && "fill-stamp text-stamp")} />
                <MessageCircle className="size-6" />
                <Send className="size-6" />
                <Bookmark className="ml-auto size-6" />
              </div>
              <p className="px-4 pt-2 text-[14px] font-semibold tabular-nums">{step === 2 ? <Ticker to={1248} suffix=" people reached · 37 saves" /> : "Not published yet"}</p>
              <p className="min-h-[60px] px-4 pb-3 pt-1 text-[15px] leading-snug">
                <span className="font-semibold">yourcafe.dubai </span>
                {step === 1 ? (
                  <>
                    Weekend breakfast is back ☀️ Two coffees and a croissant for <span className="text-muted line-through">AED 20</span> <mark className="rounded bg-lime px-1">AED 19</mark>, Fri–Sat until noon at our Marina branch.
                  </>
                ) : (
                  shown
                )}
                {step === 0 && typed < CAPTION.length && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-ink" />}
              </p>
            </div>
          </div>

          <div className={clsx("absolute -left-3 top-[42%] w-[270px] transition-all duration-500 md:-left-24", step === 1 ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-6 opacity-0")}>
            <div className="flex items-start gap-3 rounded-2xl bg-card p-3.5 shadow-[0_30px_50px_-25px_rgba(21,19,15,.5)]">
              <Avatar who="priya" mood="explaining" body="Explaining" size={48} tone="bg-[#e9f1c9]" />
              <div>
                <p className="text-[13px] font-semibold">Your account manager</p>
                <p className="text-[14px] leading-snug text-ink-2">Price is AED 19 this month. Fixed and approved.</p>
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[12px] font-semibold">
                  <Check className="size-3" strokeWidth={3} /> Approved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker({ to, suffix }: { to: number; suffix: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      {v.toLocaleString("en-US")}
      {suffix}
    </>
  );
}
