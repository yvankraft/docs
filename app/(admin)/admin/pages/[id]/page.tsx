import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/page-form";
import { getAdminPage, getAdminSections } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Modifier la page" };

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [page, sections] = await Promise.all([
    getAdminPage(id),
    getAdminSections(),
  ]);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl italic">Modifier « {page.title} »</h1>
      <PageForm page={page} sections={sections} />
    </div>
  );
}
