import Logo from "@/components/Logo";
import AdminLogout from "@/components/admin/AdminLogout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-50">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
          <Logo compact />
          <span className="text-sm text-slate-500">Yönetim paneli</span>
          <AdminLogout />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
