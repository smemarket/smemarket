import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <section className="bg-paper pb-24 pt-32 md:pt-40">
      <div className="container-x max-w-3xl">
        <p className="label text-muted">Privacy</p>
        <h1 className="display mt-6 text-[clamp(3rem,7vw,5.6rem)]">Your data, <em>plainly.</em></h1>
        <div className="mt-10 space-y-6 text-[17px] leading-relaxed text-ink-2">
          <p>When you send us an enquiry, take the growth assessment or message us, we collect what you give us: your name, phone number, email, business name and the answers you choose to share.</p>
          <p>We use it only to reply to you, prepare your growth plan and deliver services you sign up for. We don&apos;t sell your data, and we don&apos;t add you to marketing lists without asking.</p>
          <p>Our team and the tools we use to run our services may process this information on our behalf, under the same terms.</p>
          <p>
            To see, correct or delete what we hold about you, email <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <p className="text-sm text-muted">{SITE.legal} · {SITE.address}</p>
        </div>
      </div>
    </section>
  );
}
