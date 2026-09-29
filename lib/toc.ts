export type TocItem = { id: string; text: string; level: number };

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Extrait les h2/h3 du HTML et ajoute des id d'ancrage. */
export function extractToc(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, lvl, attrs, inner) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      const id = slug(text);
      if (text) toc.push({ id, text, level: Number(lvl) });
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
    },
  );
  return { toc, html: out };
}
