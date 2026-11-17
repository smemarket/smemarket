import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { SITE, waLink, mailLink } from "@/lib/site";

const LINKS = [
  ["/#services", "Services"],
  ["/pricing", "Pricing"],
  ["/#how", "How it works"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
];

export default function Footer() {
  return (
    <footer className="footer-curtain relative -mt-10 overflow-hidden bg-ink pt-28 text-paper">
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[460px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.09] blur-[110px]" />

      {/* the one focus */}
      <div className="container-x relative pb-20 text-center md:pb-28">
        <p className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-4 py-1.5 text-[14px] text-paper/80">
          Your agents are ready. So is our team.
        </p>
        <h2 className="display mx-auto mt-7 max-w-4xl text-footer !leading-[1]">Ready when you are.</h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex h-16 items-center gap-3 rounded-full bg-[#25D366] px-8 text-[18px] font-semibold text-white shadow-[0_20px_50px_-15px_rgba(37,211,102,.6)] transition hover:scale-[1.03]">
            <WhatsAppIcon className="size-6" /> Chat with us on WhatsApp
          </a>
          <Link href="/assessment" className="group flex items-center gap-2 text-[17px] font-medium text-paper/80 hover:text-paper">
            or get your free growth score <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* one quiet bar */}
      <div className="relative border-t border-rule-dark">
        <div className="container-x flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <Logo tone="dark" className="h-7 w-auto" />
          <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-paper/70" aria-label="Footer">
            {LINKS.map(([h, l]) => (
              <Link key={h} href={h} className="hover:text-paper">
                {l}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-paper/70">
            <a href={SITE.phoneHref} className="hover:text-paper">
              {SITE.phone}
            </a>
            <a href={mailLink()} className="hover:text-paper">
              {SITE.email}
            </a>
          </div>
        </div>
        <div className="container-x flex flex-col justify-between gap-2 pb-28 text-[13px] text-paper/45 md:flex-row lg:pb-8">
          <p>
            © {new Date().getFullYear()} {SITE.legal} · {SITE.address} · Licence {SITE.licence}
          </p>
          <p>Part of SMEmarket · serving all seven emirates</p>
        </div>
      </div>
    </footer>
  );
}
