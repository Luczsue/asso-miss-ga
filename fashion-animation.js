// ===================== ANIMATION DÉFILÉ DE MODE - SILHOUETTE FEMME =====================

class FashionShowAnimation {
    constructor() {
        this.canvas = document.getElementById('fashionShowCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.isAnimating = false;
        
        // Colorimétrie du logo : Or/Jaune doré + Noir + Fonds sombre
        this.colors = {
            gold: '#d4af37',
            darkGold: '#c9a227',
            brightGold: '#ffd700',
            black: '#1a1a1a',
            darkBg: '#0a0a0a',
            white: '#ffffff'
        };
        
        this.silhouette = {
            x: 0,
            y: 0,
            progress: 0,
            speed: 2
        };
        
        this.flashParticles = [];
        
        this.setupCanvas();
        this.addScrollListener();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.8;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight * 0.8;
        });
    }
    
    addScrollListener() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Si on revient vers le haut (près de la section hero)
            if (currentScrollY < 100 && lastScrollY > 100) {
                // Utilisateur est revenu en haut
                if (!this.isAnimating) {
                    this.startAnimation();
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    startAnimation() {
        this.isAnimating = true;
        this.silhouette.progress = 0;
        this.flashParticles = [];
        
        // Démarrer l'animation au chargement de la page
        this.animate();
        
        // Arrêter après 5 secondes
        setTimeout(() => {
            this.stopAnimation();
        }, 5000);
    }
    
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBackground() {
        // Dégradé de fond sombre
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#1a1a1a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawSilhouette(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Silhouette de femme en profil (défilé de mode)
        // Utilisation de dégradés or/jaune doré
        
        // Tête
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.beginPath();
        this.ctx.arc(0, -30, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Cheveux/Couronne
        this.ctx.fillStyle = this.colors.brightGold;
        this.ctx.beginPath();
        this.ctx.arc(0, -30, 14, 0, Math.PI);
        this.ctx.fill();
        
        // Points de couronne (petits joyaux)
        this.ctx.fillStyle = this.colors.darkGold;
        for (let i = -2; i <= 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(i * 8, -42, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Cou
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.fillRect(-6, -15, 12, 8);
        
        // Buste avec dégradé
        const bustGradient = this.ctx.createLinearGradient(-15, -10, 15, 30);
        bustGradient.addColorStop(0, this.colors.brightGold);
        bustGradient.addColorStop(0.5, this.colors.gold);
        bustGradient.addColorStop(1, this.colors.darkGold);
        this.ctx.fillStyle = bustGradient;
        
        this.ctx.beginPath();
        this.ctx.moveTo(-12, -10);
        this.ctx.lineTo(12, -10);
        this.ctx.lineTo(15, 25);
        this.ctx.lineTo(-15, 25);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Bras droit (levé légèrement pour le défilé)
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.beginPath();
        this.ctx.moveTo(12, 0);
        this.ctx.lineTo(25, -15);
        this.ctx.lineTo(26, -5);
        this.ctx.lineTo(12, 8);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Bras gauche
        this.ctx.fillStyle = this.colors.darkGold;
        this.ctx.beginPath();
        this.ctx.moveTo(-12, 0);
        this.ctx.lineTo(-22, 5);
        this.ctx.lineTo(-20, 12);
        this.ctx.lineTo(-12, 8);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Jupe/Robe longue
        const robeGradient = this.ctx.createLinearGradient(-20, 25, 20, 60);
        robeGradient.addColorStop(0, this.colors.brightGold);
        robeGradient.addColorStop(0.5, this.colors.gold);
        robeGradient.addColorStop(1, this.colors.darkGold);
        this.ctx.fillStyle = robeGradient;
        
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 25);
        this.ctx.lineTo(15, 25);
        this.ctx.lineTo(18, 60);
        this.ctx.lineTo(-18, 60);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Détails de robe (rayures)
        this.ctx.strokeStyle = this.colors.darkGold;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-8, 30);
        this.ctx.lineTo(-6, 60);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 30);
        this.ctx.lineTo(0, 60);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(8, 30);
        this.ctx.lineTo(6, 60);
        this.ctx.stroke();
        
        // Jambes
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.fillRect(-5, 60, 4, 25);
        this.ctx.fillRect(1, 60, 4, 25);
        
        // Chaussures
        this.ctx.fillStyle = this.colors.darkGold;
        this.ctx.fillRect(-6, 85, 6, 5);
        this.ctx.fillRect(0, 85, 6, 5);
        
        this.ctx.restore();
    }
    
    drawFlashes() {
        // Dessiner les particules de flash
        this.flashParticles = this.flashParticles.filter(particle => particle.life > 0);
        
        for (let particle of this.flashParticles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / particle.maxLife;
            
            // Flash blanc/or
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 20;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            particle.life--;
            particle.radius += 0.5;
        }
    }
    
    addFlash(x, y) {
        // Ajouter un flash à une position
        const flash = {
            x: x + Math.random() * 40 - 20,
            y: y + Math.random() * 40 - 20,
            radius: 5,
            maxLife: 30,
            life: 30,
            color: Math.random() > 0.5 ? this.colors.brightGold : this.colors.white
        };
        this.flashParticles.push(flash);
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.drawBackground();
        
        // Mise à jour de la position de la silhouette
        this.silhouette.progress += this.silhouette.speed;
        
        // X progresse de gauche à droite
        const silhouetteX = (this.silhouette.progress / 100) * this.canvas.width;
        const silhouetteY = this.canvas.height / 2;
        
        // Dessiner la silhouette
        this.drawSilhouette(silhouetteX, silhouetteY);
        
        // Ajouter des flashes aux moments clés (photograves)
        if (Math.floor(this.silhouette.progress) % 15 === 0 && Math.random() > 0.6) {
            this.addFlash(silhouetteX, silhouetteY);
        }
        
        // Dessiner les flashes
        this.drawFlashes();
        
        // Au 70% de l'animation, commencer à faire monter le logo
        if (this.silhouette.progress >= 70) {
            const logoProgress = (this.silhouette.progress - 70) / 30;
            this.drawFinalLogo(logoProgress);
        }
        
        // Continuer l'animation
        if (this.silhouette.progress < 100) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            // Animation terminée
            setTimeout(() => {
                this.stopAnimation();
            }, 500);
        }
    }
    
    drawFinalLogo(progress) {
        // Dessiner le logo final qui apparaît progressivement
        const logoImg = new Image();
        logoImg.src = 'logo.svg';
        
        logoImg.onload = () => {
            const logoX = this.canvas.width / 2 - 50;
            const logoY = this.canvas.height / 2 - 50;
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.min(progress, 1);
            this.ctx.drawImage(logoImg, logoX, logoY, 100, 100);
            this.ctx.restore();
        };
    }
}

// Initialiser l'animation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const animation = new FashionShowAnimation();
    
    // Démarrer l'animation au chargement de la page
    setTimeout(() => {
        animation.startAnimation();
    }, 500);
});
