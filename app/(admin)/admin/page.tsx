import Link from "next/link";
import type { Metadata } from "next";
import { FileText, Folder, EyeOff, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const [sections, pages, drafts, recent] = await Promise.all([
    db.docSection.count(),
    db.docPage.count(),
    db.docPage.count({ where: { published: false } }),
    db.docPage.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { section: { select: { title: true, slug: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Tableau de bord</h1>
        <Link
          href="/admin/pages/new"
          className={buttonVariants({ size: "sm" })}
        >
          Nouvelle page
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Folder} title="Sections" value={sections} />
        <StatCard icon={FileText} title="Pages publiées" value={pages - drafts} />
        <StatCard icon={EyeOff} title="Brouillons" value={drafts} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4" /> Dernières modifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.section.title} · {p.published ? "publiée" : "brouillon"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(p.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
