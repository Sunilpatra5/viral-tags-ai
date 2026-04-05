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


// Logic Engine Data
const dictionary = {
    tech: { prefixes: ["Nex", "Byte", "Cyber", "Code", "Synth"], suffixes: ["Labs", "Cast", "Tech", "Space", "AI"] },
    gaming: { prefixes: ["Pixel", "Rage", "Game", "Loot", "Epic"], suffixes: ["Play", "GG", "Zone", "Nexus", "Quest"] },
    vlog: { prefixes: ["Real", "Daily", "Life", "True", "Vibe"], suffixes: ["Diaries", "Flow", "Moments", "Now", "Lens"] },
    edu: { prefixes: ["Smart", "Think", "Learn", "Brain", "Logic"], suffixes: ["Academy", "Ed", "Guide", "Focus", "Hub"] },
    beauty: { prefixes: ["Glow", "Glam", "Aura", "Luxe", "Pure"], suffixes: ["Style", "Chic", "Trends", "Beauty", "Looks"] },
    comedy: { prefixes: ["Laugh", "Joke", "Ha", "Crazy", "Wild"], suffixes: ["Clips", "Fun", "Show", "Banter", "Gags"] }
};

const genericWords = ["Nation", "Network", "Visions", "Media", "Digital", "Creator"];

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
            // Include Personal Name
            if (strategy > 0.5) name = `${personalName} ${s}`;
            else name = `${p} ${personalName}`;
        } else if (kw && Math.random() > 0.3) {
            // Use keyword
            if (strategy > 0.5) name = `${kw} ${s}`;
            else name = `${p} ${kw}`;
        } else {
            // General combination
            if (strategy > 0.6) name = `${p}${s}`;
            else if (strategy > 0.3) name = `${p} ${gen}`;
            else name = `${s} ${p}`;
        }

        // Title case formatting
        name = name.replace(/\b\w/g, l => l.toUpperCase());
        results.add(name);
    }
    
    return Array.from(results);
}

function generateTagline(name, niche, tone) {
    const formulas = [
        `The future of ${niche}, today.`,
        `Your daily dose of ${niche}.`,
        `Explore the ${name} universe.`,
        `Unlocking ${niche} secrets.`,
        `${name}: Elevate your game.`
    ];
    return formulas[Math.floor(Math.random() * formulas.length)];
}
