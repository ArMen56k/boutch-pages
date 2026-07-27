# DESIGN.md — BoutchSoftware

Source de vérité visuelle du site public (`boutch-pages/`, miroir `docs/`) et des
pages web produit. Le système partagé vit dans `assets/site-shell.css` et
`assets/site-shell.js`.

## Positionnement

BoutchSoftware se présente comme un studio logiciel contemporain, précis et
humain. L’interface doit démontrer la qualité technique par sa finition, sa
fluidité et sa clarté — jamais par du jargon ou des effets gratuits.

## Langage visuel

- Fond graphite presque noir pour les héros et les pages produit.
- Accents lumineux vert, menthe et cyan, utilisés avec parcimonie.
- Surfaces vitrées sombres, lignes fines, halos très diffus et grille technique.
- Sections éditoriales claires pour créer du rythme et maximiser la lisibilité.
- Typographie système très contrastée, titres massifs et interlignage serré.
- Grilles « bento » asymétriques sur ordinateur, pile simple sur mobile.

Tokens principaux :

- `--studio-night: #03100b`
- `--studio-deep: #071b13`
- `--studio-green: #7cf28a`
- `--studio-lime: #a7f96f`
- `--studio-mint: #58e6bd`
- `--studio-cyan: #65dff2`
- `--studio-paper: #f1f6f3`

## Navigation

La barre globale est flottante, translucide et compacte. Son architecture est
identique sur toutes les pages : un accès direct à **Accueil** et un menu
déroulant **Toutes les pages**. Ce panneau regroupe les applications, les pages
pratiques, la philosophie, les traductions et chaque document juridique ; aucune
page publique ne doit rester inaccessible depuis cette navigation. La page
courante y est signalée. Le menu s’ouvre au survol, au clic et au clavier sur
ordinateur, puis devient un panneau tactile imbriqué sous 760 px. Le changement
de langue reste toujours accessible, les cibles interactives font au minimum
42 px de haut et le focus clavier reste visible.

## Familles de pages

- **Vitrine et traduction** : héros immersif, alternance de séquences sombres et
  claires, appels à l’action très lisibles.
- **Produits** : héros sombre, promesse forte, étapes et bénéfices en cartes bento.
- **Juridique** : en-tête sombre, contenu sur papier clair pour la lecture longue.
- **Utilitaires** : carte de verre centrée, information essentielle immédiatement
  visible sur mobile.

## Mouvement et accessibilité

Les effets sont des améliorations progressives : le contenu reste visible sans
JavaScript. Les transitions sont courtes, le défilement respecte
`prefers-reduced-motion`, le contraste est maintenu et les langues FR/EN sont
annoncées correctement aux technologies d’assistance.

## Règles de maintenance

- Ne jamais réécrire les textes métier lors d’une évolution visuelle.
- Le manifeste « L’esprit de BoutchSoftware » reste publié intégralement en français et
  en anglais : ce contenu fondateur ne doit jamais être remplacé par un résumé.
- La vitrine référence les produits actifs PrepCalm, Touché c’est fait, Preuve à l’appui
  et Serene Decisions, chacun avec une page produit dédiée.
- Toute nouvelle page charge le shell partagé avant d’ajouter ses exceptions.
- Répliquer chaque changement du site public dans `docs/`.
- Contrôler au minimum une vue ordinateur et une vue mobile dans un vrai navigateur.
