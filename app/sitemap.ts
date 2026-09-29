import type { MetadataRoute } from "next";
import { getDocTree } from "@/lib/queries";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tree = await getDocTree();
  const pages = tree.flatMap((s) =>
    s.pages.map((p) => ({
      url: `${SITE.url}/docs/${s.slug}/${p.slug}`,
      lastModified: new Date(),
    })),
  );
  return [{ url: SITE.url, lastModified: new Date() }, ...pages];
}
