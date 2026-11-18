import { Reveal } from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import Character, { Avatar, type Body, type Cast } from "@/components/ui/Character";
import { DomeTop } from "@/components/ui/Transitions";
import Swipe from "@/components/ui/Swipe";

const PAINS: { who: Cast; mood: "thinking" | "stressed" | "tired"; body: Body; tone: string; tag: string; t: string; d: string; fix: string }[] = [
  {
    who: "karim",
    mood: "thinking",
    body: "Paper",
    tone: "bg-[#e9f1c9]",
    tag: "The guessing game",
    t: "“Is any of this marketing working?”",
    d: "You pay for posts, ads or an agency, but nobody shows you what it brought in.",
    fix: "We report one number per service, every month.",
  },
  {
    who: "maya",
    mood: "stressed",
    body: "Device",
    tone: "bg-[#f6dcd2]",
    tag: "The slow reply",
    t: "“I'll answer that WhatsApp later.”",
    d: "By tomorrow, the customer has already booked someone else.",
    fix: "Every enquiry answered in seconds, day or night.",
  },
  {
    who: "ben",
    mood: "tired",
    body: "Coffee",
    tone: "bg-[#dbe6ef]",
    tag: "The never-ending to-do",
    t: "“I'll post something next week.”",
    d: "You're running the business. Marketing keeps slipping down the list.",
    fix: "Agents post on schedule. You just approve.",
  },
];

export default function Pain() {
  return (
    <section className="relative bg-paper-2 section-y">
      <DomeTop fill="fill-paper-2" />
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-end lg:gap-12">
          <SectionHead eyebrow="Sound familiar?" title="Three ways small businesses lose customers every week." />
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-card p-5 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex -space-x-3">
              {PAINS.map((p) => (
                <Avatar key={p.who} who={p.who} mood={p.mood} body="Shirt" size={52} tone={`${p.tone} ring-[3px] ring-card`} />
              ))}
            </div>
            <p className="text-[16px] leading-snug text-ink-2">
              <b className="text-ink">Most owners recognise at least two.</b> All three are fixable without hiring anyone.
            </p>
          </div>
        </div>
        <Reveal className="mt-10 md:mt-14" stagger={0.08} start="top bottom">
          <Swipe desktop="md:grid md:grid-cols-3 md:gap-5">
          {PAINS.map((p) => (
            <article key={p.who} data-reveal className="group h-full overflow-hidden rounded-3xl bg-card transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-35px_rgba(21,19,15,.45)]">
              <div className={`relative flex h-[clamp(11rem,28vh,16rem)] items-end justify-center overflow-hidden ${p.tone}`}>
                <Character who={p.who} mood={p.mood} body={p.body} size={200} className="origin-bottom translate-y-1 transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="p-7">
                <p className="mb-2 text-[14px] font-semibold text-muted">{p.tag}</p>
                <h3 className="text-[22px] font-semibold leading-snug">{p.t}</h3>
                <p className="mt-2 text-ink-2">{p.d}</p>
                <p className="mt-5 flex items-start gap-2 border-t border-rule pt-4 text-[16px] font-medium">
                  <span className="mt-[3px] grid size-5 shrink-0 place-items-center rounded-full bg-lime text-[11px] font-bold">✓</span>
                  {p.fix}
                </p>
              </div>
            </article>
          ))}
          </Swipe>
        </Reveal>
      </div>
    </section>
  );
}
