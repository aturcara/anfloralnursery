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

// Parallax Effect for Hero Image (Optional Polish)
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
    if (heroImg) {
        let scrollPosition = window.scrollY;
        // Move image slightly slower than scroll
        heroImg.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
});