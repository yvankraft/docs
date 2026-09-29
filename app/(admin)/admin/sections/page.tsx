import type { Metadata } from "next";
import { SectionDialog } from "@/components/admin/section-dialog";
import { SectionsTable } from "@/components/admin/sections-table";
import { getAdminSections } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sections" };

export default async function SectionsPage() {
  const sections = await getAdminSections();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Sections</h1>
          <p className="text-sm text-muted-foreground">
            Groupes de pages du sommaire public.
          </p>
        </div>
        <SectionDialog />
      </div>
      <SectionsTable data={sections} />
    </div>
  );
}
