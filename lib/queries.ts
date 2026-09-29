import { db } from "@/lib/db";

const pageSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  order: true,
  sectionId: true,
} as const;

export function getDocTree() {
  return db.docSection.findMany({
    orderBy: { order: "asc" },
    include: {
      pages: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: pageSelect,
      },
    },
  });
}

export function getDocPage(sectionSlug: string, pageSlug: string) {
  return db.docPage.findFirst({
    where: {
      slug: pageSlug,
      published: true,
      section: { slug: sectionSlug },
    },
    include: { section: true },
  });
}

/** Prev/next : pages aplaties de toute la doc, dans l'ordre du sommaire. */
export async function getAdjacentPages(currentId: string) {
  const sections = await getDocTree();
  const flat = sections.flatMap((s) =>
    s.pages.map((p) => ({ ...p, sectionSlug: s.slug, sectionTitle: s.title })),
  );
  const i = flat.findIndex((p) => p.id === currentId);
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  };
}

export function getFirstPage() {
  return db.docSection.findFirst({
    orderBy: { order: "asc" },
    include: {
      pages: {
        where: { published: true },
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  });
}

// ─── Admin ───

export function getAdminSections() {
  return db.docSection.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { pages: true } } },
  });
}

export function getAdminPages() {
  return db.docPage.findMany({
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    include: { section: { select: { title: true, slug: true } } },
  });
}

export function getAdminPage(id: string) {
  return db.docPage.findUnique({ where: { id }, include: { section: true } });
}

export function getActivityLogs(take = 50) {
  return db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { user: { select: { name: true, email: true } } },
  });
}
