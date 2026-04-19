document.getElementById('generator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Gather Inputs
    const niche = document.getElementById('niche').value;
    const audience = document.getElementById('audience').value;
    const tone = document.getElementById('tone').value;
    const vibe = document.getElementById('vibe').value;
    const keywordsRaw = document.getElementById('keywords').value;
    const personalName = document.getElementById('personalName').value.trim();
    const platform = document.getElementById('platform').value;

    const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);

    // 2. Apply Theme based on Style Vibe (Style Engine)
    document.body.className = `theme-${vibe}`;

    // 3. Generate 15 Names
    const names = generateNames(niche, tone, keywords, personalName, 15);
    
    // Assign properties (score, handle)
    const processedNames = names.map(name => {
        const scoreRandom = Math.random();
        let scoreLabel = 'Low', scoreClass = 'score-low';
        let isAvail = Math.random() > 0.3; // 70% chance available

        if(scoreRandom > 0.6) { scoreLabel = 'High'; scoreClass = 'score-high'; }
        else if(scoreRandom > 0.2) { scoreLabel = 'Medium'; scoreClass = 'score-med'; }

        return {
            name: name,
            handle: '@' + name.replace(/\s+/g, '').toLowerCase() + (isAvail ? '' : Math.floor(Math.random()*99)),
            scoreLabel, scoreClass,
            available: isAvail,
            tagline: generateTagline(name, niche, tone)
        };
    });

    // 4. Sort and select Top 3
    processedNames.sort((a,b) => (a.scoreLabel === 'High' ? -1 : 1));
    const top3 = processedNames.slice(0, 3);
    const rest = processedNames.slice(3, 15);

    // 5. Render Top 3
    const topPicksContainer = document.getElementById('top-picks');
    topPicksContainer.innerHTML = '';
    top3.forEach(item => {
        let expl = `Combines high-retention phrasing ideal for ${niche.toUpperCase()} audiences.`;
        if (keywords.length > 0) expl = `Uses keyword synergy to target search intent.`;
        
        const card = document.createElement('div');
        card.className = 'top-pick-card';
        card.innerHTML = `
            <h3>${item.name}</h3>
            <span class="viral-score ${item.scoreClass}">Viral Potential: ${item.scoreLabel}</span>
            <p style="font-size: 0.9rem; margin-bottom: 8px;"><strong>Handle:</strong> ${item.handle} ${item.available ? '✅' : '⚠️'}</p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${expl}</p>
        `;
        topPicksContainer.appendChild(card);
    });

    // 6. Render Rest 12
    const nameListContainer = document.getElementById('name-list');
    nameListContainer.innerHTML = '';
    rest.forEach(item => {
        const div = document.createElement('div');
        div.className = 'name-item';
        div.innerHTML = `
            <div class="name-text">${item.name} <span style="font-size: 0.8rem; color: #aaa; margin-left:10px;">${item.handle}</span></div>
            <div class="avail-badge">${item.scoreLabel}</div>
        `;
        nameListContainer.appendChild(div);
    });

    // 7. Render Taglines & Logo Prompts
    const taglinesBox = document.getElementById('taglines-box');
    taglinesBox.innerHTML = '';
    top3.slice(0,2).forEach(item => {
        taglinesBox.innerHTML += `<div class="tagline-item">"${item.tagline}"</div>`;
    });

    const logoPromptBox = document.getElementById('logo-prompt');
    const visualVibe = vibe === 'trendy' ? 'Cyberpunk neon vector art, minimalist' : 
                       vibe === 'clean' ? 'Minimalist flat logo, whitespace, tech corporate' : 
                       'Bold pop-art emblem, highly detailed 3d render';
    logoPromptBox.innerHTML = `Create an iconic YouTube channel logo for "${top3[0].name}". Style: ${visualVibe}. Colors: Vibrant, contrasting. No intricate text, just an iconic brand symbol representing a ${niche} creator.`;

    // 8. Show Results & Scroll
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
});


// Logic Engine Data — All YouTube Categories
const dictionary = {
    // 🎮 Entertainment
    gaming:       { prefixes: ["Pixel", "Rage", "Game", "Loot", "Epic", "Boss", "Clutch", "Nova"], suffixes: ["Play", "GG", "Zone", "Nexus", "Quest", "Arena", "Legends", "Rush"] },
    comedy:       { prefixes: ["Laugh", "Joke", "Ha", "Crazy", "Wild", "Funny", "Wacky", "Giggles"], suffixes: ["Clips", "Fun", "Show", "Banter", "Gags", "Riot", "Buzz", "Central"] },
    roast:        { prefixes: ["Roast", "Burn", "Savage", "Fire", "Harsh", "Spicy", "Raw", "Real"], suffixes: ["Zone", "King", "Reacts", "Takes", "Squad", "Hour", "Alert", "Central"] },
    prank:        { prefixes: ["Prank", "Dare", "Stunt", "Bold", "Trick", "Shock", "Flash", "Chaos"], suffixes: ["Kings", "Masters", "Squad", "Crew", "Bros", "Gang", "Attack", "TV"] },
    animation:    { prefixes: ["Toon", "Pixel", "Draw", "Sketch", "Anime", "Frame", "Motion", "Chibi"], suffixes: ["World", "Studio", "Toons", "Lab", "Tales", "Verse", "Nation", "Art"] },
    shorts:       { prefixes: ["Quick", "Snap", "Flash", "Mini", "Rapid", "Viral", "Clip", "Reel"], suffixes: ["Bites", "Dose", "Cuts", "Gram", "Shorts", "Pop", "Hits", "Drop"] },
    asmr:         { prefixes: ["Whisper", "Calm", "Tingle", "Soft", "Dreamy", "Serene", "Gentle", "Cozy"], suffixes: ["Vibes", "ASMR", "Sounds", "Zone", "Bliss", "Waves", "Tingles", "Rest"] },

    // 📚 Education & Knowledge
    edu:          { prefixes: ["Smart", "Think", "Learn", "Brain", "Logic", "Bright", "Know", "Wise"], suffixes: ["Academy", "Ed", "Guide", "Focus", "Hub", "Class", "School", "Minds"] },
    finance:      { prefixes: ["Wealth", "Money", "Cash", "Stock", "Profit", "Bull", "Rich", "Fund"], suffixes: ["Talk", "Guru", "Wise", "Path", "Flow", "Vault", "Club", "Edge"] },
    science:      { prefixes: ["Cosmos", "Atom", "Astro", "Quantum", "Neuro", "Lab", "Bio", "Nova"], suffixes: ["Sphere", "Frontier", "Minds", "Quest", "World", "Base", "Plus", "Hub"] },
    history:      { prefixes: ["Past", "Ancient", "Era", "Legacy", "Time", "Epic", "Old", "Grand"], suffixes: ["Tales", "Archives", "Chronicles", "Files", "Story", "Vault", "Lens", "Docs"] },
    motivation:   { prefixes: ["Rise", "Grind", "Hustle", "Dream", "Goal", "Power", "Alpha", "Peak"], suffixes: ["Mindset", "Talk", "Fuel", "Fire", "Up", "Mode", "Shift", "Path"] },
    language:     { prefixes: ["Lingo", "Speak", "Word", "Fluent", "Vocab", "Talk", "Chat", "Poly"], suffixes: ["Lab", "Master", "Pro", "Easy", "Flow", "Bridge", "World", "Zone"] },
    news:         { prefixes: ["Live", "Flash", "Breaking", "Today", "Daily", "Hot", "Alert", "Now"], suffixes: ["Report", "Desk", "Wire", "Feed", "Pulse", "Watch", "Brief", "Cast"] },

    // 💻 Tech & Digital
    tech:         { prefixes: ["Nex", "Byte", "Cyber", "Code", "Synth", "Chip", "Digi", "Micro"], suffixes: ["Labs", "Cast", "Tech", "Space", "AI", "Byte", "Pulse", "Core"] },
    coding:       { prefixes: ["Code", "Dev", "Stack", "Bug", "Script", "Hack", "Git", "Debug"], suffixes: ["Craft", "Guru", "Lab", "Base", "Flow", "Path", "Ninja", "Camp"] },
    ai:           { prefixes: ["Neural", "Deep", "AI", "GPT", "Algo", "Tensor", "Data", "Model"], suffixes: ["Mind", "Net", "Brain", "Logic", "Hub", "Core", "Verse", "Lab"] },
    crypto:       { prefixes: ["Block", "Chain", "Token", "Coin", "Defi", "Web3", "Node", "Hash"], suffixes: ["Verse", "Mint", "Vault", "Edge", "Alpha", "Pulse", "Wave", "Pro"] },
    cybersecurity:{ prefixes: ["Shield", "Cyber", "Guard", "Lock", "Crypt", "Hack", "Fire", "Safe"], suffixes: ["Wall", "Sec", "Net", "Watch", "Ops", "Defense", "Matrix", "Layer"] },

    // 🎨 Creative & Arts
    art:          { prefixes: ["Canvas", "Paint", "Sketch", "Color", "Ink", "Draw", "Pixel", "Brush"], suffixes: ["Studio", "Works", "Gallery", "Lab", "Flow", "House", "Craft", "Spot"] },
    music:        { prefixes: ["Beat", "Melody", "Tune", "Sound", "Rhythm", "Note", "Echo", "Vibe"], suffixes: ["Wave", "Studio", "Box", "Craft", "Drop", "Hub", "Soul", "Jam"] },
    photography:  { prefixes: ["Lens", "Snap", "Focus", "Frame", "Shot", "Click", "Pixel", "Light"], suffixes: ["Studio", "Lab", "Craft", "Pro", "Vision", "Graphy", "Works", "Hub"] },
    diy:          { prefixes: ["Maker", "Craft", "Build", "Create", "Fix", "Handy", "Home", "Tool"], suffixes: ["Lab", "Hub", "Zone", "Works", "Master", "Craft", "Shop", "Pro"] },
    design:       { prefixes: ["Pixel", "Vector", "UI", "Design", "Grid", "Layout", "Proto", "Figma"], suffixes: ["Lab", "Studio", "Works", "Hub", "Craft", "Flow", "House", "Core"] },

    // 🏋️ Health & Lifestyle
    fitness:      { prefixes: ["Flex", "Iron", "Lift", "Swole", "Beast", "Fit", "Power", "Grind"], suffixes: ["Nation", "Core", "Lab", "Zone", "Strong", "Life", "Mode", "Hub"] },
    beauty:       { prefixes: ["Glow", "Glam", "Aura", "Luxe", "Pure", "Bloom", "Silk", "Radiant"], suffixes: ["Style", "Chic", "Trends", "Beauty", "Looks", "Vibes", "Queen", "Studio"] },
    cooking:      { prefixes: ["Chef", "Spice", "Taste", "Yummy", "Flavor", "Cook", "Kitchen", "Masala"], suffixes: ["Tales", "Bites", "Kitchen", "Lab", "House", "Table", "Grill", "Feast"] },
    vlog:         { prefixes: ["Real", "Daily", "Life", "True", "Vibe", "Soul", "My", "Desi"], suffixes: ["Diaries", "Flow", "Moments", "Now", "Lens", "Stories", "Reel", "Journal"] },
    travel:       { prefixes: ["Wander", "Nomad", "Globe", "Voyage", "Trek", "Roam", "Explore", "Atlas"], suffixes: ["Tales", "Bound", "Diary", "Quest", "Path", "Map", "Miles", "Trip"] },
    health:       { prefixes: ["Heal", "Vital", "Well", "Nourish", "Fresh", "Glow", "Life", "Pure"], suffixes: ["Path", "Hub", "Zone", "Coach", "Life", "Guide", "Plus", "Lab"] },
    yoga:         { prefixes: ["Zen", "Om", "Soul", "Inner", "Calm", "Peace", "Aura", "Flow"], suffixes: ["Yoga", "Balance", "Bliss", "Space", "Mind", "Journey", "Path", "Mantra"] },

    // 🚗 Vehicles & Sports
    cars:         { prefixes: ["Turbo", "Rev", "Speed", "Motor", "Drift", "Auto", "Gear", "Torque"], suffixes: ["Zone", "Drive", "Track", "Hub", "Nation", "Garage", "Club", "Works"] },
    sports:       { prefixes: ["Goal", "Score", "Pro", "Elite", "Champ", "Game", "Ace", "MVP"], suffixes: ["Zone", "Talk", "Arena", "Hub", "Daily", "Edge", "Central", "Live"] },
    cricket:      { prefixes: ["Sixer", "Wicket", "Stump", "Bat", "Over", "Pitch", "Run", "IPL"], suffixes: ["King", "Zone", "Talk", "Hub", "Guru", "World", "Show", "Central"] },
    football:     { prefixes: ["Goal", "Kick", "Striker", "Net", "FIFA", "Dribble", "Match", "Pitch"], suffixes: ["FC", "Zone", "Talk", "Arena", "King", "Hub", "Central", "Live"] },
    bikes:        { prefixes: ["Rider", "Moto", "Wheel", "Cruise", "Biker", "Road", "Throttle", "Vroom"], suffixes: ["Ride", "Gang", "Nation", "Hub", "Life", "Trail", "Zone", "Crew"] },

    // 👨‍👩‍👧 Family & Pets
    kids:         { prefixes: ["Little", "Tiny", "Happy", "Fun", "Play", "Kiddo", "Star", "Magic"], suffixes: ["World", "Land", "TV", "Zone", "Fun", "Joy", "Time", "Club"] },
    parenting:    { prefixes: ["Mom", "Dad", "Parent", "Family", "Super", "Home", "Baby", "Heart"], suffixes: ["Life", "Hub", "Talk", "Guide", "World", "Nest", "Care", "Circle"] },
    pets:         { prefixes: ["Paws", "Furry", "Woof", "Meow", "Pet", "Cuddle", "Buddy", "Tail"], suffixes: ["World", "Life", "Zone", "TV", "Club", "House", "Haven", "Tales"] },

    // 🔧 Business & Skills
    business:     { prefixes: ["Founder", "Start", "CEO", "Biz", "Scale", "Launch", "Growth", "Profit"], suffixes: ["Lab", "Hub", "Talk", "Edge", "Mind", "Club", "Path", "Zone"] },
    marketing:    { prefixes: ["Brand", "Viral", "Adz", "Click", "SEO", "Funnel", "Growth", "Lead"], suffixes: ["Lab", "Pro", "Hub", "Guru", "Talk", "Mind", "Edge", "Code"] },
    realestate:   { prefixes: ["Home", "Estate", "Prop", "Land", "Realty", "Build", "Dream", "Plot"], suffixes: ["King", "Hub", "Talk", "Guru", "Zone", "Pro", "Nest", "Club"] },
    farming:      { prefixes: ["Farm", "Green", "Agri", "Harvest", "Kisan", "Crop", "Root", "Seed"], suffixes: ["Life", "Land", "Hub", "World", "Talk", "Zone", "Fresh", "Base"] },
    astrology:    { prefixes: ["Star", "Zodiac", "Moon", "Mystic", "Karma", "Rashi", "Cosmic", "Graha"], suffixes: ["Guide", "Talk", "World", "Zone", "Guru", "Path", "Vision", "Vibes"] },
    unboxing:     { prefixes: ["Unbox", "Open", "First", "Box", "Fresh", "Reveal", "New", "Drop"], suffixes: ["Lab", "Zone", "Daily", "Hub", "Pro", "Verse", "King", "Review"] }
};

const genericWords = ["Nation", "Network", "Visions", "Media", "Digital", "Creator", "Official", "Studio", "Hub", "Central"];

// Generation Algorithm
function generateNames(niche, tone, keywords, personalName, count) {
    let results = new Set();
    const dict = dictionary[niche] || dictionary['vlog'];
    
    while(results.size < count) {
        let name = "";
        const strategy = Math.random();
        
        const p = dict.prefixes[Math.floor(Math.random() * dict.prefixes.length)];
        const s = dict.suffixes[Math.floor(Math.random() * dict.suffixes.length)];
        const gen = genericWords[Math.floor(Math.random() * genericWords.length)];
        
        let kw = "";
        if(keywords.length > 0) kw = keywords[Math.floor(Math.random() * keywords.length)];

        if (personalName && Math.random() > 0.5) {
            if (strategy > 0.7) name = `${personalName} ${s}`;
            else if (strategy > 0.4) name = `${p} ${personalName}`;
            else name = `${personalName} ${p} ${s}`;
        } else if (kw && Math.random() > 0.3) {
            if (strategy > 0.6) name = `${kw} ${s}`;
            else if (strategy > 0.3) name = `${p} ${kw}`;
            else name = `${kw} ${gen}`;
        } else {
            if (strategy > 0.7) name = `${p}${s}`;
            else if (strategy > 0.5) name = `${p} ${gen}`;
            else if (strategy > 0.3) name = `${s} ${p}`;
            else name = `The ${p} ${s}`;
        }

        // Title case formatting
        name = name.replace(/\b\w/g, l => l.toUpperCase());
        results.add(name);
    }
    
    return Array.from(results);
}

// Niche-specific tagline templates
const nicheTaglines = {
    gaming:       ["Level up your gaming", "Play hard, win harder", "Every game has a story"],
    comedy:       ["Laughter is the best content", "Making the world LOL", "Comedy that hits different"],
    roast:        ["No filter, no mercy", "Keeping it brutally real", "The truth, served hot"],
    prank:        ["You won't see it coming", "Expect the unexpected", "Pranks that break the internet"],
    animation:    ["Bringing imagination to life", "Frame by frame magic", "Where art meets motion"],
    shorts:       ["Quick content, big impact", "Viral in 60 seconds", "Short but iconic"],
    asmr:         ["Relax, listen, repeat", "Your daily dose of calm", "Tingles guaranteed"],
    edu:          ["Knowledge is power", "Learn something new daily", "Education made epic"],
    finance:      ["Master your money", "Building wealth, one video at a time", "Financial freedom starts here"],
    science:      ["Exploring the unknown", "Science made simple", "From atoms to galaxies"],
    history:      ["Stories from the past", "History comes alive here", "The past has answers"],
    motivation:   ["Rise and grind", "Your potential is unlimited", "Fuel your ambition"],
    language:     ["Speak the world", "Language unlocked", "Fluency starts here"],
    news:         ["Stay informed, stay ahead", "News without the noise", "The pulse of today"],
    tech:         ["Innovation never sleeps", "Future-proof your life", "Tech that matters"],
    coding:       ["Code the future", "From zero to developer", "Building the digital world"],
    ai:           ["Intelligence reimagined", "Where AI meets creativity", "The future is neural"],
    crypto:       ["Decentralize everything", "The blockchain revolution", "Web3 starts here"],
    cybersecurity:["Securing the digital world", "Your data, our mission", "Stay safe online"],
    art:          ["Every stroke tells a story", "Art without boundaries", "Create, inspire, repeat"],
    music:        ["Feel the rhythm", "Music speaks louder", "Every note matters"],
    photography:  ["Capturing moments that last", "See the world differently", "Through the lens of beauty"],
    diy:          ["Build it yourself", "Creativity has no rules", "Handmade with love"],
    design:       ["Design with purpose", "Pixels with passion", "Beautiful by design"],
    fitness:      ["No pain, no gain", "Stronger every day", "Fitness is a lifestyle"],
    beauty:       ["Glow from within", "Beauty redefined", "Your beauty journey starts here"],
    cooking:      ["Taste the passion", "Cooking made easy", "Every dish tells a story"],
    vlog:         ["Life, unfiltered", "Real stories, real vibes", "Living out loud"],
    travel:       ["Explore the unexplored", "Wander without limits", "The world is calling"],
    health:       ["Wellness is wealth", "Healthy mind, healthy life", "Your health journey"],
    yoga:         ["Find your inner peace", "Balance body and mind", "Breathe, stretch, grow"],
    cars:         ["Born to drive", "Speed meets passion", "Life in the fast lane"],
    sports:       ["Game on!", "Passion meets performance", "For the love of the game"],
    cricket:      ["Cricket is life", "Every ball counts", "Howzat!"],
    football:     ["The beautiful game", "Goals that inspire", "Football never stops"],
    bikes:        ["Born to ride", "Two wheels, infinite freedom", "Ride or die"],
    kids:         ["Fun never stops", "Learning with a smile", "A world of wonder"],
    parenting:    ["Raising them right", "Parenting made easier", "For super parents"],
    pets:         ["Paws and love", "Every pet has a story", "Fur-ever friends"],
    business:     ["Build your empire", "From idea to IPO", "Hustle smart"],
    marketing:    ["Growth unlocked", "Marketing that converts", "Brand building 101"],
    realestate:   ["Your dream home awaits", "Property made simple", "Invest in real estate"],
    farming:      ["From farm to future", "Growing with nature", "Agriculture matters"],
    astrology:    ["Stars don't lie", "Written in the stars", "Your cosmic guide"],
    unboxing:     ["What's inside?", "First look, first impressions", "Unbox the hype"]
};

function generateTagline(name, niche, tone) {
    const nicheSpecific = nicheTaglines[niche] || nicheTaglines['vlog'];
    const genericFormulas = [
        `Explore the ${name} universe.`,
        `${name}: Elevate your vibe.`
    ];
    const all = [...nicheSpecific, ...genericFormulas];
    return all[Math.floor(Math.random() * all.length)];
}
