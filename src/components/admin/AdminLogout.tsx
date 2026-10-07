"use client";

import { usePathname } from "next/navigation";

export default function AdminLogout() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <span />;
  return (
    <form action="/api/admin/logout" method="post">
      <button className="text-sm text-slate-500 hover:text-ink">Çıkış</button>
    </form>
  );
}
