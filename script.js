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

let isDragging = false;
let startX;
let scrollLeft;

const updateSlider = (e) => {
    if (!isDragging) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const rect = sliderBg.getBoundingClientRect();
    let x = clientX - rect.left;
    
    // Boundary checks
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const percent = x / rect.width;
    
    // Update Slider UI
    handle.style.left = `${percent * 100}%`;
    growthBar.style.width = `${percent * 100}%`;
    
    // Update Track Position
    const trackMax = track.scrollWidth - window.innerWidth;
    track.style.transform = `translateX(${-percent * trackMax}px)`;
};

handle.addEventListener('mousedown', () => isDragging = true);
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', updateSlider);

handle.addEventListener('touchstart', () => isDragging = true);
window.addEventListener('touchend', () => isDragging = false);
window.addEventListener('touchmove', updateSlider);

// Parallax Effect for Hero Image (Optional Polish)
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        let scrollPosition = window.scrollY;
        // Move image slightly slower than scroll
        heroImg.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
});