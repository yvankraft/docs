"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertSection } from "@/lib/actions/sections";
import { slugify } from "@/lib/slugify";
import type { DocSection } from "@/lib/generated/prisma/client";

export function SectionDialog({ section }: { section?: DocSection }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const editing = !!section;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const input = {
      title: String(d.get("title")),
      slug: String(d.get("slug")),
      description: String(d.get("description") ?? "") || null,
      icon: String(d.get("icon") ?? "") || null,
      order: Number(d.get("order")) || 0,
    };
    startTransition(async () => {
      const res = await upsertSection(input, section?.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(editing ? "Section mise à jour" : "Section créée");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          editing ? (
            <Button variant="ghost" size="sm">
              Modifier
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" /> Nouvelle section
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier la section" : "Nouvelle section"}
          </DialogTitle>
          <DialogDescription>
            Groupe de pages dans le sommaire de la documentation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-title">Titre</Label>
            <Input
              id="s-title"
              name="title"
              defaultValue={section?.title}
              onBlur={(e) => {
                const slugInput = e.currentTarget.form?.slug as
                  | HTMLInputElement
                  | undefined;
                if (slugInput && !slugInput.value) {
                  slugInput.value = slugify(e.target.value);
                }
              }}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-slug">Slug</Label>
              <Input
                id="s-slug"
                name="slug"
                defaultValue={section?.slug}
                placeholder="demarrage"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-order">Ordre</Label>
              <Input
                id="s-order"
                name="order"
                type="number"
                min={0}
                defaultValue={section?.order ?? 0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-description">Description</Label>
            <Input
              id="s-description"
              name="description"
              defaultValue={section?.description ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-icon">Icône (nom lucide)</Label>
            <Input
              id="s-icon"
              name="icon"
              defaultValue={section?.icon ?? ""}
              placeholder="rocket"
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
