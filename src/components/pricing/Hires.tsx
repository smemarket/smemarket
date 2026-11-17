import { MONTHLY, BUNDLE_PRICE, aed } from "@/lib/site";
import { SPECIALIST } from "@/lib/specialists";
import { Avatar } from "@/components/ui/Character";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { VISUAL_TONE } from "@/components/plan/ServiceVisual";

const ROLE: Record<string, string> = {
  "seo-optimisation": "An SEO specialist",
  "paid-ads": "A paid ads manager",
  "sdr-outreach": "A sales development rep",
  "social-media-management": "A social media manager",
  "enquiry-desk": "A receptionist who never sleeps",
};
const HIRING = ["Five salaries", "Five visas and onboarding", "Five people to manage", "Gaps when anyone's on leave"];

/** What the bundle replaces: five hires, struck through one by one, against one plan. No invented salary numbers. */
export default function Hires() {
  return (
    <section className="bg-paper-2 section-y">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <p className="label">The maths</p>
          <SplitHeading className="display mt-4 text-section">Five hires, or one plan.</SplitHeading>
          <p className="mt-5 max-w-lg text-[18px] text-ink-2">To run all of this in-house, you&apos;d be hiring a small marketing team. Here&apos;s what that really involves.</p>
          <ul className="mt-8 space-y-3">
            {HIRING.map((h) => (
              <li key={h} className="flex items-center gap-3 text-[17px] text-ink-2">
                <span className="h-px w-5 bg-stamp" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-card ring-1 ring-rule">
          <Reveal stagger={0.08}>
            {MONTHLY.map((s) => {
              const sp = SPECIALIST[s.slug];
              return (
                <div key={s.slug} data-reveal className="group flex items-center gap-4 border-b border-rule px-6 py-4">
                  <Avatar who={sp.who} mood={sp.mood} body={sp.body} size={44} tone={VISUAL_TONE[s.slug]} />
                  <span className="relative text-[17px] text-muted">
                    {ROLE[s.slug]}
                    <span className="absolute inset-x-0 top-1/2 h-[2px] origin-left scale-x-100 bg-stamp/70 transition-transform duration-700 ease-out-expo" />
                  </span>
                  <span className="ml-auto shrink-0 text-[14px] font-semibold text-ink">{s.name}</span>
                </div>
              );
            })}
          </Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 bg-ink p-6 text-paper md:p-8">
            <div>
              <p className="text-[15px] text-paper/60">Instead: one plan, one team, checked every day</p>
              <p className="mt-1 text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-tight tabular-nums">
                {aed(BUNDLE_PRICE)}
                <span className="text-[16px] font-normal text-paper/55"> / month</span>
              </p>
            </div>
            <p className="rounded-full bg-lime px-4 py-2 text-[14px] font-semibold text-ink">No hiring. No visas. No gaps.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
