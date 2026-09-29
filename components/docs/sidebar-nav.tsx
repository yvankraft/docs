"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type DocTree = {
  id: string;
  title: string;
  slug: string;
  pages: { id: string; title: string; slug: string }[];
}[];

export function SidebarNav({
  tree,
  onNavigate,
}: {
  tree: DocTree;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {tree.map((section) => (
        <div key={section.id}>
          <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.pages.map((page) => {
              const href = `/docs/${section.slug}/${page.slug}`;
              const active = pathname === href;
              return (
                <li key={page.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md border-l-2 py-1.5 pr-3 pl-3 text-sm transition-colors",
                      active
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
