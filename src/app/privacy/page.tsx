import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE } from "@/lib/site";
import { SplitHeading } from "@/components/ui/Reveal";
import Character from "@/components/ui/Character";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What SME Market collects when you enquire or take the growth assessment, how we use it, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    t: "What we collect",
    b: "When you send us an enquiry, take the growth assessment or message us, we collect what you give us: your name, phone number, email, business name and the answers you choose to share.",
  },
  {
    t: "How we use it",
    b: "We use it only to reply to you, prepare your growth plan and deliver services you sign up for. We don't sell your data, and we don't add you to marketing lists without asking.",
  },
  {
    t: "Who else handles it",
    b: "Our team and the tools we use to run our services may process this information on our behalf, under the same terms.",
  },
];

const SHORT = ["We only collect what you give us", "We use it to reply and to deliver your services", "We never sell it", "You can ask us to delete it at any time"];

export default function PrivacyPage() {
  return (
    <section className="bg-paper pb-[clamp(5rem,12vh,8rem)] pt-28 md:pt-36">
      <div className="container-x">
        <p className="label">Privacy</p>
        <SplitHeading as="h1" immediate className="display mt-4 max-w-4xl text-[clamp(2.8rem,min(6.6vw,11vh),6.2rem)]">
          Your data, plainly.
        </SplitHeading>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          {/* the short version */}
          <aside className="animate-[pageIn_.8s_cubic-bezier(.16,1,.3,1)_.3s_both] lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-paper">
              <p className="text-[15px] font-semibold text-lime">The short version</p>
              <ul className="mt-5 space-y-3">
                {SHORT.map((x) => (
                  <li key={x} className="flex gap-3 text-[16px] leading-snug">
                    <Check className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={3} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 hidden w-fit rounded-[28px] bg-[#dbe6ef] text-ink lg:block">
              <Character who="hana" mood="calm" body="Coffee" size={220} className="translate-y-2" />
            </div>
          </aside>

          <div className="max-w-2xl">
            {SECTIONS.map((s, i) => (
              <div key={s.t} className="border-t border-rule-strong py-8 first:border-t-0 first:pt-0">
                <p className="text-[14px] font-semibold text-muted">0{i + 1}</p>
                <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight">{s.t}</h2>
                <p className="mt-3 text-[18px] leading-relaxed text-ink-2">{s.b}</p>
              </div>
            ))}
            <div className="border-t border-rule-strong py-8">
              <p className="text-[14px] font-semibold text-muted">04</p>
              <h2 className="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight">Your choices</h2>
              <p className="mt-3 text-[18px] leading-relaxed text-ink-2">
                To see, correct or delete what we hold about you, email{" "}
                <a className="font-medium text-ink underline underline-offset-4" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
                .
              </p>
            </div>
            <p className="border-t border-rule-strong pt-8 text-[15px] text-muted">
              {SITE.legal} · {SITE.address} · Licence {SITE.licence}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
