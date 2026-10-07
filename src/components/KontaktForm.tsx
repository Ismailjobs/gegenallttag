"use client";

import { useState } from "react";

export default function KontaktForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="mt-10 rounded-2xl border border-navy-100 bg-navy-50 p-6 text-navy-800">
        Danke. Die Nachricht ist bei der Redaktion angekommen – ohne automatische Zusage einer Antwortfrist.
      </p>
    );
  }

  return (
    <form
      className="mt-10 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="block">
        <span className="text-sm font-semibold text-ink">Name</span>
        <input
          required
          name="name"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">E-Mail</span>
        <input
          required
          type="email"
          name="email"
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Nachricht</span>
        <textarea
          required
          name="message"
          rows={6}
          className="mt-1 w-full rounded-xl border border-navy-100 px-4 py-3"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white"
      >
        Nachricht senden
      </button>
    </form>
  );
}
