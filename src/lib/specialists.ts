import type { Cast } from "@/components/ui/Character";

/** One specialist per service: the person on our team who owns it. Used on the home page and each service page. */
export const SPECIALIST: Record<string, { who: Cast; body: string; mood: "happy" | "excited" | "calm" | "explaining"; role: string }> = {
  "seo-optimisation": { who: "yusuf", body: "Device", mood: "happy", role: "Search specialist" },
  "paid-ads": { who: "mei", body: "PointingUp", mood: "excited", role: "Ads specialist" },
  "sdr-outreach": { who: "raj", body: "Explaining", mood: "explaining", role: "Outreach specialist" },
  "social-media-management": { who: "dina", body: "Device", mood: "excited", role: "Social specialist" },
  "enquiry-desk": { who: "leo", body: "Coffee", mood: "calm", role: "Enquiry desk lead" },
  "website-redesign": { who: "sara", body: "Paper", mood: "happy", role: "Web specialist" },
};
