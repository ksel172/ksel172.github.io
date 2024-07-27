document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    const text = 'Welcome to my page!';
    let index = 0;

    function typeText() {
        if (typingElement && index < text.length) {
            typingElement.textContent += text[index];
            index++;
            setTimeout(typeText, 100);
        }
    }

    if (typingElement) {
        typeText();
    } else {
        console.warn("Element with id 'typing-text' not found. Skipping typing animation.");
    }

    // Handle the mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const ctaButtons = document.querySelector('.cta-buttons');
            if (ctaButtons) ctaButtons.classList.toggle('active');
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });

        // Close the menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    navMenu.classList.remove('active');
                    const ctaButtons = document.querySelector('.cta-buttons');
                    if (ctaButtons) ctaButtons.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Handle responsive menu
        function handleResponsive() {
            if (window.innerWidth > 1024) {
                navMenu.classList.remove('active');
                const ctaButtons = document.querySelector('.cta-buttons');
                if (ctaButtons) ctaButtons.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }

        window.addEventListener('resize', handleResponsive);
    } else {
        console.warn("Navigation elements not found. Skipping navigation setup.");
    }
});