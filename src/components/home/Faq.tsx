"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CheckCheck, ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { Avatar } from "@/components/ui/Character";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/lib/site";

type Msg = { from: "you" | "us"; text: string; id: number };

export default function Faq({ items, title = "Ask us anything." }: { items: { q: string; a: string }[]; title?: React.ReactNode; no?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "you", text: items[0].q, id: 0 },
    { from: "us", text: items[0].a, id: 1 },
  ]);
  const [asked, setAsked] = useState<number[]>([0]);
  const [typing, setTyping] = useState(false);
  const idRef = useRef(2);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const ask = (k: number) => {
    if (typing) return;
    const f = items[k];
    setAsked((a) => (a.includes(k) ? a : [...a, k]));
    setMsgs((m) => [...m, { from: "you", text: f.q, id: idRef.current++ }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "us", text: f.a, id: idRef.current++ }]);
    }, 1100);
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <section className="bg-paper section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHead eyebrow="FAQ" title={title} />
          <p className="mt-5 text-[19px] text-ink-2">Tap a question. Our team answers this way on WhatsApp too.</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {items.map((f, k) => (
              <button
                key={f.q}
                onClick={() => ask(k)}
                disabled={typing}
                className={clsx(
                  "rounded-full border px-4 py-2.5 text-left text-[15px] font-medium transition-all duration-300 disabled:cursor-wait",
                  asked.includes(k) ? "border-ink/15 bg-paper text-muted" : "border-ink bg-card hover:-translate-y-0.5 hover:bg-ink hover:text-paper",
                )}
              >
                {f.q}
              </button>
            ))}
          </div>
        </div>

        {/* chat */}
        <div className="overflow-hidden rounded-[28px] bg-[#efe9dd] shadow-[0_40px_80px_-50px_rgba(21,19,15,.6)] ring-1 ring-rule">
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
            <Avatar who="omar" mood="happy" body="Shirt" size={44} tone="bg-lime" />
            <div className="flex-1">
              <p className="text-[16px] font-semibold">SME Market team</p>
              <p className="text-[13px] text-paper/60">{typing ? "typing…" : "Usually replies in minutes"}</p>
            </div>
            <WhatsAppIcon className="size-5 text-paper/60" />
          </div>
          {/* no inner scroller: the thread stacks from the bottom and older messages fade off the top, so the page always scrolls */}
          <div className="flex h-[420px] flex-col justify-end gap-3 overflow-hidden px-4 py-5 [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] md:h-[460px] md:px-6">
            {msgs.slice(-6).map((m) => (
              <div key={m.id} className={clsx("flex animate-[fadeIn_.35s_ease]", m.from === "you" ? "justify-end" : "justify-start")}>
                <div className={clsx("max-w-[85%] rounded-2xl px-4 py-3 text-[16px] leading-relaxed shadow-sm", m.from === "you" ? "rounded-br-md bg-lime text-ink" : "rounded-bl-md bg-card text-ink")}>
                  {m.text}
                  {m.from === "you" && <CheckCheck className="ml-2 inline size-4 text-ink/50" />}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex shrink-0">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-card px-4 py-4 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href={waLink("Hi SME Market, I have a question.")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 border-t border-rule bg-card px-5 py-4 text-[15px] transition hover:bg-paper">
            <span className="text-muted">Ask your own question on WhatsApp…</span>
            <span className="grid size-10 place-items-center rounded-full bg-[#25D366] text-white">
              <ArrowUpRight className="size-5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
