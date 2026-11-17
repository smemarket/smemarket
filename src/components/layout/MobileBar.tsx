"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { SITE, waLink } from "@/lib/site";

export default function MobileBar() {
  const [scrolled, setScrolled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // step aside where the page already offers these actions: the plan builder and the footer
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("#bundle, footer"));
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBlocked(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  if (pathname === "/assessment") return null;
  const show = scrolled && !blocked;

  return (
    <div className={clsx("fixed inset-x-3 bottom-3 z-40 transition-all duration-500 ease-out-expo lg:hidden", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0")}>
      <div className="flex items-center gap-1.5 rounded-full bg-ink/90 p-1.5 text-paper shadow-[0_20px_40px_-12px_rgba(21,19,15,.6)] backdrop-blur-xl">
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white active:scale-95" aria-label="WhatsApp us">
          <WhatsAppIcon className="size-5" />
        </a>
        <a href={SITE.phoneHref} className="grid size-12 place-items-center rounded-full bg-paper/10 active:scale-95" aria-label="Call us">
          <Phone className="size-5" />
        </a>
        <Link href="/assessment" className="flex h-12 flex-1 items-center justify-between rounded-full bg-lime pl-5 pr-1.5 text-[15px] font-semibold text-ink active:scale-[0.98]">
          Free growth score
          <span className="grid size-9 place-items-center rounded-full bg-ink text-lime">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
