// Mobile Navigation Logic (Preserved if needed for future, simplified in CSS for now)
const burger = document.querySelector('.burger'); // If I re-add burger
// Current layout uses simple Navbar, but logic is good to have.

// --- WhatsApp Funnel Logic ---
function whatsAppOrder(item) {
    const baseUrl = "https://wa.me/60134085923?text=";
    const message = `Hi Anfloral, saya berminat dengan ${item}.`;
    const finalUrl = `${baseUrl}${encodeURIComponent(message)}`;
    window.open(finalUrl, '_blank');
}

// --- SCROLL ANIMATION ENGINE ---
// This observes all elements with 'reveal-*' classes
const observerOptions = {
    root: null, // Use the viewport
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add the visible class to trigger CSS transition
            entry.target.classList.add('is-visible');
            
            // Optional: Stop observing once revealed (for performance)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements to animate
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

revealElements.forEach((el) => {
    observer.observe(el);
});

// --- NUMBER COUNTER ANIMATION ---
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 }); // Start when 50% visible

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// --- TESTIMONIALS V2: GROWTH SLIDER & TRACK ---
const track = document.getElementById('testimonialTrack');
const handle = document.getElementById('leafHandle');
const growthBar = document.getElementById('growthBar');
const sliderBg = document.querySelector('.growth-track-bg');
const universe = document.querySelector('.testimonial-universe');

let isDragging = false;
let isDraggingTrack = false;
let startX;
let currentPercent = 0;

// Function to update UI from percent (0 to 1)
const updateUI = (percent) => {
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    currentPercent = percent;

    // Update Slider UI
    handle.style.left = `${percent * 100}%`;
    growthBar.style.width = `${percent * 100}%`;
    
    // Update Track Position
    const trackMax = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1); // include padding
    track.style.transform = `translateX(${-percent * trackMax}px)`;
};

// Slider Drag Logic
const onSliderMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const rect = sliderBg.getBoundingClientRect();
    let x = clientX - rect.left;
    updateUI(x / rect.width);
};

// Track Drag Logic
let trackStartX;
let initialPercent;

const onTrackStart = (e) => {
    isDraggingTrack = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    trackStartX = clientX;
    initialPercent = currentPercent;
    track.style.transition = 'none'; // Snappy drag
};

const onTrackMove = (e) => {
    if (!isDraggingTrack) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const walk = clientX - trackStartX;
    const trackMax = track.scrollWidth - window.innerWidth;
    const percentChange = walk / trackMax;
    updateUI(initialPercent - percentChange);
};

const onDragEnd = () => {
    isDragging = false;
    isDraggingTrack = false;
    track.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
};

// Event Listeners for Slider
handle.addEventListener('mousedown', () => isDragging = true);
handle.addEventListener('touchstart', () => isDragging = true);

// Event Listeners for Track
universe.addEventListener('mousedown', onTrackStart);
universe.addEventListener('touchstart', onTrackStart);

// Global Listeners
window.addEventListener('mousemove', (e) => {
    onSliderMove(e);
    onTrackMove(e);
});
window.addEventListener('touchmove', (e) => {
    onSliderMove(e);
    onTrackMove(e);
});
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);

// --- PROJECT DETAIL LOGIC ---
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

function openProject(id) {
    const data = projectData[id];
    if (!data) return;

    const curtain = document.getElementById('curtain');
    const overlay = document.getElementById('projectDetailOverlay');
    const ribbonTrack = document.getElementById('ribbonTrack');

    // Reset and Set Content
    document.getElementById('detailTitle').innerText = data.title;
    document.getElementById('detailDescription').innerText = data.description;
    document.getElementById('detailDuration').innerText = data.duration;
    document.getElementById('detailPlants').innerText = data.plants;
    curtain.style.background = data.color;

    // Inject Images for Kinetic Ribbon
    ribbonTrack.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const img = document.createElement('img');
        img.src = `https://placehold.co/600x800/${data.color.replace('#', '')}/FFF?text=${data.title}+${i}`;
        ribbonTrack.appendChild(img);
    }
    // Duplicate for infinite loop
    ribbonTrack.innerHTML += ribbonTrack.innerHTML;

    // Trigger Transition
    curtain.classList.add('active');
    
    setTimeout(() => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scroll
    }, 400);

    setTimeout(() => {
        curtain.classList.remove('active');
    }, 1200);
}

function closeProject() {
    const overlay = document.getElementById('projectDetailOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scroll
}

// Parallax Effect for Hero Image (Optional Polish)
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        let scrollPosition = window.scrollY;
        // Move image slightly slower than scroll
        heroImg.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
});