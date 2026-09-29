import "dotenv/config";
import { auth } from "../lib/auth";
import { db } from "../lib/db";
import { SECTIONS } from "./seed-data";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;

  const { user } = await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email,
      password: process.env.ADMIN_PASSWORD ?? "password123",
    },
  });
  return db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
}

async function main() {
  const admin = await seedAdmin();

  let pageCount = 0;
  for (const s of SECTIONS) {
    const section = await db.docSection.upsert({
      where: { slug: s.slug },
      create: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        order: s.order,
      },
      update: { title: s.title, description: s.description, icon: s.icon, order: s.order },
    });
    for (const p of s.pages) {
      const exists = await db.docPage.findUnique({
        where: { sectionId_slug: { sectionId: section.id, slug: p.slug } },
      });
      if (!exists) {
        await db.docPage.create({
          data: {
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: p.content,
            order: p.order,
            sectionId: section.id,
          },
        });
      }
      pageCount++;
    }
  }

  const hasLog = await db.activityLog.count();
  if (hasLog === 0) {
    await db.activityLog.create({
      data: {
        action: "seed",
        entity: "docs",
        detail: `${SECTIONS.length} sections, ${pageCount} pages`,
        userId: admin.id,
      },
    });
  }

  console.log(
    `Seed docs terminé : ${SECTIONS.length} sections, ${pageCount} pages. Login : ${admin.email} / password123`,
  );
}

main().finally(() => db.$disconnect());
