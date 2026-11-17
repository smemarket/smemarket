import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/ui/Reveal";
import { waLink } from "@/lib/site";

/**
 * PLACEHOLDER: swap the photo (public/images/founder-placeholder.jpg) for the founder's
 * real portrait, and have the founder review and approve the note before launch.
 */
const FOUNDER = {
  name: "Ahmed Bin Amir",
  role: "Founder, SMEmarket",
  photo: "/images/founder-placeholder.jpg",
};

export default function FounderNote() {
  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" stagger={0.12}>
          {/* portrait */}
          <div data-reveal className="relative mx-auto w-full max-w-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
              <Image quality={90} src={FOUNDER.photo} alt={`${FOUNDER.name}, ${FOUNDER.role}`} fill sizes="(min-width:1024px) 420px, 90vw" className="object-cover object-[35%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-[0_24px_50px_-28px_rgba(21,19,15,.55)]">
              <span>
                <span className="block text-[17px] font-semibold">{FOUNDER.name}</span>
                <span className="block text-[14px] text-muted">{FOUNDER.role}</span>
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-lime">
                <Quote className="size-5" />
              </span>
            </div>
          </div>

          {/* the note */}
          <div data-reveal className="pt-6 lg:pt-0">
            <p className="label">A note from our founder</p>
            <h2 className="display mt-4 text-section">Built for the owners who keep the UAE running.</h2>
            <div className="mt-7 max-w-2xl space-y-4 text-[18px] leading-relaxed text-ink-2">
              <p>
                Every week I speak to business owners who are doing everything themselves. They pay for marketing they can&apos;t measure, and they lose customers simply because nobody replied in time.
              </p>
              <p>
                We built SME Market to fix that. AI agents do the heavy lifting, every day, and our team checks every move before it reaches your customers. You get the speed of a big company without hiring one.
              </p>
              <p className="font-medium text-ink">If we don&apos;t move your numbers, you&apos;ll see it on your dashboard. So will we. That&apos;s the deal.</p>
            </div>
            <p className="mt-7 text-[22px] font-semibold italic tracking-tight">— {FOUNDER.name.split(" ")[0]}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={waLink("Hi Ahmed, I read your note on the SME Market website.")} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-[16px] font-semibold text-paper hover:bg-ink-3">
                <WhatsAppIcon className="size-5" /> Message our team
              </a>
              <Link href="/assessment" className="group flex h-14 items-center justify-center gap-2 rounded-full border border-ink/30 px-6 text-[16px] font-semibold hover:bg-ink hover:text-paper">
                Get my free growth score <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
