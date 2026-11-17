"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Loader2, Sparkles, Phone, Gauge, Clock, ShieldCheck } from "lucide-react";
import { SERVICES, MONTHLY, BUNDLE_PRICE, BUNDLE_SAVING, SITE, aed, waLink } from "@/lib/site";
import { submitLead, isEmail, isPhone } from "@/lib/leads";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Character from "@/components/ui/Character";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import { usePlan } from "@/components/plan/Plan";
import { getLenis } from "@/components/layout/SmoothScroll";

type Area = "Search" | "Ads" | "Outreach" | "Social" | "Enquiries" | "Website";
type Q = { id: string; area?: Area; q: string; hint?: string; options: { l: string; s: number }[] };

const QUESTIONS: Q[] = [
  { id: "type", q: "What kind of business are you?", options: [{ l: "Clinic, salon or wellness", s: 0 }, { l: "Restaurant, café or retail", s: 0 }, { l: "Home or professional services", s: 0 }, { l: "B2B, trading or contracting", s: 0 }, { l: "Real estate", s: 0 }, { l: "Something else", s: 0 }] },
  { id: "search", area: "Search", q: "If someone Googles what you sell in your area, where do you show up?", options: [{ l: "Top 3 or in the Maps pack", s: 3 }, { l: "Somewhere on page one", s: 2 }, { l: "Page two or further", s: 1 }, { l: "Honestly, no idea", s: 0 }] },
  { id: "gbp", area: "Search", q: "Your Google Business Profile is…", options: [{ l: "Complete, with weekly posts and replies", s: 3 }, { l: "Set up, but rarely updated", s: 1 }, { l: "Not set up, or not sure", s: 0 }] },
  { id: "ads", area: "Ads", q: "Are you running paid ads right now?", options: [{ l: "Yes, and I know my cost per enquiry", s: 3 }, { l: "Yes, but not sure they work", s: 1 }, { l: "Just boosted posts", s: 1 }, { l: "No ads", s: 0 }] },
  { id: "social", area: "Social", q: "When did your business last post on social media?", options: [{ l: "This week", s: 3 }, { l: "This month", s: 2 }, { l: "A few months ago", s: 1 }, { l: "Can't remember", s: 0 }] },
  { id: "reply", area: "Enquiries", q: "How fast do you usually reply to a new WhatsApp enquiry?", options: [{ l: "Under 5 minutes", s: 3 }, { l: "Within an hour", s: 2 }, { l: "Same day", s: 1 }, { l: "Next day or later", s: 0 }] },
  { id: "follow", area: "Enquiries", q: "When an enquiry goes quiet, do you follow up?", options: [{ l: "Always, we have a system", s: 3 }, { l: "Sometimes, when we remember", s: 1 }, { l: "Rarely", s: 0 }] },
  { id: "site", area: "Website", q: "Your website today is…", options: [{ l: "Modern, fast and brings in enquiries", s: 3 }, { l: "Looks okay, but few enquiries", s: 1 }, { l: "Outdated or slow on mobile", s: 0 }, { l: "We don't have one", s: 0 }] },
  { id: "outreach", area: "Outreach", q: "Do you actively reach out to new potential customers?", options: [{ l: "Every week, with a system", s: 3 }, { l: "Now and then", s: 1 }, { l: "No, we wait for referrals", s: 0 }] },
  { id: "goal", q: "What matters most in the next 90 days?", options: [{ l: "More enquiries", s: 0 }, { l: "Lower cost per customer", s: 0 }, { l: "Getting my time back", s: 0 }, { l: "Looking more professional", s: 0 }] },
];

const AREA_SERVICE: Record<Area, string> = {
  Search: "seo-optimisation",
  Ads: "paid-ads",
  Outreach: "sdr-outreach",
  Social: "social-media-management",
  Enquiries: "enquiry-desk",
  Website: "website-redesign",
};

const AREA_FIX: Record<Area, string> = {
  Search: "Customers are searching for what you sell and finding someone else. Fix your Google profile and key pages first.",
  Ads: "Ad money without a cost-per-enquiry number is a guess. Track it, refresh creative, and move budget to what works.",
  Outreach: "Waiting for referrals caps your growth. A steady list of named prospects keeps the pipeline full.",
  Social: "A quiet account makes a live business look closed. A simple monthly calendar fixes it.",
  Enquiries: "Slow replies and no follow-up are the most expensive leak. Whoever replies first usually wins.",
  Website: "Your site should turn visits into WhatsApps and calls. Right now it's likely losing them.",
};

type Stage = "intro" | "quiz" | "scan" | "result";
const AREAS: Area[] = ["Search", "Ads", "Outreach", "Social", "Enquiries", "Website"];
const toneOf = (a?: Area) => (a ? VISUAL_TONE[AREA_SERVICE[a]] : "bg-[#e9f1c9]");

export default function Assessment() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const plan = usePlan();

  const q = QUESTIONS[step];

  const choose = useCallback(
    (idx: number) => {
      setAnswers((a) => ({ ...a, [q.id]: idx }));
      setTimeout(() => {
        if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
        else setStage("scan");
      }, 220);
    },
    [q, step],
  );

  // keyboard: 1-6 to answer, backspace to go back
  useEffect(() => {
    if (stage !== "quiz") return;
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(n - 1);
      if (e.key === "Backspace" && step > 0) setStep((s) => s - 1);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [stage, q, step, choose]);

  useEffect(() => {
    if (stage !== "scan") return;
    const t = setTimeout(() => setStage("result"), 2600);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0 });
  }, [stage]);

  const result = useMemo(() => {
    const areas: Record<Area, { got: number; max: number }> = { Search: { got: 0, max: 0 }, Ads: { got: 0, max: 0 }, Outreach: { got: 0, max: 0 }, Social: { got: 0, max: 0 }, Enquiries: { got: 0, max: 0 }, Website: { got: 0, max: 0 } };
    QUESTIONS.forEach((qq) => {
      if (!qq.area) return;
      const a = answers[qq.id];
      areas[qq.area].max += 3;
      if (a !== undefined) areas[qq.area].got += qq.options[a].s;
    });
    const list = (Object.keys(areas) as Area[]).map((k) => ({ area: k, pct: Math.round((areas[k].got / areas[k].max) * 100) }));
    const total = Math.round(list.reduce((a, x) => a + x.pct, 0) / list.length);
    const weak = [...list].sort((a, b) => a.pct - b.pct).filter((x) => x.pct < 67);
    const recs = (weak.length ? weak : [...list].sort((a, b) => a.pct - b.pct).slice(0, 2)).map((x) => SERVICES.find((s) => s.slug === AREA_SERVICE[x.area])!);
    const monthlyRecs = recs.filter((s) => s.billing === "month");
    const monthlySum = monthlyRecs.reduce((a, s) => a + s.price, 0);
    const suggestBundle = monthlyRecs.length >= 3 || monthlySum >= 8000;
    return { list, total, weak, recs, suggestBundle, monthlySum };
  }, [answers]);

  const answerText = () =>
    Object.fromEntries(QUESTIONS.map((qq) => [qq.id, answers[qq.id] !== undefined ? qq.options[answers[qq.id]].l : null]));

  if (stage === "intro") return <Intro onStart={() => setStage("quiz")} />;

  if (stage === "quiz") {
    const done = new Set(QUESTIONS.filter((x) => x.area && answers[x.id] !== undefined).map((x) => x.area));
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        {/* left: progress + guide, recoloured per area */}
        <aside className={clsx("relative hidden overflow-hidden rounded-[32px] p-8 text-ink transition-colors duration-700 lg:sticky lg:top-28 lg:block lg:h-[min(640px,calc(100svh-9rem))]", toneOf(q.area))}>
          <p className="text-[15px] font-semibold text-ink/60">Your growth score</p>
          <p className="mt-1 text-[28px] font-semibold tracking-tight">
            Question {step + 1} <span className="text-ink/40">of {QUESTIONS.length}</span>
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <li key={a} className={clsx("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all duration-500", done.has(a) ? "bg-ink text-paper" : q.area === a ? "bg-card text-ink" : "bg-ink/[.07] text-ink/50")}>
                {done.has(a) && <Check className="size-3.5" />}
                {a}
              </li>
            ))}
          </ul>
          <div className="absolute -bottom-4 right-2">
            <Character who="zara" mood={step < 3 ? "excited" : "thinking"} body="Device" size={300} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between text-[15px] text-muted">
            <button onClick={() => (step === 0 ? setStage("intro") : setStep((s) => s - 1))} className="flex items-center gap-1.5 font-medium transition hover:text-ink">
              <ArrowLeft className="size-4" /> Back
            </button>
            <span className="font-semibold tabular-nums text-ink lg:hidden">
              {step + 1} / {QUESTIONS.length}
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-ink transition-all duration-700 ease-out-expo" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
          </div>

          <div key={q.id} className="mt-10 animate-[slideInRight_.6s_cubic-bezier(.16,1,.3,1)_both] lg:mt-14">
            <p className="text-[15px] font-semibold text-muted">{q.area ?? "About you"}</p>
            <h1 className="display mt-3 text-[clamp(1.9rem,3.4vw,3rem)]">{q.q}</h1>
            <div className="mt-9 grid gap-3">
              {q.options.map((o, i) => {
                const on = answers[q.id] === i;
                return (
                  <button
                    key={o.l}
                    onClick={() => choose(i)}
                    style={{ animationDelay: `${120 + i * 50}ms` }}
                    className={clsx(
                      "group flex animate-[fadeIn_.5s_ease_both] items-center gap-4 rounded-2xl px-5 py-4 text-left text-[18px] font-medium transition-all duration-300 ease-out-expo",
                      on ? "bg-ink text-paper" : "bg-card ring-1 ring-rule hover:-translate-y-0.5 hover:ring-ink",
                    )}
                  >
                    <span className={clsx("grid size-9 shrink-0 place-items-center rounded-xl text-[14px] font-semibold transition-colors", on ? "bg-lime text-ink" : "bg-paper-2 text-muted group-hover:bg-ink group-hover:text-paper")}>
                      {on ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                    </span>
                    {o.l}
                  </button>
                );
              })}
            </div>
            <p className="mt-6 hidden text-[14px] text-muted md:block">Tip: press 1 to {q.options.length} on your keyboard to answer.</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "scan") return <Scanning />;

  return (
    <Result
      result={result}
      onRetake={() => {
        setAnswers({});
        setStep(0);
        setStage("intro");
      }}
      answers={answerText()}
      openPlan={() => {
        const recs = result.suggestBundle ? [...MONTHLY.map((s) => s.slug), ...result.recs.filter((r) => r.billing === "once").map((r) => r.slug)] : result.recs.map((s) => s.slug);
        plan.setAll(Array.from(new Set([...plan.items, ...recs])));
        plan.openDrawer();
      }}
    />
  );
}

/* ───────────── intro ───────────── */

function Intro({ onStart }: { onStart: () => void }) {
  const chips: { a: Area; pos: string; d: string }[] = [
    { a: "Search", pos: "left-[6%] top-[10%]", d: "0s" },
    { a: "Ads", pos: "right-[8%] top-[6%]", d: ".4s" },
    { a: "Social", pos: "left-[2%] top-[42%]", d: ".8s" },
    { a: "Enquiries", pos: "right-[4%] top-[36%]", d: "1.2s" },
    { a: "Website", pos: "left-[10%] bottom-[30%]", d: "1.6s" },
    { a: "Outreach", pos: "right-[10%] bottom-[34%]", d: "2s" },
  ];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div className="animate-[pageIn_.8s_cubic-bezier(.16,1,.3,1)_both]">
        <p className="label">Free growth score</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,min(5.8vw,10vh),5.4rem)]">Find your growth leaks in 2 minutes.</h1>
        <p className="mt-6 max-w-xl text-[20px] leading-relaxed text-ink-2">
          Ten quick questions. You&apos;ll get a score across search, ads, outreach, social, enquiries and your website, and exactly what to fix first.
        </p>
        <button onClick={onStart} className="group mt-9 flex h-16 items-center gap-3 rounded-full bg-lime pl-8 pr-2 text-[18px] font-semibold text-ink transition hover:brightness-95 active:scale-[0.98]">
          Start my growth score
          <span className="grid size-12 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-5" />
          </span>
        </button>
        <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[16px] text-ink-2">
          <li className="flex items-center gap-2">
            <Clock className="size-5" /> 2 minutes
          </li>
          <li className="flex items-center gap-2">
            <Gauge className="size-5" /> Instant score
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-5" /> Free, no obligation
          </li>
        </ul>
      </div>

      <div className="relative h-[min(560px,64vh)] min-h-[400px] animate-[pageIn_1s_cubic-bezier(.16,1,.3,1)_.15s_both] overflow-hidden rounded-[32px] bg-[#e9f1c9] text-ink">
        {chips.map((c) => (
          <span key={c.a} className={clsx("absolute z-10 animate-[fadeIn_.6s_ease_both] rounded-full px-4 py-2 text-[14px] font-semibold shadow-[0_14px_30px_-18px_rgba(21,19,15,.5)]", c.pos, toneOf(c.a) === "bg-[#e9f1c9]" ? "bg-card" : toneOf(c.a))} style={{ animationDelay: `calc(.5s + ${c.d} / 4)` }}>
            {c.a}
          </span>
        ))}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <Character who="zara" mood="excited" body="Device" size={360} className="h-[300px] w-[300px] sm:h-[360px] sm:w-[360px]" />
        </div>
      </div>
    </div>
  );
}

/* ───────────── scanning ───────────── */

function Scanning() {
  const lines = ["Reading your answers", "Checking search and your Google profile", "Scoring ads and social", "Measuring enquiry speed", "Building your recommendations"];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => Math.min(lines.length, x + 1)), 480);
    return () => clearInterval(id);
  }, [lines.length]);
  return (
    <div className="mx-auto grid max-w-4xl animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] items-center gap-10 py-6 md:grid-cols-[0.9fr_1.1fr]" role="status">
      <div className="relative mx-auto h-[320px] w-full max-w-[320px] overflow-hidden rounded-[32px] bg-[#dbe6ef] text-ink">
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <Character who="zara" mood="thinking" body="Device" size={300} />
        </div>
      </div>
      <div>
        <p className="flex items-center gap-2 text-[15px] font-semibold text-muted">
          <Sparkles className="size-4" /> Our agents are on it
        </p>
        <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3rem)]">Scoring your business…</h2>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full origin-left rounded-full bg-ink [animation:grow_2.5s_cubic-bezier(.65,0,.35,1)_both]" />
        </div>
        <ul className="mt-6 space-y-3">
          {lines.map((l, i) => (
            <li key={l} className={clsx("flex items-center gap-3 text-[16px] transition-all duration-500", i < n ? "translate-x-0 text-ink opacity-100" : "translate-x-1 opacity-35")}>
              <span className={clsx("grid size-6 place-items-center rounded-full transition-colors duration-500", i < n ? "bg-ink text-paper" : "bg-ink/10")}>{i < n ? <Check className="size-3.5" strokeWidth={3} /> : <Loader2 className="size-3.5 animate-spin" />}</span>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────── result ───────────── */

type ResultData = {
  list: { area: Area; pct: number }[];
  total: number;
  weak: { area: Area; pct: number }[];
  recs: typeof SERVICES;
  suggestBundle: boolean;
  monthlySum: number;
};

function Result({ result, onRetake, answers, openPlan }: { result: ResultData; onRetake: () => void; answers: Record<string, string | null>; openPlan: () => void }) {
  const [shown, setShown] = useState(0);
  const [bars, setBars] = useState(false);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setShown(Math.round(result.total * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setBars(true), 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [result.total]);

  const verdict = result.total >= 75 ? "Strong. Let's scale it." : result.total >= 50 ? "Solid base, real leaks." : result.total >= 25 ? "Lots of upside here." : "Big opportunity. Start now.";
  const C = 2 * Math.PI * 88;
  const card = "min-w-0 rounded-[28px] bg-card p-7 ring-1 ring-rule md:p-9";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* score */}
        <div className="animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_both] rounded-[28px] bg-ink p-7 text-center text-paper md:p-9">
          <p className="text-[15px] font-semibold text-lime">Your growth score</p>
          <div className="relative mx-auto mt-6 size-56">
            <svg viewBox="0 0 200 200" className="size-full -rotate-90">
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(242,238,230,.1)" strokeWidth="12" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#d4ff3f" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - shown / 100)} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <p className="text-7xl font-semibold tracking-tight tabular-nums">{shown}</p>
                <p className="text-[14px] text-paper/50">out of 100</p>
              </div>
            </div>
          </div>
          <p className="display mt-6 text-[28px]">{verdict}</p>
          <button onClick={onRetake} className="mt-3 text-[15px] text-paper/55 underline-offset-4 hover:text-paper hover:underline">
            Retake the score
          </button>
        </div>

        {/* by area */}
        <div className={clsx(card, "animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_.1s_both]")}>
          <p className="text-[15px] font-semibold text-muted">By area</p>
          <ul className="mt-6 space-y-5">
            {result.list.map((a, i) => (
              <li key={a.area}>
                <div className="flex justify-between text-[16px]">
                  <span className="font-semibold">{a.area}</span>
                  <span className={clsx("font-semibold tabular-nums", a.pct < 40 ? "text-stamp" : a.pct < 67 ? "text-[#b7791f]" : "text-ink")}>{a.pct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={clsx("h-full rounded-full transition-[width] duration-1000 ease-out-expo", a.pct < 40 ? "bg-stamp" : a.pct < 67 ? "bg-[#e0a33a]" : "bg-ink")}
                    style={{ width: bars ? `${Math.max(4, a.pct)}%` : "0%", transitionDelay: `${i * 110}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* fixes */}
      {result.weak.length > 0 && (
        <div className="mt-5 animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_.2s_both]">
          <p className="mb-4 mt-10 text-[15px] font-semibold text-muted">Fix these first</p>
          <div className="grid gap-4 md:grid-cols-3">
            {result.weak.slice(0, 3).map((w, i) => (
              <div key={w.area} className={clsx("rounded-[28px] p-7 text-ink", toneOf(w.area))}>
                <p className="flex items-center justify-between text-[14px] font-semibold text-ink/60">
                  <span>{w.area}</span>
                  <span>#{i + 1}</span>
                </p>
                <p className="mt-6 text-[17px] leading-relaxed">{AREA_FIX[w.area]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* recommendation + plan */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={clsx(card, "animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_.3s_both]")}>
          <p className="text-[15px] font-semibold text-muted">Recommended for you</p>
          <div className="mt-4">
            {result.recs.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 border-b border-rule py-4 last:border-0">
                <span className="flex min-w-0 items-center gap-4">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                    <Image quality={90} src={s.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[17px] font-semibold">{s.name}</span>
                    <span className="block truncate text-[14px] text-muted">We report: {s.kpi}</span>
                  </span>
                </span>
                <span className="shrink-0 text-right text-[15px] font-semibold tabular-nums">
                  {aed(s.price)}
                  <span className="block text-[13px] font-normal text-muted">{s.billing === "month" ? "per month" : "one-time"}</span>
                </span>
              </Link>
            ))}
          </div>
          {result.suggestBundle && (
            <div className="mt-5 rounded-2xl bg-ink p-5 text-paper">
              <p className="font-semibold">Better value: the full bundle</p>
              <p className="mt-1 text-[15px] text-paper/70">
                All five monthly services for {aed(BUNDLE_PRICE)} a month. That&apos;s {aed(BUNDLE_SAVING)} off every month
                {result.monthlySum > 0 && result.monthlySum < BUNDLE_PRICE ? `, only ${aed(BUNDLE_PRICE - result.monthlySum)} more than these alone` : ""}.
              </p>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={openPlan} size="lg" arrow>
              Add these to my plan
            </Button>
            <Button href={waLink(`Hi SME Market, I just scored ${result.total}/100 on the growth score. Can we talk about ${result.recs.map((r) => r.name).join(", ")}?`)} size="lg" variant="outline" icon={<WhatsAppIcon />}>
              Discuss on WhatsApp
            </Button>
          </div>
        </div>

        <PlanCapture total={result.total} recs={result.recs.map((r) => r.name)} answers={answers} />
      </div>
    </div>
  );
}

function PlanCapture({ total, recs, answers }: { total: number; recs: string[]; answers: Record<string, string | null> }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const er: Record<string, string> = {};
    if (!v("name")) er.name = "Please add your name.";
    if (!isPhone(v("phone"))) er.phone = "Please add a valid phone or WhatsApp number.";
    if (v("email") && !isEmail(v("email"))) er.email = "That email doesn't look right.";
    setErr(er);
    if (Object.keys(er).length) return;
    setState("sending");
    const res = await submitLead({
      type: "assessment",
      name: v("name"),
      phone: v("phone"),
      email: v("email"),
      business: v("business"),
      services: recs,
      message: v("site") ? `Website: ${v("site")}` : "",
      meta: { score: total, answers },
      website: v("website"),
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setErr({ form: res.error });
    }
  }

  if (state === "done")
    return (
      <div className="flex animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] flex-col justify-center rounded-[28px] bg-card p-7 ring-1 ring-rule md:p-9" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-lime text-ink">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <h3 className="display mt-5 text-3xl">Your plan is on its way.</h3>
        <p className="mt-2 text-ink-2">Our team will review your answers and reach out within one business day with your full growth plan.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={SITE.phoneHref} variant="outline" icon={<Phone className="size-4" />}>
            Call now
          </Button>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="min-w-0 animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_.4s_both] rounded-[28px] bg-[#f6e3b5] p-7 md:p-9">
      <p className="text-[15px] font-semibold text-ink/60">Free growth plan</p>
      <h3 className="display mt-3 text-3xl">Get the full plan, written for your business.</h3>
      <p className="mt-2 text-[15px] text-ink-2">We&apos;ll look at your actual site and Google profile, and send a written plan. Free.</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-6 grid gap-3">
        <input name="name" className="field" placeholder="Your name" autoComplete="name" aria-invalid={!!err.name} aria-label="Your name" />
        {err.name && <span className="-mt-1 text-[13px] text-stamp">{err.name}</span>}
        <input name="phone" type="tel" inputMode="tel" className="field" placeholder="Phone / WhatsApp" autoComplete="tel" aria-invalid={!!err.phone} aria-label="Phone or WhatsApp" />
        {err.phone && <span className="-mt-1 text-[13px] text-stamp">{err.phone}</span>}
        <input name="email" type="email" className="field" placeholder="Email (optional)" autoComplete="email" aria-invalid={!!err.email} aria-label="Email" />
        {err.email && <span className="-mt-1 text-[13px] text-stamp">{err.email}</span>}
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="business" className="field" placeholder="Business name" autoComplete="organization" aria-label="Business name" />
          <input name="site" className="field" placeholder="Website (optional)" inputMode="url" aria-label="Website" />
        </div>
      </div>
      {err.form && (
        <p className="mt-3 rounded-xl border border-stamp/40 bg-stamp/5 px-4 py-3 text-[15px] text-stamp" role="alert">
          {err.form}
        </p>
      )}
      <Button type="submit" size="lg" arrow={state !== "sending"} disabled={state === "sending"} className="mt-5 w-full">
        {state === "sending" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Sending
          </span>
        ) : (
          "Send me my plan"
        )}
      </Button>
    </form>
  );
}
