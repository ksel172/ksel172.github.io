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

    // Background animation
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 20;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.type = Math.random() < 0.5 ? 'number' : 'shape';
            this.value = this.type === 'number' ? Math.floor(Math.random() * 10) : null;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(93, 100, 179, 0.5)';
            if (this.type === 'number') {
                ctx.font = `${this.size * 2}px SpaceMono-Regular`;
                ctx.fillText(this.value, this.x, this.y);
            } else {
                ctx.beginPath();
                if (Math.random() < 0.5) {
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                } else {
                    ctx.rect(this.x, this.y, this.size * 2, this.size * 2);
                }
                ctx.fill();
            }
        }
    }

    function init() {
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Handle the mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.querySelector('.cta-buttons').classList.toggle('active');
        this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });

    // Close the menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                navMenu.classList.remove('active');
                document.querySelector('.cta-buttons').classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Handle responsive menu
    function handleResponsive() {
        if (window.innerWidth > 1024) {
            navMenu.classList.remove('active');
            document.querySelector('.cta-buttons').classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    window.addEventListener('resize', handleResponsive);
});