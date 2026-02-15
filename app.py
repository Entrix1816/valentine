from flask import Flask, render_template, jsonify, session, send_from_directory
import requests
import random
import os
import mimetypes

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

#Fix MIME types for audio files
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('audio/mp4', '.m4a')
mimetypes.add_type('audio/mpeg', '.mpga')
# ===== YOUR SPECIFIC SONGS =====

# HOMEPAGE SONG
homepage_song = {
    "name": "Perfect - Ed Sheeran",
    "file": "Perfect.m4a"
}

# GIFT PAGE SONG (plays after clicking YES)
giftpage_song = {
    "name": "Thinking Out Loud - Ed Sheeran",
    "file": "Thinking out Loud.m4a"
}

# Carousel songs
carousel_song = {
    "name": "Feeling for You - Milky Chance",
     "file": "feeling_for_you.mp3"
}


# Miss me page song
missme_song = {
    "name": "Good For You - Selena Gomez",
    "file": "good_for_you.mp3"
}

# ===== 60+ RIZZ LINES =====
rizz_lines = [
    # Classic Romantic (1-10)
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

    # Sweet & Cute (11-20)
    "Are you a campfire? Because you're hot and I want s'more! 🔥",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you! 🩹",
    "Are you a time traveler? Because I see you in my future! ⏰",
    "Is your name Ariel? Because we mermaid for each other! 🧜‍♀️",
    "Are you a dictionary? Because you add meaning to my life! 📚",
    "Are you a bank loan? Because you have my interest! 💰",
    "Is your name Cinderella? Because whenever I see you, time flies! 👠",
    "Are you a snowstorm? Because you make my heart melt! ❄️",
    "Do you like Star Wars? Because Yoda one for me! 🌟",
    "Are you a camera? Because every time I look at you, I smile! 📸",

    # Modern & Funny (21-30)
    "Is your name Netflix? Because I could watch you for hours! 📺",
    "Are you a cat? Because you're purr-fect! 🐱",
    "Do you have a pencil? Because I want to erase your past and write our future! ✏️",
    "Are you a fruit? Because you're a fine-apple! 🍍",
    "Is your name Dunkin? Because you run on love and so do I! ☕",
    "Are you a light bulb? Because you brighten up my day! 💡",
    "Do you have a name, or can I call you mine? 💕",
    "Are you a beaver? Because da-am! 🦫",
    "Is your name Oreo? Because I want to twist, lick, and dunk you! 🍪",
    "Are you a pizza? Because I want a piece of you! 🍕",

    # Romantic & Deep (31-40)
    "If beauty were time, you'd be eternity. ⏳",
    "Your smile is the reason I believe in magic. ✨",
    "I must be a snowflake because I've fallen for you. ❄️",
    "You're the missing piece to my puzzle. 🧩",
    "If I had a star for every time you crossed my mind, I'd have a galaxy. 🌌",
    "You're the 'good' in good morning and the 'dream' in sweet dreams. 💭",
    "I didn't believe in love at first sight until I saw you. 👀",
    "You're the only exception to my 'no distractions' rule. 💖",
    "Every love song makes sense now that I've met you. 🎵",
    "You're the reason my heart beats a little faster. 💓",

    # Playful & Flirty (41-50)
    "Are you a keyboard? Because you're just my type! ⌨️",
    "Is your name Wi-Fi? Because I'm really feeling a connection! 📶",
    "Are you a bank? Because you have my interest! 💰",
    "Do you like raisins? How do you feel about a date? 📅",
    "Are you a parking ticket? 'FINE' is written all over you! 🎫",
    "Is your name Google Maps? Because you have everything I'm looking for! 🗺️",
    "Are you a campfire? Because you're hot and I can't resist! 🔥",
    "Do you have a name, or can I call you mine? 💘",
    "Are you a magician? Every time I look at you, everyone else disappears! 🎩",
    "Is your dad a boxer? Because you're a knockout! 🥊",

    # Extra Sweet (51-55)
    "You must be made of chocolate because you're sweet and I want more! 🍫",
    "Are you a star? Because your beauty lights up my universe. ⭐",
    "If you were a song, you'd be my favorite melody. 🎼",
    "You're the 'I love you' I never knew I was waiting to say. 💌",
    "Every moment with you feels like a fairytale coming true. 👑",

    # Cheesy but Cute (56-60)
    "Are you a candle? Because you light up my world! 🕯️",
    "Is your name TikTok? Because I could scroll through your photos for hours! 📱",
    "Are you a rainbow? Because you make life more colorful after the rain. 🌈",
    "Do you believe in love? Because I believe in us. 🤍",
    "You're the 'happy' in my ever after. 💕"
]


@app.route('/')
def index():
    session['rizz_count'] = 0
    return render_template('index.html')


@app.route('/get_homepage_song')
def get_homepage_song():
    """Returns the homepage background song"""
    return jsonify({'song': homepage_song})


@app.route('/get_giftpage_song')
def get_giftpage_song():
    """Returns the gift page background song"""
    return jsonify({'song': giftpage_song})


@app.route('/get_rizz')
def get_rizz():
    if 'rizz_count' in session:
        session['rizz_count'] = session.get('rizz_count', 0) + 1
    else:
        session['rizz_count'] = 1

    count = session.get('rizz_count', 0)
    show_want_more = count >= 5

    # Get random rizz from our 60+ lines
    rizz = random.choice(rizz_lines)

    # Try API for even more variety
    try:
        response = requests.get('https://vinuxd.vercel.app/api/pickup', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'pickup' in data:
                if random.random() < 0.3:
                    rizz = data['pickup']
    except:
        pass

    # Return ONLY rizz text - NO song file
    return jsonify({
        'rizz': rizz,
        'count': count,
        'show_want_more': show_want_more
    })


@app.route('/get_carousel_song')
def get_carousel_song():
    return jsonify({'song': carousel_song})


@app.route('/get_missme_song')
def get_missme_song():
    return jsonify({'song': missme_song})


@app.route('/yes')
def yes_page():
    return render_template('gift.html')


@app.route('/want-more')
def want_more_page():
    return render_template('wantmore.html')


@app.route('/miss-me')
def miss_me_page():
    return render_template('missme.html')


@app.route('/debug-music')
def debug_music():
    import os
    music_folder = os.path.join(app.static_folder, 'music')
    files = []
    if os.path.exists(music_folder):
        files = os.listdir(music_folder)

    return f"""
    <h2>Music Folder Debug</h2>
    <p>Static folder: {app.static_folder}</p>
    <p>Music folder: {music_folder}</p>
    <p>Folder exists: {os.path.exists(music_folder)}</p>
    <p>Files found: {len(files)}</p>
    <ul>
        {''.join([f'<li>{f} - {os.path.getsize(os.path.join(music_folder, f))} bytes</li>' for f in files])}
    </ul>
    <p>Looking for: feeling_for_you.mp3</p>
    <p>Found: {'feeling_for_you.mp3' in files}</p>
    """

@app.route('/static/music/<path:filename>')
def serve_music(filename):
    return send_from_directory('static/music', filename,
                              mimetype=mimetypes.guess_type(filename)[0] or 'audio/mpeg',
                              as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True)