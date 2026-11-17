import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE, waLink, mailLink } from "@/lib/site";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionHead from "@/components/ui/SectionHead";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to the SME Market team. WhatsApp or call ${SITE.phone}, or email ${SITE.email}.`,
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { icon: <WhatsAppIcon className="size-5" />, k: "WhatsApp", v: SITE.phone, note: "Fastest reply", href: waLink("Hi SME Market, I'd like to talk about growing my business.") },
  { icon: <Phone className="size-5" />, k: "Call", v: SITE.phone, note: "Business hours", href: SITE.phoneHref },
  { icon: <Mail className="size-5" />, k: "Email", v: SITE.email, note: "For detailed questions", href: mailLink() },
];

export default function ContactPage() {
  return (
    <section className="bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-x">
        <SectionHead as="h1" eyebrow="Contact" title="Talk to our team." intro="Tell us about your business and what you need. We reply within one business day." />
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="grid content-start gap-3">
            {CHANNELS.map((c) => (
              <a key={c.k} href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4 rounded-2xl border border-rule bg-card p-5 transition hover:border-ink">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper-2">{c.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[15px] text-muted">
                    {c.k} · {c.note}
                  </span>
                  <span className="block truncate text-[18px] font-semibold">{c.v}</span>
                </span>
              </a>
            ))}
            <div className="flex items-start gap-4 p-5 text-[16px] text-ink-2">
              <MapPin className="mt-1 size-5 shrink-0" />
              <p>
                {SITE.legal}
                <br />
                {SITE.address} · Licence {SITE.licence}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-card p-6 md:p-9">
            <EnquiryForm type="contact" meta={{ source: "contact" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
