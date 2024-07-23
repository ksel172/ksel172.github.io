document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    const text = 'Welcome to WizzyCove!';
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
        navToggle.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    function handleResponsive() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResponsive);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax effect for stars
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        document.getElementById('stars').style.transform = `translateY(-${scrollPosition * 0.1}px)`;
        document.getElementById('stars2').style.transform = `translateY(-${scrollPosition * 0.2}px)`;
        document.getElementById('stars3').style.transform = `translateY(-${scrollPosition * 0.3}px)`;
    });
});