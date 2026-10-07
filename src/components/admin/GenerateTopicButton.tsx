"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateTopicButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          const res = await fetch(`/api/admin/topics/${id}/generate`, { method: "POST" });
          const data = await res.json().catch(() => ({}));
          setBusy(false);
          if (!res.ok) {
            setError(data.error || "Üretim başarısız. API anahtarını kontrol edin.");
            return;
          }
          if (data.preview) {
            window.location.href = data.preview;
            return;
          }
          router.refresh();
        }}
        className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        {busy ? "OpenAI çalışıyor …" : "Şimdi üret"}
      </button>
      {error && <span className="text-xs text-red-600 max-w-[220px]">{error}</span>}
    </div>
  );
}
