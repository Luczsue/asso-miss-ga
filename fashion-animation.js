// ===================== ANIMATION AVANCÉE — SILHOUETTE QUI VIENT VERS LE VISITEUR =====================

class EnhancedFashionShow {
    constructor() {
        this.canvas = document.getElementById('fashionShowCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.req = null;
        this.running = false;

        // Palette basée sur le logo
        this.colors = {
            gold: '#d4af37',
            darkGold: '#c9a227',
            brightGold: '#ffd700',
            black: '#0a0a0a',
            deep: '#111'
        };

        // timeline (plus lent pour une approche plus élégante)
        this.duration = 9000; // ms
        this.startTime = 0;

        // particles (flashes)
        this.particles = [];

        // load silhouette image (SVG simplified silhouette)
        this.silhouette = new Image();
        this.silhouette.src = 'silhouette.svg';
        this.silhouetteLoaded = false;
        this.silhouette.onload = () => { this.silhouetteLoaded = true; };

        // load logo image for finale
        this.logoImg = new Image();
        this.logoImg.src = 'logo.svg';

        this.setup();
        this.installListeners();
    }

    setup() {
        const resize = () => {
            this.width = window.innerWidth;
            this.height = Math.round(window.innerHeight * 0.78);
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    installListeners() {
        // restart when user scrolls back to top
        let lastY = window.scrollY;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < 100 && lastY > 100) {
                this.start();
            }
            lastY = y;
        });
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.startTime = performance.now();
        this.particles = [];
        this.loop(this.startTime);

        // auto-stop after duration + small buffer
        setTimeout(() => {
            this.running = false;
        }, this.duration + 500);
    }

    stop() {
        if (this.req) cancelAnimationFrame(this.req);
        this.req = null;
        this.running = false;
        // keep the final logo on screen for a moment
    }

    easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

    addFlashburst(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30 + Math.round(Math.random() * 30),
                maxLife: 60,
                size: 3 + Math.random() * 6,
                color: Math.random() > 0.6 ? this.colors.brightGold : '#ffffff'
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(p => p.life > 0);
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life--;
        }
    }

    drawRunway() {
        // perspective runway
        const g = this.ctx.createLinearGradient(0, this.height * 0.2, 0, this.height);
        g.addColorStop(0, this.colors.deep);
        g.addColorStop(1, this.colors.black);
        this.ctx.fillStyle = g;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // subtle reflective runway stripe
        const stripeHeight = 40;
        const stripeG = this.ctx.createLinearGradient(0, this.height * 0.5, 0, this.height);
        stripeG.addColorStop(0, 'rgba(212,175,55,0.04)');
        stripeG.addColorStop(1, 'rgba(212,175,55,0)');
        this.ctx.fillStyle = stripeG;
        const centerX = this.width / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, this.height * 0.7, this.width * 0.3, stripeHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSpotlight(x, y, scale) {
        const r = Math.max(this.width, this.height) * 0.6 * scale;
        const grad = this.ctx.createRadialGradient(x, y - 40, r * 0.05, x, y - 40, r);
        grad.addColorStop(0, 'rgba(255,244,200,0.22)');
        grad.addColorStop(0.4, 'rgba(255,244,200,0.06)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawSilhouetteScaled(x, y, scale, rotation = 0) {
        if (!this.silhouetteLoaded) return;
        const baseW = Math.min(420, this.width * 0.5);
        const baseH = baseW * 1.6;
        const w = baseW * scale;
        const h = baseH * scale;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        // subtle shadow/blur under feet
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, h * 0.48, w * 0.32, h * 0.08, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';

        // draw silhouette image, tint with gold using multiply
        // draw the silhouette in black first, then overlay gold highlight
        this.ctx.drawImage(this.silhouette, -w / 2, -h, w, h);

        // gold rim
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.globalAlpha = 0.22;
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.beginPath();
        this.ctx.ellipse(0, -h * 0.12, w * 0.42, h * 0.18, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = 'source-over';

        this.ctx.restore();
    }

    drawParticles() {
        for (let p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 14 * alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawLogoFinal(progress) {
        // progress 0..1
        const g = Math.min(1, progress);
        const logoMax = Math.min(this.width, 300);
        const size = 60 + logoMax * g;
        const x = this.width / 2;
        const y = this.height * 0.45;

        this.ctx.save();
        this.ctx.globalAlpha = g;
        // subtle glow
        this.ctx.shadowColor = this.colors.gold;
        this.ctx.shadowBlur = 40 * g;
        this.ctx.drawImage(this.logoImg, x - size / 2, y - size / 2, size, size);
        this.ctx.restore();
    }

    loop(now) {
        if (!this.running) {
            // keep final frame with logo visible for a moment
            this.drawFinalState();
            return;
        }

        const elapsed = now - this.startTime;
        const t = Math.min(1, Math.max(0, elapsed / this.duration));
        // easing plus doux pour une approche élégante
        const ease = this.easeInOutSine(t);

        // clear
        this.ctx.clearRect(0, 0, this.width, this.height);

        // background / runway
        this.drawRunway();

        // silhouette motion: comes towards viewer: scale from small -> large
        // start behind (small) and approach center
        const scale = 0.32 + (1.55 - 0.32) * ease; // comes closer (smoother range)
        const centerX = this.width / 2 + Math.sin(t * Math.PI * 2) * 6; // smaller sway
        const baseY = this.height * 0.78;
        const y = baseY - 160 * ease; // more subtle vertical move

        // spotlight centered on silhouette
        const spotScale = 0.6 + 0.8 * ease;
        this.drawSpotlight(centerX, y, spotScale);

        // draw silhouette (front-facing) scaled
        this.drawSilhouetteScaled(centerX, y, scale, Math.sin(ease * Math.PI) * 0.02);

        // add flashes at rhythmic intervals
        // flashes: moins fréquents au départ, plus présents en fin
        if (Math.random() < 0.03 + 0.45 * ease) {
            // flash near silhouette (count moderé)
            this.addFlashburst(centerX + (Math.random() - 0.5) * 60, y - 40, 4 + Math.round(Math.random() * 6));
        }

        // update and draw particles
        this.updateParticles();
        this.drawParticles();

        // logo finale appears near the end
        if (t > 0.72) {
            const p = (t - 0.72) / (1 - 0.72);
            this.drawLogoFinal(this.easeInOutSine(p));
        }

        if (t >= 1) {
            // finish
            this.running = false;
            // keep final display for a moment
            setTimeout(() => { /* nothing */ }, 400);
        }

        this.req = requestAnimationFrame((ts) => this.loop(ts));
    }

    drawFinalState() {
        // Draw last frame with logo visible
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawRunway();
        this.drawLogoFinal(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const enhanced = new EnhancedFashionShow();
    // start once silhouette loaded or after a short delay
    const tryStart = () => {
        if (enhanced.silhouetteLoaded) {
            enhanced.start();
        } else {
            setTimeout(tryStart, 200);
        }
    };
    tryStart();
});
