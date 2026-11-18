import type { CSSProperties } from "react";
import CAST_DATA from "@/lib/cast.json";

/**
 * Open Peeps (CC0, by Pablo Stanley).
 * Each character is pre-rendered to public/peeps/<who>-<mood>-<body>.svg by scripts/build-peeps.mjs
 * (runs before dev and every build), so the 2 MB react-peeps library never reaches the browser.
 * Add a cast member, mood or body in src/lib/cast.json.
 * A varied cast; use each character in one place only.
 */
export type Mood = keyof typeof CAST_DATA.faces;
export type Cast = keyof typeof CAST_DATA.cast;
export type Body = "Shirt" | "Paper" | "Device" | "PointingUp" | "Coffee" | "Explaining";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Character({
  who,
  mood = "happy",
  body = "Shirt",
  size = 200,
  className,
  style,
  eager,
}: {
  who: Cast;
  mood?: Mood;
  body?: Body;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** load straight away (for characters revealed by an animation rather than by scrolling) */
  eager?: boolean;
}) {
  return (
    <div aria-hidden className={className} style={{ width: size, height: size, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing for the optimiser to do */}
      <img
        src={`${BASE}/peeps/${who}-${mood}-${body}.svg`}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="block h-full w-full select-none"
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
