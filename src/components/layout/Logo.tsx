import Link from "next/link";
import Image from "next/image";

/** The official SMEmarket logo (from smemarket.ae), recoloured for dark and light backgrounds. */
export default function Logo({ onClick, tone = "light", className = "h-7 w-auto md:h-8" }: { onClick?: () => void; tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" onClick={onClick} className="flex shrink-0 items-center" aria-label="SME Market home">
      <Image quality={90}
        src={tone === "dark" ? "/brand/logo-on-dark.png" : "/brand/logo-on-light.png"}
        alt="SMEmarket"
        width={1206}
        height={215}
        priority
        className={className}
      />
    </Link>
  );
}

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return <Image quality={90} src="/brand/logo-mark.png" alt="" width={208} height={208} className={className} aria-hidden />;
}
