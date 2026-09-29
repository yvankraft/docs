import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, Pencil } from "lucide-react";
import { PrevNext } from "@/components/docs/prev-next";
import { Toc } from "@/components/docs/toc";
import { getSessionUser } from "@/lib/auth";
import { extractToc } from "@/lib/toc";
import { db } from "@/lib/db";
import { getAdjacentPages, getDocPage, getDocTree } from "@/lib/queries";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { slug: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [sectionSlug, pageSlug] = slug;
  if (!pageSlug) return {};
  const page = await getDocPage(sectionSlug, pageSlug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.excerpt ?? undefined,
    alternates: {
      canonical: `${SITE.url}/docs/${sectionSlug}/${pageSlug}`,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [sectionSlug, pageSlug] = slug;

  // /docs/<section> → redirige vers la première page de la section
  if (!pageSlug) {
    const section = await db.docSection.findUnique({
      where: { slug: sectionSlug },
      include: {
        pages: {
          where: { published: true },
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    });
    const first = section?.pages[0];
    if (first) redirect(`/docs/${sectionSlug}/${first.slug}`);
    notFound();
  }

  const [page, user] = await Promise.all([
    getDocPage(sectionSlug, pageSlug),
    getSessionUser(),
  ]);
  if (!page) notFound();

  const { toc, html } = extractToc(page.content);
  const { prev, next } = await getAdjacentPages(page.id);

  return (
    <div className="flex gap-10">
      <article className="min-w-0 max-w-3xl flex-1">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground">
            Documentation
          </Link>
          <ChevronRight className="size-3" />
          <span>{page.section.title}</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{page.title}</span>
        </nav>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl italic">{page.title}</h1>
            {page.excerpt && (
              <p className="mt-3 text-lg text-muted-foreground">
                {page.excerpt}
              </p>
            )}
          </div>
          {user && (
            <Link
              href={`/admin/pages/${page.id}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3" /> Modifier
            </Link>
          )}
        </div>

        <div
          className="prose prose-stone mt-10 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <PrevNext prev={prev} next={next} />
      </article>
      <Toc items={toc} />
    </div>
  );
}
