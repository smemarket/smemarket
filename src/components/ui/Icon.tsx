import { Search, Megaphone, UserPlus, CalendarDays, Headphones, PanelsTopLeft, type LucideProps } from "lucide-react";
import type { IconName } from "@/lib/site";

const MAP = {
  search: Search,
  megaphone: Megaphone,
  userPlus: UserPlus,
  calendar: CalendarDays,
  headphones: Headphones,
  layout: PanelsTopLeft,
};

export default function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = MAP[name];
  return <C strokeWidth={1.75} {...props} />;
}
