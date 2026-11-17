import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";

const ROUTES = [
  { href: "/#services", l: "Our services" },
  { href: "/pricing", l: "Pricing" },
  { href: "/assessment", l: "Free growth score" },
  { href: "/contact", l: "Talk to our team" },
];

export default function NotFound() {
  return (
    <section className="bg-paper pb-[clamp(5rem,12vh,8rem)] pt-28 md:pt-36">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="animate-[pageIn_.8s_cubic-bezier(.16,1,.3,1)_both]">
          <p className="label">Error 404</p>
          <h1 className="display mt-4 text-[clamp(2.8rem,min(6vw,10vh),5.6rem)]">This page took a wrong turn.</h1>
          <p className="mt-5 max-w-md text-[19px] text-ink-2">The link may be old or mistyped. Here&apos;s where most people are headed.</p>
          <ul className="mt-8 max-w-md border-t border-rule-strong">
            {ROUTES.map((r) => (
              <li key={r.href} className="border-b border-rule-strong">
                <Link href={r.href} className="group flex items-center justify-between py-4 text-[20px] font-semibold">
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{r.l}</span>
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/" arrow>
              Back to the homepage
            </Button>
          </div>
        </div>

        <div className="relative h-[min(520px,60vh)] min-h-[360px] animate-[pageIn_1s_cubic-bezier(.16,1,.3,1)_.15s_both] overflow-hidden rounded-[32px] bg-[#f6dcd2] text-ink">
          <span className="absolute left-6 top-4 select-none text-[clamp(6rem,14vw,11rem)] font-semibold leading-none tracking-tighter text-ink/10">404</span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <Character who="tom" mood="thinking" body="Paper" size={340} className="h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
