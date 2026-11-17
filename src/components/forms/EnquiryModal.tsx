"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import { getLenis } from "@/components/layout/SmoothScroll";

type Opts = { title?: string; subtitle?: string; services?: string[]; meta?: Record<string, unknown>; type?: "enquiry" | "plan" };
const Ctx = createContext<(o?: Opts) => void>(() => {});
export const useEnquiry = () => useContext(Ctx);

export default function EnquiryModalProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<Opts | null>(null);
  const [key, setKey] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const open = useCallback((o: Opts = {}) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setKey((k) => k + 1);
    setOpts(o);
  }, []);
  const close = useCallback(() => setOpts(null), []);

  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    const l = getLenis();
    if (opts) {
      l?.stop();
      document.body.style.overflow = "hidden";
      setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input:not([type=hidden]):not(.hidden)")?.focus(), 60);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    l?.start();
    document.body.style.overflow = "";
    lastFocus.current?.focus?.();
  }, [opts, close]);

  return (
    <Ctx.Provider value={open}>
      {children}
      <div className={clsx("fixed inset-0 z-[60] transition", opts ? "visible" : "invisible")} aria-hidden={!opts}>
        <div className={clsx("absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300", opts ? "opacity-100" : "opacity-0")} onClick={close} />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enq-title"
          data-lenis-prevent
          className={clsx(
            "absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-2xl transition-all duration-500 ease-out-expo sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(680px,calc(100vw-32px))] sm:-translate-x-1/2 sm:rounded-2xl sm:p-10",
            opts ? "translate-y-0 opacity-100 sm:-translate-y-1/2" : "translate-y-full opacity-0 sm:-translate-y-[45%]",
          )}
        >
          <button onClick={close} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-rule-strong transition hover:bg-ink hover:text-paper" aria-label="Close">
            <X className="size-5" />
          </button>
          {opts && (
            <>
              <p className="label">Talk to our team</p>
              <h2 id="enq-title" className="display mt-3 pr-10 text-3xl sm:text-4xl">
                {opts.title || "Let's grow your business."}
              </h2>
              <p className="mb-7 mt-3 text-muted">{opts.subtitle || "Tell us a little about your business. We'll come back with a plan and a clear price."}</p>
              <EnquiryForm key={key} compact defaultServices={opts.services} meta={opts.meta} type={opts.type} submitLabel={opts.type === "plan" ? "Start this plan" : "Send enquiry"} />
            </>
          )}
        </div>
      </div>
    </Ctx.Provider>
  );
}
