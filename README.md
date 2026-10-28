# Landing page — Eric Reboisson

Site personnel statique, prêt pour GitHub Pages. HTML5, CSS3 et JavaScript
vanilla : **aucun framework, aucun build, aucun backend**. Le site se compose
de cinq fichiers texte et de trois images.

---

## Structure des fichiers

```
.
├── index.html              La page complète (contenu, SEO, Open Graph)
├── style.css               Tout le style. Les couleurs sont en haut du fichier.
├── script.js               Thème, menu mobile, apparition au scroll
├── README.md               Ce fichier
└── assets/
    ├── avatar.jpg          Photo du hero (actuellement 100×100)
    ├── favicon.svg         Monogramme ER
    ├── og-source.html      Modèle de l'image Open Graph
    └── og-image.png        Image Open Graph 1200×630
```

Ouvrez `index.html` directement dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

---

## Comment personnaliser

Tout est dans `index.html`. Le fichier contient des commentaires `<!-- ... -->`
au-dessus de chaque bloc modifiable. Les endroits à connaître :

| Quoi | Où |
|---|---|
| Nom, rôle, accroche, boutons | `index.html`, section `hero` |
| Paragraphes de présentation | `index.html`, section `a-propos` |
| Groupes de compétences | `index.html`, section `competences` |
| Cartes de projets (titre, description, tags, liens, preuve) | `index.html`, section `projets` |
| Projets de loisir | `index.html`, section `loisirs` |
| Postes et badges bénévolat / professionnel | `index.html`, section `parcours` |
| Adresse e-mail et réseaux | `index.html`, section `contact` |
| Couleurs, espacements, typographie | `style.css`, bloc `1. JETONS DE DESIGN` |
| Titre et description SEO | `index.html`, bloc `SEO` dans `<head>` |

### Ajouter un projet

Copiez un bloc `<article class="project">` complet, collez-le dans `#projets`,
et modifiez le texte. Pour ajouter une carte à la place d'une carte existante,
effacez l'ancien `<article>`. La première carte porte la classe
`project-featured` : elle occupe toute la largeur et sert de mise en avant.

### Ajouter un lien de navigation

Dans le `<nav>`, dupliquez un `<li><a href="#ancre">Libellé</a></li>`, puis
ajoutez une `<section id="ancre">` correspondante.

### Changer les couleurs

Tout part des variables du haut de `style.css`. Pour un thème sombre,
modifiez `:root`. Pour le thème clair, modifiez `[data-theme="light"]`.
La couleur d'accent est `--accent` (et `--accent-hover` pour son survol).

```css
:root {
  --accent: #4EA8FF;   /* Bleu par défaut */
  --accent-hover: #7BBEFF;
}
```

Chaque thème porte son propre accent. Vérifiez qu'il passe **4.5:1** sur son
fond : `.eyebrow` et `.badge-job` sont peints en `var(--accent)`, donc un accent
trop clair échoue en petit texte. C'est pourquoi l'accent clair est passé de
`#0B72D9` (4.21:1) à `#0A66C4` (4.97:1).

---

## Remplacer la photo

La photo actuelle (`assets/avatar.jpg`) ne fait que **100 × 100 pixels** : elle
s'affiche nets sur un écran standard, mais un peu douce sur un écran Retina.

Pour une image nette, ouvrez votre photo LinkedIn en grand format,
enregistrez-la, et remplacez le fichier `assets/avatar.jpg` par cette image.
Format carré recommandé, **400 × 400 minimum** (800 × 800 idéal).

Si vous changez de dimensions, ajustez l'attribut `width` / `height` de l'image
et la taille dans `.hero-avatar img` (`style.css`, section `6. HERO`).

---

## Remplacer l'image Open Graph

`assets/og-image.png` est l'aperçu qui s'affiche quand quelqu'un partage le lien
sur LinkedIn, X, Slack ou Discord. Format **1200 × 630**.

Le fichier est déjà généré. Il est produit à partir de `assets/og-source.html`,
une page HTML autonome qui reprend les couleurs et la typographie du hero.

**Si vous changez le nom, le rôle ou l'accroche**, modifiez `og-source.html`
puis régénérez l'image. En ligne de commande, avec Google Chrome installé :

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --force-device-scale-factor=1 --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot=assets/og-image.png \
  "file://$PWD/assets/og-source.html"
```

Sinon, ouvrez `og-source.html` dans un navigateur et faites une capture de la
fenêtre entière. Si vous renommez le fichier, mettez à jour les balises
`og:image` et `twitter:image` dans `index.html`.

> `og-source.html` n'est utile qu'à la génération. Attention : la procédure de
> déploiement ci-dessous fait un `git add .`, qui **publie** aussi ce fichier à
> `https://ericreboisson.github.io/assets/og-source.html`. L'image étant déjà
> générée, supprimez-le avant le `git push` si vous préférez ne pas l'exposer —
> vous perdrez seulement la facilité de régénérer l'OG.

---

## Déployer sur GitHub Pages

Le dépôt `ericreboisson.github.io` **n'existe pas encore** : créez-le d'abord.

### 1. Créer le dépôt

Sur GitHub, **New repository** :

- Nom du dépôt : `ericreboisson.github.io`
- Visibilité : **Public** (obligatoire pour GitHub Pages gratuit)
- Cochez *Add a README file* pour créer la branche `main`
- **Ne cochez pas** l'ajout de `.gitignore` ni de licence

Le nom est imposé : c'est lui qui fait le lien vers
`https://ericreboisson.github.io/`.

### 2. Pousser les fichiers

Depuis ce dossier :

> **Dossiers cachés.** Ce dossier contient `.omo/` et `.playwright-mcp/`, qui sont
> des fichiers de travail, pas du site : un `git add .` les publierait. Excluez-les
> d'abord, soit via un `.gitignore` listant `.omo/` et `.playwright-mcp/`, soit en
> n'ajoutant que `git add index.html style.css script.js assets/`.

```bash
git init
git branch -M main
git add .
git commit -m "Landing page personnelle"
git remote add origin https://github.com/ericreboisson/ericreboisson.github.io.git
git push -u origin main
```

### 3. Activer Pages

Dans le dépôt, allez dans **Settings → Pages** :

- **Source** : *Deploy from a branch*
- **Branch** : `main`, dossier `/ (root)`
- **Save**

### 4. Vérifier

La première compilation prend une à deux minutes. Le site est ensuite en ligne
sur **https://ericreboisson.github.io/**

> **À savoir.** `https://ericreboisson.github.io/lifecycle-timeline/` est un
> *site de projet* séparé, alimenté par un autre dépôt. Les deux cohabitent :
> créer ce dépôt racine ne le perturbe pas.

### Mettre à jour ensuite

```bash
git add .
git commit -m "Mise à jour"
git push
```

GitHub Pages redéploie automatiquement en une à deux minutes.

---

## Accessibilité et performances

- Lien d'évitement en premier élément focusable
- Navigation complète au clavier, `aria-expanded` sur le burger, `Échap` ferme le menu
- Contrastes conformes AA dans les deux thèmes
- `prefers-reduced-motion` respecté : les animations sont désactivées
- Le contenu reste lisible si JavaScript est désactivé
- Aucune dépendance externe en JavaScript, aucun traqueur, aucun formulaire

## Licence

Code du site : usage personnel libre. Chaque projet lié a sa propre licence.
Vérifié le 26 septembre 2026 : `lifecycle-timeline` est sous MIT, le paquet npm
`npm-goodjob` déclare MIT (mais son dépôt n'a pas de fichier `LICENSE`),
`checker-maven-plugin` ne déclare aucune licence.
