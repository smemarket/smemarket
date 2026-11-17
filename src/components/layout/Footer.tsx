import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Character from "@/components/ui/Character";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import { SERVICES, SITE, waLink, mailLink } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";

const COMPANY = [
  ["/pricing", "Pricing"],
  ["/#how", "How it works"],
  ["/assessment", "Free growth score"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
];

/** Closing message and links on ink, with the whole team peeking up along the bottom edge. */
export default function Footer() {
  return (
    <footer className="footer-curtain relative -mt-10 overflow-hidden bg-ink pt-[clamp(6rem,12vh,8rem)] text-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* the close */}
        <div>
          <p className="text-[15px] font-semibold text-lime">Ready when you are</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2.4rem,min(4.6vw,8vh),4.2rem)]">Let&apos;s grow your business.</h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-paper/60">Message us on WhatsApp, or start with a free growth score. Our team replies within one business day.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-[16px] font-semibold text-white transition hover:brightness-95 active:scale-[0.98]">
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp
            </a>
            <Link href="/assessment" className="group flex h-14 items-center justify-center gap-2 rounded-full border border-paper/25 px-6 text-[16px] font-semibold transition hover:border-paper hover:bg-paper hover:text-ink">
              Free growth score <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* links */}
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pt-2">
          <div>
            <p className="text-[14px] font-semibold text-paper/40">Services</p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-[15px] text-paper/75 transition-colors hover:text-paper">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-paper/40">Company</p>
            <ul className="mt-4 space-y-2.5">
              {COMPANY.map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="text-[15px] text-paper/75 transition-colors hover:text-paper">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[14px] font-semibold text-paper/40">Talk to us</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-paper/75">
              <li>
                <a href={SITE.phoneHref} className="transition-colors hover:text-paper">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={mailLink()} className="break-all transition-colors hover:text-paper">
                  {SITE.email}
                </a>
              </li>
              <li className="text-paper/50">{SITE.address}</li>
            </ul>
          </div>
        </nav>
      </div>

      {/* the team, peeking up */}
      <div className="container-x mt-[clamp(3.5rem,8vh,5rem)]">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-3">
          {SERVICES.map((s) => {
            const sp = SPECIALIST[s.slug];
            return (
              <Link key={s.slug} href={`/services/${s.slug}`} aria-label={`${s.name}: meet your ${sp.role.toLowerCase()}`} className={`group relative h-[clamp(84px,13vw,170px)] overflow-hidden rounded-t-2xl text-ink sm:rounded-t-[24px] ${VISUAL_TONE[s.slug]}`}>
                <span className="absolute left-3 top-2.5 hidden text-[13px] font-semibold text-ink/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">{sp.role}</span>
                <span className="absolute inset-x-0 bottom-0 flex justify-center">
                  <Character who={sp.who} mood={sp.mood} body={sp.body} size={200} style={{ width: "92%", height: "auto", aspectRatio: "1" }} className="translate-y-[38%] transition-transform duration-700 ease-out-expo group-hover:translate-y-[18%]" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* legal */}
      <div className="border-t border-rule-dark">
        <div className="container-x flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <Logo tone="dark" className="h-6 w-auto" />
          <p className="text-[13px] text-paper/45">
            © {new Date().getFullYear()} {SITE.legal} · {SITE.address} · Licence {SITE.licence}
          </p>
        </div>
      </div>
    </footer>
  );
}
