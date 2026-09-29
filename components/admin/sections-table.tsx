"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { SectionDialog } from "@/components/admin/section-dialog";
import { Button } from "@/components/ui/button";
import { deleteSection } from "@/lib/actions/sections";
import type { DocSection } from "@/lib/generated/prisma/client";

type SectionRow = DocSection & { _count: { pages: number } };

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4 text-destructive" />
        )}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Supprimer cette section ?"
        description="La section doit être vide. Cette action est irréversible."
        onConfirm={() =>
          startTransition(async () => {
            const res = await deleteSection(id);
            setOpen(false);
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Section supprimée");
              router.refresh();
            }
          })
        }
      />
    </>
  );
}

const columns: ColumnDef<SectionRow>[] = [
  {
    accessorKey: "title",
    header: "Section",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
      </div>
    ),
  },
  {
    id: "pages",
    header: "Pages",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count.pages}
      </span>
    ),
  },
  { accessorKey: "order", header: "Ordre" },
  {
    id: "view",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/docs/${row.original.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
      >
        Voir →
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <SectionDialog section={row.original} />
        <DeleteButton id={row.original.id} />
      </div>
    ),
  },
];

export function SectionsTable({ data }: { data: SectionRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder="Rechercher une section…"
    />
  );
}
