import { NextResponse } from "next/server";

const MAX = 4000;
const clip = (v: unknown, n = 300) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (clip(body.website)) return NextResponse.json({ id: "ok" });

  const lead = {
    id: crypto.randomUUID(),
    type: clip(body.type, 30) || "enquiry",
    name: clip(body.name, 120),
    phone: clip(body.phone, 40),
    email: clip(body.email, 200),
    business: clip(body.business, 200),
    services: Array.isArray(body.services) ? body.services.slice(0, 10).map((s) => clip(s, 80)) : [],
    message: clip(body.message, MAX),
    meta: typeof body.meta === "object" && body.meta ? body.meta : {},
    page: clip(body.page, 200),
    submittedAt: clip(body.submittedAt, 40) || new Date().toISOString(),
  };

  if (!lead.name) return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (lead.phone.replace(/\D/g, "").length < 8)
    return NextResponse.json({ error: "Please add a valid phone or WhatsApp number." }, { status: 422 });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!r.ok) throw new Error(String(r.status));
    } catch (e) {
      console.error("[lead] webhook failed", e);
      return NextResponse.json({ error: "We couldn't save that just now. Please WhatsApp us." }, { status: 502 });
    }
  } else {
    // No endpoint configured yet: log so nothing is lost in dev / server logs.
    console.log("[lead]", JSON.stringify(lead));
  }

  return NextResponse.json({ id: lead.id });
}
