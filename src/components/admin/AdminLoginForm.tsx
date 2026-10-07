"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: fd.get("secret") }),
        });
        setPending(false);
        if (!res.ok) {
          setError("Anahtar geçersiz.");
          return;
        }
        router.push("/admin");
        router.refresh();
      }}
    >
      <label className="block">
        <span className="text-sm font-semibold">Yönetici anahtarı</span>
        <input
          name="secret"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-navy-900 py-3 text-white font-semibold disabled:opacity-60"
      >
        {pending ? "Kontrol ediliyor …" : "Giriş yap"}
      </button>
    </form>
  );
}
