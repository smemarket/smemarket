"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Check, ChevronDown, CornerDownLeft, Pause, Play, TrendingDown, TrendingUp } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Button from "@/components/ui/Button";
import { WaveBottom } from "@/components/ui/Transitions";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* ───────────────────────── data ───────────────────────── */

type Agent = "Search" | "Ads" | "Enquiry desk" | "Social";
type Task = { id: number; agent: Agent; title: string; progress: number; state: "working" | "review" | "approved" };
type Approval = { id: number; kind: string; title: string; note: string; status: "pending" | "approved" | "changes" };

const TABS = ["Overview", "SEO", "Paid ads", "Social", "Enquiry desk", "Approvals", "Reports"] as const;
type Tab = (typeof TABS)[number];

const SEED: { agent: Agent; title: string }[] = [
  { agent: "Search", title: "Rewriting 3 service pages for AI answers" },
  { agent: "Ads", title: "Testing 4 new reel hooks on Meta" },
  { agent: "Enquiry desk", title: "Following up 11 open WhatsApp enquiries" },
  { agent: "Social", title: "Scheduling this week's posts and stories" },
  { agent: "Search", title: "Replying to 6 new Google reviews" },
  { agent: "Ads", title: "Moving budget to the best cost per enquiry" },
  { agent: "Social", title: "Editing Friday's behind-the-scenes reel" },
  { agent: "Enquiry desk", title: "Sending booking reminders for tomorrow" },
];

const APPROVALS: Approval[] = [
  { id: 1, kind: "Social", title: "Weekend offer reel", note: "Drafted by the social agent, checked by your account team", status: "pending" },
  { id: 2, kind: "Paid ads", title: "New headline set for Google Ads", note: "Three headlines, written around your best-rated service", status: "pending" },
  { id: 3, kind: "SEO", title: "Guide: choosing a salon in JLT", note: "1,200 words, targets 4 local searches", status: "pending" },
];

const CHART = [12, 14, 13, 18, 17, 22, 21, 27, 26, 31, 35, 34, 40, 44];

const KEYWORDS = [
  { k: "hair salon jlt", pos: 2, ch: 3, page: "/services/hair", next: "Add 4 more before-and-after photos to the page." },
  { k: "keratin treatment dubai", pos: 4, ch: 5, page: "/services/keratin", next: "Answer the top 3 price questions on the page." },
  { k: "bridal makeup dubai marina", pos: 7, ch: 2, page: "/bridal", next: "Collect 5 bridal reviews this month." },
  { k: "best salon near me", pos: 3, ch: 1, page: "Google Business Profile", next: "Post weekly offers on the profile." },
  { k: "nail art jumeirah", pos: 11, ch: -2, page: "/services/nails", next: "Rewrite the page title and add prices." },
];

const CAMPAIGNS = [
  { id: "a", name: "Weekend offer · Instagram", ch: "Meta", spend: 1240, leads: 31 },
  { id: "b", name: "Hair services · Search", ch: "Google", spend: 980, leads: 19 },
  { id: "c", name: "Bridal season · Reels", ch: "Meta", spend: 620, leads: 9 },
  { id: "d", name: "Brand name · Search", ch: "Google", spend: 160, leads: 6 },
];
const ADS_WEEK = [6, 9, 7, 11, 8, 14, 12];

const POSTS = [
  { day: "Mon", img: "/images/post-cafe.jpg", type: "Reel", cap: "Saturday mornings, sorted. New weekend brunch menu.", status: "Published", reach: "4.2k" },
  { day: "Tue", img: "/images/salon.jpg", type: "Post", cap: "Meet the team behind your Friday glow-up.", status: "Published", reach: "2.8k" },
  { day: "Wed", img: "/images/cafe.jpg", type: "Story", cap: "Behind the counter at 7am. Fresh every day.", status: "Published", reach: "1.9k" },
  { day: "Thu", img: "/images/clinic.jpg", type: "Carousel", cap: "5 questions to ask before your first treatment.", status: "Scheduled", reach: "" },
  { day: "Fri", img: "/images/owner.jpg", type: "Reel", cap: "Why we started this business, in 30 seconds.", status: "Scheduled", reach: "" },
  { day: "Sat", img: "/images/dubai-day.jpg", type: "Post", cap: "Weekend offer: 20% off before 12pm.", status: "Awaiting approval", reach: "" },
  { day: "Sun", img: "/images/team.jpg", type: "Story", cap: "Your reviews this week. Thank you.", status: "Drafting", reach: "" },
];

type Convo = { id: number; name: string; ch: "WhatsApp" | "Instagram" | "Website"; time: string; status: "New" | "Replied" | "Booked"; msgs: { me: boolean; t: string }[] };
const CONVOS: Convo[] = [
  { id: 1, name: "Fatima K.", ch: "WhatsApp", time: "2 min", status: "Replied", msgs: [{ me: false, t: "Hi, do you have a slot for a keratin treatment on Saturday?" }, { me: true, t: "Hi Fatima! Yes, we have 11am or 3pm on Saturday. Which suits you better?" }, { me: false, t: "3pm please" }] },
  { id: 2, name: "Daniel R.", ch: "Website", time: "14 min", status: "New", msgs: [{ me: false, t: "How much is a men's haircut and beard trim?" }, { me: true, t: "Hi Daniel, it's AED 120 for both, about 45 minutes. Want me to book you in this week?" }] },
  { id: 3, name: "Mariam A.", ch: "Instagram", time: "1 hr", status: "Booked", msgs: [{ me: false, t: "Is the bridal package still available for March?" }, { me: true, t: "It is! I've reserved 14 March for you and sent the details on WhatsApp." }, { me: false, t: "Perfect, thank you!" }] },
  { id: 4, name: "Omar S.", ch: "WhatsApp", time: "3 hr", status: "Replied", msgs: [{ me: false, t: "Are you open on Eid?" }, { me: true, t: "We're open on Eid from 2pm to 10pm. Shall I hold a slot for you?" }] },
];

const REPORTS = [
  { m: "October", headline: "Best month so far", stats: [["Enquiries", "48", "+18%"], ["Cost per enquiry", "AED 46", "-12%"], ["Google rating", "4.8", "+0.2"]], note: "Weekend reels drove a third of all enquiries. Next month we move more budget there and start the bridal season campaign." },
  { m: "September", headline: "Ads found their winner", stats: [["Enquiries", "41", "+11%"], ["Cost per enquiry", "AED 52", "-9%"], ["Google rating", "4.6", "+0.1"]], note: "The weekend offer creative beat the others by 2x. Search ads paused on low-intent keywords." },
  { m: "August", headline: "Foundations in place", stats: [["Enquiries", "37", "+6%"], ["Cost per enquiry", "AED 57", "-4%"], ["Google rating", "4.5", "+0.1"]], note: "New service pages went live, Google profile fully rebuilt, and the WhatsApp desk now replies 24/7." },
];

/* ───────────────────────── main ───────────────────────── */

export default function DashboardPreview() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [tasks, setTasks] = useState<Task[]>(() => SEED.slice(0, 4).map((t, i) => ({ ...t, id: i, progress: [72, 35, 10, 90][i], state: "working" })));
  const [enq, setEnq] = useState(44);
  const [approvals, setApprovals] = useState(APPROVALS);
  const next = useRef(4);
  const box = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const sec = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const st = { trigger: sec.current, start: "top bottom", end: "top 10%", scrub: true };
      const at = window.matchMedia("(max-width: 767px)").matches ? "50% 260px" : "50% 100%";
      gsap.fromTo("[data-portal]", { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-portal-content]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "none", scrollTrigger: { ...st, start: "top 55%" } });
    },
    { scope: sec },
  );

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.2 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setTasks((ts) => {
        let out = ts.map((t) => {
          if (t.state === "working") {
            const p = Math.min(100, t.progress + 4 + Math.random() * 9);
            return { ...t, progress: p, state: p >= 100 ? ("review" as const) : t.state };
          }
          if (t.state === "review" && Math.random() < 0.35) return { ...t, state: "approved" as const };
          return t;
        });
        const done = out.findIndex((t) => t.state === "approved");
        if (done !== -1 && Math.random() < 0.5) {
          const s = SEED[next.current % SEED.length];
          next.current++;
          out = [...out.slice(0, done), ...out.slice(done + 1), { ...s, id: next.current + 100, progress: 0, state: "working" }];
        }
        return out;
      });
      if (Math.random() < 0.25) setEnq((e) => e + 1);
    }, 900);
    return () => clearInterval(id);
  }, [live]);

  const pending = approvals.filter((a) => a.status === "pending");
  const decide = (id: number, status: Approval["status"]) => setApprovals((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));

  return (
    <section ref={sec} className="relative section-y text-paper">
      <div data-portal aria-hidden className="absolute inset-0 bg-ink" style={{ clipPath: "circle(150% at 50% 100%)" }} />
      <WaveBottom fill="fill-ink" />
      <div data-portal-content className="container-x relative">
        <SectionHead
          dark
          center
          eyebrow="Your client dashboard"
          title="See the work happen, not just the invoice."
          intro="Every task our agents run, what's waiting for your approval, and one clear number per service. Updated in real time."
        />

        <div ref={box} className="mx-auto mt-8 max-w-6xl md:mt-14 overflow-hidden rounded-2xl border border-rule-dark bg-ink-2">
          <div className="flex items-center justify-between border-b border-rule-dark px-5 py-3">
            <span className="text-[13px] text-paper/50">app.smemarket.ae</span>
            <span className="text-[13px] text-paper/50">Updated just now</span>
          </div>

          <div className="grid md:grid-cols-[200px_1fr]">
            <TabNav tab={tab} setTab={setTab} badge={pending.length} />
            <AutoHeight>
              <div key={tab} className="animate-[viewIn_.55s_cubic-bezier(.16,1,.3,1)_both]">
                {tab === "Overview" && <Overview enq={enq} tasks={tasks} first={pending[0]} decide={decide} onAll={() => setTab("Approvals")} />}
                {tab === "SEO" && <Seo tasks={tasks} />}
                {tab === "Paid ads" && <Ads tasks={tasks} />}
                {tab === "Social" && <Social tasks={tasks} />}
                {tab === "Enquiry desk" && <Enquiries enq={enq} />}
                {tab === "Approvals" && <Approvals items={approvals} decide={decide} />}
                {tab === "Reports" && <Reports />}
              </div>
            </AutoHeight>
          </div>
        </div>

        <div className="mt-8 flex justify-center md:mt-12">
          <Button href="/assessment" size="lg" variant="paper" arrow>
            See what yours would track
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── shell ───────────────────────── */

/** Sidebar on desktop, a swipeable pill row on phones, with an indicator that glides to the active tab. */
function TabNav({ tab, setTab, badge }: { tab: Tab; setTab: (t: Tab) => void; badge: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
      if (!el || !wrap.current) return;
      setInd({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
      const w = wrap.current;
      if (w.scrollWidth > w.clientWidth) w.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [tab]);

  return (
    <nav
      ref={wrap}
      aria-label="Dashboard sections"
      className="relative flex gap-1 overflow-x-auto border-b border-rule-dark p-3 [scrollbar-width:none] [mask-image:linear-gradient(to_right,#000_80%,transparent)] md:flex-col md:overflow-visible md:border-b-0 md:[mask-image:none] md:border-r md:p-4 [&::-webkit-scrollbar]:hidden"
    >
      {ind && <span aria-hidden className="absolute left-0 top-0 rounded-lg bg-paper/10 transition-all duration-500 ease-out-expo" style={{ transform: `translate(${ind.x}px, ${ind.y}px)`, width: ind.w, height: ind.h }} />}
      {TABS.map((l) => (
        <button
          key={l}
          data-tab={l}
          onClick={() => setTab(l)}
          aria-current={tab === l ? "page" : undefined}
          className={clsx("relative flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[15px] transition-colors duration-300", tab === l ? "text-paper" : "text-paper/55 hover:text-paper")}
        >
          {l}
          {l === "Approvals" && (
            <span className={clsx("grid min-w-5 place-items-center rounded-md bg-paper/15 px-1.5 text-[12px] font-semibold text-paper transition-all duration-500", badge ? "scale-100 opacity-100" : "scale-0 opacity-0")}>{badge || ""}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

/** Smoothly animates its height whenever the content inside changes size. */
function AutoHeight({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="min-w-0 overflow-hidden transition-[height] duration-500 ease-out-expo" style={{ height: h }}>
      <div ref={inner}>{children}</div>
    </div>
  );
}

function Kpis({ items }: { items: { l: string; v: string; d: string; bad?: boolean }[] }) {
  return (
    <div className="grid grid-cols-3 border-b border-rule-dark">
      {items.map((k, i) => (
        <div key={k.l} className={clsx("p-4 sm:p-5", i > 0 && "border-l border-rule-dark")}>
          <p className="text-[13px] text-paper/60">{k.l}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums sm:text-3xl">{k.v}</p>
          <p className={clsx("mt-1 hidden text-[13px] sm:block", k.bad ? "text-[#f2a07e]" : "text-lime")}>{k.d}</p>
        </div>
      ))}
    </div>
  );
}

function Activity({ tasks, only }: { tasks: Task[]; only?: Agent }) {
  const list = only ? tasks.filter((t) => t.agent === only) : tasks;
  return (
    <div className="border-t border-rule-dark p-5 lg:border-t-0">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[15px] font-medium">{only ? `${only} agent` : "Agent activity"}</p>
        <span className="text-[13px] text-paper/50">Real time</span>
      </div>
      {list.length === 0 && <p className="py-6 text-[15px] text-paper/50">Between tasks. Next one starts in a moment.</p>}
      <ul>
        {list.map((t) => (
          <li key={t.id} className="animate-[fadeIn_.5s_ease] border-b border-rule-dark py-3.5 last:border-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] text-paper/55">{t.agent} agent</span>
              <StateBadge s={t.state} />
            </div>
            <p className="mt-1 text-[15px] leading-snug">{t.title}</p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-paper/10">
              <div className={clsx("h-full rounded-full transition-[width] duration-700", t.state === "working" ? "bg-paper/50" : "bg-lime")} style={{ width: `${t.progress}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Split({ children, side }: { children: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0 border-rule-dark lg:border-r">{children}</div>
      <div className="hidden min-w-0 md:block">{side}</div>
    </div>
  );
}

/* ───────────────────────── views ───────────────────────── */

function Overview({ enq, tasks, first, decide, onAll }: { enq: number; tasks: Task[]; first?: Approval; decide: (id: number, s: Approval["status"]) => void; onAll: () => void }) {
  const max = Math.max(...CHART, enq);
  const pts = [...CHART.slice(0, -1), enq].map((v, i, a) => `${(i / (a.length - 1)) * 100},${100 - (v / max) * 88}`).join(" ");
  return (
    <Split side={<Activity tasks={tasks} />}>
      <Kpis items={[{ l: "Enquiries this month", v: String(enq), d: "+18% vs last month" }, { l: "Cost per enquiry", v: "AED 46", d: "-12% vs last month" }, { l: "First reply", v: "9 sec", d: "24/7" }]} />
      <div className="border-b border-rule-dark p-4 sm:p-5">
        <p className="text-[15px] font-medium">Enquiries, last 14 weeks</p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-24 w-full animate-[wipeIn_1.4s_cubic-bezier(.65,0,.35,1)_both] overflow-visible sm:h-44">
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(242,238,230,.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <polyline points={pts} fill="none" stroke="#d4ff3f" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
      </div>
      {first ? (
        <div key={first.id} className="flex animate-[fadeIn_.4s_ease] flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-lime">Needs your approval</p>
            <p className="mt-1 font-medium">{first.title}</p>
            <p className="text-[14px] text-paper/55">{first.note}</p>
          </div>
          <button onClick={() => decide(first.id, "approved")} className="h-11 shrink-0 rounded-[10px] bg-paper px-6 text-[15px] font-semibold text-ink transition hover:bg-white active:scale-95">
            Approve
          </button>
        </div>
      ) : (
        <div className="flex animate-[fadeIn_.4s_ease] items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[13px] font-semibold text-lime">✓ All caught up</p>
            <p className="mt-1 font-medium">Nothing waiting for you</p>
          </div>
          <button onClick={onAll} className="text-[14px] text-paper/60 underline-offset-4 hover:text-paper hover:underline">
            See approvals
          </button>
        </div>
      )}
    </Split>
  );
}

function Seo({ tasks }: { tasks: Task[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Split side={<Activity tasks={tasks} only="Search" />}>
      <Kpis items={[{ l: "Keywords in top 3", v: "14", d: "+5 this month" }, { l: "Google Maps views", v: "2,310", d: "+22% vs last month" }, { l: "Google rating", v: "4.8", d: "126 reviews" }]} />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-[13px] text-paper/50">
          <span>Search term</span>
          <span>Position</span>
        </div>
        <ul>
          {KEYWORDS.map((k, i) => (
            <li key={k.k} className="border-b border-rule-dark last:border-0">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 py-3 text-left">
                <span className="flex min-w-0 items-center gap-2 text-[15px]">
                  <ChevronDown className={clsx("size-4 shrink-0 text-paper/40 transition-transform duration-300", open === i && "rotate-180")} />
                  <span className="truncate">{k.k}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 tabular-nums">
                  <span className={clsx("flex items-center gap-1 text-[13px]", k.ch > 0 ? "text-lime" : "text-[#f2a07e]")}>
                    {k.ch > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {Math.abs(k.ch)}
                  </span>
                  <span className="w-8 text-right text-[17px] font-semibold">#{k.pos}</span>
                </span>
              </button>
              <div className={clsx("grid transition-[grid-template-rows] duration-500 ease-out-expo", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="pb-3 pl-6 text-[14px] text-paper/60">
                    Ranking page: <span className="text-paper/85">{k.page}</span>
                    <br />
                    Next step: <span className="text-paper/85">{k.next}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Split>
  );
}

function Ads({ tasks }: { tasks: Task[] }) {
  const [on, setOn] = useState<Record<string, boolean>>({ a: true, b: true, c: true, d: false });
  const live = CAMPAIGNS.filter((c) => on[c.id]);
  const spend = live.reduce((s, c) => s + c.spend, 0);
  const leads = live.reduce((s, c) => s + c.leads, 0);
  const max = Math.max(...ADS_WEEK);
  return (
    <Split side={<Activity tasks={tasks} only="Ads" />}>
      <Kpis items={[{ l: "Spend this month", v: `AED ${spend.toLocaleString()}`, d: `${live.length} campaigns live` }, { l: "Leads", v: String(leads), d: "+21% vs last month" }, { l: "Cost per lead", v: leads ? `AED ${Math.round(spend / leads)}` : "–", d: "-12% vs last month" }]} />
      <div className="border-b border-rule-dark p-5">
        <p className="text-[15px] font-medium">Leads, last 7 days</p>
        <div className="mt-4 flex h-24 items-end gap-2">
          {ADS_WEEK.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="w-full origin-bottom animate-[barUp_.8s_cubic-bezier(.16,1,.3,1)_both] rounded-t-md bg-lime/80" style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 60}ms` }} />
              <span className="text-[11px] text-paper/40">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
      <ul className="p-3">
        {CAMPAIGNS.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5">
            <div className="min-w-0">
              <p className={clsx("truncate text-[15px] transition-opacity duration-300", !on[c.id] && "opacity-50")}>{c.name}</p>
              <p className="text-[13px] text-paper/50">
                {c.ch} · {on[c.id] ? `${c.leads} leads` : "Paused"}
              </p>
            </div>
            <button
              onClick={() => setOn((o) => ({ ...o, [c.id]: !o[c.id] }))}
              aria-label={on[c.id] ? `Pause ${c.name}` : `Resume ${c.name}`}
              className={clsx("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", on[c.id] ? "bg-lime" : "bg-paper/15")}
            >
              <span className={clsx("absolute top-1 grid size-5 place-items-center rounded-full bg-ink transition-all duration-300 ease-out-expo", on[c.id] ? "left-6" : "left-1")}>
                {on[c.id] ? <Play className="size-2.5 fill-lime text-lime" /> : <Pause className="size-2.5 text-paper/60" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Split>
  );
}

function Social({ tasks }: { tasks: Task[] }) {
  const [day, setDay] = useState(3);
  const p = POSTS[day];
  return (
    <Split side={<Activity tasks={tasks} only="Social" />}>
      <Kpis items={[{ l: "Reach this week", v: "8.9k", d: "+31% vs last week" }, { l: "Posts", v: "7", d: "3 published" }, { l: "Profile visits", v: "612", d: "+14% vs last week" }]} />
      <div className="p-5">
        <p className="text-[15px] font-medium">This week</p>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {POSTS.map((x, i) => (
            <button key={x.day} onClick={() => setDay(i)} className={clsx("group relative aspect-[3/4] overflow-hidden rounded-lg ring-2 transition-all duration-300", i === day ? "ring-lime" : "ring-transparent hover:ring-paper/30")} aria-label={`${x.day}: ${x.cap}`}>
              <Image src={x.img} alt="" fill sizes="80px" className={clsx("object-cover transition-all duration-500", i === day ? "scale-105" : "opacity-60 group-hover:opacity-90")} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent pb-1 pt-4 text-center text-[11px] font-semibold">{x.day}</span>
            </button>
          ))}
        </div>
        <div key={day} className="mt-4 flex animate-[fadeIn_.4s_ease] gap-4 rounded-xl bg-paper/5 p-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
            <Image src={p.img} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-paper/50">
              {p.day} · {p.type} · <span className={clsx(p.status === "Published" ? "text-lime" : p.status === "Awaiting approval" ? "text-[#f2c14e]" : "text-paper/70")}>{p.status}</span>
            </p>
            <p className="mt-1 text-[15px] leading-snug">{p.cap}</p>
            {p.reach && <p className="mt-1 text-[13px] text-paper/50">Reach {p.reach}</p>}
          </div>
        </div>
      </div>
    </Split>
  );
}

function Enquiries({ enq }: { enq: number }) {
  const [convos, setConvos] = useState(CONVOS);
  const [sel, setSel] = useState(1);
  const c = convos.find((x) => x.id === sel)!;
  const book = () => setConvos((cs) => cs.map((x) => (x.id === sel ? { ...x, status: "Booked" } : x)));
  return (
    <div>
      <Kpis items={[{ l: "Enquiries this month", v: String(enq), d: "+18% vs last month" }, { l: "First reply", v: "9 sec", d: "24/7" }, { l: "Booked", v: `${convos.filter((x) => x.status === "Booked").length + 21}`, d: "from enquiries" }]} />
      <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
        <ul className="border-rule-dark p-2 sm:border-r">
          {convos.map((x) => (
            <li key={x.id}>
              <button onClick={() => setSel(x.id)} className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-300", sel === x.id ? "bg-paper/10" : "hover:bg-paper/5")}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper/10 text-[14px] font-semibold">{x.name[0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-medium">{x.name}</span>
                    <span className="shrink-0 text-[12px] text-paper/40">{x.time}</span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] text-paper/50">{x.ch}</span>
                    <Status s={x.status} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div key={sel} className="flex animate-[fadeIn_.4s_ease] flex-col border-t border-rule-dark p-4 sm:border-t-0">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium">
              {c.name} <span className="text-[13px] font-normal text-paper/50">· {c.ch}</span>
            </p>
            <Status s={c.status} />
          </div>
          <div className="mt-3 flex-1 space-y-2">
            {c.msgs.map((m, i) => (
              <div key={i} className={clsx("flex", m.me ? "justify-end" : "justify-start")}>
                <p className={clsx("max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug", m.me ? "rounded-br-md bg-lime text-ink" : "rounded-bl-md bg-paper/10")}>{m.t}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule-dark pt-3">
            <span className="flex items-center gap-1.5 text-[13px] text-paper/50">
              <CornerDownLeft className="size-3.5" /> Replied by the enquiry agent
            </span>
            {c.status !== "Booked" ? (
              <button onClick={book} className="h-9 shrink-0 rounded-lg bg-paper px-4 text-[14px] font-semibold text-ink transition hover:bg-white active:scale-95">
                Mark booked
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[14px] font-medium text-lime">
                <Check className="size-4" /> Booked
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Approvals({ items, decide }: { items: Approval[]; decide: (id: number, s: Approval["status"]) => void }) {
  const left = items.filter((a) => a.status === "pending").length;
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium">Waiting for you</p>
        <p className="text-[13px] text-paper/50">{left ? `${left} to review` : "✓ All caught up"}</p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((a) => (
          <li key={a.id} className={clsx("flex flex-col gap-4 rounded-xl border p-4 transition-all duration-500 sm:flex-row sm:items-center sm:justify-between", a.status === "pending" ? "border-rule-dark bg-paper/[.03]" : "border-transparent bg-paper/[.02] opacity-70")}>
            <div>
              <p className="text-[13px] text-paper/50">{a.kind}</p>
              <p className="mt-0.5 font-medium">{a.title}</p>
              <p className="text-[14px] text-paper/55">{a.note}</p>
            </div>
            {a.status === "pending" ? (
              <div className="flex shrink-0 gap-2">
                <button onClick={() => decide(a.id, "changes")} className="h-10 rounded-[10px] border border-paper/20 px-4 text-[14px] font-medium text-paper/80 transition hover:border-paper/50 hover:text-paper">
                  Ask for changes
                </button>
                <button onClick={() => decide(a.id, "approved")} className="h-10 rounded-[10px] bg-paper px-5 text-[14px] font-semibold text-ink transition hover:bg-white active:scale-95">
                  Approve
                </button>
              </div>
            ) : (
              <span className="flex shrink-0 animate-[fadeIn_.4s_ease] items-center gap-3">
                <span className={clsx("rounded-full px-3 py-1.5 text-[13px] font-semibold", a.status === "approved" ? "bg-lime text-ink" : "bg-[#f2c14e] text-ink")}>{a.status === "approved" ? "✓ Approved" : "Changes requested"}</span>
                <button onClick={() => decide(a.id, "pending")} className="text-[13px] text-paper/50 underline-offset-4 hover:text-paper hover:underline">
                  Undo
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reports() {
  const [open, setOpen] = useState(0);
  return (
    <div className="p-5">
      <p className="text-[15px] font-medium">Monthly reports</p>
      <ul className="mt-3 space-y-2.5">
        {REPORTS.map((r, i) => (
          <li key={r.m} className={clsx("rounded-xl border transition-colors duration-300", open === i ? "border-paper/20 bg-paper/[.04]" : "border-rule-dark")}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
              <span>
                <span className="block text-[13px] text-paper/50">{r.m} report</span>
                <span className="block font-medium">{r.headline}</span>
              </span>
              <ChevronDown className={clsx("size-5 shrink-0 text-paper/50 transition-transform duration-300", open === i && "rotate-180")} />
            </button>
            <div className={clsx("grid transition-[grid-template-rows] duration-500 ease-out-expo", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {r.stats.map(([l, v, d]) => (
                      <div key={l} className="rounded-lg bg-paper/5 p-3">
                        <p className="text-[12px] text-paper/50">{l}</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{v}</p>
                        <p className="text-[12px] text-lime">{d}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-paper/65">{r.note}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── bits ───────────────────────── */

function Status({ s }: { s: Convo["status"] }) {
  return <span className={clsx("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300", s === "New" ? "bg-[#f2c14e] text-ink" : s === "Booked" ? "bg-lime text-ink" : "bg-paper/10 text-paper/70")}>{s}</span>;
}

function StateBadge({ s }: { s: Task["state"] }) {
  const map = {
    working: ["Working", "text-paper/60"],
    review: ["In review", "text-[#f2c14e]"],
    approved: ["✓ Approved", "text-lime"],
  } as const;
  const [l, c] = map[s];
  return <span className={clsx("text-[13px] font-medium", c)}>{l}</span>;
}
