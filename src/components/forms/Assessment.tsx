"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import { ArrowLeft, Check, Loader2, Sparkles, Phone, Gauge, Clock, ShieldCheck } from "lucide-react";
import { SERVICES, MONTHLY, BUNDLE_PRICE, BUNDLE_SAVING, SITE, aed, waLink } from "@/lib/site";
import { submitLead, isEmail, isPhone } from "@/lib/leads";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { usePlan } from "@/components/plan/Plan";

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

  if (stage === "intro")
    return (
      <div className="mx-auto max-w-3xl animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] text-center">
        <p className="label text-muted">Free growth assessment</p>
        <h1 className="display mt-5 text-[clamp(2.4rem,min(4.8vw,8.5vh),4.6rem)]">
          Find your leaks <em>in 2 minutes.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-2">Ten quick questions. You&apos;ll get a growth score across search, ads, outreach, social, enquiries and website, and exactly what to fix first.</p>
        <div className="mt-10 flex justify-center">
          <Button onClick={() => setStage("quiz")} size="lg" arrow>
            Start my assessment
          </Button>
        </div>
        <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-4 text-sm text-muted">
          <span className="flex flex-col items-center gap-2">
            <Clock className="size-5 text-stamp" /> 2 minutes
          </span>
          <span className="flex flex-col items-center gap-2">
            <Gauge className="size-5 text-stamp" /> Instant score
          </span>
          <span className="flex flex-col items-center gap-2">
            <ShieldCheck className="size-5 text-stamp" /> Free, no obligation
          </span>
        </div>
      </div>
    );

  if (stage === "quiz")
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between font-mono text-xs text-muted">
          <button onClick={() => (step === 0 ? setStage("intro") : setStep((s) => s - 1))} className="flex items-center gap-1.5 transition hover:text-ink">
            <ArrowLeft className="size-3.5" /> Back
          </button>
          <span>
            {String(step + 1).padStart(2, "0")} / {QUESTIONS.length}
          </span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-ink transition-all duration-500 ease-out-expo" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>

        <div key={q.id} className="mt-12 animate-[fadeIn_.5s_ease]">
          {q.area && <p className="label text-muted">{q.area}</p>}
          <h1 className="display mt-4 text-[clamp(1.9rem,3.6vw,2.8rem)]">{q.q}</h1>
          <div className="mt-10 grid gap-3">
            {q.options.map((o, i) => {
              const on = answers[q.id] === i;
              return (
                <button
                  key={o.l}
                  onClick={() => choose(i)}
                  className={clsx(
                    "group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left text-lg transition-all duration-300",
                    on ? "border-ink bg-card" : "border-rule-strong bg-card/50 hover:border-ink hover:bg-card",
                  )}
                >
                  <span className={clsx("grid size-8 shrink-0 place-items-center rounded-lg border font-mono text-xs transition", on ? "border-ink bg-ink text-paper" : "border-rule-strong text-muted group-hover:border-ink")}>
                    {on ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  </span>
                  {o.l}
                </button>
              );
            })}
          </div>
          <p className="mt-6 hidden font-mono text-xs text-muted md:block">Tip: press 1–{q.options.length} to answer</p>
        </div>
      </div>
    );

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

function Scanning() {
  const lines = ["Reading your answers", "Checking search and Google profile", "Scoring ads and social", "Measuring enquiry speed", "Building your recommendations"];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => Math.min(lines.length, x + 1)), 480);
    return () => clearInterval(id);
  }, [lines.length]);
  return (
    <div className="mx-auto flex max-w-md animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] flex-col items-center py-16 text-center" role="status">
      <div className="relative grid size-28 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-stamp/15" />
        <span className="absolute inset-3 rounded-full border border-ink/30" />
        <Sparkles className="size-9 text-stamp" />
      </div>
      <h2 className="display mt-10 text-3xl">Our agents are scoring your business…</h2>
      <ul className="mt-8 w-full space-y-3 text-left">
        {lines.map((l, i) => (
          <li key={l} className={clsx("flex items-center gap-3 text-sm transition-all duration-500", i < n ? "text-ink opacity-100" : "opacity-30")}>
            {i < n ? <Check className="size-4 text-stamp" /> : <Loader2 className="size-4 animate-spin" />}
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setShown(Math.round(result.total * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result.total]);

  const verdict = result.total >= 75 ? "Strong. Let's scale it." : result.total >= 50 ? "Solid base, real leaks." : result.total >= 25 ? "Lots of upside here." : "Big opportunity. Start now.";
  const C = 2 * Math.PI * 88;

  return (
    <div className="mx-auto max-w-6xl animate-[pageIn_.7s_cubic-bezier(.16,1,.3,1)_both]">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Gauge */}
        <div className="rounded-sm border border-rule bg-card p-8 text-center">
          <p className="label text-muted">Your growth score</p>
          <div className="relative mx-auto mt-6 size-56">
            <svg viewBox="0 0 200 200" className="size-full -rotate-90">
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(21,19,15,.1)" strokeWidth="12" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#15130f" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - shown / 100)} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <p className="text-7xl font-semibold tracking-tight tabular-nums">{shown}</p>
                <p className="font-mono text-xs text-muted">out of 100</p>
              </div>
            </div>
          </div>
          <p className="display mt-6 text-2xl">{verdict}</p>
          <button onClick={onRetake} className="mt-3 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Retake
          </button>
        </div>

        {/* Areas */}
        <div className="rounded-sm border border-rule bg-card p-8">
          <p className="label text-muted">By area</p>
          <ul className="mt-6 space-y-5">
            {result.list.map((a, i) => (
              <li key={a.area}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{a.area}</span>
                  <span className={clsx("font-mono", a.pct < 40 ? "text-stamp" : a.pct < 67 ? "text-[#b7791f]" : "text-[#3f7d20]")}>{a.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={clsx("h-full rounded-full transition-all duration-1000 ease-out-expo", a.pct < 40 ? "bg-stamp" : a.pct < 67 ? "bg-[#e0a33a]" : "bg-ink")}
                    style={{ width: `${Math.max(4, a.pct)}%`, transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fixes */}
      {result.weak.length > 0 && (
        <div className="mt-6 rounded-sm border border-rule bg-card p-8">
          <p className="label text-muted">Fix these first</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {result.weak.slice(0, 3).map((w, i) => (
              <div key={w.area} className="rounded-sm border border-rule bg-paper p-6">
                <span className="font-mono text-xs text-stamp">
                  #{i + 1} · {w.area}
                </span>
                <p className="mt-3 text-ink-2">{AREA_FIX[w.area]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-sm border-2 border-ink bg-card p-8">
          <p className="label text-muted">Recommended for you</p>
          <div className="mt-6 grid gap-3">
            {result.recs.map((s) => (
              <a key={s.slug} href={`/services/${s.slug}`} className="flex items-center justify-between gap-4 border-b border-rule py-4 transition hover:bg-paper">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-ink text-paper">
                    <Icon name={s.icon} className="size-[18px]" />
                  </span>
                  <span>
                    <span className="block font-semibold">{s.name}</span>
                    <span className="block text-xs text-muted">KPI: {s.kpi}</span>
                  </span>
                </span>
                <span className="font-mono text-sm">
                  {aed(s.price)}
                  <span className="text-muted">{s.billing === "month" ? "/mo" : " once"}</span>
                </span>
              </a>
            ))}
          </div>
          {result.suggestBundle && (
            <div className="mt-5 bg-ink p-5 text-paper">
              <p className="font-semibold">Better value: the full bundle</p>
              <p className="mt-1 text-sm text-paper/70">
                All 5 monthly services for {aed(BUNDLE_PRICE)}/month. That&apos;s {aed(BUNDLE_SAVING)} off every month
                {result.monthlySum > 0 && result.monthlySum < BUNDLE_PRICE ? `, only ${aed(BUNDLE_PRICE - result.monthlySum)} more than these alone` : ""}.
              </p>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={openPlan} size="lg" arrow>
              Add these to my plan
            </Button>
            <Button href={waLink(`Hi SME Market, I just scored ${result.total}/100 on the growth assessment. Can we talk about ${result.recs.map((r) => r.name).join(", ")}?`)} size="lg" variant="outline" icon={<WhatsAppIcon />}>
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
      <div className="flex animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] flex-col justify-center rounded-sm border border-rule bg-card p-8" role="status">
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
    <form onSubmit={onSubmit} noValidate className="rounded-sm border border-rule bg-card p-8">
      <p className="label text-muted">Free growth plan</p>
      <h3 className="display mt-3 text-3xl">Get the full plan, written for your business.</h3>
      <p className="mt-2 text-sm text-muted">We&apos;ll look at your actual site and Google profile, and send a written plan. Free.</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-6 grid gap-3">
        <input name="name" className="field" placeholder="Your name" autoComplete="name" aria-invalid={!!err.name} aria-label="Your name" />
        {err.name && <span className="-mt-1 text-xs text-stamp">{err.name}</span>}
        <input name="phone" type="tel" inputMode="tel" className="field" placeholder="Phone / WhatsApp" autoComplete="tel" aria-invalid={!!err.phone} aria-label="Phone or WhatsApp" />
        {err.phone && <span className="-mt-1 text-xs text-stamp">{err.phone}</span>}
        <input name="email" type="email" className="field" placeholder="Email (optional)" autoComplete="email" aria-invalid={!!err.email} aria-label="Email" />
        {err.email && <span className="-mt-1 text-xs text-stamp">{err.email}</span>}
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="business" className="field" placeholder="Business name" autoComplete="organization" aria-label="Business name" />
          <input name="site" className="field" placeholder="Website (optional)" inputMode="url" aria-label="Website" />
        </div>
      </div>
      {err.form && (
        <p className="mt-3 rounded-lg border border-stamp/40 bg-stamp/5 px-4 py-3 text-sm text-stamp" role="alert">
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
