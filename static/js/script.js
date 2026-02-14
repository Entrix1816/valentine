// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log

    // Create floating hearts
    createFloatingHearts();

    // No button escape functionality
    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
        console.log('No button found'); // Debug log
        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('click', function(e) {
            e.preventDefault();
            moveNoButton();
        });
    }

    // Rizz button functionality - FIXED VERSION
    const rizzBtn = document.getElementById('rizzBtn');
    if (rizzBtn) {
        console.log('Rizz button found'); // Debug log
        rizzBtn.addEventListener('click', function(e) {
            e.preventDefault();
            getRizz();
        });
    } else {
        console.log('Rizz button not found');
    }
});

function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-background');
    if (!heartsContainer) return;

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animation = `float-hearts ${5 + Math.random() * 5}s infinite linear`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (10 + Math.random() * 20) + 'px';
        heart.style.opacity = 0.3 + Math.random() * 0.5;
        heart.style.pointerEvents = 'none';
        heartsContainer.appendChild(heart);
    }
}

function moveNoButton() {
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;

    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate new position within container
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    let newX, newY;

    // Keep trying until we find a valid position
    do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
    } while (
        Math.abs(newX - (btnRect.left - containerRect.left)) < 50 &&
        Math.abs(newY - (btnRect.top - containerRect.top)) < 50
    );

    // Apply new position
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    // Add shake animation
    noBtn.style.animation = 'shake 0.5s';
    setTimeout(() => {
        noBtn.style.animation = '';
    }, 500);

    // Update footer text
    const footerText = document.getElementById('footerText');
    if (footerText) {
        const messages = [
            "no is too shy right 💕",
            "aww, trying to escape? 😘",
            "you know you want to say yes! 💖",
            "can't run from love! 💗",
            "yes is the only way! 💓"
        ];
        footerText.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

function getRizz() {
    console.log('getRizz function called'); // Debug log

    const rizzDisplay = document.getElementById('rizzDisplay');
    if (!rizzDisplay) {
        console.log('Rizz display element not found');
        return;
    }

    // Show loading animation
    rizzDisplay.innerHTML = '✨ Thinking of something sexy... ✨';
    rizzDisplay.style.animation = 'pulse 1s infinite';

    // Fetch rizz from server
    fetch('/get_rizz')
        .then(response => {
            console.log('Response received:', response); // Debug log
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Debug log
            rizzDisplay.style.animation = '';
            rizzDisplay.innerHTML = '💕 ' + data.rizz + ' 💕';

            // Add pop animation
            rizzDisplay.style.animation = 'popIn 0.5s';
            setTimeout(() => {
                rizzDisplay.style.animation = '';
            }, 500);
        })
        .catch(error => {
            console.error('Error fetching rizz:', error); // Debug log
            rizzDisplay.style.animation = '';

            // Fallback rizz lines in case API fails
            const fallbackRizz = [
                "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
                "Do you have a map? I keep getting lost in your eyes! 🗺️",
                "Is your name Google? Because you have everything I've been searching for! 🔍",
                "Are you made of copper and tellurium? Because you're Cu-Te! ⚛️",
                "Do you believe in love at first sight, or should I walk by again? 💫",
                "If you were a vegetable, you'd be a 'cute-cumber'! 🥒",
                "Are you a parking ticket? Because you've got FINE written all over you! 🎫",
                "Is your dad a baker? Because you're a cutie pie! 🥧",
                "Are you WiFi? Because I'm feeling a connection! 📶",
                "Is your name Chapstick? Because you're da balm! 💄",
                "Are you a campfire? Because you're hot and I want s'more! 🔥",
                "Do you have a Band-Aid? Because I just scraped my knee falling for you! 🩹",
                "Are you a time traveler? Because I see you in my future! ⏰",
                "Is your name Ariel? Because we mermaid for each other! 🧜‍♀️",
                "Are you a dictionary? Because you add meaning to my life! 📚"
            ];

            rizzDisplay.innerHTML = '💕 ' + fallbackRizz[Math.floor(Math.random() * fallbackRizz.length)] + ' 💕';
        });
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    @keyframes float-hearts {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }

    @keyframes popIn {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);