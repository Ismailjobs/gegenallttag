"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteButton from "./DeleteButton";

export default function PreviewActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function publish() {
    setBusy("publish");
    const res = await fetch(`/api/admin/posts/${id}/publish`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setError(data.error || "Yayınlanamadı.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function regenCover() {
    setBusy("cover");
    setError("");
    const res = await fetch(`/api/admin/posts/${id}/cover`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setError(data.error || "Görsel üretilemedi.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status !== "PUBLISHED" && (
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={publish}
          className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy === "publish" ? "Yayınlanıyor …" : "Şimdi yayınla"}
        </button>
      )}
      <button
        type="button"
        disabled={Boolean(busy)}
        onClick={regenCover}
        className="rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 disabled:opacity-60"
      >
        {busy === "cover" ? "Görsel üretiliyor …" : "Kapağı OpenAI ile yeniden üret"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <DeleteButton
        href={`/api/admin/posts/${id}`}
        label="Yazıyı sil"
        confirmText="Yazıyı kalıcı olarak silmek istiyor musunuz?"
      />
    </div>
  );
}
