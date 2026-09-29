import { DocsHeader } from "@/components/docs/docs-header";
import { SidebarNav } from "@/components/docs/sidebar-nav";
import { getDocTree } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = await getDocTree();

  return (
    <div className="flex min-h-screen flex-col">
      <DocsHeader tree={tree} />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-8 pr-4 pl-6 lg:block">
          <SidebarNav tree={tree} />
        </aside>
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
