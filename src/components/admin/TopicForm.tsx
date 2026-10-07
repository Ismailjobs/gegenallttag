"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/site";

export default function TopicForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      className="rounded-3xl border border-navy-100 bg-white p-6 grid gap-4 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setMessage("");
        const form = e.currentTarget;
        const fd = new FormData(form);
        const res = await fetch("/api/admin/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: fd.get("title"),
            clusterKeyword: fd.get("clusterKeyword"),
            categorySlug: fd.get("categorySlug"),
            targetLinkUrl: fd.get("targetLinkUrl"),
            targetAnchor: fd.get("targetAnchor"),
            editorPrompt: fd.get("editorPrompt"),
            generateNow: fd.get("generateNow") === "on",
            webResearch: fd.get("webResearch") === "on",
          }),
        });
        const data = await res.json().catch(() => ({}));
        setPending(false);
        if (!res.ok) {
          setMessage(data.error || "Kaydedilemedi.");
          return;
        }
        form.reset();
        if (data.preview) {
          window.location.href = data.preview;
          return;
        }
        setMessage("Kuyruğa eklendi. Başlık ve metni AI üretecek.");
        router.refresh();
      }}
    >
      <label className="md:col-span-2 block">
        <span className="text-sm font-semibold">Prompt</span>
        <textarea
          name="editorPrompt"
          required
          rows={7}
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
          placeholder="Türkçe, İngilizce veya Almanca yazın. Örn: Favoriten’de bodrum evden çıkarma, maliyet, MA 48, komşu şikayeti. AI başlığı, anahtar kelimeyi ve yazıyı Avusturya Almancasıyla üretir."
        />
        <span className="mt-1 block text-xs text-slate-500">
          Tek prompt yeter. Dil fark etmez; yayımlanan metin her zaman resmi Avusturya Almancası olur.
        </span>
      </label>
      <label className="md:col-span-2 block">
        <span className="text-sm font-semibold">Başlık (isteğe bağlı)</span>
        <input
          name="title"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
          placeholder="Boş bırakın — AI Almanca başlık üretir"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Hedef kelime (isteğe bağlı)</span>
        <input
          name="clusterKeyword"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
          placeholder="Boş = AI seçer"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Kategori</span>
        <select
          name="categorySlug"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3 bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">İsteğe bağlı backlink (URL)</span>
        <input
          name="targetLinkUrl"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
          placeholder="https://sofortentrumpelung.at"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">İsteğe bağlı çapa metni</span>
        <input
          name="targetAnchor"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
          placeholder="Entrümpelung in Wien"
        />
      </label>
      <div className="md:col-span-2 flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="webResearch" className="h-4 w-4" defaultChecked />
          İnternet taraması (rakipler, MA 48/46, resmi kaynaklar)
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="generateNow" className="h-4 w-4" defaultChecked />
          OpenAI ile hemen üret (başlık + metin + kapak)
        </label>
      </div>
      <div className="md:col-span-2 flex items-center gap-4">
        <button
          disabled={pending}
          className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "OpenAI çalışıyor …" : "Üret"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
