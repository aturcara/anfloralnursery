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

    const ribbonImages = {
        'villa-tropika': ['1512917774080-9991f1c4c750', '1582268611958-ebfd161ef9cf', '1584132905271-8927dd5c74fe', '1613490493576-7fde63acd811', '1564013799919-ab600027ffc6'],
        'vertical-garden': ['1534349762230-e0cadf78f5db', '1591857177580-dc82b9ac4e1e', '1446064448000-d63a7945965b', '1533038590840-1cde6e66b056', '1603511021144-fed96d24600a'],
        'zen-garden': ['1505312017300-366532e3a6c9', '1504198453319-5ce5815fd3bf', '1553356084-58ef4a67b2ad', '1536431311719-398b6704d4cc', '1507568548784-7484a26811d7']
    };

    const imgIds = ribbonImages[id] || ['1585320806297-9794b3e4eeae'];
    for (let i = 0; i < 6; i++) {
        const img = document.createElement('img');
        const imgId = imgIds[i % imgIds.length];
        img.src = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=1200`;
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

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

// Special observer for marquee to handle translateX(100%) starting position
const marqueeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            marqueeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: '50px' });

document.querySelectorAll('.marquee, .marquee-reverse').forEach(el => marqueeObserver.observe(el));

// Trust Counter Staggered Animation
const trustSection = document.querySelector('.trust-section');
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach((counter, index) => {
                const target = +counter.getAttribute('data-target');
                const duration = 1200; // 1.2 seconds total per counter
                const delay = index * 300; // 0.3s stagger
                
                setTimeout(() => {
                    let startTime = null;
                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        const currentVal = Math.floor(progress * target);
                        counter.innerText = currentVal;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    requestAnimationFrame(animate);
                }, delay);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (trustSection) counterObserver.observe(trustSection);

// --- TESTIMONIALS DRAG & AUTOPLAY (INFINITE LOOP + MOMENTUM) ---

const track = document.getElementById('testimonialTrack');
const universe = document.querySelector('.testimonial-universe');

let isDraggingTrack = false;
let testimonialAutoplayId = null;
let currentTranslateX = 0;
let trackBaseWidth = 0;

let dragVelocity = 0;
let lastDragX = 0;
let lastDragTime = 0;
let rafMomentum = null;

const initInfiniteTestimonials = () => {
    if (!track) return;
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    const clone = track.innerHTML;
    track.innerHTML = clone + clone + clone;
    
    // Recalculate base width using a card and the track style
    const card = track.querySelector('.t-card');
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 0;
    trackBaseWidth = (card.offsetWidth + gap) * originalCards.length;
    
    // Initial: Center the first card of the middle set
    const cardWidth = card.offsetWidth;
    const firstCardMiddleSetX = trackBaseWidth;
    currentTranslateX = (window.innerWidth / 2) - (firstCardMiddleSetX + cardWidth / 2);
    
    track.style.transition = 'none';
    track.style.transform = `translateX(${currentTranslateX}px)`;
    updateActiveCard();
};

const updateTestimonialPos = (newX, useTransition = false) => {
    if (!track || !trackBaseWidth) return;
    
    currentTranslateX = newX;

    // Boundary Wrap logic based on centered position
    const centerOffset = window.innerWidth / 2;
    const minX = centerOffset - (trackBaseWidth * 2);
    const maxX = centerOffset - trackBaseWidth;

    if (currentTranslateX < minX) {
        currentTranslateX += trackBaseWidth;
        if (isDraggingTrack) startTranslateX += trackBaseWidth;
    } else if (currentTranslateX > maxX) {
        currentTranslateX -= trackBaseWidth;
        if (isDraggingTrack) startTranslateX -= trackBaseWidth;
    }

    if (useTransition) {
        track.style.transition = 'transform 0.5s var(--transition-curve)';
    } else {
        track.style.transition = 'none';
    }
    
    track.style.transform = `translateX(${currentTranslateX}px)`;
    updateActiveCard();
};

const updateActiveCard = () => {
    if (!track) return;
    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const step = cardWidth + gap;

    // The center of the visible area relative to the track's start
    const viewportCenter = window.innerWidth / 2;
    const trackCenterOffset = viewportCenter - currentTranslateX;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
        const cardCenter = (index * step) + (cardWidth / 2);
        const distance = Math.abs(trackCenterOffset - cardCenter);
        
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
        card.classList.remove('active');
    });

    if (cards[closestIndex]) {
        cards[closestIndex].classList.add('active');
    }
};

const startTestimonialAutoplay = () => {
    stopTestimonialAutoplay();
    testimonialAutoplayId = setInterval(() => {
        if (isDraggingTrack) return;
        const card = document.querySelector('.t-card');
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const step = (card.offsetWidth + gap);
        
        // Move to the next card's centered position
        updateTestimonialPos(currentTranslateX - step, true);
    }, 5000);
};

const stopTestimonialAutoplay = () => {
    if (testimonialAutoplayId) {
        clearInterval(testimonialAutoplayId);
        testimonialAutoplayId = null;
    }
};

let trackStartX;
let startTranslateX;

if (universe) {
    const startTrackDrag = (e) => {
        stopTestimonialAutoplay();
        cancelAnimationFrame(rafMomentum);
        isDraggingTrack = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        trackStartX = clientX;
        startTranslateX = currentTranslateX;
        lastDragX = clientX;
        lastDragTime = performance.now();
        track.style.transition = 'none';
    };
    universe.addEventListener('mousedown', startTrackDrag);
    universe.addEventListener('touchstart', startTrackDrag, {passive: true});
}

window.addEventListener('mousemove', (e) => {
    if (!isDraggingTrack) return;
    const clientX = e.clientX;
    const now = performance.now();
    
    // Calculate Velocity
    const dt = now - lastDragTime;
    const dx = clientX - lastDragX;
    if (dt > 0) dragVelocity = dx / dt;
    
    const walk = clientX - trackStartX;
    updateTestimonialPos(startTranslateX + walk, false);
    
    lastDragX = clientX;
    lastDragTime = now;
});

window.addEventListener('touchmove', (e) => {
    if (!isDraggingTrack) return;
    const clientX = e.touches[0].clientX;
    const now = performance.now();
    const dt = now - lastDragTime;
    const dx = clientX - lastDragX;
    if (dt > 0) dragVelocity = dx / dt;
    
    const walk = clientX - trackStartX;
    updateTestimonialPos(startTranslateX + walk, false);
    
    lastDragX = clientX;
    lastDragTime = now;
}, {passive: false});

const applyMomentum = () => {
    if (Math.abs(dragVelocity) < 0.1) {
        snapToCard();
        return;
    }

    currentTranslateX += dragVelocity * 16;
    dragVelocity *= 0.95; // Friction
    updateTestimonialPos(currentTranslateX, false);
    rafMomentum = requestAnimationFrame(applyMomentum);
};

const snapToCard = () => {
    if (!trackBaseWidth) return;
    const card = document.querySelector('.t-card');
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const step = cardWidth + gap;
    
    // Find the current index centered in the viewport
    // Reverse of: currentTranslateX = (viewport / 2) - (index * step + cardWidth / 2)
    const viewportCenter = window.innerWidth / 2;
    const index = Math.round(((viewportCenter - currentTranslateX) - (cardWidth / 2)) / step);
    const targetX = viewportCenter - (index * step + cardWidth / 2);
    
    updateTestimonialPos(targetX, true);
    setTimeout(startTestimonialAutoplay, 2000);
};

const endDrag = () => {
    if (!isDraggingTrack) return;
    isDraggingTrack = false;
    applyMomentum();
};
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

// --- INITIALIZE ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    initHeaderDrag(); // For standalone project pages
    initInfiniteTestimonials(); // Setup infinite cloning
    startTestimonialAutoplay(); // Start testimonials autoplay

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        const allMobileLinks = document.querySelectorAll('.mobile-nav-links a, .btn-fancy-mobile');
        allMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Back to Top Logic
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
});

// --- PARALLAX ---
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    }
});

// --- BUTTERFLY RANDOM MOVEMENT ---
function startButterflyWandering() {
    const butterflyContainer = document.querySelector('.butterfly-container');
    if (!butterflyContainer) return;

    // Listen for fly-in animation end
    butterflyContainer.addEventListener('animationend', (e) => {
        if (e.animationName === 'fly-in') {
            // 1. Freeze the element at the exact position where the CSS animation ended.
            // This matches the 100% keyframe in style.css: translate(60px, -20px) rotate(90deg)
            butterflyContainer.style.transform = 'translate(60px, -20px) rotate(90deg)';
            
            // 2. Force a reflow/repaint so the browser registers this as the start point
            void butterflyContainer.offsetWidth;

            // 3. Enable the transition class (which adds transition: transform 3s...)
            // and remove the animation rule so it doesn't conflict.
            butterflyContainer.classList.add('wandering');
            
            // 4. Start the wandering loop. 
            // We use a small timeout to ensure the transition class is active before the first move.
            setTimeout(() => {
                butterflyWander(butterflyContainer);
                setInterval(() => butterflyWander(butterflyContainer), 3000);
            }, 50);
        }
    });
}

function butterflyWander(element) {
    // Generate random coordinates relative to center (0,0)
    const x = (Math.random() - 0.5) * 200; 
    const y = (Math.random() - 0.5) * 100;
    
    // Random organic rotation
    const rotation = Math.random() * 360; 

    element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
}

// Initialize butterfly logic
document.addEventListener('DOMContentLoaded', () => {
    startButterflyWandering();
});