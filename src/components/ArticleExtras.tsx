import type { ChecklistItem, CostRow, FaqItem } from "@/lib/utils";

export function CostTable({ rows }: { rows: CostRow[] }) {
  if (!rows?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl text-ink mb-4">Orientierung zu den Kosten</h2>
      <div className="overflow-x-auto rounded-2xl border border-navy-100">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-navy-800">
            <tr>
              <th className="px-4 py-3 font-semibold">Leistung</th>
              <th className="px-4 py-3 font-semibold">Spanne</th>
              <th className="px-4 py-3 font-semibold">Hinweis</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-navy-50">
                <td className="px-4 py-3 text-ink">{row.item || (row as { leistung?: string }).leistung}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.range || (row as { spanne?: string }).spanne}</td>
                <td className="px-4 py-3 text-slate-600">{row.note || (row as { hinweis?: string }).hinweis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Spannen dienen der Orientierung in Wien und NÖ. Keine Angebote, keine Garantiepreise.
      </p>
    </section>
  );
}

export function Checklist({ items }: { items: ChecklistItem[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl text-ink mb-4">Checkliste</h2>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-navy-100 bg-navy-50/40 p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
              {i + 1}
            </span>
            <span>
              <span className="block font-semibold text-ink">
                {item.title || (item as { punkt?: string }).punkt}
              </span>
              <span className="block text-sm text-slate-600 mt-1">
                {item.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl text-ink mb-4">Häufige Fragen</h2>
      <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100">
        {items.map((item, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-semibold text-ink flex justify-between gap-4">
              {item.question || (item as { q?: string }).q}
              <span className="text-accent group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-slate-600 leading-7">
              {item.answer || (item as { a?: string }).a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
