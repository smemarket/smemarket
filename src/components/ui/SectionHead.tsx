import clsx from "clsx";

/**
 * Heading row: eyebrow + title on the left, intro or actions on the right,
 * so headings never leave a blank half-row.
 */
export default function SectionHead({
  eyebrow,
  title,
  intro,
  aside,
  center,
  dark,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  center?: boolean;
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  const size = Tag === "h1" ? "text-[clamp(2.4rem,min(4.8vw,8.5vh),4.6rem)]" : "text-section";
  if (center)
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className={clsx("label", dark && "!text-paper/60")}>{eyebrow}</p>
        <Tag className={clsx("display mt-4", size)}>{title}</Tag>
        {intro && <p className={clsx("mx-auto mt-5 max-w-2xl text-[19px] leading-relaxed", dark ? "text-paper/75" : "text-ink-2")}>{intro}</p>}
        {aside && <div className="mt-7 flex justify-center">{aside}</div>}
      </div>
    );
  return (
    <div className={clsx("grid gap-6", (intro || aside) && "lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-12")}>
      <div>
        <p className={clsx("label", dark && "!text-paper/60")}>{eyebrow}</p>
        <Tag className={clsx("display mt-4", size)}>{title}</Tag>
      </div>
      {(intro || aside) && (
        <div className={clsx("lg:pb-2", !intro && "lg:justify-self-end")}>
          {intro && <p className={clsx("text-[19px] leading-relaxed", dark ? "text-paper/75" : "text-ink-2")}>{intro}</p>}
          {aside && <div className={clsx(intro && "mt-6")}>{aside}</div>}
        </div>
      )}
    </div>
  );
}
