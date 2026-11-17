"use client";
import Peep from "react-peeps";
import type { CSSProperties } from "react";

/**
 * Open Peeps (CC0, by Pablo Stanley) via react-peeps.
 * A varied cast; use each character in one place only.
 */
type Mood = "happy" | "tired" | "calm" | "excited" | "thinking" | "stressed" | "explaining";
export type Cast = "omar" | "priya" | "aisha" | "karim" | "james" | "lina" | "rashid" | "maya" | "ben" | "noor" | "sami" | "zara" | "faisal" | "tom" | "hana" | "yusuf" | "mei" | "leo" | "dina" | "raj" | "sara";

const FACE: Record<Mood, string> = {
  happy: "Smile",
  tired: "Tired",
  calm: "Calm",
  excited: "SmileBig",
  thinking: "Concerned",
  stressed: "Hectic",
  explaining: "Explaining",
};

const CAST: Record<Cast, { hair: string; facialHair?: string; accessory?: string }> = {
  omar: { hair: "ShortVolumed", facialHair: "FullMedium" },
  priya: { hair: "Bun", accessory: "GlassRound" },
  aisha: { hair: "LongCurly" },
  karim: { hair: "ShortScratch", facialHair: "Goatee" },
  james: { hair: "Afro", accessory: "GlassRoundThick" },
  lina: { hair: "MediumBangs" },
  rashid: { hair: "ShortWavy", facialHair: "Full" },
  maya: { hair: "BunCurly", accessory: "GlassButterfly" },
  ben: { hair: "MediumShort", facialHair: "Chin" },
  noor: { hair: "Long" },
  sami: { hair: "Bald", facialHair: "GoateeCircle", accessory: "GlassClubmaster" },
  zara: { hair: "BantuKnots" },
  faisal: { hair: "ShortCurly", facialHair: "Painters" },
  tom: { hair: "Pomp", accessory: "GlassAviator" },
  hana: { hair: "MediumStraight" },
  yusuf: { hair: "FlatTop", facialHair: "Chin", accessory: "GlassRound" },
  mei: { hair: "BunFancy" },
  leo: { hair: "ShortCurly", accessory: "SunglassWayfarer" },
  dina: { hair: "Twists" },
  raj: { hair: "Turban", facialHair: "Full" },
  sara: { hair: "LongBangs", accessory: "GlassButterflyOutline" },
};

export default function Character({
  who,
  mood = "happy",
  body = "Shirt",
  size = 200,
  className,
  style,
}: {
  who: Cast;
  mood?: Mood;
  body?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const c = CAST[who];
  return (
    <div aria-hidden className={className} style={{ width: size, height: size, ...style }}>
      <Peep
        style={{ width: "100%", height: "100%" }}
        // default frame is 0 0 850 1200 and clips tall hair (buns); give it headroom
        viewBox={{ x: "-50", y: "-130", width: "950", height: "1330" }}
        body={body as never}
        face={FACE[mood] as never}
        hair={c.hair as never}
        facialHair={(c.facialHair ?? "None") as never}
        accessory={(c.accessory ?? "None") as never}
        strokeColor="#15130f"
        backgroundColor="#fbf9f4"
      />
    </div>
  );
}

/** A character inside a coloured circle. */
export function Avatar({ size = 96, tone = "bg-paper-2", className = "", ...rest }: Omit<Parameters<typeof Character>[0], "size" | "className"> & { size?: number; tone?: string; className?: string }) {
  return (
    <div aria-hidden className={`shrink-0 overflow-hidden rounded-full ${tone} ${className}`} style={{ width: size, height: size }}>
      <Character {...rest} size={size} style={{ transform: "translateY(12%) scale(1.08)" }} />
    </div>
  );
}
