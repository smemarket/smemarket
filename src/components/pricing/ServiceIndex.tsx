"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, BarChart3, Plus } from "lucide-react";
import { SERVICES, aed } from "@/lib/site";
import { AddToPlan } from "@/components/plan/Plan";
import SectionHead from "@/components/ui/SectionHead";

/** Every service as one long index: click a row to open it up with the photo, what's included and the price. */
export default function ServiceIndex() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-paper section-y">
      <div className="container-x">
        <SectionHead eyebrow="Every service" title="What each service includes." />
        <ul className="mt-12 border-t border-rule-strong">
          {SERVICES.map((s, i) => {
            const on = open === i;
            return (
              <li key={s.slug} className="border-b border-rule-strong">
                <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="group grid w-full grid-cols-[40px_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[64px_1fr_1fr_auto] md:py-7">
                  <span className="text-[15px] font-semibold text-muted">{s.num}</span>
                  <span className="text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{s.name}</span>
                  <span className="hidden text-[16px] text-muted md:block">{s.sub}</span>
                  <span className="flex items-center gap-4">
                    <span className="hidden text-right text-[16px] font-semibold tabular-nums sm:block">
                      {aed(s.price)}
                      <span className="block text-[13px] font-normal text-muted">{s.billing === "month" ? "per month" : "one-time"}</span>
                    </span>
                    <span className={clsx("grid size-11 place-items-center rounded-full border transition-all duration-500 ease-out-expo", on ? "rotate-45 border-ink bg-ink text-paper" : "border-rule-strong group-hover:border-ink")}>
                      <Plus className="size-5" />
                    </span>
                  </span>
                </button>

                <div className={clsx("grid transition-[grid-template-rows] duration-700 ease-out-expo", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className={clsx("grid gap-6 pb-8 transition-opacity duration-500 md:grid-cols-[64px_1fr_1fr] md:gap-4", on ? "opacity-100 delay-150" : "opacity-0")}>
                      <span className="hidden md:block" />
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:mr-8">
                        <Image quality={90} src={s.image} alt="" fill sizes="(min-width:768px) 40vw, 100vw" className={clsx("object-cover transition-transform duration-[1.2s] ease-out-expo", on ? "scale-100" : "scale-110")} />
                      </div>
                      <div className="flex flex-col">
                        <ul className="space-y-3">
                          {s.bullets.map((b) => (
                            <li key={b} className="flex gap-3 text-[17px] leading-snug text-ink-2">
                              <span className="mt-2.5 h-px w-4 shrink-0 bg-ink/40" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-5 flex items-center gap-2 text-[15px] text-ink-2">
                          <BarChart3 className="size-4" /> We report: <span className="font-semibold text-ink">{s.kpi}</span>
                        </p>
                        {s.priceNote && <p className="mt-1 text-[14px] text-muted">{s.priceNote}</p>}
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <AddToPlan slug={s.slug} />
                          <Link href={`/services/${s.slug}`} className="group/l inline-flex h-11 items-center gap-2 rounded-full border border-ink/30 px-5 text-[15px] font-semibold transition hover:bg-ink hover:text-paper">
                            Learn more <ArrowUpRight className="size-4 transition-transform group-hover/l:rotate-45" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
