"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { pageSchema, type PageInput } from "@/lib/validators";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function slugTaken(sectionId: string, slug: string, excludeId?: string) {
  const p = await db.docPage.findUnique({
    where: { sectionId_slug: { sectionId, slug } },
  });
  return !!p && p.id !== excludeId;
}

export async function upsertPage(
  input: PageInput,
  id?: string,
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const parsed = pageSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalide" };
    }
    if (await slugTaken(parsed.data.sectionId, parsed.data.slug, id)) {
      return { ok: false, error: "Ce slug existe déjà dans cette section" };
    }
    const page = id
      ? await db.docPage.update({
          where: { id },
          data: parsed.data,
          include: { section: true },
        })
      : await db.docPage.create({
          data: parsed.data,
          include: { section: true },
        });
    await logActivity(
      id ? "update" : "create",
      "page",
      page.id,
      page.title,
      user.id,
    );
    revalidatePath("/admin/pages");
    revalidatePath(`/docs/${page.section.slug}/${page.slug}`);
    revalidatePath("/docs", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function deletePage(id: string): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    await db.docPage.delete({ where: { id } });
    await logActivity("delete", "page", id, undefined, user.id);
    revalidatePath("/admin/pages");
    revalidatePath("/docs", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function setPagePublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    await db.docPage.update({
      where: { id },
      data: { published },
    });
    await logActivity(
      "update",
      "page",
      id,
      published ? "publiée" : "dépubliée",
      user.id,
    );
    revalidatePath("/admin/pages");
    revalidatePath("/docs", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}
