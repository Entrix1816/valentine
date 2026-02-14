from flask import Flask, render_template, jsonify
import requests
import random

app = Flask(__name__)

# Extended list of pickup lines/rizz
rizz_lines = [
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
    "Are you a dictionary? Because you add meaning to my life! 📚",
    "Are you a bank loan? Because you have my interest! 💰",
    "Is your name Cinderella? Because whenever I see you, time flies! 👠",
    "Are you a snowstorm? Because you make my heart cold... just kidding, you make it melt! ❄️",
    "Do you like Star Wars? Because Yoda one for me! 🌟",
    "Are you a camera? Because every time I look at you, I smile! 📸",
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
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_rizz')
def get_rizz():
    # Try multiple APIs for pickup lines
    apis = [
        'https://vinuxd.vercel.app/api/pickup',
        'https://api.luciferking.ml/api/pickuplines',
        'https://api.popcat.xyz/pickuplines'
    ]

    for api in apis:
        try:
            response = requests.get(api, timeout=5)
            if response.status_code == 200:
                data = response.json()
                # Handle different API response formats
                if isinstance(data, dict):
                    if 'pickup' in data:
                        return jsonify({'rizz': data['pickup']})
                    elif 'line' in data:
                        return jsonify({'rizz': data['line']})
                    elif 'pickup_line' in data:
                        return jsonify({'rizz': data['pickup_line']})
                elif isinstance(data, list) and len(data) > 0:
                    if isinstance(data[0], dict):
                        if 'line' in data[0]:
                            return jsonify({'rizz': data[0]['line']})
                        elif 'pickup' in data[0]:
                            return jsonify({'rizz': data[0]['pickup']})
                    else:
                        return jsonify({'rizz': random.choice(data)})
        except Exception as e:
            print(f"Error with API {api}: {e}")
            continue

    # Fallback to local rizz lines
    return jsonify({'rizz': random.choice(rizz_lines)})

@app.route('/yes')
def yes_page():
    return render_template('gift.html')

if __name__ == '__main__':
    app.run(debug=True)