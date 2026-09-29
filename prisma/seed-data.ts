// Contenu de démonstration — HTML compatible Tiptap (h2/h3 pour la TOC).

const p = (t: string) => `<p>${t}</p>`;
const h2 = (t: string) => `<h2>${t}</h2>`;
const h3 = (t: string) => `<h3>${t}</h3>`;
const code = (t: string) => `<pre><code>${t}</code></pre>`;
const ul = (...items: string[]) =>
  `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

export const SECTIONS: {
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  pages: {
    title: string;
    slug: string;
    excerpt: string;
    order: number;
    content: string;
  }[];
}[] = [
  {
    title: "Démarrage",
    slug: "demarrage",
    description: "Prise en main et installation",
    icon: "rocket",
    order: 0,
    pages: [
      {
        title: "Introduction",
        slug: "introduction",
        excerpt: "Ce que fait le produit, pour qui, et comment il est organisé.",
        order: 0,
        content:
          h2("Bienvenue") +
          p("Cette documentation couvre l'installation, la configuration et l'usage quotidien de la plateforme. Elle est organisée en sections ordonnées : chaque page renvoie à la suivante.") +
          h2("Public visé") +
          p("Développeurs, product managers et équipes support. Aucune connaissance préalable n'est requise pour la section Démarrage.") +
          h3("Conventions") +
          ul(
            "Les blocs de code sont exécutables tels quels en environnement de développement.",
            "Les chemins de fichiers sont relatifs à la racine du projet.",
            "Les valeurs entre <code>&lt;chevrons&gt;</code> sont à remplacer.",
          ) +
          h2("Obtenir de l'aide") +
          p("En cas de blocage, utilisez la recherche (⌘K) ou contactez le support via le canal dédié."),
      },
      {
        title: "Installation",
        slug: "installation",
        excerpt: "Installer le projet et ses dépendances en local.",
        order: 1,
        content:
          h2("Prérequis") +
          ul("Node.js 20+", "pnpm 9+", "PostgreSQL 15+") +
          h2("Étapes") +
          p("Clonez le dépôt puis installez les dépendances :") +
          code("pnpm install\npnpm db:push\npnpm db:seed") +
          h3("Variables d'environnement") +
          p("Copiez <code>.env.example</code> vers <code>.env</code> et renseignez <code>DATABASE_URL</code> ainsi que le secret d'authentification.") +
          h2("Lancement") +
          code("pnpm dev") +
          p("L'application est disponible sur http://localhost:3000."),
      },
      {
        title: "Premier projet",
        slug: "premier-projet",
        excerpt: "Créer et publier votre première page de documentation.",
        order: 2,
        content:
          h2("Créer une section") +
          p("Dans l'administration, ouvrez « Sections » puis « Nouvelle section ». Le slug est généré automatiquement depuis le titre.") +
          h2("Créer une page") +
          p("Ouvrez « Pages » → « Nouvelle page ». Choisissez la section, saisissez le titre et le contenu dans l'éditeur riche.") +
          h3("Publication") +
          p("Une page en brouillon n'apparaît ni dans le sommaire ni dans la recherche. Basculez l'interrupteur « Publiée » pour la rendre visible.") +
          h2("Vérifier le rendu") +
          p("Le bouton « Voir » dans la table des pages ouvre la page publique. La table des matières est générée automatiquement à partir des titres h2 et h3."),
      },
    ],
  },
  {
    title: "Guides",
    slug: "guides",
    description: "Guides pas à pas",
    icon: "map",
    order: 1,
    pages: [
      {
        title: "Organiser le sommaire",
        slug: "organiser-le-sommaire",
        excerpt: "Ordonner sections et pages pour une navigation logique.",
        order: 0,
        content:
          h2("Ordre des sections") +
          p("Chaque section possède un champ « ordre ». Les sections sont triées par ordre croissant dans le sommaire latéral.") +
          h2("Ordre des pages") +
          p("Même principe à l'intérieur de chaque section. La navigation précédent/suivant suit cet ordre global, à travers toutes les sections.") +
          h3("Bonnes pratiques") +
          ul(
            "Placez les pages de démarrage en premier.",
            "Regroupez les références techniques en fin de sommaire.",
            "Évitez plus de 7 pages par section : créez une nouvelle section sinon.",
          ),
      },
      {
        title: "Écrire du contenu",
        slug: "ecrire-du-contenu",
        excerpt: "Structurer les pages pour la lisibilité et la recherche.",
        order: 1,
        content:
          h2("Structure d'une page") +
          p("Un titre clair, un extrait d'une phrase, puis des sections h2. Les h3 servent pour les sous-parties : ils apparaissent dans « Sur cette page ».") +
          h2("Blocs de code") +
          p("Utilisez les blocs de code pour les commandes et extraits :") +
          code("curl -X GET https://api.exemple.dev/v1/status") +
          h3("Extraits") +
          p("L'extrait sert de description dans les résultats de recherche et les balises meta. Rédigez-le comme une réponse à « que vais-je apprendre ? ».") +
          h2("Style") +
          ul("Phrases courtes.", "Toujours en français dans la doc produit.", "Pas de jargon sans définition."),
      },
      {
        title: "Recherche et navigation",
        slug: "recherche-navigation",
        excerpt: "Comment fonctionnent la recherche ⌘K et la table des matières.",
        order: 2,
        content:
          h2("Recherche globale") +
          p("La recherche interroge titres, extraits et contenu de toutes les pages publiées. Elle se déclenche via ⌘K ou le bouton en haut de page.") +
          h2("Table des matières") +
          p("Générée automatiquement depuis les titres h2 et h3 de la page. Elle suit le défilement et surligne la section visible.") +
          h2("Navigation linéaire") +
          p("Les liens « Précédent » et « Suivant » en bas de page suivent l'ordre du sommaire, indépendamment des sections."),
      },
    ],
  },
  {
    title: "Administration",
    slug: "administration",
    description: "Gérer le contenu et les accès",
    icon: "shield",
    order: 2,
    pages: [
      {
        title: "Comptes et rôles",
        slug: "comptes-et-roles",
        excerpt: "Gérer les administrateurs de la documentation.",
        order: 0,
        content:
          h2("Rôle administrateur") +
          p("Tous les comptes créés ont le rôle ADMIN : accès complet aux sections, pages, journal d'activité et paramètres.") +
          h2("Créer un compte") +
          p("Les comptes se créent via la page d'inscription ou directement en base. En production, restreignez la page d'inscription ou désactivez-la.") +
          h3("Sécurité") +
          ul(
            "Mot de passe minimum 8 caractères.",
            "Sessions signées côté serveur via Better Auth.",
            "Les routes /admin sont protégées par le proxy.",
          ),
      },
      {
        title: "Journal d'activité",
        slug: "journal-activite",
        excerpt: "Suivre les créations, modifications et suppressions.",
        order: 1,
        content:
          h2("Ce qui est enregistré") +
          p("Chaque création, modification, publication et suppression de section ou de page est journalisée avec l'auteur et l'horodatage.") +
          h2("Consulter le journal") +
          p("Administration → Activité. Le journal liste les 100 dernières actions, de la plus récente à la plus ancienne.") +
          h3("Cas d'usage") +
          ul(
            "Retrouver qui a publié une page.",
            "Auditer les suppressions.",
            "Suivre l'activité de rédaction sur une période.",
          ),
      },
    ],
  },
  {
    title: "Référence",
    slug: "reference",
    description: "Références techniques",
    icon: "book",
    order: 3,
    pages: [
      {
        title: "API publique",
        slug: "api-publique",
        excerpt: "Endpoints exposés par le squelette.",
        order: 0,
        content:
          h2("GET /api/search") +
          p("Recherche plein texte dans les pages publiées.") +
          code('GET /api/search?q=installation\n→ { "results": [{ "title", "href", "section", "excerpt" }] }') +
          h2("POST /api/upload") +
          p("Upload d'images (session requise, Vercel Blob). Retourne l'URL publique du fichier.") +
          h2("Flux générés") +
          ul(
            "<code>/sitemap.xml</code> — toutes les pages publiées.",
            "<code>/robots.txt</code> — exclut /admin et /api.",
          ),
      },
      {
        title: "Modèle de données",
        slug: "modele-de-donnees",
        excerpt: "Schéma Prisma : sections, pages, utilisateurs.",
        order: 1,
        content:
          h2("DocSection") +
          ul(
            "<code>title</code>, <code>slug</code> unique, <code>description</code>",
            "<code>icon</code> — nom d'icône Lucide",
            "<code>order</code> — position dans le sommaire",
          ) +
          h2("DocPage") +
          ul(
            "<code>title</code>, <code>slug</code> (unique par section)",
            "<code>content</code> — HTML issu de l'éditeur riche",
            "<code>published</code> — visibilité publique",
            "<code>order</code> — position dans la section",
          ) +
          h2("Contraintes") +
          p("La suppression d'une section est bloquée tant qu'elle contient des pages. Le couple (sectionId, slug) est unique."),
      },
    ],
  },
];
