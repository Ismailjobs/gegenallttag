import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArticleView from "@/components/ArticleView";
import PreviewActions from "@/components/admin/PreviewActions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!post) redirect("/admin");

  const related = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      status: "PUBLISHED",
      NOT: { id: post.id },
    },
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
          Önizleme · herkese açık değil
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">{post.title}</p>
            <p className="text-sm text-slate-600">
              Durum {statusLabel(post.status)}
              {post.scheduledFor ? ` · planlanan ${formatDate(post.scheduledFor, "tr-TR")}` : ""}
              {post.publishedAt ? ` · yayında ${formatDate(post.publishedAt, "tr-TR")}` : ""}
            </p>
          </div>
          <PreviewActions id={post.id} status={post.status} />
        </div>
        <Link href="/admin" className="mt-3 inline-block text-sm text-navy-700 hover:underline">
          ← Kuyruğa dön
        </Link>
      </div>
      <ArticleView post={post} related={related} />
    </div>
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Bekliyor",
    PROCESSING: "İşleniyor",
    PUBLISHED: "Yayında",
    DRAFT: "Taslak",
    SCHEDULED: "Planlandı",
  };
  return labels[status] || status;
}
