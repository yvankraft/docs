import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  EyeOff,
  FileText,
  Folder,
  PenLine,
  Plus,
} from "lucide-react";
import { MiniBars, Spark } from "@/components/admin/dash-charts";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";

const DAY_MS = 86400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS);

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const [user, sections, pages, drafts, recent, sectionList, edits14d, editors] =
    await Promise.all([
      getSessionUser(),
      db.docSection.count(),
      db.docPage.count(),
      db.docPage.count({ where: { published: false } }),
      db.docPage.findMany({
        orderBy: { updatedAt: "desc" },
        take: 7,
        include: { section: { select: { title: true, slug: true } } },
      }),
      db.docSection.findMany({
        include: { _count: { select: { pages: true } } },
        orderBy: { order: "asc" },
        take: 4,
      }),
      db.docPage.findMany({
        where: { updatedAt: { gte: daysAgo(14) } },
        select: { updatedAt: true },
      }),
      db.user.findMany({ orderBy: { createdAt: "asc" }, take: 4 }),
    ]);

  const published = pages - drafts;
  const pubPct = pages ? Math.round((published / pages) * 100) : 0;
  const maxSection = Math.max(1, ...sectionList.map((s) => s._count.pages));

  const perDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--)
    perDay.set(daysAgo(i).toISOString().slice(0, 10), 0);
  for (const e of edits14d) {
    const d = e.updatedAt.toISOString().slice(0, 10);
    if (perDay.has(d)) perDay.set(d, perDay.get(d)! + 1);
  }
  const series = [...perDay.values()];
  const firstName = (user?.name ?? "rédacteur").split(" ")[0];

  return (
    <div className="space-y-5">
      {/* Greeting — style Youcare */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          Bonjour, {firstName} !
        </h1>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> Nouvelle page
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Brouillons — chart card */}
        <div className="rounded-3xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Modifications — 14 j</p>
            <Badge variant="secondary" className="rounded-full text-xs">
              {edits14d.length}
            </Badge>
          </div>
          <div className="mt-4">
            <MiniBars
              data={series}
              width={180}
              height={70}
              color="var(--chart-1)"
              className="w-full"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {drafts} brouillon(s) en attente de publication
          </p>
        </div>

        {/* Accent card — feature */}
        <Link
          href="/docs"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-5 text-primary-foreground"
        >
          <PenLine className="absolute -right-3 -bottom-3 size-24 text-white opacity-20 transition-transform group-hover:scale-110" />
          <Badge className="border-white/30 bg-white/20 text-white">
            Aujourd’hui
          </Badge>
          <p className="mt-3 text-lg font-semibold leading-snug">
            La documentation vit par vos contributions.
          </p>
          <p className="mt-1 max-w-[85%] text-xs leading-relaxed text-white/75">
            Publiez, réorganisez et gardez la base à jour.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
            Voir le site <ArrowUpRight className="size-3.5" />
          </span>
        </Link>

        {/* Taux publié — trend card */}
        <div className="rounded-3xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Taux publié</p>
            <Badge variant="secondary" className="rounded-full text-xs">
              {published}/{pages}
            </Badge>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {pubPct}
            <span className="text-lg text-muted-foreground">%</span>
          </p>
          <div className="mt-2">
            <Spark data={series} stroke="var(--chart-2)" width={150} height={44} />
          </div>
          <p className="mt-2 text-xs font-medium text-primary">
            ▲ activité éditoriale
          </p>
        </div>

        {/* Progression sections — checkup style */}
        <div className="rounded-3xl border bg-card p-5">
          <p className="text-sm font-medium">Sections</p>
          <ul className="mt-4 space-y-3.5">
            {sectionList.map((s) => (
              <li key={s.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Folder className="size-3" /> {s.title}
                  </span>
                  <span className="tabular-nums">{s._count.pages}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(s._count.pages / maxSection) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
            {sectionList.length === 0 && (
              <p className="text-xs text-muted-foreground">Aucune section.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_260px]">
        {/* Chiffres */}
        <div className="grid content-start gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Sections</p>
                <Folder className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                {sections}
              </p>
            </div>
            <div className="rounded-3xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <EyeOff className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                {drafts}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pages publiées</p>
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {published}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              sur {pages} page(s) au total
            </p>
          </div>
        </div>

        {/* Dernières modifications — table */}
        <div className="rounded-3xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4" /> Dernières modifications
            </p>
            <Link
              href="/admin/pages"
              className="flex items-center gap-1 text-xs font-medium text-primary"
            >
              Tout voir <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-3 divide-y">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="block truncate text-sm font-medium hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.section.title} ·{" "}
                    {p.published ? "publiée" : "brouillon"}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(p.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rédacteurs — my doctor style */}
        <div className="rounded-3xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Rédacteurs</p>
            <Link
              href="/admin/activity"
              className="text-xs font-medium text-primary"
            >
              Activité
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {editors.map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {u.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {u.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {u.role === "ADMIN" ? "Administrateur" : "Rédacteur"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
