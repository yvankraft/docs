import type { Metadata } from "next";
import { PageForm } from "@/components/admin/page-form";
import { getAdminSections } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nouvelle page" };

export default async function NewPage() {
  await requireAdmin();
  const sections = await getAdminSections();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl italic">Nouvelle page</h1>
      <PageForm sections={sections} />
    </div>
  );
}
