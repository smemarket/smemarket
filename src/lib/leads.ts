import { SITE, waLink } from "./site";

export type LeadPayload = {
  type: "enquiry" | "assessment" | "plan" | "contact";
  name: string;
  phone: string;
  email?: string;
  business?: string;
  services?: string[];
  message?: string;
  meta?: Record<string, unknown>;
  /** honeypot, must stay empty */
  website?: string;
};

/** `whatsapp` is set when the lead went out as a pre-filled WhatsApp chat, which only reaches us once the visitor presses send. */
export type LeadResult = { ok: true; id: string; whatsapp?: string } | { ok: false; error: string };

/**
 * Where leads go on a static build (GitHub Pages).
 *  - Web3Forms (recommended, free): set NEXT_PUBLIC_LEAD_ACCESS_KEY to your access key; each lead is emailed to you.
 *    The key is meant to be public, so it's fine in the browser bundle.
 *  - Anything else that accepts a JSON POST (Formspree, Make, Zapier…): set NEXT_PUBLIC_LEAD_ENDPOINT to its URL.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_LEAD_ACCESS_KEY || "";
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || (ACCESS_KEY ? "https://api.web3forms.com/submit" : "");
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Turns a lead into a ready-to-send WhatsApp message to our number. */
function leadMessage(l: LeadPayload) {
  const lines = [
    `Hi ${SITE.name}, I'd like to talk about growing my business.`,
    "",
    `Name: ${l.name}`,
    `Phone: ${l.phone}`,
    l.email && `Email: ${l.email}`,
    l.business && `Business: ${l.business}`,
    l.services?.length && `Interested in: ${l.services.join(", ")}`,
    l.message && `Message: ${l.message}`,
  ];
  return lines.filter((x, i): x is string => typeof x === "string" && (x !== "" || i === 1)).join("\n");
}

/**
 * Sends a lead.
 *  - Server build: POSTs to our own API route (/api/lead), which forwards to LEAD_WEBHOOK_URL.
 *  - Static build with NEXT_PUBLIC_LEAD_ENDPOINT set: POSTs straight to that endpoint.
 *  - Static build without an endpoint: opens WhatsApp with the details filled in, so no lead is ever lost.
 *    (Called synchronously from the submit handler, so the new tab isn't blocked.)
 */
export async function submitLead(lead: LeadPayload): Promise<LeadResult> {
  if (lead.website) return { ok: true, id: "ignored" }; // honeypot: quietly drop bots
  if (STATIC && !ENDPOINT) {
    const href = waLink(leadMessage(lead));
    window.open(href, "_blank", "noopener,noreferrer");
    return { ok: true, id: "whatsapp", whatsapp: href };
  }
  try {
    const res = await fetch(ENDPOINT || "/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...lead,
        page: typeof window !== "undefined" ? window.location.pathname : "",
        submittedAt: new Date().toISOString(),
        // Web3Forms: authenticates the form, and shapes the email so it reads well in an inbox
        ...(ACCESS_KEY && {
          access_key: ACCESS_KEY,
          subject: `New ${lead.type} from ${lead.name}${lead.business ? ` (${lead.business})` : ""}`,
          from_name: "SME Market website",
          services: lead.services?.join(", ") || "",
          meta: lead.meta ? JSON.stringify(lead.meta) : "",
        }),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || "Something went wrong. Please try WhatsApp instead." };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Please try WhatsApp or call us." };
  }
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/[^\d]/g, "").length >= 8;
