# Architecture du système de gestion des Miss

## Vue d'ensemble

Le système de gestion des Miss de l'Association des Miss du Gabon est conçu de manière modulaire et évolutive pour permettre l'ajout facile de nouvelles miss et l'adaptation future à une base de données.

## Structure des fichiers

```
/
├── data/
│   └── misses.json              # Base de données JSON des miss
├── toutes-les-miss.html         # Page listing de toutes les miss
├── miss-detail.html             # Page détail pour chaque miss (dynamique)
├── misses.js                    # Script JavaScript pour la gestion des miss
├── about.html                   # Page À propos (contient la section Nos Miss)
└── styles.css                   # Feuille de styles (incluant les styles des miss)
```

## Fichiers principaux

### 1. data/misses.json
Base de données JSON contenant toutes les informations des miss.

**Structure d'une miss:**
```json
{
  "id": 1,
  "nom": "Nom Complet",
  "titre": "Titre/Couronne",
  "annee": 2025,
  "photo": "images/miss_photo.jpg",
  "description": "Courte description",
  "biographie": "Biographie complète",
  "parcours": "Parcours professionnel/personnel",
  "engagements": "Engagements et causes",
  "citation": "Citation inspirante",
  "reseaux": {
    "facebook": "lien",
    "tiktok": "lien",
    "instagram": "lien"
  }
}
```

### 2. toutes-les-miss.html
Page qui affiche toutes les miss sous forme de grille (cards).

**Fonctionnalités:**
- Affichage responsive (3 colonnes desktop, 2 tablettes, 1 mobile)
- Filtrage par année
- Animations AOS
- Liens vers les pages détail de chaque miss

### 3. miss-detail.html
Page de détail pour chaque miss. Le contenu est généré dynamiquement via JavaScript en fonction de l'ID passé en paramètre URL.

**URL:** `miss-detail.html?id=1`

**Affichage dynamique:**
- Photo et badge du titre
- Biographie complète
- Parcours détaillé
- Engagements sociaux
- Citation inspirante
- Réseaux sociaux
- Miss associées (3 autres miss aléatoires)
- Balises meta optimisées pour SEO

### 4. misses.js
Script JavaScript principal qui gère:
- Chargement des données JSON
- Affichage dynamique des miss
- Filtrage
- Génération des pages de détail
- SEO (mise à jour des balises meta dynamiquement)

### 5. about.html
Section "Nos Miss" ajoutée entre l'équipe dirigeante et le parcours.

## Fonctionnalités SEO

### Optimisations incluses:
1. **Balises meta dynamiques** - Chaque page de miss a son propre titre et description meta
2. **URLs SEO-friendly** - `miss-detail.html?id=1` (peut être amélioré avec le routing)
3. **Open Graph** - Métadonnées pour les réseaux sociaux
4. **Structured Data** - Prêt pour JSON-LD (Person schema)
5. **Sitemap XML** - À générer automatiquement

## Comment ajouter une nouvelle miss

### 1. Ajouter les données dans `data/misses.json`

```json
{
  "id": 16,
  "nom": "Nom Complet",
  "titre": "Miss [Titre]",
  "annee": 2026,
  "photo": "images/miss_new.jpg",
  "description": "Description courte",
  "biographie": "Texte complet...",
  "parcours": "Parcours détaillé...",
  "engagements": "Causes et engagements...",
  "citation": "Citation inspirante",
  "reseaux": {
    "facebook": "https://...",
    "tiktok": "https://...",
    "instagram": "https://..."
  }
}
```

### 2. Ajouter la photo

Placer l'image dans le dossier `images/` avec le chemin spécifié dans le JSON.

### 3. C'est tout !

Le système chargera automatiquement la nouvelle miss sur:
- Page "Toutes les Miss" (avec filtrage par année)
- Accessibilité depuis les pages détail des autres miss
- Dynamiquement sans modification du code HTML

## Architecture évolutive

### Améliorations futures possibles:

1. **Base de données SQL** - Remplacer le JSON par une vraie BD
   - Les fonctions JavaScript resteraient similaires
   - Changement au niveau du fetch uniquement

2. **CMS Backend** - Ajouter un panneau d'administration
   - Interface web pour ajouter/modifier/supprimer les miss
   - Gestion des images

3. **Routing amélioré** - URLs plus SEO
   - De: `miss-detail.html?id=1`
   - À: `nos-miss/nom-prenom/`

4. **Galerie photo** - Ajouter un champ `galerie` dans le JSON
   - Support déjà implémenté dans le code

5. **Recherche** - Moteur de recherche intégré
   - Filtrer par nom, titre, année, engagements

6. **Export/Import** - Fonctionnalités admin
   - Exporter les données en CSV/PDF
   - Importer des données en masse

## Styles CSS

Tous les styles des miss sont regroupés à la fin du fichier `styles.css`:

- `.misses-section` - Section principale
- `.miss-card` - Carte de miss (liste)
- `.miss-detail-section` - Page détail
- `.related-misses-grid` - Miss associées
- Responsive design pour tous les écrans

## Maintenance

### Vérifier le fonctionnement:

1. **Vérifier que le JSON est valide** - Utiliser [jsonlint.com](https://www.jsonlint.com/)
2. **Vérifier les images** - S'assurer que tous les chemins d'images existent
3. **Tester les liens** - Vérifier que les pages s'ouvrent correctement
4. **Tester le filtrage** - Vérifier le filtrage par année sur toutes-les-miss.html
5. **Tester les réseaux sociaux** - Vérifier que les liens vers les réseaux sociaux sont valides

## Performance

- ✅ Lazy loading des images
- ✅ Grille CSS responsive
- ✅ Animations AOS
- ✅ Chargement asynchrone des données
- ✅ Pas de dépendances lourdes

## Accessibilité

- ✅ Balises semantic HTML
- ✅ Attributs alt sur les images
- ✅ Navigation au clavier
- ✅ Contraste de couleurs correct
- ✅ Structure heading hiérarchique

## Support et questions

Pour toute question sur l'architecture ou l'ajout de miss, contactez l'administrateur du site.
