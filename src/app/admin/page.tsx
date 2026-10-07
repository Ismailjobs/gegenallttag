import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bootstrapDatabase } from "@/lib/bootstrap";
import TopicForm from "@/components/admin/TopicForm";
import RunSchedulerButton from "@/components/admin/RunSchedulerButton";
import PostActions from "@/components/admin/PostActions";
import GenerateTopicButton from "@/components/admin/GenerateTopicButton";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  await bootstrapDatabase();

  const [topics, posts] = await Promise.all([
    prisma.targetTopic.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
    prisma.post.findMany({
      orderBy: [{ scheduledFor: "asc" }, { publishedAt: "desc" }],
      include: { category: true },
      take: 60,
    }),
  ]);

  const planned = posts.filter((p) => p.status === "SCHEDULED" || p.status === "DRAFT");
  const live = posts.filter((p) => p.status === "PUBLISHED");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Yönetim</h1>
        <p className="mt-2 text-slate-600">
          Tek prompt yeter (Türkçe olabilir). AI başlığı, Avusturya Almancası metni ve kapağı üretir;
          sonra önizleme veya yayın.
        </p>
        <div className="mt-4">
          <RunSchedulerButton />
        </div>
      </div>
      <TopicForm />
      <section className="rounded-3xl border border-navy-100 bg-white overflow-hidden">
        <header className="px-5 py-4 border-b border-navy-100 font-semibold text-ink">
          Konu kuyruğu
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="px-5 py-3">Başlık</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id} className="border-t border-navy-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{topic.title}</div>
                    <div className="text-xs text-slate-500">{topic.clusterKeyword}</div>
                    {topic.editorPrompt ? (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{topic.editorPrompt}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">{topic.categorySlug}</td>
                  <td className="px-5 py-3">
                    <StatusPill value={topic.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {topic.status === "PENDING" && <GenerateTopicButton id={topic.id} />}
                      <DeleteButton
                        href={`/api/admin/topics/${topic.id}`}
                        confirmText="Bu konuyu kuyruktan silmek istiyor musunuz?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-navy-100 bg-white overflow-hidden">
        <header className="px-5 py-4 border-b border-navy-100 font-semibold text-ink">
          Planlanan yazılar (önizleme)
        </header>
        {planned.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">
            Henüz planlanmış yazı yok. Bekleyen bir konuyu ürettiğinizde metin burada PLANLANDI olarak durur.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3">Yazı</th>
                  <th className="px-5 py-3">Tarih</th>
                  <th className="px-5 py-3">Durum</th>
                  <th className="px-5 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {planned.map((post) => (
                  <tr key={post.id} className="border-t border-navy-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-ink">{post.title}</div>
                      <div className="text-xs text-slate-500">{post.category.name}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(post.scheduledFor, "tr-TR")}</td>
                    <td className="px-5 py-3">
                      <StatusPill value={post.status} />
                    </td>
                    <td className="px-5 py-3">
                      <PostActions
                        id={post.id}
                        status={post.status}
                        publicHref={`/${post.category.slug}/${post.slug}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-navy-100 bg-white overflow-hidden">
        <header className="px-5 py-4 border-b border-navy-100 font-semibold text-ink">
          Yayında / arşiv
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="px-5 py-3">Yazı</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Yayın tarihi</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {live.map((post) => (
                <tr key={post.id} className="border-t border-navy-50">
                  <td className="px-5 py-3 text-ink">{post.title}</td>
                  <td className="px-5 py-3">{post.category.name}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(post.publishedAt, "tr-TR")}</td>
                  <td className="px-5 py-3">
                    <PostActions
                      id={post.id}
                      status={post.status}
                      publicHref={`/${post.category.slug}/${post.slug}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const labels: Record<string, string> = {
    PENDING: "Bekliyor",
    PROCESSING: "İşleniyor",
    PUBLISHED: "Yayında",
    DRAFT: "Taslak",
    SCHEDULED: "Planlandı",
  };
  const map: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800",
    PROCESSING: "bg-sky-50 text-sky-800",
    PUBLISHED: "bg-emerald-50 text-emerald-800",
    DRAFT: "bg-slate-100 text-slate-700",
    SCHEDULED: "bg-indigo-50 text-indigo-800",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[value] || "bg-slate-100"}`}>
      {labels[value] || value}
    </span>
  );
}
