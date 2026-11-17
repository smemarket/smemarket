import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials";
import { Avatar } from "@/components/ui/Character";
import SectionHead from "@/components/ui/SectionHead";
import Button from "@/components/ui/Button";

export default function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, half);
  const rowB = TESTIMONIALS.slice(half);

  return (
    <section className="overflow-hidden bg-paper section-y">
      <div className="container-x">
        <SectionHead
          eyebrow="What owners say"
          title="Business owners, in their own words."
          aside={
            <Button href="/assessment" variant="outline" arrow>
              Start your own story
            </Button>
          }
        />
      </div>

      <div className="group/rows mt-14 space-y-5 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  // repeat so the loop is seamless at any screen width
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="flex w-max gap-5 animate-marquee group-hover/rows:[animation-play-state:paused]" style={{ animationDuration: "70s", animationDirection: reverse ? "reverse" : "normal" }}>
      {loop.map((t, i) => (
        <Card key={`${t.who}-${i}`} t={t} />
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-3xl bg-card p-6 ring-1 ring-rule transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-35px_rgba(21,19,15,.5)] md:w-[420px] md:p-7">
      <figcaption className="flex items-center gap-3">
        <Avatar who={t.who} mood="happy" body="Shirt" size={56} tone={t.tone} />
        <span className="min-w-0">
          <span className="block text-[17px] font-semibold">{t.name}</span>
          <span className="block truncate text-[14px] text-muted">
            {t.role} · {t.place}
          </span>
        </span>
      </figcaption>
      <blockquote className="mt-5 flex-1 text-[18px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="whitespace-nowrap text-[24px] font-semibold tracking-tight">{t.result}</span>
          <span className="text-[13px] leading-tight text-muted">{t.resultLabel}</span>
        </span>
        <span className="shrink-0 rounded-full bg-paper-2 px-3 py-1 text-[13px] font-medium">{t.service}</span>
      </div>
    </figure>
  );
}
