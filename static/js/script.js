// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');

    createFloatingHearts(100);
    createAudioPlayer();

    // NO BUTTON
    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('mousemove', moveNoButton);
        noBtn.addEventListener('click', function(e) {
            e.preventDefault();
            moveNoButton();
        });
    }

    // Check which page and load music
    if (document.querySelector('.gift-container')) {
        console.log('Gift page detected');
        loadGiftPageMusic();
    }
    else if (document.querySelector('.wantmore-container')) {
        console.log('Carousel page detected');
        loadCarouselMusic(); // Simplified version
    }
    else if (document.querySelector('.missme-container')) {
        console.log('Miss me page detected');
        loadMissMeMusic();
    }
    else {
        console.log('Homepage detected');
        loadHomepageMusic();
    }

    // Rizz button
    const rizzBtn = document.getElementById('rizzBtn');
    if (rizzBtn) {
        rizzBtn.addEventListener('click', getRizz);
    }

    // Want more button
    const wantMoreBtn = document.getElementById('wantMoreBtn');
    if (wantMoreBtn) {
        wantMoreBtn.addEventListener('click', function() {
            window.location.href = '/want-more';
        });
    }

    // Miss me button
    const missMeBtn = document.getElementById('missMeBtn');
    if (missMeBtn) {
        missMeBtn.addEventListener('click', function() {
            window.location.href = '/miss-me';
        });
    }

    initCarousel();
});

function createAudioPlayer() {
    if (!document.getElementById('bgMusicPlayer')) {
        const audio = document.createElement('audio');
        audio.id = 'bgMusicPlayer';
        audio.style.display = 'none';
        audio.volume = 0.4;
        document.body.appendChild(audio);
        console.log('Audio player created');
    }
    return document.getElementById('bgMusicPlayer');
}

function loadHomepageMusic() {
    console.log('Loading homepage music...');
    fetch('/get_homepage_song')
        .then(response => response.json())
        .then(data => {
            const audio = document.getElementById('bgMusicPlayer');
            audio.src = `/static/music/${data.song.file}`;
            audio.loop = true;
            audio.play()
                .then(() => console.log('✅ Homepage music playing'))
                .catch(() => createPlayButton(audio));
        });
}

function loadGiftPageMusic() {
    console.log('Loading gift page music...');
    fetch('/get_giftpage_song')
        .then(response => response.json())
        .then(data => {
            const audio = document.getElementById('bgMusicPlayer');
            audio.src = `/static/music/${data.song.file}`;
            audio.loop = true;
            audio.play()
                .then(() => console.log('✅ Gift page music playing'))
                .catch(() => createPlayButton(audio));
        });
}

// SIMPLIFIED: Load carousel music
function loadCarouselMusic() {
    console.log('🎵 Loading carousel music...');

    fetch('/get_carousel_song')
        .then(response => response.json())
        .then(data => {
            console.log('Song to play:', data.song.file);

            const audio = document.getElementById('bgMusicPlayer');

            // Create a new audio element to ensure fresh load
            const newAudio = new Audio();
            newAudio.id = 'bgMusicPlayer';
            newAudio.volume = 0.4;
            newAudio.loop = true;

            // Try multiple formats if needed
            const fileName = data.song.file;
            const baseName = fileName.split('.')[0];

            // List of possible formats to try
            const formats = [
                fileName,  // Original
                baseName + '.mp3',
                baseName + '.m4a',
                fileName.toLowerCase(),
                fileName.toUpperCase()
            ];

            let currentFormat = 0;

            function tryNextFormat() {
                if (currentFormat >= formats.length) {
                    console.error('All formats failed');
                    createPlayButton(audio, 'Could not load audio file');
                    return;
                }

                const songUrl = `/static/music/${formats[currentFormat]}`;
                console.log(`Trying format ${currentFormat + 1}:`, songUrl);

                // Test if file exists
                fetch(songUrl, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            console.log('✅ File found:', songUrl);
                            newAudio.src = songUrl;

                            // Replace old audio with new
                            const oldAudio = document.getElementById('bgMusicPlayer');
                            if (oldAudio) oldAudio.remove();
                            document.body.appendChild(newAudio);

                            // Try to play
                            newAudio.play()
                                .then(() => {
                                    console.log('✅ Now playing!');
                                    showSongNotification('Feeling for You - Milky Chance');
                                })
                                .catch(e => {
                                    console.log('Auto-play blocked');
                                    createPlayButton(newAudio, 'Feeling for You');
                                });
                        } else {
                            console.log('❌ File not found:', songUrl);
                            currentFormat++;
                            tryNextFormat();
                        }
                    })
                    .catch(() => {
                        currentFormat++;
                        tryNextFormat();
                    });
            }

            tryNextFormat();
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Could not load music');
        });
}

// Simplified play button
function createPlayButton(audio, songName = 'Feeling for You') {
    const existingBtn = document.querySelector('.music-play-btn');
    if (existingBtn) existingBtn.remove();

    const playBtn = document.createElement('button');
    playBtn.className = 'music-play-btn';
    playBtn.innerHTML = `🎵 Click to Play ${songName} 🎵`;
    playBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 15px 30px;
        background: linear-gradient(45deg, #ff4d6d, #ffb6b6);
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-size: 1.2rem;
        animation: pulse 2s infinite;
        box-shadow: 0 5px 15px rgba(255,77,109,0.4);
        border: 2px solid white;
    `;

    playBtn.onclick = function() {
        audio.play()
            .then(() => {
                playBtn.remove();
                showSongNotification(songName);
            })
            .catch(e => {
                console.error('Error:', e);
                playBtn.innerHTML = '❌ Click again';
            });
    };

    document.body.appendChild(playBtn);
}



// Helper function to show error messages
function showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.innerHTML = `❌ ${message}`;
    errorMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff4444;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border: 2px solid white;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(errorMsg);

    // Also log to console for debugging
    console.error('Error message shown to user:', message);

    setTimeout(() => errorMsg.remove(), 8000);
}

// Enhanced play button
function createPlayButton(audio) {
    // Remove any existing buttons
    const existingBtn = document.querySelector('.music-play-btn');
    if (existingBtn) existingBtn.remove();

    const playBtn = document.createElement('button');
    playBtn.className = 'music-play-btn';
    playBtn.innerHTML = '🎵 Click to Play Feeling for You 🎵';
    playBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 15px 30px;
        background: linear-gradient(45deg, #ff4d6d, #ffb6b6);
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-size: 1.2rem;
        animation: pulse 2s infinite;
        box-shadow: 0 5px 15px rgba(255,77,109,0.4);
        border: 2px solid white;
    `;

    playBtn.onclick = function() {
        console.log('Play button clicked');
        audio.play()
            .then(() => {
                console.log('✅ Music started from play button');
                playBtn.remove();
                showSongNotification('Feeling for You - Milky Chance');
            })
            .catch(e => {
                console.error('Still blocked:', e);
                playBtn.innerHTML = '❌ Click again - still blocked';
            });
    };

    document.body.appendChild(playBtn);
}

// Also add a test function you can run from console
window.testCarouselMusic = function() {
    console.log('Manual test triggered');
    loadCarouselMusic();
};

function loadMissMeMusic() {
    console.log('Loading miss me music...');
    fetch('/get_missme_song')
        .then(response => response.json())
        .then(data => {
            const audio = document.getElementById('bgMusicPlayer');
            audio.src = `/static/music/${data.song.file}`;
            audio.loop = true;
            audio.play()
                .then(() => console.log('✅ Miss me music playing'))
                .catch(() => createPlayButton(audio));
        });
}

function showSongNotification(songName) {
    const notification = document.createElement('div');
    notification.innerHTML = `🎵 Now Playing: ${songName} 🎵`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff4d6d, #ffb6b6);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        z-index: 9999;
        animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;
        box-shadow: 0 5px 15px rgba(255,77,109,0.3);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}


function getRizz() {
    const rizzDisplay = document.getElementById('rizzDisplay');
    const wantMoreContainer = document.getElementById('wantMoreContainer');
    if (!rizzDisplay) return;

    rizzDisplay.innerHTML = '✨ Thinking of something sexy... ✨';
    fetch('/get_rizz')
        .then(response => response.json())
        .then(data => {
            rizzDisplay.innerHTML = '💕 ' + data.rizz + ' 💕';
            if (data.show_want_more && wantMoreContainer) {
                wantMoreContainer.style.display = 'block';
            }
        });
}

function moveNoButton() {
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;

    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const newX = Math.random() * (containerRect.width - btnRect.width);
    const newY = Math.random() * (containerRect.height - btnRect.height);

    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    const footerText = document.getElementById('footerText');
    if (footerText) {
        const messages = ["no is too shy right 💕", "aww, trying to escape? 😘", "you know you want to say yes! 💖"];
        footerText.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

function createFloatingHearts(count) {
    const heartsContainer = document.querySelector('.hearts-background');
    if (!heartsContainer) return;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = ['❤️', '💖', '💗', '💓'][Math.floor(Math.random() * 4)];
        heart.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            bottom: -50px;
            font-size: ${15 + Math.random() * 30}px;
            opacity: ${0.3 + Math.random() * 0.7};
            animation: float-hearts ${8 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        heartsContainer.appendChild(heart);
    }
}

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    dotsContainer.innerHTML = '';

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    setInterval(() => goToSlide(currentIndex + 1), 4000);
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float-hearts {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(20px); }
    }
    @keyframes pulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.1); }
    }
`;
document.head.appendChild(style);