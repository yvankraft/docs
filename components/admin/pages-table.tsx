"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePage, setPagePublished } from "@/lib/actions/pages";
import type { DocPage } from "@/lib/generated/prisma/client";

export type PageRow = DocPage & {
  section: { title: string; slug: string };
};

export function PagesTable({ data }: { data: PageRow[] }) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: Promise<{ ok: boolean; error?: string }>, msg: string) {
    startTransition(async () => {
      const res = await action;
      if (!res.ok) toast.error(res.error ?? "Erreur");
      else {
        toast.success(msg);
        router.refresh();
      }
    });
  }

  const columns: ColumnDef<PageRow>[] = [
    {
      accessorKey: "title",
      header: "Page",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/admin/pages/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.title}
          </Link>
          <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      ),
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.section.title}
        </span>
      ),
    },
    {
      accessorKey: "published",
      header: "Statut",
      cell: ({ row }) =>
        row.original.published ? (
          <Badge>Publiée</Badge>
        ) : (
          <Badge variant="secondary">Brouillon</Badge>
        ),
    },
    { accessorKey: "order", header: "Ordre" },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            title={row.original.published ? "Dépublier" : "Publier"}
            onClick={() =>
              run(
                setPagePublished(row.original.id, !row.original.published),
                row.original.published ? "Page dépubliée" : "Page publiée",
              )
            }
          >
            {row.original.published ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/pages/${row.original.id}`)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            onClick={() => setToDelete(row.original.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Rechercher une page…"
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Supprimer cette page ?"
        description="Elle sera retirée du sommaire. Cette action est irréversible."
        onConfirm={() => {
          if (!toDelete) return;
          startTransition(async () => {
            const res = await deletePage(toDelete);
            setToDelete(null);
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Page supprimée");
              router.refresh();
            }
          });
        }}
      />
    </>
  );
}
