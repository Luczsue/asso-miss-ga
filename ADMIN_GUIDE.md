# Guide d'Administration - Système des Miss

## 🎯 Objectif
Ce guide explique comment gérer les miss de l'Association sans connaissances techniques approfondies.

## 📁 Structure des Fichiers

```
/
├── data/
│   └── misses.json              ⭐ FICHIER PRINCIPAL À MODIFIER
├── toutes-les-miss.html         📖 Page de listing (ne pas modifier)
├── miss-detail.html             📖 Page détail (ne pas modifier)
├── about.html                   📖 Page à propos (ne pas modifier)
├── misses.js                    🔧 Logique (ne pas modifier)
├── styles.css                   🎨 Styles (ne pas modifier sauf CSS)
└── images/                      📸 Dossier des photos
```

---

## 🎬 Ajouter une Nouvelle Miss

### Étape 1: Préparer la Photo
1. Prendre une photo claire et professionnelle
2. Redimensionner à environ 400x500px minimum
3. Enregistrer au format JPG ou PNG
4. Donner un nom descriptif (ex: `miss_nom_prenom.jpg`)
5. Placer le fichier dans le dossier `images/`

### Étape 2: Ouvrir le Fichier JSON
1. Ouvrir le fichier `data/misses.json` avec un éditeur de texte
   - Notepad, VS Code, Atom, Sublime Text, etc.
2. Ne PAS utiliser Word (il corrompt le JSON)

### Étape 3: Ajouter les Informations de la Miss

Avant le `}` final du fichier, ajouter une virgule et le code suivant:

```json
,
{
  "id": 16,
  "nom": "PRENOM NOM Surnom",
  "titre": "Miss [Concours/Couronne]",
  "annee": 2026,
  "photo": "images/miss_prenom_nom.jpg",
  "description": "Description courte (1-2 lignes max)",
  "biographie": "Biographie complète. Parlez de son parcours, son caractère, ses accomplissements. Texte de 2-3 paragraphes.",
  "parcours": "Décrivez son parcours professionnel/personnel. Ses études, ses expériences, ses réalisations.",
  "engagements": "Ses causes, ses valeurs, son engagement social. Listez ses priorités et domaines d'action.",
  "citation": "Une citation inspirante ou signifiante pour elle. Mettez la entre guillemets.",
  "reseaux": {
    "facebook": "https://www.facebook.com/...",
    "tiktok": "https://www.tiktok.com/@...",
    "instagram": "https://www.instagram.com/..."
  }
}
```

### Étape 4: Vérifier la Syntaxe

1. Compter les accolades: doit y avoir autant de `{` que de `}`
2. Compter les crochets: doit y avoir autant de `[` que de `]`
3. Vérifier qu'il n'y a pas de virgule après le dernier `}`
4. Valider le JSON sur [jsonlint.com](https://www.jsonlint.com/)

### Étape 5: Sauvegarder
1. Cliquer sur "Fichier" → "Enregistrer"
2. Vérifier que le fichier s'appelle bien `misses.json`

### Étape 6: Tester
1. Rafraîchir la page `toutes-les-miss.html`
2. Vérifier que la nouvelle miss apparaît dans la grille
3. Cliquer sur "Voir le profil" pour vérifier la page détail

---

## ✏️ Modifier une Miss Existante

### Pour Modifier les Informations:
1. Ouvrir `data/misses.json`
2. Trouver la miss avec le bon ID
3. Modifier les champs appropriés
4. Sauvegarder et tester

### Pour Changer la Photo:
1. Remplacer l'image dans le dossier `images/`
2. Garder le même nom de fichier, OU
3. Modifier le chemin dans le JSON si le nom change

---

## 🗑️ Supprimer une Miss

1. Ouvrir `data/misses.json`
2. Trouver l'objet miss (entre `{` et `}`)
3. Sélectionner tout l'objet
4. Y compris la virgule avant si ce n'est pas le dernier
5. Supprimer
6. Sauvegarder

⚠️ **IMPORTANT:** Assurez-vous que le JSON reste valide après suppression.

---

## 🔄 Filtrer par Année

Le système supporte automatiquement le filtrage par année sur la page "Toutes les Miss".

### Ajouter une Nouvelle Année:
1. Changer le champ `"annee"` pour les miss
2. Aucune modification du code n'est nécessaire
3. Le dropdown du filtre se met à jour automatiquement

---

## 📱 Champs Requis Expliqués

| Champ | Obligatoire | Format | Exemple |
|-------|-----------|--------|---------|
| `id` | ✓ | Nombre unique | `1`, `2`, `3`... |
| `nom` | ✓ | Texte | `MINKOUE MI-NDONG Stécya` |
| `titre` | ✓ | Texte | `Miss Panther 2025` |
| `annee` | ✓ | Nombre | `2025` |
| `photo` | ✓ | Chemin fichier | `images/photo.jpg` |
| `description` | ✓ | Texte court | "Présidente de l'Association" |
| `biographie` | ✓ | Texte long | Plusieurs phrases |
| `parcours` | ✓ | Texte long | Explique son contexte |
| `engagements` | ✓ | Texte long | Listes ses causes |
| `citation` | ✓ | Texte court | Une phrase inspirante |
| `reseaux` | ✗ | Objet URLs | Facebook, TikTok, Instagram |

---

## 🎨 Conseils de Rédaction

### Pour la Biographie:
- Écrire en 2-3 paragraphes
- Utiliser un ton professionnel et respectueux
- Mettre l'accent sur les accomplissements
- Exemple de longueur: 150-200 mots

### Pour le Parcours:
- Énumérer les jalons importants
- Parler de formation, expérience, réalisations
- Être factuel et détaillé
- Exemple de longueur: 100-150 mots

### Pour les Engagements:
- Lister les causes principales
- Utiliser des listes à puces ou des virgules
- Être spécifique et authentique
- Exemple: "Santé féminine, éducation, égalité des genres"

### Pour la Citation:
- Choisir une phrase personnelle ou attribuée
- Elle doit refléter les valeurs de la miss
- Garder entre 10-20 mots
- Exemple: "La beauté n'est que la surface. Le vrai pouvoir réside dans la détermination."

---

## 🔧 Dépannage

### Les miss ne s'affichent pas
**Possible causes:**
- JSON invalide (erreur de syntaxe)
- **Solution:** Valider sur [jsonlint.com](https://www.jsonlint.com/)

### Les images ne s'affichent pas
**Possible causes:**
- Mauvais chemin de fichier
- Image n'existe pas
- **Solution:** Vérifier que le fichier existe dans `images/` et que le chemin est correct

### Erreur "404" sur une page
**Possible causes:**
- Le fichier HTML a été renommé ou déplacé
- **Solution:** Vérifier que tous les fichiers sont au bon endroit

### Le filtrage ne fonctionne pas
**Possible causes:**
- JavaScript désactivé
- Année non présente dans les données
- **Solution:** Vérifier la console du navigateur (F12) pour les erreurs

---

## 💡 Bonnes Pratiques

### ✅ À FAIRE:
- Sauvegarder régulièrement
- Faire un backup du JSON avant modifications
- Valider le JSON après chaque modification
- Tester les changements avant de publier
- Utiliser des photos de qualité
- Écrire des informations complètes et exactes

### ❌ À ÉVITER:
- Ne pas utiliser Word pour éditer le JSON
- Ne pas utiliser d'accents mal codés
- Ne pas copier-coller depuis Word
- Ne pas modifier les fichiers HTML/JavaScript
- Ne pas supprimer les virgules nécessaires
- Ne pas laisser de numéros d'ID dupliqués

---

## 📊 Exemple Complet

```json
{
  "id": 1,
  "nom": "MEHEKOU MOULOUNGUI Constalida Orty",
  "titre": "Miss Panther 2025",
  "annee": 2025,
  "photo": "images/miss_orty.jpg",
  "description": "Vice-Présidente de l'Association",
  "biographie": "Constalida Orty MEHEKOU MOULOUNGUI est la Vice-Présidente de l'Association des Miss du Gabon. Élue Miss Panther 2025, elle incarne l'excellence, l'engagement et la détermination. Son parcours remarquable inspire les femmes du Gabon à poursuivre leurs rêves avec passion et fierté.",
  "parcours": "Formée aux valeurs d'excellence et de solidarité, Constalida a toujours eu une passion pour le service public et l'engagement social. Avant d'accéder à ce titre prestigieux, elle a participé à plusieurs initiatives communautaires.",
  "engagements": "Sensibilisation à la santé féminine, promotion de l'éducation des jeunes filles, engagement en faveur de l'égalité des genres",
  "citation": "La beauté n'est que la surface. Le vrai pouvoir réside dans la détermination et le cœur.",
  "reseaux": {
    "facebook": "https://www.facebook.com/share/17wo3Hm5qT/",
    "tiktok": "https://www.tiktok.com/@misspanthergabon2025",
    "instagram": ""
  }
}
```

---

## 🆘 Besoin d'Aide?

Consultez la page [TEST_MISSES.html](TEST_MISSES.html) pour:
- Un guide interactif
- Des exemples
- Les pages de test

---

**Document créé le:** 12 janvier 2026  
**Version:** 1.0  
**Statut:** Production
