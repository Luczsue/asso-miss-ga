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
    // Coordonnées de Libreville, Gabon
    const librevilleCoords = { lat: 0.4162, lng: 9.4673 };

    // Créer la carte
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: librevilleCoords,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#f5f5f5" }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#616161" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#c9c9c9" }]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#cccccc" }]
            }
        ]
    });

    // Ajouter un marqueur
    const marker = new google.maps.Marker({
        position: librevilleCoords,
        map: map,
        title: 'Association des Miss du Gabon',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#d4af37',
            fillOpacity: 1,
            strokeColor: '#1a1a1a',
            strokeWeight: 2
        }
    });

    // Ajouter une info window
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

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Initialiser la map quand la page est chargée
if (document.getElementById('map')) {
    window.addEventListener('load', initMap);
}

// ===================== ANIMATIONS AU SCROLL =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

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

// Déclencher les compteurs quand la section est visible
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

// Fermer modal au clic sur le background
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
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

// ===================== STYLES DYNAMIQUES POUR NOTIFICATIONS =====================
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #4caf50;
    }

    .notification-error {
        border-left: 4px solid #f44336;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .notification-success i {
        color: #4caf50;
        font-size: 1.5rem;
    }

    .notification-error i {
        color: #f44336;
        font-size: 1.5rem;
    }

    .map-info {
        padding: 1rem;
        color: #333;
    }

    .map-info h4 {
        color: #d4af37;
        margin-bottom: 0.5rem;
    }

    .map-info p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
    }

    @media (max-width: 600px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================== LOADER =====================
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ===================== SCROLL TO TOP =====================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const scrollTopStyle = document.createElement('style');
scrollTopStyle.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #d4af37, #ff6b9d);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(-10px);
    }

    .scroll-to-top:hover {
        transform: translateY(-15px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(scrollTopStyle);

createScrollToTopButton();

// ===================== LOG =====================
console.log('%c🌟 Bienvenue sur le site de l\'Association des Miss du Gabon! 🌟', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%cPour des questions, contactez-nous: contact@missgarbon.ga', 'color: #ff6b9d; font-size: 12px;');
