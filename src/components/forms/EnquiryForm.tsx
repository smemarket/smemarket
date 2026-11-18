"use client";
import { useState } from "react";
import clsx from "clsx";
import { Check, Loader2, Phone } from "lucide-react";
import { SERVICES, SITE, waLink } from "@/lib/site";
import { submitLead, isEmail, isPhone, type LeadPayload } from "@/lib/leads";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

type Props = {
  defaultServices?: string[];
  type?: LeadPayload["type"];
  meta?: Record<string, unknown>;
  submitLabel?: string;
  compact?: boolean;
  onDone?: () => void;
};

type Errors = Partial<Record<"name" | "phone" | "email" | "form", string>>;

export default function EnquiryForm({ defaultServices = [], type = "enquiry", meta, submitLabel = "Send enquiry", compact }: Props) {
  const [services, setServices] = useState<string[]>(defaultServices);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [name, setName] = useState("");
  const [waPending, setWaPending] = useState<string | null>(null);

  const toggle = (slug: string) => setServices((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const err: Errors = {};
    if (!v("name")) err.name = "Please add your name.";
    if (!isPhone(v("phone"))) err.phone = "Please add a valid phone or WhatsApp number.";
    if (v("email") && !isEmail(v("email"))) err.email = "That email doesn't look right.";
    setErrors(err);
    if (Object.keys(err).length) {
      (e.currentTarget.querySelector("[aria-invalid='true']") as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    setName(v("name").split(" ")[0]);
    const res = await submitLead({
      type,
      name: v("name"),
      phone: v("phone"),
      email: v("email"),
      business: v("business"),
      message: v("message"),
      services: services.map((s) => SERVICES.find((x) => x.slug === s)?.name || s),
      meta,
      website: v("website"),
    });
    if (res.ok) {
      setWaPending(res.whatsapp ?? null);
      setStatus("done");
    } else {
      setStatus("idle");
      setErrors({ form: res.error });
    }
  }

  if (status === "done" && waPending) return <WhatsAppPending href={waPending} name={name} />;

  if (status === "done") {
    const chosen = services.map((s) => SERVICES.find((x) => x.slug === s)?.name).filter(Boolean).join(", ");
    return (
      <div className="flex animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] flex-col items-start gap-5 py-4" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-lime text-ink">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <div>
          <h3 className="display text-3xl">Got it{name ? `, ${name}` : ""}.</h3>
          <p className="mt-2 max-w-md text-muted">
            Our team will reach out within one business day. Want to move faster? Message us on WhatsApp now.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={waLink(`Hi SME Market, I just sent an enquiry${chosen ? ` about ${chosen}` : ""}. My name is ${name}.`)} icon={<WhatsAppIcon />}>
            Continue on WhatsApp
          </Button>
          <Button href={SITE.phoneHref} variant="outline" icon={<Phone className="size-4" />}>
            Call {SITE.phone}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className={clsx("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Your name" error={errors.name}>
          <input name="name" className="field" autoComplete="name" placeholder="Full name" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Business name" optional>
          <input name="business" className="field" autoComplete="organization" placeholder="Company LLC" />
        </Field>
        <Field label="Phone / WhatsApp" error={errors.phone}>
          <input name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+971 5X XXX XXXX" aria-invalid={!!errors.phone} />
        </Field>
        <Field label="Email" optional error={errors.email}>
          <input name="email" type="email" className="field" autoComplete="email" placeholder="you@company.ae" aria-invalid={!!errors.email} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => {
            const on = services.includes(s.slug);
            return (
              <button
                type="button"
                key={s.slug}
                onClick={() => toggle(s.slug)}
                aria-pressed={on}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition",
                  on ? "border-ink bg-ink text-paper" : "border-rule-strong hover:border-ink",
                )}
              >
                {on && <Check className="size-3.5" strokeWidth={3} />}
                {s.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="Anything we should know?" optional>
        <textarea name="message" rows={compact ? 3 : 4} className="field resize-none" placeholder="What you sell, who your customers are, what you've tried..." />
      </Field>

      {errors.form && (
        <p className="rounded-lg border border-stamp/40 bg-stamp/5 px-4 py-3 text-sm text-stamp" role="alert">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" arrow={status !== "sending"} disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Sending
            </span>
          ) : (
            submitLabel
          )}
        </Button>
        <p className="text-sm text-muted">Our team replies within one business day. No spam, ever.</p>
      </div>
    </form>
  );
}

function Field({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">
        {label} {optional && <span className="font-normal text-faint">(optional)</span>}
      </span>
      {children}
      {error && <span className="text-xs text-stamp">{error}</span>}
    </label>
  );
}

/** Shown when the lead went out as a pre-filled WhatsApp chat: it only reaches us once they press send. */
export function WhatsAppPending({ href, name }: { href: string; name?: string }) {
  return (
    <div className="flex animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both] flex-col items-start gap-5 py-4" role="status">
      <span className="grid size-12 place-items-center rounded-full bg-lime text-ink">
        <WhatsAppIcon className="size-6" />
      </span>
      <div>
        <h3 className="display text-3xl">One last tap{name ? `, ${name}` : ""}.</h3>
        <p className="mt-2 max-w-md text-ink-2">
          We&apos;ve opened WhatsApp with your details filled in. Press <span className="font-semibold text-ink">send</span> there and our team will reply within one business day.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href={href} icon={<WhatsAppIcon />}>
          Open WhatsApp again
        </Button>
        <Button href={SITE.phoneHref} variant="outline" icon={<Phone className="size-4" />}>
          Or call {SITE.phone}
        </Button>
      </div>
    </div>
  );
}
