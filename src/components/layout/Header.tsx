"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Phone, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { SERVICES, SITE, waLink } from "@/lib/site";
import { PlanButton } from "@/components/plan/Plan";
import { getLenis } from "./SmoothScroll";

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 24);
      setOverHero(pathname === "/" && window.scrollY < window.innerHeight * 0.75);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);
  // same-page section links don't change the path, so close menus on any site navigation too
  useEffect(() => {
    const close = () => {
      setOpen(false);
      setMega(false);
    };
    window.addEventListener("smem:navigate", close);
    return () => window.removeEventListener("smem:navigate", close);
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const hover = (e: React.MouseEvent<HTMLElement>) => {
    const nav = navRef.current?.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    if (nav) setPill({ left: r.left - nav.left, width: r.width });
  };

  const light = overHero && !open && !mega;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={clsx(
          "relative mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-full border px-3 pl-5 transition-all duration-500 md:px-3 md:pl-6",
          scrolled ? "h-[60px]" : "h-[68px]",
          light ? "border-paper/15 bg-ink/25 text-paper backdrop-blur-md" : "border-rule bg-card/85 text-ink shadow-[0_12px_40px_-20px_rgba(21,19,15,.35)] backdrop-blur-xl",
        )}
        onMouseLeave={() => setMega(false)}
      >
        <Logo onClick={() => setOpen(false)} tone={light ? "dark" : "light"} className="h-6 w-auto md:h-7" />

        <nav ref={navRef} className="relative hidden items-center lg:flex" aria-label="Main" onMouseLeave={() => setPill(null)}>
          <span
            aria-hidden
            className={clsx("absolute top-1/2 h-10 -translate-y-1/2 rounded-full transition-all duration-300 ease-out-expo", light ? "bg-paper/15" : "bg-paper-2", pill ? "opacity-100" : "opacity-0")}
            style={{ left: pill?.left ?? 0, width: pill?.width ?? 0 }}
          />
          <button onMouseEnter={(e) => { hover(e); setMega(true); }} onClick={() => setMega((m) => !m)} aria-expanded={mega} className="relative flex items-center gap-1 px-4 py-2 text-[15px] font-medium">
            Services <ChevronDown className={clsx("size-4 transition", mega && "rotate-180")} />
          </button>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onMouseEnter={(e) => { hover(e); setMega(false); }} className="relative px-4 py-2 text-[15px] font-medium">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <PlanButton light={light} />
          <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us" className={clsx("grid size-11 place-items-center rounded-full transition", light ? "bg-paper/10 hover:bg-paper/20" : "bg-paper-2 hover:bg-[#25D366] hover:text-white")}>
            <WhatsAppIcon className="size-[18px]" />
          </a>
          <Link href="/assessment" className={clsx("group flex h-11 items-center gap-2.5 rounded-full pl-5 pr-1.5 text-[15px] font-semibold transition", light ? "bg-paper text-ink" : "bg-ink text-paper")}>
            Free growth score
            <span className="grid size-8 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <PlanButton light={light} />
        <button
          className={clsx("flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold lg:hidden", light ? "bg-paper text-ink" : "bg-ink text-paper")}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
        </div>

        {/* mega menu */}
        <div className={clsx("absolute inset-x-0 top-full hidden pt-3 transition-all duration-300 lg:block", mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
          <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-3 rounded-[28px] border border-rule bg-card p-3 text-ink shadow-[0_40px_80px_-40px_rgba(21,19,15,.5)]">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-paper-2">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image quality={90} src={s.image} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span>
                  <span className="block text-[16px] font-semibold leading-tight">{s.name}</span>
                  <span className="block text-[14px] text-muted">{s.sub}</span>
                </span>
              </Link>
            ))}
            <Link href="/pricing" className="col-start-4 row-span-2 row-start-1 flex flex-col justify-between rounded-2xl bg-ink p-5 text-paper">
              <span className="text-[14px] font-semibold text-lime">Bundle</span>
              <span>
                <span className="block text-[26px] font-semibold leading-tight">All five, one plan</span>
                <span className="mt-1 block text-[15px] text-paper/70">Bundle the monthly services and save every month.</span>
              </span>
              <span className="flex items-center gap-1.5 text-[15px] font-semibold">
                Build your plan <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div className={clsx("fixed inset-x-3 bottom-3 top-[84px] overflow-y-auto rounded-[28px] bg-card p-5 text-ink shadow-2xl transition-all duration-500 ease-out-expo lg:hidden", open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0")} data-lenis-prevent>
        <p className="label">Services</p>
        <div className="mt-3 grid gap-2">
          {SERVICES.map((s, i) => (
            <Link
              key={`${s.slug}-${open}`}
              href={`/services/${s.slug}`}
              style={open ? { animation: `slideInRight .55s cubic-bezier(.16,1,.3,1) ${80 + i * 45}ms both` } : undefined}
              className="flex items-center gap-3 rounded-2xl p-1.5 active:bg-paper-2"
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                <Image quality={90} src={s.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="flex-1 text-[18px] font-semibold">{s.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-1 border-t border-rule pt-4">
          {NAV.map((n, i) => (
            <Link
              key={`${n.href}-${open}`}
              href={n.href}
              onClick={() => setOpen(false)}
              style={open ? { animation: `slideInRight .55s cubic-bezier(.16,1,.3,1) ${380 + i * 50}ms both` } : undefined}
              className="py-2 text-[22px] font-semibold"
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div key={`cta-${open}`} className="mt-6 grid gap-3" style={open ? { animation: "fadeIn .6s ease 560ms both" } : undefined}>
          <Button href="/assessment" size="lg" arrow className="w-full">
            Get my free growth score
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button href={waLink()} variant="outline" icon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
            <Button href={SITE.phoneHref} variant="outline" icon={<Phone className="size-4" />}>
              Call
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
