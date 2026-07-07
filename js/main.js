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

// ─── RESUMEN DE COTIZACIÓN Y CALCULADORA EN VIVO ───
const PRECIO_JERSEY_BASE = 20;
const PRECIO_ALGODON_BASE = 40;

function calcularFechaEntrega(dias) {
    let result = new Date();
    let contados = 0;
    while (contados < dias) {
        result.setDate(result.getDate() + 1);
        const diaSemana = result.getDay(); // 0 = Domingo, 6 = Sábado
        if (diaSemana !== 0 && diaSemana !== 6) {
            contados++;
        }
    }
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${diasSemana[result.getDay()]}, ${result.getDate()} de ${meses[result.getMonth()]} de ${result.getFullYear()}`;
}

function actualizarCalculadora() {
    const cantidadInput = document.getElementById('cantidad');
    const tipoPoloSelect = document.getElementById('tipo-polo');
    const summaryCard = document.getElementById('quote-summary');

    if (!cantidadInput || !tipoPoloSelect || !summaryCard) return;

    const cantidad = parseInt(cantidadInput.value, 10);
    const tipoPolo = tipoPoloSelect.value;

    if (isNaN(cantidad) || cantidad < 2 || !tipoPolo) {
        summaryCard.style.display = 'none';
        return;
    }

    // Precio base
    let precioUnitario = tipoPolo === 'jersey' ? PRECIO_JERSEY_BASE : PRECIO_ALGODON_BASE;
    if (tipoPolo === 'ambos') {
        precioUnitario = (PRECIO_JERSEY_BASE + PRECIO_ALGODON_BASE) / 2; // promedio estimado
    }

    // Descuentos por volumen
    let descuentoPct = 0;
    if (cantidad >= 12 && cantidad < 30) {
        descuentoPct = 10;
    } else if (cantidad >= 30) {
        descuentoPct = 20;
    }

    const precioConDescuento = precioUnitario * (1 - descuentoPct / 100);
    const total = cantidad * precioConDescuento;
    const adelanto = total * 0.5;
    const saldo = total - adelanto;
    const fechaEntregaStr = calcularFechaEntrega(4);

    // Actualizar interfaz
    document.getElementById('summary-unit-price').textContent = `S/ ${precioUnitario.toFixed(2)}`;
    const discountRow = document.getElementById('summary-discount-row');
    if (descuentoPct > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('summary-discount-pct').textContent = `${descuentoPct}%`;
    } else {
        discountRow.style.display = 'none';
    }
    document.getElementById('summary-total-price').textContent = `S/ ${total.toFixed(2)}`;
    document.getElementById('summary-deposit').textContent = `S/ ${adelanto.toFixed(2)}`;
    document.getElementById('summary-balance').textContent = `S/ ${saldo.toFixed(2)}`;
    document.getElementById('summary-delivery-date').textContent = fechaEntregaStr;

    summaryCard.style.display = 'block';
}

// Hook calculator inputs
document.getElementById('cantidad').addEventListener('input', actualizarCalculadora);
document.getElementById('tipo-polo').addEventListener('change', actualizarCalculadora);

// ─── WHATSAPP FORM SUBMIT ────────────────────
function handleQuoteSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const cantidad = parseInt(form.cantidad.value, 10);
    const tipoPoloVal = form['tipo-polo'].value;
    const tipoPoloText = form['tipo-polo'].options[form['tipo-polo'].selectedIndex].text;
    const mensaje = form.mensaje.value.trim();
    const customData = document.getElementById('custom-design-data').value;

    let precioUnitario = tipoPoloVal === 'jersey' ? PRECIO_JERSEY_BASE : PRECIO_ALGODON_BASE;
    if (tipoPoloVal === 'ambos') precioUnitario = (PRECIO_JERSEY_BASE + PRECIO_ALGODON_BASE) / 2;

    let descuentoPct = 0;
    if (cantidad >= 12 && cantidad < 30) descuentoPct = 10;
    else if (cantidad >= 30) descuentoPct = 20;

    const total = cantidad * precioUnitario * (1 - descuentoPct / 100);
    const adelanto = total * 0.5;
    const saldo = total - adelanto;
    const fechaEntrega = calcularFechaEntrega(4);

    let whatsappMsg = `¡Hola Reyes Sublimados! Quisiera cotizar polos.\n\n`;
    whatsappMsg += `👤 *Nombre:* ${nombre}\n`;
    whatsappMsg += `📞 *Teléfono:* ${telefono}\n`;
    whatsappMsg += `👕 *Tipo:* ${tipoPoloText}\n`;
    whatsappMsg += `📦 *Cantidad:* ${cantidad} unidades\n`;
    
    if (customData) {
        whatsappMsg += `🎨 *Pre-diseño web:* ${customData}\n`;
    }
    if (mensaje) {
        whatsappMsg += `📝 *Detalles:* ${mensaje}\n`;
    }

    whatsappMsg += `\n💵 *Resumen Estimado:*\n`;
    whatsappMsg += `• Unitario: S/ ${precioUnitario.toFixed(2)}\n`;
    if (descuentoPct > 0) whatsappMsg += `• Descuento: ${descuentoPct}%\n`;
    whatsappMsg += `• *Total:* S/ ${total.toFixed(2)}\n`;
    whatsappMsg += `• *Adelanto (50%):* S/ ${adelanto.toFixed(2)}\n`;
    whatsappMsg += `• *Saldo contraentrega:* S/ ${saldo.toFixed(2)}\n`;
    whatsappMsg += `📆 *Fecha estimada de entrega:* ${fechaEntrega}\n`;

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
        document.getElementById('quote-summary').style.display = 'none';
        btn.innerHTML = `<i class='bx bxl-whatsapp'></i> Enviar por WhatsApp`;
        btn.style.background = '';
    }, 800);
}

// ─── INTERACTIVE POLO CUSTOMIZER (PROBADOR) ───
let customizerState = {
    type: 'jersey',       // 'jersey' | 'algodon'
    color: '#ffffff',     // Color hexadecimal
    view: 'front',        // 'front' | 'back'
    designSrc: '',        // Imagen del diseño
    scale: 60,            // %
    x: 0,                 // px
    y: 0,                 // px
    rotate: 0,            // deg
    designName: ''        // Nombre de la plantilla o imagen subida
};

// Generar filtros CSS para colorear de manera realista la camiseta blanca
function getCSSFilterForColor(hex) {
    const key = hex.toLowerCase();
    if (key === '#ffffff') return 'none';
    if (key === '#121212') return 'brightness(0.16) contrast(1.15)';
    if (key === '#0e2f56') return 'sepia(1) saturate(4.5) hue-rotate(190deg) brightness(0.4) contrast(1.1)';
    if (key === '#a61c1c') return 'sepia(1) saturate(7.5) hue-rotate(335deg) brightness(0.6) contrast(1.15)';
    if (key === '#194c33') return 'sepia(1) saturate(5.5) hue-rotate(85deg) brightness(0.45) contrast(1.1)';
    if (key === '#7f8c8d') return 'sepia(0.5) saturate(0) brightness(0.7) contrast(1.0)'; // Gris
    return 'none';
}

function changePoloType(type) {
    customizerState.type = type;
    
    // Activar tabs
    document.getElementById('tab-jersey').classList.toggle('active', type === 'jersey');
    document.getElementById('tab-algodon').classList.toggle('active', type === 'algodon');
    
    const colorGroup = document.getElementById('color-selector-group');
    const poloMockupImg = document.getElementById('polo-mockup-img');

    if (type === 'jersey') {
        // Jersey Spun sólo blanco
        colorGroup.style.display = 'none';
        customizerState.color = '#ffffff';
        if (poloMockupImg) poloMockupImg.style.filter = 'none';
    } else {
        // 100% Algodón permite colores
        colorGroup.style.display = 'flex';
        // Restaurar color activo
        const activeSwatch = document.querySelector('.swatch.active');
        if (activeSwatch) {
            const activeColor = activeSwatch.dataset.color;
            customizerState.color = activeColor;
            if (poloMockupImg) poloMockupImg.style.filter = getCSSFilterForColor(activeColor);
        }
    }
}

// Configurar swatches de colores
document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        const color = swatch.dataset.color;
        customizerState.color = color;
        
        const poloMockupImg = document.getElementById('polo-mockup-img');
        if (poloMockupImg) {
            poloMockupImg.style.filter = getCSSFilterForColor(color);
        }
    });
});

// Función para alternar entre vista frontal y trasera
function changePoloView(view) {
    customizerState.view = view;
    
    // Alternar clases activas de los botones de vista
    document.getElementById('btn-view-front').classList.toggle('active', view === 'front');
    document.getElementById('btn-view-back').classList.toggle('active', view === 'back');
    
    const poloMockupImg = document.getElementById('polo-mockup-img');
    const printableArea = document.getElementById('printable-area');
    const labelText = document.getElementById('printable-label-text');
    
    if (view === 'front') {
        if (poloMockupImg) poloMockupImg.style.transform = 'translateX(0)';
        if (printableArea) {
            printableArea.className = 'printable-area-box view-front';
        }
        if (labelText) labelText.textContent = 'Frente (Pecho)';
    } else {
        if (poloMockupImg) poloMockupImg.style.transform = 'translateX(-50%)';
        if (printableArea) {
            printableArea.className = 'printable-area-box view-back';
        }
        if (labelText) labelText.textContent = 'Espalda';
    }
    
    // Reiniciamos los offsets para evitar que el diseño quede mal posicionado
    resetAdjustments();
    updateDesignLayout();
}

function toggleDesignTab(tab) {
    const uploadTab = document.querySelectorAll('.design-tab')[0];
    const presetsTab = document.querySelectorAll('.design-tab')[1];
    
    const uploadPanel = document.getElementById('panel-upload');
    const presetsPanel = document.getElementById('panel-presets');
    
    if (tab === 'upload') {
        uploadTab.classList.add('active');
        presetsTab.classList.remove('active');
        uploadPanel.style.display = 'block';
        presetsPanel.style.display = 'none';
    } else {
        uploadTab.classList.remove('active');
        presetsTab.classList.add('active');
        uploadPanel.style.display = 'none';
        presetsPanel.style.display = 'block';
    }
}

function handleDesignUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        customizerState.designSrc = e.target.result;
        customizerState.designName = `Imagen Subida: ${file.name}`;
        
        const img = document.getElementById('user-design-img');
        img.src = e.target.result;
        img.style.display = 'block';
        
        document.getElementById('adjustments-group').style.display = 'flex';
        resetAdjustments();
        updateDesignLayout();
    };
    reader.readAsDataURL(file);
}

function resetAdjustments() {
    customizerState.scale = 60;
    customizerState.x = 0;
    customizerState.y = 0;
    customizerState.rotate = 0;
    
    document.getElementById('slider-scale').value = 60;
    document.getElementById('slider-x').value = 0;
    document.getElementById('slider-y').value = 0;
    document.getElementById('slider-rotate').value = 0;
}

function updateDesignLayout() {
    customizerState.scale = document.getElementById('slider-scale').value;
    customizerState.x = document.getElementById('slider-x').value;
    customizerState.y = document.getElementById('slider-y').value;
    customizerState.rotate = document.getElementById('slider-rotate').value;
    
    // Actualizar etiquetas texto
    document.getElementById('val-scale').textContent = `${customizerState.scale}%`;
    document.getElementById('val-x').textContent = `${customizerState.x}px`;
    document.getElementById('val-y').textContent = `${customizerState.y}px`;
    document.getElementById('val-rotate').textContent = `${customizerState.rotate}°`;
    
    // Aplicar transformaciones CSS
    const img = document.getElementById('user-design-img');
    if (img) {
        img.style.transform = `translate(${customizerState.x}px, ${customizerState.y}px) scale(${customizerState.scale / 100}) rotate(${customizerState.rotate}deg)`;
    }
}

// Generador de plantillas predefinidas en Canvas
function applyPreset(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 300, 300);
    
    if (type === 'misa') {
        // Dibujar cruz elegante
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(140, 40, 20, 180);
        ctx.fillRect(90, 90, 120, 20);
        
        ctx.fillStyle = '#d4af37'; // Dorado
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('En Memoria', 150, 255);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText('Recuerdo Eterno', 150, 280);
        customizerState.designName = 'Plantilla: Misa de Honras';
    } 
    else if (type === 'cumple') {
        // Dibujar corona y texto
        ctx.fillStyle = '#f39c12'; // Amarillo/Oro
        ctx.beginPath();
        ctx.moveTo(90, 130);
        ctx.lineTo(100, 70);
        ctx.lineTo(130, 100);
        ctx.lineTo(150, 50);
        ctx.lineTo(170, 100);
        ctx.lineTo(200, 70);
        ctx.lineTo(210, 130);
        ctx.closePath();
        ctx.fill();
        
        // Círculos de perlas de la corona
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(100, 70, 4, 0, Math.PI * 2);
        ctx.arc(150, 50, 5, 0, Math.PI * 2);
        ctx.arc(200, 70, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText('FELIZ CUMPLE', 150, 180);
        ctx.fillText('FELIZ CUMPLE', 150, 180);
        
        ctx.fillStyle = '#f1c40f';
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillText('Familia Reunida', 150, 210);
        customizerState.designName = 'Plantilla: Cumpleaños Feliz';
    }
    else if (type === 'corp') {
        // Escudo corporativo
        ctx.fillStyle = '#235d82';
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(220, 70);
        ctx.lineTo(200, 180);
        ctx.lineTo(150, 230);
        ctx.lineTo(100, 180);
        ctx.lineTo(80, 70);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('REYES', 150, 125);
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText('SUBLIMADOS', 150, 150);
        
        ctx.strokeStyle = '#58a4cd';
        ctx.lineWidth = 4;
        ctx.stroke();
        customizerState.designName = 'Plantilla: Escudo Reyes Corporativo';
    }
    else if (type === 'pareja') {
        // Corazones unidos
        ctx.fillStyle = '#c0392b'; // Rojo
        
        // Corazón 1
        ctx.beginPath();
        ctx.arc(125, 120, 25, Math.PI, 0);
        ctx.arc(175, 120, 25, Math.PI, 0);
        ctx.lineTo(150, 180);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('J & M', 150, 130);
        
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.fillText('Juntos x Siempre', 150, 220);
        customizerState.designName = 'Plantilla: Parejas Amor';
    }
    
    const dataURL = canvas.toDataURL();
    customizerState.designSrc = dataURL;
    
    const img = document.getElementById('user-design-img');
    img.src = dataURL;
    img.style.display = 'block';
    
    document.getElementById('adjustments-group').style.display = 'flex';
    resetAdjustments();
    updateDesignLayout();
}

function applyCustomToQuote() {
    // Buscar campos del formulario
    const tipoPoloSelect = document.getElementById('tipo-polo');
    const descTextarea = document.getElementById('mensaje');
    
    if (customizerState.type === 'jersey') {
        tipoPoloSelect.value = 'jersey';
    } else {
        tipoPoloSelect.value = 'algodon';
    }
    
    // Rellenar campo oculto de personalización
    const colorTxt = customizerState.type === 'jersey' ? 'Blanco' : getFriendlyColorName(customizerState.color);
    const viewTxt = customizerState.view === 'front' ? 'Adelante (Pecho)' : 'Atrás (Espalda)';
    const summaryStr = `Tipo: ${customizerState.type === 'jersey' ? 'Jersey Spun' : '100% Algodón'}, Color: ${colorTxt}, Vista: ${viewTxt}, Diseño: ${customizerState.designName || 'Lienzo vacío'}`;
    
    document.getElementById('custom-design-data').value = summaryStr;
    
    // Mensaje descriptivo
    descTextarea.value = `¡Polo personalizado diseñado en la web!\n• Tela: ${customizerState.type === 'jersey' ? 'Jersey Spun (Blanco)' : '100% Algodón'}\n• Color del polo: ${colorTxt}\n• Estampado en: ${viewTxt}\n• Diseño: ${customizerState.designName || 'Por favor, comuníquese para pasar la imagen.'}`;
    
    actualizarCalculadora();
    
    // Notificación y scroll
    const personalizerSection = document.getElementById('personalizar');
    const quoteSection = document.getElementById('cotizar');
    
    const top = quoteSection.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    
    // Crear una notificación flotante temporal
    const notif = document.createElement('div');
    notif.textContent = '¡Diseño aplicado! Rellena tus datos para cotizar.';
    notif.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        padding: 0.8rem 1.8rem;
        border-radius: 50px;
        box-shadow: var(--shadow-glow);
        z-index: 3000;
        font-weight: 600;
        font-family: var(--font-main);
        font-size: 0.9rem;
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
    
    window.scrollTo({ top, behavior: 'smooth' });
}

function getFriendlyColorName(hex) {
    const colors = {
        '#ffffff': 'Blanco',
        '#121212': 'Negro',
        '#0e2f56': 'Azul Marino',
        '#a61c1c': 'Rojo',
        '#194c33': 'Verde',
        '#7f8c8d': 'Gris'
    };
    return colors[hex.toLowerCase()] || 'Personalizado';
}

// Descarga en canvas PNG
function downloadCustomMockup() {
    const canvas = document.getElementById('export-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 800, 800);
    
    // 1. Dibujar el fondo del lienzo estético
    ctx.fillStyle = '#0a1929'; 
    ctx.fillRect(0, 0, 800, 800);
    
    // Círculo decorativo
    ctx.fillStyle = 'rgba(88, 164, 205, 0.1)';
    ctx.beginPath();
    ctx.arc(400, 400, 320, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. Cargar la imagen de la plantilla del polo
    const poloTemplateImg = new Image();
    poloTemplateImg.crossOrigin = "anonymous";
    poloTemplateImg.onload = function() {
        ctx.save();
        
        // Aplicar el filtro de color al canvas para colorear el polo
        const filterVal = getCSSFilterForColor(customizerState.color);
        ctx.filter = filterVal;
        
        // Si la vista es delantera recortamos la mitad izquierda, si es trasera la mitad derecha
        const srcX = customizerState.view === 'front' ? 0 : poloTemplateImg.naturalWidth / 2;
        const srcW = poloTemplateImg.naturalWidth / 2;
        const srcH = poloTemplateImg.naturalHeight;
        
        // Dibujamos el polo centrado en el lienzo 800x800
        ctx.drawImage(poloTemplateImg, srcX, 0, srcW, srcH, 150, 100, 500, 600);
        ctx.restore();
        
        // 3. Dibujar el diseño del usuario sobre el área de estampado correspondiente
        if (customizerState.designSrc) {
            const userImg = new Image();
            userImg.onload = function() {
                ctx.save();
                
                // Área imprimible en coordenadas del lienzo (basado en el dibujo del polo de 500x600 centrado a 150,100)
                let printX, printY, printW, printH;
                if (customizerState.view === 'front') {
                    printX = 150 + (500 * 0.36); // 330
                    printY = 100 + (600 * 0.25); // 250
                    printW = 500 * 0.28;         // 140
                    printH = 600 * 0.33;         // 198
                } else {
                    printX = 150 + (500 * 0.32); // 310
                    printY = 100 + (600 * 0.20); // 220
                    printW = 500 * 0.36;         // 180
                    printH = 600 * 0.38;         // 228
                }
                
                // Recortar al área de estampado para que no sobresalga el diseño
                ctx.beginPath();
                ctx.rect(printX, printY, printW, printH);
                ctx.clip();
                
                // Centro del estampado
                const centerX = printX + (printW / 2);
                const centerY = printY + (printH / 2);
                
                ctx.translate(centerX, centerY);
                ctx.rotate((customizerState.rotate * Math.PI) / 180);
                
                // Desplazamiento manual
                const offsetX = parseFloat(customizerState.x);
                const offsetY = parseFloat(customizerState.y);
                ctx.translate(offsetX, offsetY);
                
                // Escala final
                const scaleFactor = customizerState.scale / 100;
                const drawW = printW * scaleFactor;
                const drawH = printH * scaleFactor;
                
                ctx.drawImage(userImg, -drawW/2, -drawH/2, drawW, drawH);
                ctx.restore();
                
                triggerDownload();
            };
            userImg.src = customizerState.designSrc;
        } else {
            triggerDownload();
        }
    };
    
    function triggerDownload() {
        const link = document.createElement('a');
        link.download = `reyes-sublimados-polo-${customizerState.type}-${customizerState.view}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    poloTemplateImg.src = 'assets/polo_template.png';
}

// ─── MODAL GUÍA DE TALLAS ───
const modalTallas = document.getElementById('modal-tallas');
const modalTallasClose = document.getElementById('modal-tallas-close-btn');

function switchTallasTab(tab) {
    const tabAdultos = document.getElementById('tab-tallas-adultos');
    const tabNinos = document.getElementById('tab-tallas-ninos');
    
    const tableAdultos = document.getElementById('table-adultos');
    const tableNinos = document.getElementById('table-ninos');
    
    if (tab === 'adultos') {
        tabAdultos.classList.add('active');
        tabNinos.classList.remove('active');
        tableAdultos.style.display = 'block';
        tableNinos.style.display = 'none';
    } else {
        tabAdultos.classList.remove('active');
        tabNinos.classList.add('active');
        tableAdultos.style.display = 'none';
        tableNinos.style.display = 'block';
    }
}

// Agregar listeners para abrir guía de tallas
document.querySelectorAll('.btn-tallas').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalTallas.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    });
});

// Cerrar modal
if (modalTallasClose) {
    modalTallasClose.addEventListener('click', () => {
        modalTallas.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (modalTallas) {
    modalTallas.addEventListener('click', (e) => {
        if (e.target === modalTallas) {
            modalTallas.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
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

// Pre-fill type when clicking "Cotizar Polo" from product cards
document.querySelectorAll('.product-btn[data-polo]').forEach(btn => {
    btn.addEventListener('click', () => {
        const poloType = btn.dataset.polo;
        const select = document.getElementById('tipo-polo');
        if (select) {
            select.value = poloType;
            actualizarCalculadora();
        }
    });
});
