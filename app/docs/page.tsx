import { redirect } from "next/navigation";
import { getFirstPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DocsIndex() {
  const first = await getFirstPage();
  const page = first?.pages[0];
  if (page) redirect(`/docs/${first.slug}/${page.slug}`);
  redirect("/");
}
