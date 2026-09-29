"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { upsertPage } from "@/lib/actions/pages";
import { pageSchema, type PageFormValues, type PageInput } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import type { DocPage, DocSection } from "@/lib/generated/prisma/client";

export function PageForm({
  page,
  sections,
}: {
  page?: DocPage;
  sections: DocSection[];
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PageFormValues, unknown, PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      excerpt: page?.excerpt ?? "",
      content: page?.content ?? "",
      sectionId: page?.sectionId ?? sections[0]?.id ?? "",
      order: page?.order ?? 0,
      published: page?.published ?? true,
    },
  });

  async function onSubmit(data: PageInput) {
    const res = await upsertPage(data, page?.id);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(page ? "Page mise à jour" : "Page créée");
    router.push("/admin/pages");
    router.refresh();
  }

  const published = watch("published");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              {...register("title")}
              onBlur={(e) => {
                if (!page && !watch("slug")) {
                  setValue("slug", slugify(e.target.value));
                }
              }}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait</Label>
            <Textarea
              id="excerpt"
              rows={2}
              placeholder="Résumé affiché sous le titre…"
              {...register("excerpt")}
            />
          </div>
          <div className="space-y-2">
            <Label>Contenu</Label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>
        <aside className="space-y-5 rounded-xl border p-4 h-fit">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Section</Label>
            <Controller
              control={control}
              name="sectionId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sectionId && (
              <p className="text-xs text-destructive">
                {errors.sectionId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Ordre dans la section</Label>
            <Input
              id="order"
              type="number"
              min={0}
              {...register("order", { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="published">Publiée</Label>
            <Switch
              id="published"
              checked={published}
              onCheckedChange={(v) => setValue("published", v)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {page ? "Enregistrer" : "Créer la page"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
