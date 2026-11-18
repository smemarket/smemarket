"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { AddToPlan } from "@/components/plan/Plan";
import ServiceVisual, { VISUAL_TONE } from "@/components/plan/ServiceVisual";
import Character from "@/components/ui/Character";
import { SPECIALIST } from "@/lib/specialists";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHead from "@/components/ui/SectionHead";

export default function ServiceList() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);

  // only autoplay while on screen; on touch devices, leaving the screen also resumes
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (!e.isIntersecting) setPaused(false);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    setActive(i);
    setPaused(true);
    setCycle((c) => c + 1);
  };
  const advance = () => {
    if (prefersReducedMotion()) return;
    setActive((a) => (a + 1) % SERVICES.length);
    setCycle((c) => c + 1);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        root.current,
        { clipPath: "inset(0% 5% 0% 5% round 64px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} onMouseLeave={() => setPaused(false)} className="bg-ink section-y text-paper">
      <div className="container-x">
        <SectionHead
          dark
          eyebrow="Services"
          title="Six services. Six specialists. One growth team."
          aside={
            <Link href="/pricing" className="inline-flex items-center gap-2 text-[17px] font-medium text-paper/80 underline-offset-4 hover:text-paper hover:underline">
              Build your plan <ArrowUpRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-10 flex flex-col gap-2.5 lg:h-[min(66vh,580px)] lg:flex-row">
          {SERVICES.map((s, i) => {
            const on = active === i;
            const sp = SPECIALIST[s.slug];
            return (
              <div
                key={s.slug}
                onClick={() => pick(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(i)}
                tabIndex={on ? -1 : 0}
                role={on ? undefined : "button"}
                aria-label={on ? undefined : `Show ${s.name}`}
                className={clsx(
                  "group relative overflow-hidden rounded-2xl text-ink transition-[flex-grow,height] duration-700 ease-out-expo lg:basis-0",
                  VISUAL_TONE[s.slug],
                  on ? "h-[490px] lg:h-auto lg:grow-[5]" : "h-[96px] lg:h-auto lg:grow",
                )}
              >
                {/* closed: number, name, and the specialist rising from the bottom */}
                <div className={clsx("absolute inset-0 transition-opacity", on ? "opacity-0 duration-150" : "opacity-100 delay-300 duration-500")}>
                  <div className="relative z-10 flex items-center gap-3 p-5 lg:flex-col lg:items-start">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-[14px] font-semibold text-lime">{s.num}</span>
                    <span className="block text-[19px] font-semibold leading-tight">{s.short}</span>
                  </div>
                  <div className="absolute bottom-0 right-3 lg:inset-x-0 lg:right-auto lg:flex lg:justify-center">
                    <Character who={sp.who} mood={sp.mood} body={sp.body} size={150} className="!h-[88px] !w-[88px] origin-bottom translate-y-1 transition-transform duration-500 group-hover:scale-[1.06] lg:!h-[170px] lg:!w-[170px]" />
                  </div>
                </div>

                {on && visible && !paused && (
                  <span className="absolute inset-x-0 bottom-0 z-20 h-1 bg-ink/10">
                    <span key={`${i}-${cycle}`} onAnimationEnd={advance} className="block h-full origin-left bg-ink [animation:grow_5s_linear_both]" />
                  </span>
                )}

                {/* open: fixed-width content, so nothing reflows while the panel resizes */}
                <div className={clsx("absolute inset-y-0 left-0 w-full transition-opacity lg:w-[min(620px,52vw)]", on ? "opacity-100 delay-200 duration-500" : "pointer-events-none opacity-0 duration-150")}>
                  <div className="flex h-full flex-col">
                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden pt-6">
                      <div className={clsx("flex w-[300px] shrink-0 justify-center transition-transform duration-700 ease-out-expo lg:w-[340px]", on ? "scale-105 lg:scale-[1.25]" : "scale-90")}>
                        <ServiceVisual slug={s.slug} />
                      </div>
                    </div>
                    <div className="relative p-6 md:p-8 md:pr-[190px]">
                      <p className="text-[15px] font-semibold text-ink/60">
                        {s.num} · {sp.role}
                      </p>
                      <h3 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">{s.name}</h3>
                      <p className="mt-2 text-[16px] text-ink-2">{s.promise}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <AddToPlan slug={s.slug} tone="ink" />
                        <Link href={`/services/${s.slug}`} className="group/l inline-flex h-11 items-center gap-2 rounded-full border border-ink/30 px-5 text-[15px] font-semibold transition hover:bg-ink hover:text-paper">
                          Learn more <ArrowUpRight className="size-4 transition-transform group-hover/l:rotate-45" />
                        </Link>
                      </div>
                      {/* the specialist stands beside the details */}
                      <Character
                        who={sp.who}
                        mood={sp.mood}
                        body={sp.body}
                        size={190}
                        className={clsx("absolute bottom-0 right-0 hidden h-[190px] w-[190px] transition-transform duration-700 ease-out-expo md:block", on ? "translate-y-0" : "translate-y-10")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
