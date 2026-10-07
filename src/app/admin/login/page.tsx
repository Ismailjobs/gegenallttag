import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) redirect("/admin");
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
      <h1 className="font-serif text-3xl text-ink">Yönetim</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sunucu gizli anahtarı ile giriş. Herkese açık hesap yok.
      </p>
      <AdminLoginForm />
    </div>
  );
}
