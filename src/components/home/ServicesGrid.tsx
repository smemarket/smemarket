import Link from "next/link";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/site";
import { AddToPlan } from "@/components/plan/Plan";

/** Service card used on the pricing page: the add-to-plan button carries the price. */
export function ServiceCard({ s }: { s: Service; i?: number }) {
  return (
    <div data-reveal className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-rule transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(21,19,15,.45)]">
      <Link href={`/services/${s.slug}`} className="relative block aspect-[16/8] overflow-hidden">
        <Image quality={90} src={s.image} alt={s.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[12px] font-semibold backdrop-blur">{s.billing === "month" ? "Monthly" : "One-time"}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/services/${s.slug}`} className="flex items-start justify-between gap-3">
          <h3 className="text-[22px] font-semibold leading-tight">{s.name}</h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted transition group-hover:rotate-45 group-hover:text-ink" />
        </Link>
        <p className="mt-2 text-[16px] font-medium leading-snug">{s.promise}</p>
        <ul className="mt-4 flex-1 space-y-2.5">
          {s.bullets.map((b) => (
            <li key={b} className="flex gap-2.5 text-[15px] leading-snug text-ink-2">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime">
                <Check className="size-3 text-ink" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-paper-2 px-4 py-3 text-[14px]">
          <span className="font-semibold">KPI we report:</span> {s.kpi}
        </p>
        <AddToPlan slug={s.slug} className="mt-4 w-full" />
      </div>
    </div>
  );
}
