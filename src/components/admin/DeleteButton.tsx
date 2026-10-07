"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  href,
  label = "Sil",
  confirmText = "Silmek istediğinize emin misiniz?",
}: {
  href: string;
  label?: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
        onClick={async () => {
        if (!window.confirm(confirmText)) return;
        setBusy(true);
        const res = await fetch(href, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) return;
        if (window.location.pathname.startsWith("/admin/vorschau")) {
          window.location.href = "/admin";
          return;
        }
        router.refresh();
      }}
      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {busy ? "…" : label}
    </button>
  );
}
