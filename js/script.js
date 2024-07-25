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

       // Particle background
       document.getElementById('background-canvas').style.backgroundImage = "url('images/untitled-10%.png')";
       const ctx = canvas.getContext('2d');
   
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
   
       const particles = [];
       const particleCount = 60;
   
       class Particle {
           constructor() {
               this.x = Math.random() * canvas.width;
               this.y = Math.random() * canvas.height;
               this.size = Math.random() * 2 + 1;
               this.speedX = Math.random() * 0.5 - 0.25;
               this.speedY = Math.random() * 0.5 - 0.25;
               this.color = `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 0.3 + 0.2})`;
           }
   
           update() {
               this.x += this.speedX;
               this.y += this.speedY;
   
               if (this.x > canvas.width) this.x = 0;
               else if (this.x < 0) this.x = canvas.width;
               if (this.y > canvas.height) this.y = 0;
               else if (this.y < 0) this.y = canvas.height;
           }
   
           draw() {
               ctx.fillStyle = this.color;
               ctx.beginPath();
               ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
               ctx.fill();
           }
       }
   
       function init() {
           for (let i = 0; i < particleCount; i++) {
               particles.push(new Particle());
           }
       }
   
       function animate() {
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           particles.forEach(particle => {
               particle.update();
               particle.draw();
           });
           requestAnimationFrame(animate);
       }
   
       init();
       animate();
   

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        dots.length = 0;
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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
