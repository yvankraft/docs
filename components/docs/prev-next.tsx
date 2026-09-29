import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

type Adjacent = {
  title: string;
  slug: string;
  sectionSlug: string;
  sectionTitle: string;
} | null;

export function PrevNext({ prev, next }: { prev: Adjacent; next: Adjacent }) {
  return (
    <div className="mt-14 grid gap-4 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={`/docs/${prev.sectionSlug}/${prev.slug}`}>
          <Card className="h-full p-4 transition-colors hover:bg-accent">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3" /> Précédent
            </p>
            <p className="mt-1.5 font-medium">{prev.title}</p>
            <p className="text-xs text-muted-foreground">{prev.sectionTitle}</p>
          </Card>
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={`/docs/${next.sectionSlug}/${next.slug}`}>
          <Card className="h-full p-4 text-right transition-colors hover:bg-accent">
            <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Suivant <ArrowRight className="size-3" />
            </p>
            <p className="mt-1.5 font-medium">{next.title}</p>
            <p className="text-xs text-muted-foreground">{next.sectionTitle}</p>
          </Card>
        </Link>
      )}
    </div>
  );
}
