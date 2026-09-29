import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PagesTable } from "@/components/admin/pages-table";
import { buttonVariants } from "@/components/ui/button";
import { getAdminPages } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pages" };

export default async function PagesPage() {
  const pages = await getAdminPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Contenu de la documentation.
          </p>
        </div>
        <Link href="/admin/pages/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="size-4" /> Nouvelle page
        </Link>
      </div>
      <PagesTable data={pages} />
    </div>
  );
}
