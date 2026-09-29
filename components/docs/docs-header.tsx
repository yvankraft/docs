"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchDialog } from "@/components/docs/search-dialog";
import { SidebarNav, type DocTree } from "@/components/docs/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function DocsHeader({ tree }: { tree: DocTree }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <SheetTitle className="sr-only">Sommaire</SheetTitle>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mb-6 flex items-center gap-2 font-serif text-lg italic"
          >
            <BookOpen className="size-5 text-primary" /> DocuBase
          </Link>
          <SidebarNav tree={tree} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 font-serif italic">
        <BookOpen className="size-5 text-primary" />
        <span className="hidden sm:inline">DocuBase</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <SearchDialog />
        <ThemeToggle />
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
}
