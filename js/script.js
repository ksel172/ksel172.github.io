document.addEventListener('DOMContentLoaded', () => {
    // Animate hero section
    gsap.from('.hero h1', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from('.hero .subtitle', { opacity: 0, y: 50, duration: 1, delay: 0.7 });
    gsap.from('.hero .cta-button', { opacity: 0, y: 50, duration: 1, delay: 0.9 });

    // Animate article cards
    gsap.from('.article-card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.featured-articles',
            start: 'top 80%'
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});