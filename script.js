console.log('Anfloral Script Loaded');

// --- PROJECT DATA ---
const projectData = {
    'villa-tropika': {
        title: 'Villa Tropika',
        subtitle: 'RESIDENTIAL • MODERN TROPICAL • LANGKAWI',
        description: 'Transformasi resort peribadi di Langkawi. Kami menggunakan kombinasi pokok kelapa eksotik dan lanskap lembut untuk mencipta suasana hutan hujan tropika yang menyejukkan. Setiap sudut dirancang untuk privasi dan ketenangan.',
        duration: '21 Hari',
        plants: '120+ Spesies',
        color: '#1a472a'
    },
    'vertical-garden': {
        title: 'Vertical Garden KL',
        subtitle: 'CORPORATE • SUSTAINABLE • KUALA LUMPUR',
        description: 'Dinding hijau vertikal di tengah pusat bandar Kuala Lumpur. Menggunakan sistem pengairan automatik untuk memastikan lumut dan tanaman sentiasa subur walaupun di dalam ruang tertutup pejabat korporat.',
        duration: '7 Hari',
        plants: '1500+ Tanaman',
        color: '#27ae60'
    },
    'zen-garden': {
        title: 'Zen Garden Ipoh',
        subtitle: 'MINIMALIST • ZEN • IPOH PERAK',
        description: 'Konsep minimalis Jepun yang menenangkan. Kami mengimport batuan sungai khas dan menggabungkan seni pasir (gravel) dengan pokok Juniperus Taiwan untuk mencipta ruang meditasi yang estetik.',
        duration: '10 Hari',
        plants: '15 Spesies',
        color: '#795548'
    }
};

// --- CORE FUNCTIONS ---

function whatsAppOrder(item) {
    const baseUrl = "https://wa.me/60134085923?text=";
    const message = `Hi Anfloral, saya berminat dengan ${item}.`;
    const finalUrl = `${baseUrl}${encodeURIComponent(message)}`;
    window.open(finalUrl, '_blank');
}

// Global state for project header dragging & autoplay
let isHeaderDragging = false;
let headerStartX;
let headerInitialX = 0;
let headerCurrentX = 0;
let autoplayDirection = -1; // -1 for left, 1 for right
let autoplaySpeed = 0.8; 
let autoplayId = null;

function animateHeader() {
    const ribbonTrack = document.getElementById('ribbonTrack');
    if (!ribbonTrack || isHeaderDragging) {
        autoplayId = requestAnimationFrame(animateHeader);
        return;
    }

    const maxScroll = ribbonTrack.scrollWidth - window.innerWidth;
    if (maxScroll <= 0) {
        autoplayId = requestAnimationFrame(animateHeader);
        return;
    }

    headerCurrentX += (autoplaySpeed * autoplayDirection);

    // Boundary check & reverse
    if (headerCurrentX <= -maxScroll) {
        headerCurrentX = -maxScroll;
        autoplayDirection = 1;
    } else if (headerCurrentX >= 0) {
        headerCurrentX = 0;
        autoplayDirection = -1;
    }

    ribbonTrack.style.transform = `translateX(${headerCurrentX}px)`;
    autoplayId = requestAnimationFrame(animateHeader);
}

function initHeaderDrag() {
    const headerContainer = document.querySelector('.kinetic-header');
    const ribbonTrack = document.getElementById('ribbonTrack');
    if (!headerContainer || !ribbonTrack) return;

    // Start/Stop animation
    if (!autoplayId) animateHeader();

    const startHeaderDrag = (e) => {
        isHeaderDragging = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        headerStartX = clientX;
        
        // Sync InitialX with CurrentX from autoplay
        headerInitialX = headerCurrentX;
        ribbonTrack.style.transition = 'none';
    };

    const moveHeaderDrag = (e) => {
        if (!isHeaderDragging) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const walk = (clientX - headerStartX) * 1.2;
        let newX = headerInitialX + walk;
        
        const maxScroll = ribbonTrack.scrollWidth - window.innerWidth;
        if (newX > 0) newX = 0;
        if (newX < -maxScroll) newX = -maxScroll;
        
        headerCurrentX = newX; // Update the shared current position
        ribbonTrack.style.transform = `translateX(${newX}px)`;
    };

    const stopHeaderDrag = () => {
        if (!isHeaderDragging) return;
        isHeaderDragging = false;
        ribbonTrack.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    };

    headerContainer.addEventListener('mousedown', startHeaderDrag);
    headerContainer.addEventListener('touchstart', startHeaderDrag, {passive: true});
    
    window.addEventListener('mousemove', moveHeaderDrag);
    window.addEventListener('touchmove', moveHeaderDrag, {passive: false});
    
    window.addEventListener('mouseup', stopHeaderDrag);
    window.addEventListener('touchend', stopHeaderDrag);
}

let lastClickedEl = null;

function openProject(id, el) {
    console.log('Attempting to open project:', id);
    const data = projectData[id];
    if (!data) return;

    lastClickedEl = el; // Store for reverse transition

    const overlay = document.getElementById('projectDetailOverlay');
    const ribbonTrack = document.getElementById('ribbonTrack');
    const detailContent = document.getElementById('detailContent');
    const detailNav = document.querySelector('.detail-nav');
    const heroMarquee = document.getElementById('heroMarquee');

    if (!overlay || !ribbonTrack || !detailContent || !detailNav) return;

    // Update URL
    try { history.pushState({ projectId: id }, '', `${id}.html`); } catch (e) { }

    const rect = el.getBoundingClientRect();
    const expander = document.createElement('div');
    expander.className = 'card-expander';
    Object.assign(expander.style, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        background: data.color,
        position: 'fixed',
        zIndex: '10000'
    });
    document.body.appendChild(expander);

    // Prepare Content
    document.getElementById('detailTitle').innerText = data.title;
    document.getElementById('detailDescription').innerText = data.description;
    document.getElementById('detailDuration').innerText = data.duration;
    document.getElementById('detailPlants').innerText = data.plants;
    heroMarquee.innerHTML = `<span>${data.subtitle}</span> • <span>${data.subtitle}</span> • <span>${data.subtitle}</span>`;

    ribbonTrack.innerHTML = '';
    const themes = ['nature', 'garden', 'plants', 'landscape', 'architecture'];
    for (let i = 0; i < 6; i++) {
        const img = document.createElement('img');
        img.src = `https://placehold.co/1200x800/${data.color.replace('#', '')}/FFF?text=${themes[i % themes.length]}+${i+1}`;
        ribbonTrack.appendChild(img);
    }
    
    headerCurrentX = 0;
    autoplayDirection = -1;
    ribbonTrack.style.transform = 'translateX(0)';

    requestAnimationFrame(() => expander.classList.add('expanding'));

    setTimeout(() => {
        overlay.classList.add('active');
        overlay.scrollTop = 0;
        detailContent.classList.add('visible');
        detailNav.classList.add('visible');
        document.body.style.overflow = 'hidden';
        initHeaderDrag(); 
    }, 600);

    setTimeout(() => {
        expander.style.opacity = '0';
        setTimeout(() => expander.remove(), 500);
    }, 1000);
}

function closeProject(isBackAction = false) {
    const overlay = document.getElementById('projectDetailOverlay');
    const detailContent = document.getElementById('detailContent');
    const detailNav = document.querySelector('.detail-nav');

    if (!overlay || !overlay.classList.contains('active')) return;

    detailContent.classList.remove('visible');
    detailNav.classList.remove('visible');

    // REVERSE TRANSITION
    if (lastClickedEl) {
        const rect = lastClickedEl.getBoundingClientRect();
        const data = projectData[overlay.querySelector('h1').innerText.toLowerCase().replace(/ /g, '-')]; 
        // fallback color if parsing title fails
        const bgColor = (data && data.color) ? data.color : 'var(--dark-green)';

        const shrinker = document.createElement('div');
        shrinker.className = 'card-expander expanding'; // Start full screen
        Object.assign(shrinker.style, {
            top: '0', left: '0', width: '100vw', height: '100vh',
            background: bgColor,
            position: 'fixed', zIndex: '10000', opacity: '1'
        });
        document.body.appendChild(shrinker);

        // Hide overlay immediately to show shrinker
        overlay.classList.remove('active');

        requestAnimationFrame(() => {
            // Animate back to original card rect
            shrinker.style.top = `${rect.top}px`;
            shrinker.style.left = `${rect.left}px`;
            shrinker.style.width = `${rect.width}px`;
            shrinker.style.height = `${rect.height}px`;
            shrinker.style.borderRadius = '0';
            shrinker.classList.remove('expanding');
        });

        setTimeout(() => {
            shrinker.style.opacity = '0';
            setTimeout(() => shrinker.remove(), 500);
        }, 800);
    } else {
        // Simple fade if no reference card (direct landing)
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.opacity = '1';
        }, 400);
    }

    document.body.style.overflow = 'auto';
    if (!isBackAction) {
        try { history.pushState(null, '', 'index.html'); } catch(e){}
    }
}

window.addEventListener('popstate', (e) => {
    if (!e.state || !e.state.projectId) {
        closeProject(true);
    }
});

// --- OBSERVERS ---

const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const increment = target / 120;
            const update = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target;
                }
            };
            update();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// --- TESTIMONIALS SLIDER ---

const track = document.getElementById('testimonialTrack');
const handle = document.getElementById('leafHandle');
const growthBar = document.getElementById('growthBar');
const sliderBg = document.querySelector('.growth-track-bg');
const universe = document.querySelector('.testimonial-universe');

let isDragging = false;
let isDraggingTrack = false;
let currentPercent = 0;

const updateUI = (percent) => {
    percent = Math.max(0, Math.min(1, percent));
    currentPercent = percent;
    if (handle) handle.style.left = `${percent * 100}%`;
    if (growthBar) growthBar.style.width = `${percent * 100}%`;
    if (track) {
        const trackMax = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
        track.style.transform = `translateX(${-percent * trackMax}px)`;
    }
};

if (handle) {
    handle.addEventListener('mousedown', () => isDragging = true);
    handle.addEventListener('touchstart', () => isDragging = true, {passive: true});
}

let trackStartX, initialPercent;
if (universe) {
    const startTrackDrag = (e) => {
        isDraggingTrack = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        trackStartX = clientX;
        initialPercent = currentPercent;
        if (track) track.style.transition = 'none';
    };
    universe.addEventListener('mousedown', startTrackDrag);
    universe.addEventListener('touchstart', startTrackDrag, {passive: true});
}

window.addEventListener('mousemove', (e) => {
    if (isDragging && sliderBg) {
        const rect = sliderBg.getBoundingClientRect();
        updateUI((e.clientX - rect.left) / rect.width);
    }
    if (isDraggingTrack) {
        const walk = e.clientX - trackStartX;
        const trackMax = track.scrollWidth - window.innerWidth;
        updateUI(initialPercent - (walk / (trackMax || 1)));
    }
});

window.addEventListener('touchmove', (e) => {
    if (isDragging && sliderBg) {
        const rect = sliderBg.getBoundingClientRect();
        updateUI((e.touches[0].clientX - rect.left) / rect.width);
    }
    if (isDraggingTrack) {
        const walk = e.touches[0].clientX - trackStartX;
        const trackMax = track.scrollWidth - window.innerWidth;
        updateUI(initialPercent - (walk / (trackMax || 1)));
    }
}, {passive: false});

const endDrag = () => {
    isDragging = isDraggingTrack = false;
    if (track) track.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
};
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

// --- INITIALIZE ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    initHeaderDrag(); // For standalone project pages
});

// --- CUSTOM CURSOR PHYSICS (SPRING-DAMPER & SQUASH/STRETCH) ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorOuterLine = document.querySelector('.cursor-outer-line');

let mouse = { x: 0, y: 0 };
let dot = { x: 0, y: 0 };
let outline = { x: 0, y: 0, vx: 0, vy: 0 };
let outerLine = { x: 0, y: 0, vx: 0, vy: 0 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Only show the biggest one on movement
    if (cursorOuterLine) cursorOuterLine.style.opacity = '1';
});

let outlineAngle = 0;
let outerLineAngle = 0;

const animateCursor = () => {
    // 1. Dot Logic (Simple Lerp for precision)
    dot.x += (mouse.x - dot.x) * 0.4;
    dot.y += (mouse.y - dot.y) * 0.4;

    // 2. Outline Physics (Spring-Damper)
    const outlineStiffness = 0.15;
    const outlineDamping = 0.7;
    
    outline.vx += (mouse.x - outline.x) * outlineStiffness;
    outline.vy += (mouse.y - outline.y) * outlineStiffness;
    outline.vx *= outlineDamping;
    outline.vy *= outlineDamping;
    outline.x += outline.vx;
    outline.y += outline.vy;

    // 3. Outer Line Physics (Heavier Spring)
    const outerStiffness = 0.05;
    const outerDamping = 0.85;
    
    outerLine.vx += (mouse.x - outerLine.x) * outerStiffness;
    outerLine.vy += (mouse.y - outerLine.y) * outerStiffness;
    outerLine.vx *= outerDamping;
    outerLine.vy *= outerDamping;
    outerLine.x += outerLine.vx;
    outerLine.y += outerLine.vy;

    // 4. Transform & Squash/Stretch Logic
    const isHovering = document.body.classList.contains('hovering');
    
    // Dot Transform
    cursorDot.style.transform = `translate(${dot.x - 4}px, ${dot.y - 4}px) scale(${isHovering ? 0 : 1})`;

    // Outline Visuals
    const speed = Math.hypot(outline.vx, outline.vy);
    const targetAngle = speed > 0.5 ? Math.atan2(outline.vy, outline.vx) * 180 / Math.PI : 0;
    
    // Smoothly transition angle back to 0 when stopped
    outlineAngle += (targetAngle - outlineAngle) * 0.1;
    
    const stretch = Math.min(speed / 20, 0.5);
    const outlineScale = isHovering ? 1.5 : 1;
    cursorOutline.style.transform = `translate(${outline.x - 20}px, ${outline.y - 20}px) rotate(${outlineAngle}deg) scale(${outlineScale + stretch}, ${outlineScale - stretch})`;

    // Outer Line Visuals
    if (cursorOuterLine) {
        const outerSpeed = Math.hypot(outerLine.vx, outerLine.vy);
        const outerTargetAngle = outerSpeed > 0.5 ? Math.atan2(outerLine.vy, outerLine.vx) * 180 / Math.PI : 0;
        
        outerLineAngle += (outerTargetAngle - outerLineAngle) * 0.05;
        
        const outerStretch = Math.min(outerSpeed / 40, 0.3);
        cursorOuterLine.style.transform = `translate(${outerLine.x - 50}px, ${outerLine.y - 50}px) rotate(${outerLineAngle}deg) scale(${1 + outerStretch}, ${1 - outerStretch})`;
    }
    
    requestAnimationFrame(animateCursor);
};

animateCursor();

// Cursor Hover Effects (Using delegation for robustness)
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .modern-card, .project-card, .leaf-handle, .close-btn')) {
        document.body.classList.add('hovering');
    } else {
        document.body.classList.remove('hovering');
    }
});

// --- PARALLAX ---
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    }
});