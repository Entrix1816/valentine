// Floating Hearts Generator
function createHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if (!heartsContainer) return;

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heartsContainer.appendChild(heart);

            // Remove heart after animation
            setTimeout(() => {
                heart.remove();
            }, 15000);
        }, i * 100);
    }
}

// Run every 15 seconds to keep hearts flowing
setInterval(createHearts, 15000);

// No Button Running Away Logic
if (document.querySelector('.no-btn')) {
    const noBtn = document.querySelector('.no-btn');
    const footer = document.querySelector('.footer p');
    const messages = [
        "no is too shy right 💕",
        "no is hiding! 🙈",
        "no ran away! 🏃‍♂️",
        "can't catch no! 💨",
        "no says maybe? 🤔",
        "stop chasing no! 😅",
        "no is playing hard to get 💕"
    ];
    let messageIndex = 0;

    function moveNoButton() {
        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 100;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.classList.add('running');

        // Change footer message
        if (footer) {
            messageIndex = (messageIndex + 1) % messages.length;
            footer.textContent = messages[messageIndex];
        }

        // Create sparkle effect
        createSparkle(randomX + noBtn.offsetWidth/2, randomY + noBtn.offsetHeight/2);

        setTimeout(() => {
            noBtn.classList.remove('running');
        }, 500);
    }

    // Events that make the button run away
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('mousemove', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

// Sparkle Effect
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Rizz Generator
if (document.getElementById('rizzBtn')) {
    const rizzBtn = document.getElementById('rizzBtn');
    const rizzDisplay = document.getElementById('rizzDisplay');
    const rizzCounter = document.getElementById('rizzCounter');
    const wantMoreSection = document.getElementById('wantMoreSection');
    const currentAudio = document.getElementById('currentAudio');
    const songNotification = document.getElementById('songNotification');
    const songNotificationText = document.getElementById('songNotificationText');
    let clickCount = 0;

    function showSongNotification(songName, lyric) {
        if (songNotification && songNotificationText) {
            songNotificationText.textContent = `🎵 Now Playing: ${songName} - "${lyric}"`;
            songNotification.style.display = 'block';
            setTimeout(() => {
                songNotification.style.display = 'none';
            }, 5000);
        }
    }

    rizzBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/get_rizz');
            const data = await response.json();

            // Update display
            rizzDisplay.innerHTML = `
                <div class="rizz-line">${data.line}</div>
                <div class="song-info">
                    <div class="song-name">🎵 ${data.song}</div>
                    <div class="song-lyric">"${data.lyric}"</div>
                </div>
            `;

            // Play song
            if (currentAudio) {
                currentAudio.src = '/static/music/' + data.song_file;
                currentAudio.play().catch(e => console.log('Audio play failed:', e));
            }

            // Show notification
            showSongNotification(data.song, data.lyric);

            // Update counter
            clickCount = data.count;
            if (rizzCounter) {
                rizzCounter.textContent = `✨ ${clickCount} rizz unlocked ✨`;
            }

            // Show "Want more?" button after 5 clicks
            if (clickCount >= 5 && wantMoreSection) {
                wantMoreSection.style.display = 'block';
            }

            // Create sparkles
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createSparkle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }, i * 100);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Want More Button
if (document.getElementById('wantMoreBtn')) {
    const wantMoreBtn = document.getElementById('wantMoreBtn');

    wantMoreBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/get_more_rizz');
            const data = await response.json();

            const rizzDisplay = document.getElementById('rizzDisplay');
            rizzDisplay.innerHTML = `
                <div class="rizz-line">${data.line}</div>
                <div class="song-info">
                    <div class="song-name">🎵 ${data.song}</div>
                    <div class="song-lyric">"${data.lyric}"</div>
                </div>
            `;

            // Play song
            const currentAudio = document.getElementById('currentAudio');
            if (currentAudio) {
                currentAudio.src = '/static/music/' + data.song_file;
                currentAudio.play().catch(e => console.log('Audio play failed:', e));
            }

            // Show notification
            const songNotificationText = document.getElementById('songNotificationText');
            const songNotification = document.getElementById('songNotification');
            if (songNotificationText && songNotification) {
                songNotificationText.textContent = `🎵 Now Playing: ${data.song} - "${data.lyric}"`;
                songNotification.style.display = 'block';
                setTimeout(() => {
                    songNotification.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Carousel Functionality
if (document.querySelector('.carousel')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Next button
    document.querySelector('.next-btn')?.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    // Previous button
    document.querySelector('.prev-btn')?.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto advance every 5 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.carousel')?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.querySelector('.carousel')?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX) {
            showSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX) {
            showSlide(currentSlide - 1);
        }
    });
}

// Music Player for Want More Page
if (document.querySelector('.carousel-page')) {
    const songs = [
        { file: 'flashed_junk_mind.mp3', name: 'Flashed Junk Mind - Milky Chance' },
        { file: 'jasmin_skin.mp3', name: 'Jasmin Skin - Milky Chance' },
        { file: 'cocoon.mp3', name: 'Cocoon - Milky Chance' },
        { file: 'feeling_for_you.mp3', name: 'Feeling for You - Milky Chance' },
        { file: 'good_song_never_dies.mp3', name: 'A Good Song Never Dies - Saint Motel' }
    ];

    let currentSongIndex = 0;
    const carouselAudio = document.getElementById('carouselAudio');
    const nowPlaying = document.querySelector('.now-playing');

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        if (carouselAudio) {
            carouselAudio.src = '/static/music/' + songs[currentSongIndex].file;
            carouselAudio.play().catch(e => console.log('Audio play failed:', e));
            if (nowPlaying) {
                nowPlaying.textContent = `🎵 ${songs[currentSongIndex].name}`;
            }

            // Show notification
            const notification = document.createElement('div');
            notification.className = 'song-notification';
            notification.textContent = `🎵 Now Playing: ${songs[currentSongIndex].name}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }

    if (carouselAudio) {
        carouselAudio.addEventListener('ended', playNextSong);
    }
}

// Miss Me Page Music
if (document.querySelector('.missme-page')) {
    const missMeAudio = document.getElementById('missMeAudio');
    const nowPlaying = document.querySelector('.now-playing');

    if (missMeAudio && nowPlaying) {
        nowPlaying.textContent = '🎵 Good For You - Selena Gomez';
    }
}

// Music Toggle
document.querySelectorAll('.music-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
        const audio = this.closest('.music-player')?.previousElementSibling;
        if (audio && audio.tagName === 'AUDIO') {
            if (audio.paused) {
                audio.play();
                this.textContent = '🔊';
            } else {
                audio.pause();
                this.textContent = '🔈';
            }
        }
    });
});

// Auto-play fallback (browsers require user interaction)
document.addEventListener('click', function initAudio() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        if (audio.autoplay) {
            audio.play().catch(e => console.log('Auto-play prevented'));
        }
    });
    document.removeEventListener('click', initAudio);
}, { once: true });

// Initialize hearts on page load
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
});