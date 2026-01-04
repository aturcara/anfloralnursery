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

// ... (keep previous functions)

function openProject(id, el) {
    console.log('Attempting to open project:', id);
    const data = projectData[id];
    if (!data) return;

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

    // Inject Images (Manual Carousel - No Infinite loop clone)
    ribbonTrack.innerHTML = '';
    const themes = ['nature', 'garden', 'plants', 'landscape', 'architecture'];
    for (let i = 0; i < 6; i++) {
        const img = document.createElement('img');
        img.src = `https://placehold.co/1200x800/${data.color.replace('#', '')}/FFF?text=${themes[i % themes.length]}+${i+1}`;
        ribbonTrack.appendChild(img);
    }
    ribbonTrack.style.transform = 'translateX(0)';

    // Animation
    requestAnimationFrame(() => expander.classList.add('expanding'));

    setTimeout(() => {
        overlay.classList.add('active');
        overlay.scrollTop = 0;
        detailContent.classList.add('visible');
        detailNav.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }, 600);

    setTimeout(() => {
        expander.style.opacity = '0';
        setTimeout(() => expander.remove(), 500);
    }, 1000);

    // --- INTERNAL HEADER DRAG ---
    let isHeaderDragging = false;
    let headerStartX;
    let headerScrollLeft = 0;

    const headerContainer = document.querySelector('.kinetic-header');
    
    headerContainer.onmousedown = (e) => {
        isHeaderDragging = true;
        headerStartX = e.pageX - ribbonTrack.offsetLeft;
    };

    window.addEventListener('mousemove', (e) => {
        if (!isHeaderDragging) return;
        const x = e.pageX - headerContainer.offsetLeft;
        const walk = (x - headerStartX) * 1.5;
        headerScrollLeft = walk;
        
        // Boundaries
        const maxScroll = ribbonTrack.scrollWidth - window.innerWidth;
        if (headerScrollLeft > 0) headerScrollLeft = 0;
        if (headerScrollLeft < -maxScroll) headerScrollLeft = -maxScroll;
        
        ribbonTrack.style.transform = `translateX(${headerScrollLeft}px)`;
    });

    window.addEventListener('mouseup', () => isHeaderDragging = false);
    
    // Touch
    headerContainer.ontouchstart = (e) => {
        isHeaderDragging = true;
        headerStartX = e.touches[0].pageX - ribbonTrack.offsetLeft;
    };
    window.addEventListener('touchmove', (e) => {
        if (!isHeaderDragging) return;
        const x = e.touches[0].pageX - headerContainer.offsetLeft;
        const walk = (x - headerStartX) * 1.5;
        headerScrollLeft = walk;
        const maxScroll = ribbonTrack.scrollWidth - window.innerWidth;
        if (headerScrollLeft > 0) headerScrollLeft = 0;
        if (headerScrollLeft < -maxScroll) headerScrollLeft = -maxScroll;
        ribbonTrack.style.transform = `translateX(${headerScrollLeft}px)`;
    });
    window.addEventListener('touchend', () => isHeaderDragging = false);
}

function closeProject(isBackAction = false) {
    const overlay = document.getElementById('projectDetailOverlay');
    const detailContent = document.getElementById('detailContent');
    const detailNav = document.querySelector('.detail-nav');

    if (detailContent) detailContent.classList.remove('visible');
    if (detailNav) detailNav.classList.remove('visible');

    setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (!isBackAction) {
            try { history.pushState(null, '', 'index.html'); } catch(e){}
        }
    }, 400);
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
    handle.addEventListener('touchstart', () => isDragging = true);
}

let trackStartX, initialPercent;
if (universe) {
    universe.addEventListener('mousedown', (e) => {
        isDraggingTrack = true;
        trackStartX = e.clientX;
        initialPercent = currentPercent;
        if (track) track.style.transition = 'none';
    });
    universe.addEventListener('touchstart', (e) => {
        isDraggingTrack = true;
        trackStartX = e.touches[0].clientX;
        initialPercent = currentPercent;
        if (track) track.style.transition = 'none';
    });
}

window.addEventListener('mousemove', (e) => {
    if (isDragging && sliderBg) {
        const rect = sliderBg.getBoundingClientRect();
        updateUI((e.clientX - rect.left) / rect.width);
    }
    if (isDraggingTrack) {
        const walk = e.clientX - trackStartX;
        const trackMax = track.scrollWidth - window.innerWidth;
        updateUI(initialPercent - (walk / trackMax));
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
        updateUI(initialPercent - (walk / trackMax));
    }
});

window.addEventListener('mouseup', () => {
    isDragging = isDraggingTrack = false;
    if (track) track.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
});
window.addEventListener('touchend', () => {
    isDragging = isDraggingTrack = false;
    if (track) track.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
});

// --- PARALLAX ---
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    }
});
