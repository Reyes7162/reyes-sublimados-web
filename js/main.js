/* ============================================
   MAIN.JS — Reyes Sublimados
   ============================================ */

// ─── STICKY HEADER ──────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ─── HAMBURGER MENU ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const overlay = document.getElementById('mobile-overlay');

function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    toggleMenu(!isOpen);
});

overlay.addEventListener('click', () => toggleMenu(false));

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// ─── ACTIVE NAV LINK ON SCROLL ──────────────
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => observerNav.observe(sec));

// ─── SCROLL REVEAL ANIMATION ─────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay for siblings
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((el, idx) => {
                if (el === entry.target) delay = idx * 100;
            });
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ───────────────────────
function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
});

// ─── HERO PARTICLES ──────────────────────────
function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;

        dot.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(88, 164, 205, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            animation: particleFloat ${duration}s ${delay}s ease-in-out infinite alternate;
        `;
        container.appendChild(dot);
    }

    // Inject keyframe
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(0) translateX(0); opacity: 0.2; }
                100% { transform: translateY(-60px) translateX(20px); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

createParticles();

// ─── WHATSAPP FORM SUBMIT ────────────────────
function handleQuoteSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const cantidad = form.cantidad.value.trim();
    const tipoPolo = form['tipo-polo'].options[form['tipo-polo'].selectedIndex].text;
    const mensaje = form.mensaje.value.trim();

    let whatsappMsg = `¡Hola! Quisiera cotizar polos.\n\n`;
    whatsappMsg += `👤 *Nombre:* ${nombre}\n`;
    whatsappMsg += `📞 *Teléfono:* ${telefono}\n`;
    whatsappMsg += `👕 *Tipo de polo:* ${tipoPolo}\n`;
    whatsappMsg += `📦 *Cantidad:* ${cantidad} unidades\n`;
    if (mensaje) whatsappMsg += `📝 *Detalles:* ${mensaje}\n`;

    const whatsappNumber = '51996670614';
    const encoded = encodeURIComponent(whatsappMsg);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    // Feedback visual
    const btn = document.getElementById('submit-btn');
    btn.innerHTML = `<i class='bx bx-check'></i> ¡Abriendo WhatsApp!`;
    btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';

    setTimeout(() => {
        window.open(url, '_blank');
        form.reset();
        btn.innerHTML = `<i class='bx bxl-whatsapp'></i> Enviar por WhatsApp`;
        btn.style.background = '';
    }, 800);
}

// ─── SMOOTH SCROLLING ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerH = header.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ─── PORTFOLIO FILTERING ──────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar clase activa de todos los botones
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ─── FAQ ACCORDION ───────────────────────────
const faqTriggers = document.querySelectorAll('.faq-trigger');

faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Cerrar los otros elementos abiertos
        faqTriggers.forEach(t => {
            if (t !== trigger) {
                t.setAttribute('aria-expanded', 'false');
                const content = t.nextElementSibling;
                content.style.maxHeight = null;
            }
        });

        // Alternar el estado del elemento actual
        trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        const content = trigger.nextElementSibling;
        if (!isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = null;
        }
    });
});
