"use client";
import Link from "next/link";
import clsx from "clsx";

type Variant = "ink" | "outline" | "paper" | "outline-paper" | "stamp";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  arrow?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const styles: Record<Variant, string> = {
  ink: "bg-ink text-paper hover:bg-ink-3 shadow-[0_1px_0_rgba(255,255,255,.12)_inset,0_10px_20px_-12px_rgba(21,19,15,.6)]",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
  paper: "bg-paper text-ink hover:bg-white",
  "outline-paper": "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  stamp: "bg-stamp text-white hover:bg-[#c7361f]",
};

export default function Button({ href, onClick, children, variant = "ink", size = "md", arrow, icon, className, type = "button", disabled }: Props) {
  const cls = clsx(
    "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-[10px] font-semibold transition-[background,color,border,transform,box-shadow] duration-300 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-40",
    size === "lg" ? "h-[56px] px-7 text-[16px]" : "h-11 px-5 text-[15px]",
    styles[variant],
    className,
  );
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (href) {
    const ext = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (ext)
      return (
        <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      );
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
