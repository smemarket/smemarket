"use client";
import { Children, useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * On phones: a horizontal, snap-scrolling card row with progress dots.
 * From the given breakpoint up: whatever layout `desktop` describes (e.g. a grid).
 */
export default function Swipe({
  children,
  desktop,
  bp = "md",
  itemWidth = "84%",
  outer,
}: {
  children: React.ReactNode;
  /** classes applied from the breakpoint up, e.g. "md:grid md:grid-cols-3 md:gap-5" */
  desktop: string;
  bp?: "sm" | "md" | "lg";
  itemWidth?: string;
  /** classes for the outer wrapper, e.g. "lg:contents" to merge into a parent grid */
  outer?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => {
      const first = el.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + 16;
      setActive(Math.min(count - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, [count]);

  const go = (i: number) => {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - 20, behavior: "smooth" });
  };

  const reset = { sm: "sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:[&>*]:w-auto", md: "md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:[&>*]:w-auto", lg: "lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 lg:[&>*]:w-auto" }[bp];
  const hideDots = { sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden" }[bp];

  return (
    <div className={clsx("min-w-0 max-w-full", outer)}>
      <div
        ref={ref}
        className={clsx(
          "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:snap-start [&>*]:scroll-ml-5",
          reset,
          desktop,
        )}
        style={{ ["--w" as string]: itemWidth }}
      >
        {Children.map(children, (c) => (
          <div className={clsx("w-[var(--w)]", { sm: "sm:contents", md: "md:contents", lg: "lg:contents" }[bp])}>{c}</div>
        ))}
      </div>
      {count > 1 && (
        <div className={clsx("mt-3 flex justify-center gap-1.5", hideDots)}>
          {Array.from({ length: count }).map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to card ${i + 1}`} className={clsx("h-1.5 rounded-full transition-all duration-500 ease-out-expo", i === active ? "w-6 bg-ink" : "w-1.5 bg-ink/20")} />
          ))}
        </div>
      )}
    </div>
  );
}
