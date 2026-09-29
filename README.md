# DocuBase — squelette de documentation

Base de connaissances / documentation technique avec sommaire en sections,
recherche instantanée (⌘K), table des matières automatique et back-office
d'édition (Tiptap).

## Stack

- Next.js 16 + React 19 + TypeScript
- Prisma 7 + PostgreSQL
- Better Auth (rôle `ADMIN`)
- Tiptap (édition riche), Tailwind CSS v4, Base UI

## Fonctionnalités

- **Sommaire arborescent** : sections ordonnées + pages ordonnées
- **TOC auto** : extraite des `h2`/`h3` avec scroll-spy
- **Recherche** : `/api/search` + dialog ⌘K
- **Prev/Next** : navigation linéaire à travers tout le sommaire
- **Brouillons** : `published=false` invisible publiquement
- **Admin** : CRUD sections/pages, journal d'activité, paramètres profil
- **SEO** : sitemap.xml, robots.txt, canonical par page

## Démarrage

```bash
cp .env.example .env   # renseigner DATABASE_URL + BETTER_AUTH_SECRET
pnpm install
pnpm db:push
pnpm db:seed           # admin@example.com / password123
pnpm dev
```

## Structure

```
app/
  docs/[...slug]/page.tsx  → page publique + TOC + prev/next
  docs/page.tsx            → redirige vers la 1ʳᵉ page
  (admin)/admin/           → sections, pages, activité, paramètres
  api/search               → recherche (titre/extrait/contenu)
  api/upload               → images (Vercel Blob)
lib/
  toc.ts                   → extraction h2/h3 + ancres
  queries.ts               → getDocTree, getAdjacentPages…
  actions/                 → sections, pages, users
```

## Limites assumées

- Pas de versioning/éditions : le contenu est la vérité courante
- Recherche par `contains` (suffisant pour <10k pages ; prévoir
  Postgres FTS ou un moteur externe au-delà)
- Un seul rôle (ADMIN) : tout utilisateur connecté peut tout éditer
