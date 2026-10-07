"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteButton from "./DeleteButton";

export default function PostActions({
  id,
  status,
  publicHref,
}: {
  id: string;
  status: string;
  publicHref: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function call(path: string, label: string) {
    setBusy(label);
    setError("");
    const res = await fetch(path, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setError(data.error || "İşlem başarısız.");
      return;
    }
    if (data.href) {
      window.open(data.href, "_blank");
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/vorschau/${id}`}
        className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50"
      >
        Önizleme
      </Link>
      {status !== "PUBLISHED" && (
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => call(`/api/admin/posts/${id}/publish`, "publish")}
          className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {busy === "publish" ? "…" : "Şimdi yayınla"}
        </button>
      )}
      {status === "PUBLISHED" && (
        <Link
          href={publicHref}
          className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-800"
        >
          Canlı
        </Link>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
      <DeleteButton
        href={`/api/admin/posts/${id}`}
        confirmText="Yazıyı kalıcı olarak silmek istiyor musunuz?"
      />
    </div>
  );
}
