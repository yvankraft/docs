"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sectionSchema, type SectionInput } from "@/lib/validators";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function slugTaken(slug: string, excludeId?: string) {
  const s = await db.docSection.findUnique({ where: { slug } });
  return !!s && s.id !== excludeId;
}

export async function upsertSection(
  input: SectionInput,
  id?: string,
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const parsed = sectionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalide" };
    }
    if (await slugTaken(parsed.data.slug, id)) {
      return { ok: false, error: "Ce slug est déjà utilisé" };
    }
    const section = id
      ? await db.docSection.update({ where: { id }, data: parsed.data })
      : await db.docSection.create({ data: parsed.data });
    await logActivity(
      id ? "update" : "create",
      "section",
      section.id,
      section.title,
      user.id,
    );
    revalidatePath("/admin/sections");
    revalidatePath("/docs", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function deleteSection(id: string): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const count = await db.docPage.count({ where: { sectionId: id } });
    if (count > 0) {
      return {
        ok: false,
        error: `Cette section contient ${count} page(s) — supprimez-les d'abord`,
      };
    }
    await db.docSection.delete({ where: { id } });
    await logActivity("delete", "section", id, undefined, user.id);
    revalidatePath("/admin/sections");
    revalidatePath("/docs", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}
