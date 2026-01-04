// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// WhatsApp Funnel Logic
function whatsAppOrder(item) {
    // Base URL provided by user
    const baseUrl = "https://wa.me/60134085923?text=";
    
    // Construct the message
    // "Hi Anfloral, saya berminat dengan [Item Name]."
    const message = `Hi Anfloral, saya berminat dengan ${item}.`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `${baseUrl}${encodedMessage}`;
    
    // Open in new tab
    window.open(finalUrl, '_blank');
}

// Add simple scroll animation reveal
window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.service-card, .product-card');

    for (var i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;

        if (revealtop < windowheight - revealpoint) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}
