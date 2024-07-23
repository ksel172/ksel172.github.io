document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    const text = 'Welcome to my page!';
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text[index];
            index++;
            setTimeout(typeText, 100);
        }
    }

    typeText();

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    function handleResponsive() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    window.addEventListener('resize', handleResponsive);
});