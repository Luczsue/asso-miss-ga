// ===================== GESTION DES MISS =====================

// Charger les données des miss
let allMisses = [];

// Fonction pour charger les données JSON
async function loadMisses() {
    try {
        const response = await fetch('data/misses.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        allMisses = data.misses;
        
        // Si nous sommes sur la page toutes-les-miss.html
        if (document.getElementById('missesGrid')) {
            displayMisses(allMisses);
            setupFilters();
        }
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('missesGrid').innerHTML = '<p>Erreur lors du chargement des miss.</p>';
    }
}

// Fonction pour afficher les miss dans la grille
function displayMisses(misses) {
    const grid = document.getElementById('missesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (misses.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Aucune miss trouvée.</p>';
        return;
    }
    
    misses.forEach((miss, index) => {
        const card = document.createElement('div');
        card.className = 'miss-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index % 3) * 100);
        
        card.innerHTML = `
            <div class="miss-image">
                <img src="${miss.photo}" alt="${miss.nom}" loading="lazy">
                <div class="miss-overlay">
                    <a href="miss-detail.html?id=${miss.id}" class="btn btn-small">Voir le profil</a>
                </div>
            </div>
            <div class="miss-content">
                <h3>${miss.nom}</h3>
                <p class="miss-title">${miss.titre}</p>
                <p class="miss-year">${miss.annee}</p>
                <p class="miss-description">${miss.description}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Réinitialiser AOS pour les nouveaux éléments
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Fonction pour configurer les filtres
function setupFilters() {
    const filterYear = document.getElementById('filterYear');
    
    if (filterYear) {
        filterYear.addEventListener('change', (e) => {
            const year = e.target.value;
            
            if (year === '') {
                displayMisses(allMisses);
            } else {
                const filtered = allMisses.filter(miss => miss.annee.toString() === year);
                displayMisses(filtered);
            }
        });
    }
}

// Fonction pour obtenir les détails d'une miss par ID
function getMissById(id) {
    return allMisses.find(miss => miss.id === parseInt(id));
}

// Fonction pour créer une URL SEO-friendly à partir du nom
function createSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/-+/g, '-');
}

// Fonction utilitaire pour mettre à jour les balises meta
function updateMetaTag(property, content) {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.querySelector(`meta[name="${property}"]`);
    }
    if (!tag) {
        tag = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
            tag.setAttribute('property', property);
        } else {
            tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

// Charger les miss quand la page est prête
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMisses);
} else {
    loadMisses();
}

// ===================== PAGE DÉTAIL MISS =====================

// Fonction pour charger et afficher les détails d'une miss
function loadMissDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const missId = urlParams.get('id');
    
    if (!missId) {
        window.location.href = 'toutes-les-miss.html';
        return;
    }
    
    // Attendre que les miss soient chargées
    const checkAndLoad = setInterval(() => {
        if (allMisses.length > 0) {
            clearInterval(checkAndLoad);
            
            const miss = getMissById(parseInt(missId));
            
            if (!miss) {
                window.location.href = 'toutes-les-miss.html';
                return;
            }
            
            displayMissDetail(miss);
            displayRelatedMisses(miss.id);
        }
    }, 100);
}

// Fonction pour afficher les détails d'une miss
function displayMissDetail(miss) {
    // Mettre à jour les méta tags pour le SEO
    document.title = `${miss.nom} - ${miss.titre} | Association des Miss du Gabon`;
    
    // Mise à jour des balises meta
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `${miss.nom} - ${miss.titre}. ${miss.biographie.substring(0, 150)}...`);
    }
    
    // Mise à jour des Open Graph tags
    updateMetaTag('og:title', `${miss.nom} - ${miss.titre}`);
    updateMetaTag('og:description', miss.biographie.substring(0, 160));
    updateMetaTag('og:image', miss.photo);
    updateMetaTag('og:url', `miss-detail.html?id=${miss.id}`);
    
    // Mise à jour Twitter card
    updateMetaTag('twitter:title', `${miss.nom} - ${miss.titre}`);
    updateMetaTag('twitter:description', miss.biographie.substring(0, 160));
    updateMetaTag('twitter:image', miss.photo);
    
    // Mettre à jour le contenu de la page
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    // Parcourir et remplir les sections
    const heroTitle = document.querySelector('.page-hero-content h1');
    if (heroTitle) heroTitle.textContent = miss.nom;
    
    const heroSubtitle = document.querySelector('.page-hero-content p');
    if (heroSubtitle) heroSubtitle.textContent = miss.titre + ' - ' + miss.annee;
    
    const breadcrumb = document.querySelector('.breadcrumb span');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="toutes-les-miss.html">Nos Miss</a> / ${miss.nom}`;
    }
    
    // Remplir la section de contenu si elle existe
    const contentSection = document.querySelector('.miss-detail-section');
    if (contentSection) {
        contentSection.innerHTML = generateMissDetailHTML(miss);
    }
    
    // Remplir la galerie si elle existe
    const gallerySection = document.querySelector('.miss-gallery-section');
    if (gallerySection && miss.galerie) {
        gallerySection.innerHTML = generateGalleryHTML(miss.galerie);
    }
}

// Fonction pour générer le HTML des détails
function generateMissDetailHTML(miss) {
    let reseauxHTML = '';
    if (miss.reseaux) {
        if (miss.reseaux.facebook) {
            reseauxHTML += `<a href="${miss.reseaux.facebook}" target="_blank" class="social-icon"><i class="fab fa-facebook"></i></a>`;
        }
        if (miss.reseaux.instagram) {
            reseauxHTML += `<a href="${miss.reseaux.instagram}" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>`;
        }
        if (miss.reseaux.tiktok) {
            reseauxHTML += `<a href="${miss.reseaux.tiktok}" target="_blank" class="social-icon"><i class="fab fa-tiktok"></i></a>`;
        }
    }
    
    return `
        <div class="container">
            <div class="miss-detail-content">
                <div class="miss-detail-image" data-aos="fade-right">
                    <img src="${miss.photo}" alt="${miss.nom}" class="miss-main-image">
                    <div class="miss-badge">${miss.titre}</div>
                </div>
                
                <div class="miss-detail-info" data-aos="fade-left">
                    <h2>${miss.nom}</h2>
                    <p class="miss-title-large">${miss.titre}</p>
                    <p class="miss-year">${miss.annee}</p>
                    
                    <div class="miss-social">
                        ${reseauxHTML}
                    </div>
                    
                    <section class="detail-section">
                        <h3>Biographie</h3>
                        <p>${miss.biographie}</p>
                    </section>
                    
                    <section class="detail-section">
                        <h3>Parcours</h3>
                        <p>${miss.parcours}</p>
                    </section>
                    
                    <section class="detail-section">
                        <h3>Engagements</h3>
                        <p>${miss.engagements}</p>
                    </section>
                    
                    <section class="detail-section citation">
                        <blockquote>
                            <p>"${miss.citation}"</p>
                            <footer>— ${miss.nom}</footer>
                        </blockquote>
                    </section>
                    
                    <div class="back-link">
                        <a href="toutes-les-miss.html" class="btn btn-outline">← Retour à toutes les miss</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour afficher les miss associées
function displayRelatedMisses(currentMissId) {
    const grid = document.getElementById('relatedMissesGrid');
    if (!grid) return;
    
    // Obtenir 3 miss aléatoires (sauf la miss actuelle)
    const related = allMisses
        .filter(miss => miss.id !== currentMissId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    grid.innerHTML = '';
    
    related.forEach((miss, index) => {
        const card = document.createElement('div');
        card.className = 'miss-card-small';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        card.innerHTML = `
            <div class="miss-image-small">
                <img src="${miss.photo}" alt="${miss.nom}" loading="lazy">
            </div>
            <div class="miss-content-small">
                <h4>${miss.nom}</h4>
                <p>${miss.titre}</p>
                <a href="miss-detail.html?id=${miss.id}" class="link-arrow">Voir le profil →</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Fonction pour générer le HTML de la galerie
function generateGalleryHTML(galerie) {
    if (!galerie || galerie.length === 0) return '';
    
    let html = '<h3>Galerie</h3><div class="gallery-grid">';
    galerie.forEach((image, index) => {
        html += `
            <div class="gallery-item" data-aos="zoom-in" data-aos-delay="${index * 100}">
                <img src="${image.url}" alt="${image.caption || 'Photo'}" loading="lazy">
                ${image.caption ? `<p>${image.caption}</p>` : ''}
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Charger les détails si nous sommes sur la page miss-detail.html
if (window.location.pathname.includes('miss-detail.html')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadMissDetail);
    } else {
        loadMissDetail();
    }
}
