import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getService, midSentence, type Service } from "@/lib/site";
import { SERVICE_EXTRA } from "@/lib/service-extra";
import { SPECIALIST } from "@/lib/specialists";
import { AddToPlan } from "@/components/plan/Plan";
import Character from "@/components/ui/Character";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import { SplitHeading } from "@/components/ui/Reveal";

/** "Pairs well with": this service and its best partner side by side, with one tap to add the partner. */
export default function Pair({ s }: { s: Service }) {
  const x = SERVICE_EXTRA[s.slug].pair;
  const o = getService(x.slug)!;
  const a = SPECIALIST[s.slug];
  const b = SPECIALIST[o.slug];
  return (
    <section className="bg-paper-2 section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="label">Pairs well with</p>
          <SplitHeading className="display mt-4 text-section">{`${s.short} + ${o.short}.`}</SplitHeading>
          <p className="mt-5 max-w-lg text-[19px] leading-relaxed text-ink-2">{x.why}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AddToPlan slug={o.slug} size="lg" />
            <Link href={`/services/${o.slug}`} className="group inline-flex h-14 items-center gap-2 rounded-full border border-ink/30 px-6 text-[16px] font-semibold transition hover:bg-ink hover:text-paper">
              About {midSentence(o.name)} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          <div className={`relative h-[clamp(260px,40vh,380px)] overflow-hidden rounded-[28px] text-ink ${VISUAL_TONE[s.slug]}`}>
            <p className="absolute left-5 top-5 rounded-full bg-card px-3 py-1.5 text-[14px] font-semibold">{s.name}</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <Character who={a.who} mood={a.mood} body={a.body} size={240} className="h-[200px] w-[200px] sm:h-[240px] sm:w-[240px]" />
            </div>
          </div>
          <div className={`relative h-[clamp(260px,40vh,380px)] overflow-hidden rounded-[28px] text-ink ${VISUAL_TONE[o.slug]}`}>
            <p className="absolute left-5 top-5 rounded-full bg-card px-3 py-1.5 text-[14px] font-semibold">{o.name}</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <Character who={b.who} mood={b.mood} body={b.body} size={240} className="h-[200px] w-[200px] sm:h-[240px] sm:w-[240px]" />
            </div>
          </div>
          <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-lime shadow-[0_14px_30px_-10px_rgba(21,19,15,.5)]">
            <Plus className="size-6" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </section>
  );
}
