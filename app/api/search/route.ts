import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Recherche plein texte simple sur titre + extrait + contenu. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const pages = await db.docPage.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      section: { select: { title: true, slug: true } },
    },
    take: 10,
  });

  return NextResponse.json({
    results: pages.map((p) => ({
      title: p.title,
      href: `/docs/${p.section.slug}/${p.slug}`,
      section: p.section.title,
      excerpt: p.excerpt,
    })),
  });
}
