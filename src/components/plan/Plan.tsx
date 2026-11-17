"use client";
import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Check, Plus, X, Trash2, Sparkles, ShoppingBag } from "lucide-react";
import { SERVICES, MONTHLY, MONTHLY_TOTAL, BUNDLE_PRICE, BUNDLE_SAVING, aed, waLink } from "@/lib/site";
import { useEnquiry } from "@/components/forms/EnquiryModal";
import { getLenis } from "@/components/layout/SmoothScroll";
import { gsap } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const KEY = "smemarket.plan.v1";

export function computePlan(sel: string[]) {
  const chosen = MONTHLY.filter((s) => sel.includes(s.slug));
  const sum = chosen.reduce((a, s) => a + s.price, 0);
  const bundle = chosen.length === MONTHLY.length;
  const monthly = bundle ? BUNDLE_PRICE : sum;
  const site = sel.includes("website-redesign");
  const missing = MONTHLY.filter((s) => !sel.includes(s.slug));
  const names = SERVICES.filter((s) => sel.includes(s.slug)).map((s) => s.name);
  const summary = `${names.join(", ")}. ${monthly ? `${aed(monthly)}/month` : ""}${site ? `${monthly ? " + " : ""}AED 5,000 one-time` : ""}`;
  return { chosen, sum, bundle, monthly, site, missing, toBundle: BUNDLE_PRICE - sum, names, summary };
}

type PlanCtx = {
  items: string[];
  has: (slug: string) => boolean;
  /** pass the clicked element to get the fly-to-cart animation */
  toggle: (slug: string, from?: Element | null) => void;
  add: (slug: string, from?: Element | null) => void;
  remove: (slug: string) => void;
  setAll: (slugs: string[]) => void;
  openDrawer: () => void;
  start: () => void;
};

const Ctx = createContext<PlanCtx | null>(null);
export const usePlan = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlan must be used inside PlanProvider");
  return c;
};

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The visible cart icon (desktop or mobile header). */
function cartTarget(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]"));
  return all.find((el) => el.getBoundingClientRect().width > 0) ?? null;
}

/** A thumbnail of the service flies in an arc from the button into the cart. */
function flyToCart(from: Element, img: string, onLand: () => void) {
  const target = cartTarget();
  if (!target || reduced()) return onLand();
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = 56;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "999px",
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 0 3px #d4ff3f, 0 18px 40px -10px rgba(21,19,15,.6)",
    zIndex: "90",
    pointerEvents: "none",
  });
  document.body.appendChild(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const tl = gsap.timeline({
    onComplete: () => {
      el.remove();
      onLand();
    },
  });
  tl.fromTo(el, { scale: 0.4, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.25, ease: "back.out(2)" })
    .to(el, { x: dx, duration: 0.75, ease: "power1.inOut" }, 0.2)
    .to(el, { y: dy, duration: 0.75, ease: "back.in(1.4)" }, 0.2)
    .to(el, { scale: 0.3, duration: 0.75, ease: "power2.in" }, 0.2);
}

export default function PlanProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [opens, setOpens] = useState(0);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openEnquiry = useEnquiry();
  const pathname = usePathname();

  // restore the visitor's plan (per-browser convenience only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((s) => SERVICES.some((x) => x.slug === s)));
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    const close = () => setDrawer(false);
    window.addEventListener("smem:navigate", close);
    return () => window.removeEventListener("smem:navigate", close);
  }, []);
  useEffect(() => {
    const l = getLenis();
    if (drawer) l?.stop();
    else l?.start();
    document.body.style.overflow = drawer ? "hidden" : "";
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const notify = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const svc = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

  // the cart updates (and is saved) immediately; the flight and bump are purely visual
  const celebrate = useCallback(
    (slug: string) => {
      setBump((b) => b + 1);
      notify(`${svc(slug).name} added to your plan`);
    },
    [notify],
  );

  const add = useCallback(
    (slug: string, from?: Element | null) => {
      if (items.includes(slug)) return;
      setItems((s) => (s.includes(slug) ? s : [...s, slug]));
      setFresh(slug);
      if (from) flyToCart(from, svc(slug).image, () => celebrate(slug));
      else celebrate(slug);
    },
    [items, celebrate],
  );

  // removal slides out and collapses before the item actually leaves the list
  const remove = useCallback((slug: string) => {
    setLeaving((l) => [...l, slug]);
    setTimeout(
      () => {
        setItems((s) => s.filter((x) => x !== slug));
        setLeaving((l) => l.filter((x) => x !== slug));
        setBump((b) => b + 1);
      },
      reduced() ? 0 : 380,
    );
  }, []);

  const toggle = useCallback(
    (slug: string, from?: Element | null) => {
      if (items.includes(slug)) remove(slug);
      else add(slug, from);
    },
    [items, add, remove],
  );
  const has = useCallback((slug: string) => items.includes(slug), [items]);
  const setAll = useCallback((slugs: string[]) => {
    setItems(slugs);
    setBump((b) => b + 1);
  }, []);
  const openDrawer = useCallback(() => {
    setOpens((o) => o + 1);
    setDrawer(true);
  }, []);

  const calc = useMemo(() => computePlan(items), [items]);

  const start = useCallback(() => {
    setDrawer(false);
    openEnquiry({
      type: "plan",
      title: "Start your growth plan",
      subtitle: items.length ? `Your plan: ${calc.summary}. Our team will confirm the details and get you set up.` : undefined,
      services: items,
      meta: { monthly: calc.monthly, oneTime: calc.site ? 5000 : 0, bundle: calc.bundle },
    });
  }, [openEnquiry, items, calc]);

  const value = useMemo(() => ({ items, has, toggle, add, remove, setAll, openDrawer, start }), [items, has, toggle, add, remove, setAll, openDrawer, start]);

  return (
    <Ctx.Provider value={value}>
      <BumpCtx.Provider value={bump}>{children}</BumpCtx.Provider>

      {/* toast */}
      <div aria-live="polite" className={clsx("pointer-events-none fixed inset-x-0 top-[92px] z-[70] flex justify-center px-4 transition-all duration-500 ease-out-expo", toast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0")}>
        {toast && (
          <div key={toast.id} className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-2 text-paper shadow-2xl">
            <span className="grid size-8 animate-[pop_.45s_ease] place-items-center rounded-full bg-lime text-ink">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <span className="text-[15px]">{toast.text}</span>
            <button onClick={openDrawer} className="rounded-full bg-paper px-4 py-1.5 text-[14px] font-semibold text-ink hover:bg-lime">
              View cart
            </button>
          </div>
        )}
      </div>

      {/* cart drawer */}
      <div className={clsx("fixed inset-0 z-[65]", drawer ? "visible" : "invisible delay-500")} aria-hidden={!drawer}>
        <div className={clsx("absolute inset-0 bg-ink/45 backdrop-blur-[3px] transition-opacity duration-500", drawer ? "opacity-100" : "opacity-0")} onClick={() => setDrawer(false)} />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Your cart"
          data-lenis-prevent
          className={clsx(
            "absolute bottom-3 right-3 top-3 flex w-[calc(100%-24px)] max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-paper shadow-2xl transition-[transform,opacity] duration-[600ms] ease-out-expo",
            drawer ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-60",
          )}
        >
          <div className="flex items-center justify-between border-b border-rule px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-ink text-lime">
                <ShoppingBag className="size-5" />
              </span>
              <div>
                <p className="text-[21px] font-semibold leading-tight">Your cart</p>
                <p className="text-[14px] text-muted">{items.length ? `${items.length} service${items.length > 1 ? "s" : ""}` : "Nothing added yet"}</p>
              </div>
            </div>
            <button onClick={() => setDrawer(false)} aria-label="Close cart" className="grid size-10 place-items-center rounded-full border border-rule-strong transition duration-300 hover:rotate-90 hover:bg-ink hover:text-paper">
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {items.length === 0 && (
              <div key={`empty-${opens}`} className="animate-[fadeIn_.5s_ease_both] py-6 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-paper-2">
                  <ShoppingBag className="size-7 text-muted" />
                </span>
                <p className="mt-4 text-ink-2">Your cart is empty. Add services from any page.</p>
              </div>
            )}
            <ul>
              {SERVICES.filter((s) => items.includes(s.slug)).map((s, i) => {
                const out = leaving.includes(s.slug);
                return (
                  <li key={`${s.slug}-${opens}`} className={clsx("grid transition-[grid-template-rows,opacity,margin] duration-[380ms] ease-out-expo", out ? "mb-0 grid-rows-[0fr] opacity-0" : "mb-3 grid-rows-[1fr] opacity-100")}>
                    <div className="overflow-hidden">
                      <div
                        className={clsx("flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-rule transition-transform duration-[380ms] ease-out-expo", out && "translate-x-16")}
                        style={{ animation: `slideInRight .55s cubic-bezier(.16,1,.3,1) ${fresh === s.slug ? 0 : i * 70 + 150}ms both` }}
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                          <Image quality={90} src={s.image} alt="" fill sizes="56px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-semibold leading-tight">{s.name}</span>
                          <span className="block text-[14px] text-muted">
                            {aed(s.price)} {s.billing === "month" ? "/ month" : "one-time"}
                          </span>
                        </span>
                        <button onClick={() => remove(s.slug)} aria-label={`Remove ${s.name}`} className="grid size-9 place-items-center rounded-full text-muted transition duration-300 hover:scale-110 hover:bg-[#f6dcd2] hover:text-stamp">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {SERVICES.some((s) => !items.includes(s.slug)) && (
              <div className="mt-6">
                <p className="text-[14px] font-semibold text-muted">Add more</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SERVICES.filter((s) => !items.includes(s.slug)).map((s) => (
                    <button key={s.slug} onClick={() => add(s.slug)} className="flex animate-[fadeIn_.4s_ease_both] items-center gap-1.5 rounded-full border border-rule-strong bg-card px-3.5 py-2 text-[14px] font-medium transition duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper">
                      <Plus className="size-3.5" /> {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-rule bg-card px-6 py-5">
            <div className={clsx("grid transition-all duration-500 ease-out-expo", calc.chosen.length > 0 && !calc.bundle ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="mb-3 rounded-xl bg-paper-2 px-4 py-2.5 text-[14px]">
                  {calc.toBundle <= 0 ? (
                    <>
                      Add the other {calc.missing.length} monthly service{calc.missing.length > 1 ? "s" : ""} and pay <b>{aed(-calc.toBundle)} less</b> a month.
                    </>
                  ) : (
                    <>
                      <b>{aed(Math.max(0, calc.toBundle))} more</b> a month gets all five monthly services.
                    </>
                  )}{" "}
                  <button onClick={() => setAll(Array.from(new Set([...items, ...MONTHLY.map((m) => m.slug)])))} className="font-semibold underline underline-offset-4">
                    Add all
                  </button>
                </p>
              </div>
            </div>
            <div className={clsx("grid transition-all duration-500 ease-out-expo", calc.bundle ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="mb-3 flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-[14px] font-semibold">
                  <Sparkles className="size-4" /> Bundle price: you save {aed(BUNDLE_SAVING)} a month
                </p>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] text-muted">Monthly</span>
              <span>
                <span className={clsx("mr-2 text-[15px] text-muted line-through transition-opacity duration-500", calc.bundle ? "opacity-100" : "opacity-0")}>{aed(MONTHLY_TOTAL)}</span>
                <CountUp value={calc.monthly} className="text-[26px] font-semibold" />
              </span>
            </div>
            <div className={clsx("grid transition-all duration-500", calc.site ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="flex items-baseline justify-between overflow-hidden text-[15px]">
                <span className="text-muted">One-time</span>
                <span className="font-semibold">AED 5,000</span>
              </div>
            </div>
            <div className="mt-4 grid gap-2.5">
              <Button onClick={start} size="lg" arrow disabled={items.length === 0} className="w-full">
                Start this plan
              </Button>
              <Button href={waLink(`Hi SME Market, I'd like this plan: ${calc.summary}`)} variant="outline" icon={<WhatsAppIcon />} className={clsx("w-full", items.length === 0 && "pointer-events-none opacity-40")}>
                Send on WhatsApp
              </Button>
              <Link href="/pricing" onClick={() => setDrawer(false)} className="text-center text-[14px] font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
                Compare all services
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Ctx.Provider>
  );
}

const BumpCtx = createContext(0);

/** Animated number for prices. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced()) {
      setV(value);
      from.current = value;
      return;
    }
    let raf = 0;
    const a = from.current;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 550);
      setV(Math.round(a + (value - a) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={clsx("tabular-nums", className)}>{aed(v)}</span>;
}

/** Add-to-plan button usable anywhere. Shows the price, because this is where adding happens. */
export function AddToPlan({ slug, tone = "ink", size = "md", className }: { slug: string; tone?: "ink" | "paper" | "lime"; size?: "md" | "lg"; className?: string }) {
  const { has, toggle } = usePlan();
  const s = SERVICES.find((x) => x.slug === slug)!;
  const on = has(slug);
  const base = size === "lg" ? "h-14 px-6 text-[16px]" : "h-11 px-5 text-[15px]";
  const tones = {
    ink: on ? "bg-lime text-ink" : "bg-ink text-paper hover:bg-ink-3",
    paper: on ? "bg-lime text-ink" : "bg-paper text-ink hover:bg-white",
    lime: on ? "bg-paper text-ink" : "bg-lime text-ink hover:brightness-95",
  };
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug, e.currentTarget);
      }}
      aria-pressed={on}
      className={clsx("group/add inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-out-expo active:scale-95", base, tones[tone], className)}
    >
      <span key={on ? "on" : "off"} className="grid animate-[pop_.4s_ease] place-items-center">
        {on ? <Check className="size-4" strokeWidth={3} /> : <Plus className="size-4 transition-transform duration-300 group-hover/add:rotate-90" strokeWidth={2.5} />}
      </span>
      {on ? "Added to plan" : "Add to plan"}
      <span className={clsx("font-normal", on ? "opacity-60" : "opacity-70")}>
        · {aed(s.price)}
        {s.billing === "month" ? "/mo" : ""}
      </span>
    </button>
  );
}

/** Header cart: a bag that shakes and a count that pops whenever the cart changes. */
export function PlanButton({ light }: { light?: boolean }) {
  const { items, openDrawer } = usePlan();
  const bump = useContext(BumpCtx);
  return (
    <button
      onClick={openDrawer}
      aria-label={`Cart, ${items.length} service${items.length === 1 ? "" : "s"}`}
      className={clsx("group relative grid size-11 place-items-center rounded-full transition duration-300 hover:scale-105", light ? "bg-paper/10 hover:bg-paper/20" : "bg-paper-2 hover:bg-rule")}
    >
      <span data-cart-target key={`bag-${bump}`} className={clsx("grid place-items-center", bump > 0 && "animate-[bagShake_.6s_ease]")}>
        <ShoppingBag className="size-[19px]" strokeWidth={1.9} />
      </span>
      {items.length > 0 && (
        <span
          key={`n-${items.length}`}
          className={clsx(
            "absolute bottom-1 right-1 grid h-4 min-w-4 animate-[pop_.45s_ease] place-items-center rounded-full px-1 text-[10px] font-semibold leading-none",
            light ? "bg-paper text-ink" : "bg-ink text-paper",
          )}
        >
          {items.length}
        </span>
      )}
    </button>
  );
}
