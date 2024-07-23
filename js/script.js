document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    const text = 'Welcome to my page!';
    let index = 0;
    
    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text[index];
            index++;
            setTimeout(typeText, 100); // Adjust typing speed here
        }
    }
    
    // Start the typing animation
    typeText();
});