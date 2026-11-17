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

/**
 * Sends a lead to our own API route (/api/lead). That route forwards it to
 * LEAD_WEBHOOK_URL when configured. Swap the endpoint there, not here.
 */
export async function submitLead(lead: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
