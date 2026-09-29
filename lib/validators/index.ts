import { z } from "zod";

const slug = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (a-z, 0-9, tirets)");

export const sectionSchema = z.object({
  title: z.string().min(2, "Titre requis").max(80),
  slug,
  description: z.string().max(300).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  order: z.number().int().min(0).default(0),
});

export const pageSchema = z.object({
  title: z.string().min(2, "Titre requis").max(120),
  slug,
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(1, "Contenu requis"),
  sectionId: z.string().min(1, "Section requise"),
  order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(60),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(8, "8 caractères minimum"),
  newPassword: z.string().min(8, "8 caractères minimum"),
});

export type SectionInput = z.infer<typeof sectionSchema>;
export type PageFormValues = z.input<typeof pageSchema>;
export type PageInput = z.output<typeof pageSchema>;
