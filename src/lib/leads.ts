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

export type LeadResult = { ok: true; id: string } | { ok: false; error: string };

/** Where leads go on a static build (GitHub Pages): any URL that accepts a JSON POST (Formspree, Web3Forms, Make, Zapier, a Google Apps Script…). */
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "";
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
    window.open(waLink(leadMessage(lead)), "_blank", "noopener,noreferrer");
    return { ok: true, id: "whatsapp" };
  }
  try {
    const res = await fetch(ENDPOINT || "/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...lead,
        page: typeof window !== "undefined" ? window.location.pathname : "",
        submittedAt: new Date().toISOString(),
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
