import Image from "next/image";
import type { Service } from "@/lib/site";
import { SERVICE_EXTRA } from "@/lib/service-extra";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import Swipe from "@/components/ui/Swipe";

/** Who this service is for: four kinds of UAE business, each with a photo and what it looks like for them. */
export default function WhoFor({ s }: { s: Service }) {
  const x = SERVICE_EXTRA[s.slug];
  return (
    <section className="bg-paper-2 section-y">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label">Who it&apos;s for</p>
            <SplitHeading className="display mt-4 text-section">Built for the businesses that keep the UAE running.</SplitHeading>
          </div>
          <p className="max-w-md text-[18px] text-ink-2 lg:justify-self-end">The same service, shaped around how your customers actually buy.</p>
        </div>
        <Reveal className="mt-12" stagger={0.1}>
          <Swipe bp="lg" itemWidth="78%" desktop="lg:grid lg:grid-cols-4 lg:gap-4">
            {x.who.map((w) => (
              <article key={w.k} data-reveal className="group relative h-[clamp(380px,52vh,480px)] overflow-hidden rounded-[28px]">
                <Image quality={90} src={w.img} alt={w.k} fill sizes="(min-width:1024px) 25vw, 80vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                  <h3 className="text-[24px] font-semibold tracking-tight">{w.k}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-paper/80">{w.line}</p>
                </div>
              </article>
            ))}
          </Swipe>
        </Reveal>
      </div>
    </section>
  );
}
