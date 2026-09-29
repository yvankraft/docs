import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Search, ListTree } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { SITE } from "@/lib/constants";
import { getDocTree, getFirstPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [tree, first] = await Promise.all([getDocTree(), getFirstPage()]);
  const firstPage = first?.pages[0];
  if (!firstPage) redirect("/login");
  const startHref = `/docs/${first.slug}/${firstPage.slug}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 font-serif text-lg italic">
          <BookOpen className="size-5 text-primary" /> {SITE.name}
        </span>
        <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Admin
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-6 pb-24">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Documentation
          </p>
          <h1 className="mt-4 font-serif text-5xl italic md:text-6xl">
            {SITE.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {SITE.description}
          </p>
        </FadeIn>
        <FadeIn className="mt-10 flex flex-wrap gap-3">
          <Link href={startHref} className={buttonVariants({ size: "lg" })}>
            Lire la documentation <ArrowRight className="size-4" />
          </Link>
        </FadeIn>
        <FadeIn className="mt-16 grid w-full gap-4 sm:grid-cols-2">
          {[
            {
              icon: ListTree,
              title: "Sommaire organisé",
              text: "Sections ordonnées, navigation claire, prev/next automatique.",
            },
            {
              icon: Search,
              title: "Recherche instantanée",
              text: "⌘K pour chercher dans toute la base sans quitter la page.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border p-5">
              <f.icon className="size-5 text-primary" />
              <p className="mt-3 font-medium">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </FadeIn>
      </main>
    </div>
  );
}
