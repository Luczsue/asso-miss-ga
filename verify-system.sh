#!/bin/bash
# SCRIPT DE VÉRIFICATION DU SYSTÈME DES MISS
# À exécuter dans le terminal pour vérifier que tous les fichiers sont en place

echo "🔍 VÉRIFICATION DU SYSTÈME DES MISS"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
FOUND=0

# Fonction pour vérifier un fichier
check_file() {
    TOTAL=$((TOTAL+1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        FOUND=$((FOUND+1))
    else
        echo -e "${RED}✗${NC} $1 (MANQUANT)"
    fi
}

# Fonction pour vérifier un dossier
check_dir() {
    TOTAL=$((TOTAL+1))
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/ (dossier)"
        FOUND=$((FOUND+1))
    else
        echo -e "${RED}✗${NC} $1/ (MANQUANT)"
    fi
}

echo "📄 Pages HTML:"
check_file "toutes-les-miss.html"
check_file "miss-detail.html"
check_file "about.html"

echo ""
echo "📁 Fichiers Data:"
check_file "data/misses.json"

echo ""
echo "🎨 Styles et Scripts:"
check_file "styles.css"
check_file "misses.js"

echo ""
echo "🔍 SEO Files:"
check_file "sitemap.xml"
check_file "robots.txt"

echo ""
echo "📚 Documentation:"
check_file "MISS_SYSTEM_README.md"
check_file "ADMIN_GUIDE.md"
check_file "IMPLEMENTATION_RESUME.md"
check_file "FILE_STRUCTURE.md"

echo ""
echo "🧪 Tests:"
check_file "TEST_MISSES.html"

echo ""
echo "📂 Dossiers:"
check_dir "data"
check_dir "images"

echo ""
echo "=================================="
echo -e "Résultat: ${GREEN}$FOUND/$TOTAL${NC} fichiers trouvés"

if [ $FOUND -eq $TOTAL ]; then
    echo -e "${GREEN}✓ Tous les fichiers sont en place!${NC}"
    exit 0
else
    echo -e "${RED}✗ Certains fichiers sont manquants${NC}"
    exit 1
fi
