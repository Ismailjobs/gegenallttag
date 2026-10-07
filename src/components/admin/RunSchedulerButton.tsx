"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RunSchedulerButton() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setMsg("");
          const res = await fetch("/api/admin/run", { method: "POST" });
          const data = await res.json().catch(() => ({}));
          setPending(false);
          setMsg(
            res.ok
              ? `Yayınlanan: ${data.published || 0}, üretilen: ${data.generated || 0}`
              : "Zamanlayıcı başarısız (OpenAI anahtarını kontrol edin).",
          );
          router.refresh();
        }}
        className="rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50 disabled:opacity-60"
      >
        {pending ? "Çalışıyor …" : "Zamanlayıcıyı şimdi çalıştır"}
      </button>
      {msg && <span className="text-sm text-slate-600">{msg}</span>}
    </div>
  );
}
