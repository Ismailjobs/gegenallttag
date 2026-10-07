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

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <svg
        width={compact ? 36 : 42}
        height={compact ? 28 : 32}
        viewBox="0 0 64 48"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 36 L18 16 L28 28 L40 10 L60 36"
          stroke={inverted ? "#93C5FD" : "#1E6BB8"}
          strokeWidth="3.2"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M10 36 L22 22 L32 32 L44 16 L58 36"
          stroke={inverted ? "#E8F1FB" : "#0E2744"}
          strokeWidth="2.4"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M2 38 H62" stroke={inverted ? "#64748B" : "#0E2744"} strokeWidth="2" />
      </svg>
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
