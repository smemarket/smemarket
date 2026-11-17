import clsx from "clsx";
import { Search, Star, TrendingDown, Check, CalendarCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/** Small, crisp illustrations of what each service actually does. */
export const VISUAL_TONE: Record<string, string> = {
  "seo-optimisation": "bg-[#e9f1c9]",
  "paid-ads": "bg-[#f6dcd2]",
  "sdr-outreach": "bg-[#dbe6ef]",
  "social-media-management": "bg-[#f6e3b5]",
  "enquiry-desk": "bg-[#d5ece4]",
  "website-redesign": "bg-[#e3dcf2]",
};

const card = "rounded-xl bg-white shadow-[0_8px_20px_-12px_rgba(21,19,15,.35)]";

export default function ServiceVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "seo-optimisation":
      return (
        <div className="w-[78%] space-y-1.5">
          <div className={clsx(card, "flex items-center gap-2 px-3 py-2 text-[12px] text-muted")}>
            <Search className="size-3.5" /> dentist near JLT
          </div>
          <div className={clsx(card, "flex items-center justify-between px-3 py-2 ring-2 ring-ink")}>
            <span>
              <span className="block text-[12px] font-semibold">Your business</span>
              <span className="flex items-center gap-0.5 text-[10px] text-[#c58a00]">
                <Star className="size-2.5 fill-current" />
                <Star className="size-2.5 fill-current" />
                <Star className="size-2.5 fill-current" />
                <Star className="size-2.5 fill-current" />
                <Star className="size-2.5 fill-current" />
              </span>
            </span>
            <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold">Top 3</span>
          </div>
          <div className={clsx(card, "h-6 opacity-60")} />
        </div>
      );
    case "paid-ads":
      return (
        <div className="flex w-[80%] gap-2">
          <div className={clsx(card, "w-[52%] p-2")}>
            <div className="h-10 rounded-md bg-gradient-to-br from-[#f2c14e] to-[#e0402a]" />
            <p className="mt-1.5 text-[9px] text-muted">Sponsored</p>
            <div className="mt-1 h-1.5 w-4/5 rounded bg-ink/15" />
            <div className="mt-1.5 rounded bg-ink py-0.5 text-center text-[9px] font-semibold text-paper">Book now</div>
          </div>
          <div className={clsx(card, "flex flex-1 flex-col justify-between p-2")}>
            <p className="text-[9px] font-semibold leading-tight">Cost per enquiry</p>
            <div className="flex h-10 items-end gap-1">
              {[90, 70, 55, 40, 30].map((h, i) => (
                <span key={i} className="flex-1 rounded-sm bg-ink/80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="flex items-center gap-0.5 text-[9px] font-bold text-[#3f7d20]">
              <TrendingDown className="size-3" /> going down
            </p>
          </div>
        </div>
      );
    case "sdr-outreach":
      return (
        <div className="w-[80%] space-y-1.5">
          <div className={clsx(card, "max-w-[85%] rounded-bl-sm px-3 py-2 text-[11px] leading-snug")}>Hi Ahmed, saw your new Marina branch. Worth a quick chat?</div>
          <div className="ml-auto max-w-[75%] rounded-xl rounded-br-sm bg-ink px-3 py-2 text-[11px] leading-snug text-paper">Yes, call me Tuesday 👍</div>
          <div className="flex justify-end">
            <span className="flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold">
              <CalendarCheck className="size-3" /> Meeting booked
            </span>
          </div>
        </div>
      );
    case "social-media-management":
      return (
        <div className={clsx(card, "w-[46%] p-2.5")}>
          <div className="grid grid-cols-3 gap-1">
            {["bg-[#e0402a]/70", "bg-[#f2c14e]", "bg-ink/80", "bg-[#7fb3d5]", "bg-[#d4ff3f]", "bg-[#e3a4c4]"].map((c, i) => (
              <span key={i} className={clsx("aspect-square rounded-md", c)} />
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold">
            <span className="size-1.5 rounded-full bg-[#3f7d20]" /> 12 posts scheduled
          </p>
        </div>
      );
    case "enquiry-desk":
      return (
        <div className="w-[80%] space-y-1.5">
          <div className={clsx(card, "max-w-[80%] rounded-bl-sm px-3 py-2 text-[11px]")}>Is Saturday available?</div>
          <div className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-[#d9fdd3] px-3 py-2 text-[11px] shadow-[0_8px_20px_-12px_rgba(21,19,15,.35)]">
            Yes! 11am or 2pm? <Check className="ml-1 inline size-3 text-[#34b7f1]" strokeWidth={3} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="grid size-5 place-items-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon className="size-3" />
            </span>
            <span className="text-[10px] font-semibold">Replied in 9 seconds</span>
          </div>
        </div>
      );
    case "website-redesign":
      return (
        <div className={clsx(card, "w-[78%] overflow-hidden")}>
          <div className="flex gap-1 border-b border-rule px-2 py-1.5">
            <span className="size-1.5 rounded-full bg-[#e0402a]/60" />
            <span className="size-1.5 rounded-full bg-[#f2c14e]" />
            <span className="size-1.5 rounded-full bg-[#3f7d20]/60" />
          </div>
          <div className="p-2.5">
            <div className="h-2 w-3/5 rounded bg-ink" />
            <div className="mt-1.5 h-1.5 w-4/5 rounded bg-ink/15" />
            <div className="mt-1 h-1.5 w-2/3 rounded bg-ink/15" />
            <div className="mt-2.5 flex gap-1.5">
              <span className="rounded bg-ink px-2 py-1 text-[9px] font-semibold text-paper">Book now</span>
              <span className="flex items-center gap-1 rounded bg-[#25D366] px-2 py-1 text-[9px] font-semibold text-white">
                <WhatsAppIcon className="size-2.5" /> WhatsApp
              </span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
