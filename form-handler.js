/**
 * Gestion du formulaire de contact
 * Envoi async et feedback utilisateur
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Traiter la soumission du formulaire
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    
    try {
        // Désactiver le bouton
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // Envoyer la requête
        const response = await fetch('process_contact.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Succès
            showNotification('success', result.message);
            form.reset();
            
            // Log succès
            console.log('Message envoyé avec succès');
        } else {
            // Erreur
            const errorMessage = result.errors ? 
                result.errors.join('\n') : 
                result.message;
            showNotification('error', errorMessage);
            
            console.error('Erreur:', result);
        }
    } catch (error) {
        // Erreur réseau ou autre
        showNotification('error', 'Erreur lors de l\'envoi. Veuillez réessayer.');
        console.error('Erreur réseau:', error);
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

/**
 * Afficher une notification
 */
function showNotification(type, message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : '✕'}
            </span>
            <span class="notification-message">${escapeHtml(message)}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Ajouter à la page
    document.body.insertBefore(notification, document.body.firstChild);

    // Ajouter les styles s'ils n'existent pas
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.innerHTML = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            .notification-success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
            }

            .notification-error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 20px;
            }

            .notification-icon {
                font-weight: bold;
                font-size: 1.2rem;
            }

            .notification-success .notification-icon {
                color: #155724;
            }

            .notification-error .notification-icon {
                color: #721c24;
            }

            .notification-message {
                flex: 1;
                color: #333;
                white-space: pre-wrap;
            }

            .notification-success .notification-message {
                color: #155724;
            }

            .notification-error .notification-message {
                color: #721c24;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                color: #333;
            }

            @media (max-width: 600px) {
                .notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-fermer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Échapper les caractères HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Valider l'email (côté client)
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valider le téléphone (côté client)
 */
function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}
