// ===================== INITIALISATION AOS =====================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 100
});

// ===================== NAVIGATION =====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu mobile
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Mettre à jour le lien actif au scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================== PARALLAX EFFECT =====================
const parallaxBg = document.querySelector('.parallax-bg');

window.addEventListener('scroll', () => {
    if (parallaxBg) {
        const scrollPosition = window.scrollY;
        parallaxBg.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================== CONTACT FORM =====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Récupérer les valeurs
        const formData = {
            nom: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            telephone: this.querySelector('input[type="tel"]').value,
            sujet: this.querySelector('select').value,
            message: this.querySelector('textarea').value
        };

        // Validation
        if (!formData.nom || !formData.email || !formData.sujet || !formData.message) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Simuler l'envoi (en production, envoyer à votre serveur)
        console.log('Données du formulaire:', formData);
        showNotification('Merci! Votre message a été envoyé avec succès.', 'success');

        // Réinitialiser le formulaire
        this.reset();
    });
}

// ===================== NOTIFICATIONS =====================
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Afficher avec animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Retirer après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================== GOOGLE MAPS =====================
let map;

function initMap() {
    const librevilleCoords = { lat: 0.4162, lng: 9.4673 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: librevilleCoords,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
            { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
            { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#cccccc" }] }
        ]
    });

    const marker = new google.maps.Marker({
        position: librevilleCoords,
        map: map,
        title: 'Association des Miss du Gabon',
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#d4af37', fillOpacity: 1, strokeColor: '#1a1a1a', strokeWeight: 2 }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info">
                <h4>Association des Miss du Gabon</h4>
                <p>📍 Libreville, Gabon</p>
                <p>📞 +241 XX XX XX XX</p>
                <p>📧 contact@missgarbon.ga</p>
            </div>
        `
    });

    marker.addListener('click', () => infoWindow.open(map, marker));
}

if (document.getElementById('map')) {
    window.addEventListener('load', initMap);
}

// ===================== ANIMATIONS AU SCROLL =====================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ===================== EFFETS À LA SOURIS =====================
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const moveX = x * (index + 1) * 10;
        const moveY = y * (index + 1) * 10;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ===================== COMPTEUR D'ANIMATIONS =====================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const increment = target / 100;
        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// ===================== BOUTONS MODAUX =====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal.id);
    });
});

// ===================== LAZY LOADING D'IMAGES =====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ===================== DIAPORAMA HERO =====================
// <--- Cette partie est corrigée uniquement --->
(function() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const prevBtn = document.querySelector('.slideshow-control.prev');
    const nextBtn = document.querySelector('.slideshow-control.next');
    const dotsContainer = document.getElementById('slideshowDots');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let interval;

    // Charger les images lazy du diaporama si ce n'est pas déjà fait
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });

    // Créer les dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];

    function updateSlides() {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        updateSlides();
        resetInterval();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    function startInterval() {
        interval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }

    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }

    updateSlides();
    startInterval();
})();

// ===================== STYLES DYNAMIQUES POUR NOTIFICATIONS =====================
const style = document.createElement('style');
// ... reste du CSS notifications, scroll-to-top, loader etc. inchangé ...
