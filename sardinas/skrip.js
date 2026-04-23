const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 26, 21, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 26, 21, 0.95)';
    }
});

let cartCount = 0;
const cartIcon = document.querySelector('.cart-icon');
const addToCartBtns = document.querySelectorAll('.add-to-cart');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        cartIcon.textContent = `Cart (${cartCount})`;
        btn.textContent = 'Added!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 2000);
    });
});

const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .about-item').forEach(el => {
    el.style.opacity = '0';
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
