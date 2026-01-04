console.log('Anfloral Script Loaded');

// --- PROJECT DATA ---
const projectData = {
    'villa-tropika': {
        title: 'Villa Tropika',
        description: 'Transformasi resort peribadi di Langkawi. Kami menggunakan kombinasi pokok kelapa eksotik dan lanskap lembut untuk mencipta suasana hutan hujan tropika yang menyejukkan. Setiap sudut dirancang untuk privasi dan ketenangan.',
        duration: '21 Hari',
        plants: '120+ Spesies',
        color: '#1a472a'
    },
    'vertical-garden': {
        title: 'Vertical Garden KL',
        description: 'Dinding hijau vertikal di tengah pusat bandar Kuala Lumpur. Menggunakan sistem pengairan automatik untuk memastikan lumut dan tanaman sentiasa subur walaupun di dalam ruang tertutup pejabat korporat.',
        duration: '7 Hari',
        plants: '1500+ Tanaman',
        color: '#27ae60'
    },
    'zen-garden': {
        title: 'Zen Garden Ipoh',
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

function openProject(id, el) {
    console.log('Attempting to open project:', id);
    const data = projectData[id];
    if (!data) return;

    const overlay = document.getElementById('projectDetailOverlay');
    const ribbonTrack = document.getElementById('ribbonTrack');
    const detailContent = document.getElementById('detailContent');
    const detailNav = document.querySelector('.detail-nav');

    if (!overlay || !ribbonTrack || !detailContent || !detailNav) {
        console.error('One or more detail elements not found in DOM');
        return;
    }

    // Update URL without reload
    try {
        history.pushState({ projectId: id }, '', `${id}.html`);
    } catch (e) { console.warn(e); }

    // 1. Calculate Rect
    const rect = el.getBoundingClientRect();

    // 2. Create Expander
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

    // 3. Prepare Content
    document.getElementById('detailTitle').innerText = data.title;
    document.getElementById('detailDescription').innerText = data.description;
    document.getElementById('detailDuration').innerText = data.duration;
    document.getElementById('detailPlants').innerText = data.plants;

    ribbonTrack.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const img = document.createElement('img');
        img.src = `https://placehold.co/600x800/${data.color.replace('#', '')}/FFF?text=${data.title}+${i}`;
        ribbonTrack.appendChild(img);
    }
    ribbonTrack.innerHTML += ribbonTrack.innerHTML;

    // 4. Animation
    requestAnimationFrame(() => {
        expander.classList.add('expanding');
    });

    setTimeout(() => {
        overlay.classList.add('active');
        detailContent.classList.add('visible');
        detailNav.classList.add('visible');
        document.body.style.overflow = 'hidden';
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
