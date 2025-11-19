# Association des Miss du Gabon

Site officiel - prototype

Contenu:
- index.html (accueil)
- about.html (à propos)
- news.html (actualités)
- partners.html (partenaires)
- contests.html (concours)
- contact.html (contact + Google Maps)
- styles.css
- script.js

Instructions rapides pour mettre le projet sur GitHub (PowerShell):

1) Vérifier que `git` est installé:
   git --version

2) Initialiser le dépôt local et faire le commit initial:
   git init
   git add .
   git commit -m "Initial commit — site Miss Gabon"

3) Créer un repo distant sur GitHub (option web) puis ajouter le remote et pousser:
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main

Ou, si vous avez GitHub CLI (`gh`) et êtes connecté:
   gh repo create REPO_NAME --public --source=. --remote=origin --push

4) Autoriser d'autres personnes:
   - Sur GitHub → Settings du repo → Collaborators and teams → Invite
   - Ou créer un org et ajouter des membres + équipes

5) Activer GitHub Pages (si vous voulez héberger):
   - Sur GitHub → Settings → Pages → branch `main` (root) → Save
   - Ou avec `gh`: `gh repo edit --enable-pages` (selon version)

Remarques:
- Remplacez `YOUR_API_KEY` dans `contact.html` par votre clé Google Maps.
- Si vous voulez que j'exécute `git init` et fasse le commit initial ici, donnez-moi l'autorisation, je peux l'exécuter localement dans ce workspace.
- Pour pousser vers GitHub, vous devez soit fournir l'URL du repo distant, soit autoriser l'utilisation de `gh` (si installé) et être authentifié.

Si vous voulez, je peux:
- Exécuter `git init` + `git add` + `git commit` pour vous,
- Créer le repo distant via `gh` (si installé et connecté),
- Ou vous fournir une checklist pas-à-pas pour tout faire vous-même.

Dites-moi quelle option vous préférez.