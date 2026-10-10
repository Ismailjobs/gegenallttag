import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Logo({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  const title = inverted ? "text-white" : "text-ink";
  const sub = inverted ? "text-white/70" : "text-navy-600";
  const height = compact ? 28 : 36;
  const width = Math.round(height * (1600 / 723));

  return (
    <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
      <Image
        src="/images/logo.png"
        alt={SITE.name}
        width={width}
        height={height}
        className="h-7 w-auto sm:h-9"
        priority={!inverted && !compact}
      />
      <span className="leading-tight">
        <span className={`block font-serif text-[22px] font-semibold tracking-tight ${title}`}>
          {SITE.name}
        </span>
        {!compact && (
          <span className={`block text-[10px] uppercase tracking-[0.18em] ${sub}`}>
            {SITE.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
