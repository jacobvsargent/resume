class WikipediaArticle {
    constructor(title, words, views, links, buyValue = null, sellValue = null) {
        this.title = title;
        this.words = words;
        this.views = views;
        this.links = links;
        this.buyValue = buyValue || Math.floor(Math.random() * 5) + 5; // 6-10 tokens
        this.sellValue = sellValue || Math.floor(this.buyValue * 0.6); // 60% of buy value
        this.revealed = {
            words: false,
            views: false,
            links: false
        };
    }

    clone() {
        const cloned = new WikipediaArticle(this.title, this.words, this.views, this.links, this.buyValue, this.sellValue);
        cloned.revealed = { ...this.revealed };
        return cloned;
    }
}

// Event types
const EVENT_TYPES = {
    BATTLE: 'battle',
    SPECIAL_EVENT: 'special_event',
    SHOP: 'shop',
    BOSS: 'boss'
};

// Sample Wikipedia articles with realistic stats
const articlePool = [
    new WikipediaArticle("United States", 4500, 950000, 420),
    new WikipediaArticle("Van Halen", 1330, 28400, 72),
    new WikipediaArticle("Giraffe", 745, 13456, 29),
    new WikipediaArticle("Tsagaan-Uul District", 421, 392, 12),
    new WikipediaArticle("Photosynthesis", 840, 21753, 43),
    new WikipediaArticle("Black Holes", 1532, 38762, 112),
    new WikipediaArticle("World War II", 2431, 49821, 158),
    new WikipediaArticle("Mount Everest", 960, 14532, 51),
    new WikipediaArticle("Python (programming language)", 2180, 68241, 203),
    new WikipediaArticle("Quantum Mechanics", 2111, 35211, 94),
    new WikipediaArticle("Internet", 2388, 80315, 187),
    new WikipediaArticle("Gravitational Wave", 1104, 15428, 37),
    new WikipediaArticle("K-pop", 1120, 24122, 52),
    new WikipediaArticle("French Revolution", 1345, 19328, 76),
    new WikipediaArticle("Mariana Trench", 1231, 11922, 48),
    new WikipediaArticle("Lawn Mower Racing", 410, 891, 9),
    new WikipediaArticle("North Korea", 2080, 49183, 105),
    new WikipediaArticle("Banana", 680, 15723, 21),
    new WikipediaArticle("Renaissance", 1754, 23094, 77),
    new WikipediaArticle("Battle of Hastings", 995, 18300, 41),
    new WikipediaArticle("Fortnite", 1220, 42332, 96),
    new WikipediaArticle("Keanu Reeves", 910, 24110, 44),
    new WikipediaArticle("Toothpaste", 400, 7411, 17),
    new WikipediaArticle("Solar System", 1205, 28941, 56),
    new WikipediaArticle("List of Unusual Deaths", 890, 7343, 26),
    new WikipediaArticle("Yurt", 533, 4821, 14),
    new WikipediaArticle("Artificial Intelligence", 2261, 60127, 142),
    new WikipediaArticle("Blue-Ringed Octopus", 687, 8123, 28),
    new WikipediaArticle("Dust Bowl", 1033, 13092, 33),
    new WikipediaArticle("Pluto (dwarf planet)", 1122, 21432, 51),
    new WikipediaArticle("Coca-Cola", 1303, 39814, 62),
    new WikipediaArticle("Borat", 780, 22433, 39),
    new WikipediaArticle("List of People Who Disappeared Mysteriously", 1020, 13771, 27),
    new WikipediaArticle("The Simpsons", 1420, 31542, 65),
    new WikipediaArticle("DIY Biohacking", 550, 2920, 11),
    new WikipediaArticle("Mongolian Throat Singing", 488, 5133, 18),
    new WikipediaArticle("Game Boy Advance", 990, 15430, 36),
    new WikipediaArticle("Neural Networks", 1381, 32942, 82),
    new WikipediaArticle("Chernobyl Disaster", 1642, 28971, 67),
    new WikipediaArticle("Avril Lavigne", 970, 19810, 40),
    new WikipediaArticle("Shoelace Knot", 305, 2134, 8),
    new WikipediaArticle("Quantum Entanglement", 1508, 17921, 46),
    new WikipediaArticle("Tofu", 460, 6312, 19),
    new WikipediaArticle("Eiffel Tower", 1190, 27451, 49),
    new WikipediaArticle("Bagel", 610, 9021, 16),
    new WikipediaArticle("Waffle House Index", 367, 1411, 10)
];

// Difficulty levels
const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    BOSS: 'boss'
};

class PerkCard {
    constructor(title, playable, oneTime, effect, buyValue = null, sellValue = null) {
        this.title = title;
        this.playable = playable;
        this.oneTime = oneTime;
        this.effect = effect;
        this.buyValue = buyValue || Math.floor(Math.random() * 8) + 3; // 3-10 tokens
        this.sellValue = sellValue || Math.floor(this.buyValue * 0.5); // 50% of buy value
    }

    clone() {
        return new PerkCard(this.title, this.playable, this.oneTime, this.effect, this.buyValue, this.sellValue);
    }
}

const perkPool = [
    new PerkCard("Wordsworth", false, false, "Multiply your card's Words count by 1.5x"),
    new PerkCard("One-Hit Wonder", true, true, "Immediately win a Words battle once"),
    // Add more perks here...
];

let gameState = {
    round: 1,
    wins: 0,
    score: 0,
    tokens: 5,
    playerCards: [],
    opponentCards: [],
    playerSlots: { words: null, views: null, links: null },
    opponentSlots: { words: null, views: null, links: null },
    battleInProgress: false,
    gameMap: [],
    currentEventIndex: 0
};

function generateGameMap() {
    const map = [];
    
    // Generate 100 events
    for (let i = 0; i < 100; i++) {
        if (i === 0) {
            // First event is always an easy battle
            map.push({ type: EVENT_TYPES.BATTLE, difficulty: DIFFICULTY.EASY });
        } else if ((i + 1) % 10 === 0) {
            // Every 10th event is a boss
            map.push({ type: EVENT_TYPES.BOSS, difficulty: DIFFICULTY.BOSS });
        } else {
            // Random distribution for other events
            const rand = Math.random();
            if (rand < 0.6) {
                // 60% battles with varying difficulty
                const difficultyRand = Math.random();
                let difficulty;
                if (difficultyRand < 0.4) difficulty = DIFFICULTY.EASY;
                else if (difficultyRand < 0.7) difficulty = DIFFICULTY.MEDIUM;
                else difficulty = DIFFICULTY.HARD;
                
                map.push({ type: EVENT_TYPES.BATTLE, difficulty });
            } else if (rand < 0.8) {
                // 20% special events
                map.push({ type: EVENT_TYPES.SPECIAL_EVENT });
            } else {
                // 20% shops
                map.push({ type: EVENT_TYPES.SHOP });
            }
        }
    }

    // Logging
    map.forEach((event, index) => {
        let description = `${index + 1}: `;
        switch (event.type) {
            case EVENT_TYPES.BATTLE:
                description += `battle (${event.difficulty.toLowerCase()})`;
                break;
            case EVENT_TYPES.BOSS:
                description += `boss (${event.difficulty.toLowerCase()})`;
                break;
            case EVENT_TYPES.SPECIAL_EVENT:
                description += `special event`;
                break;
            case EVENT_TYPES.SHOP:
                description += `shop`;
                break;
            default:
                description += `unknown`;
        }
        console.log(description + ';');
    });
    
    return map;
}

function updateMapDisplay() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = '';
    
    // Show current position and next 3 events
    const startIndex = gameState.currentEventIndex;
    const endIndex = Math.min(startIndex + 4, gameState.gameMap.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const event = gameState.gameMap[i];
        const isFirst = i === startIndex;
        
        // Create map icon
        const mapIcon = document.createElement('div');
        mapIcon.className = `map-icon ${isFirst ? 'current' : 'upcoming'}`;
        
        // Set icon based on event type
        let iconText = '';
        switch (event.type) {
            case EVENT_TYPES.BATTLE:
                iconText = '⚔️';
                break;
            case EVENT_TYPES.BOSS:
                iconText = '👑';
                break;
            case EVENT_TYPES.SPECIAL_EVENT:
                iconText = '❓';
                break;
            case EVENT_TYPES.SHOP:
                iconText = '🛒';
                break;
        }
        
        mapIcon.textContent = iconText;
        mapContainer.appendChild(mapIcon);
        
        // Add connector if not the last icon
        if (i < endIndex - 1) {
            const connector = document.createElement('div');
            connector.className = 'map-connector';
            mapContainer.appendChild(connector);
        }
    }
}

function showCurrentEvent() {
    const currentEvent = gameState.gameMap[gameState.currentEventIndex];
    
    // Hide all screens first
    document.getElementById('battle-screen').style.display = 'none';
    document.getElementById('event-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'none';
    
    switch (currentEvent.type) {
        case EVENT_TYPES.BATTLE:
        case EVENT_TYPES.BOSS:
            showBattleScreen(currentEvent);
            break;
        case EVENT_TYPES.SPECIAL_EVENT:
            showEventScreen();
            break;
        case EVENT_TYPES.SHOP:
            showShopScreen();
            break;
    }
}

function showBattleScreen(event) {
    document.getElementById('battle-screen').style.display = 'block';
    
    // Update difficulty display
    const difficultyElement = document.getElementById('difficulty-level');
    const difficultyContainer = document.getElementById('battle-difficulty');

    if (difficultyElement) {
        difficultyElement.textContent = event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1);
        difficultyContainer.className = `battle-difficulty difficulty-${event.difficulty}`;
    }
    
    // Deal cards for this battle
    dealCards();
    
    // Show sell zone
    showSellZone();
}

function showEventScreen() {
    const eventScreen = document.getElementById('event-screen');
    eventScreen.style.display = 'block';
    const title = document.getElementById('event-title');
    const desc = document.getElementById('event-description');
    title.textContent = 'Special Event';
    desc.textContent = 'You found a rare Wikipedia article! Drag it into your hand if you want to keep it.';
    
    // Initialize reroll count if not exists
    if (gameState.rerollCount === undefined) {
        gameState.rerollCount = 3;
    }
    
    // Remove existing special card if any
    const oldCard = document.getElementById('event-special-card');
    if (oldCard) oldCard.remove();
    // Remove temp hand if it exists
    const oldHand = document.getElementById('event-player-hand');
    if (oldHand) oldHand.remove();
    // Create new special card
    const isPerk = Math.random() < 0.5;
    const specialCard = isPerk ? perkPool[Math.floor(Math.random() * perkPool.length)].clone()
                           : getRandomArticles(1)[0];
    const specialCardElement = createCardElement(specialCard, true);
    specialCardElement.id = 'event-special-card';
    specialCardElement.classList.add('animated-pop-in');
    // Create temporary player hand display
    const handContainer = document.createElement('div');
    handContainer.id = 'event-player-hand';
    handContainer.className = 'player-hand';
    handContainer.ondrop = (e) => {
        e.preventDefault();
        let { title: cardTitle, type: cardType } = JSON.parse(e.dataTransfer.getData('text/plain'));
        // Check if already in hand
        if (gameState.playerCards.some(card => card.title === cardTitle)) return;
        if (gameState.playerCards.length >= 7) {
            alert("Your hand is full! Max 7 cards.");
            return;
        }
        // Clone and add to player's hand
        let card;
        if (cardType === 'article') {
            card = articlePool.find(a => a.title === cardTitle)?.clone();
        } else if (cardType === 'perk') {
            card = perkPool.find(p => p.title === cardTitle)?.clone();
        }
        if (card) {
            gameState.playerCards.push(card);
            // Add card visually
            const cardEl = createCardElement(card, true);
            handContainer.appendChild(cardEl);
            // Remove special card
            const toRemove = document.getElementById('event-special-card');
            if (toRemove) toRemove.remove();
            // Remove reroll button when card is taken
            const rerollBtn = document.getElementById('reroll-btn');
            if (rerollBtn) rerollBtn.remove();
        }
    };
    handContainer.ondragover = (e) => e.preventDefault();
    // Add current hand cards
    gameState.playerCards.forEach(card => {
        const cardElement = createCardElement(card, true);
        handContainer.appendChild(cardElement);
    });
    // Insert special card and hand above Continue button
    const continueBtn = document.getElementById('event-continue-btn');
    
    // Create/Update Reroll button
    let rerollBtn = document.getElementById('reroll-btn');
    if (rerollBtn) rerollBtn.remove(); // Remove existing button
    
    if (gameState.rerollCount > 0) {
        rerollBtn = document.createElement('button');
        rerollBtn.textContent = `Reroll ${gameState.rerollCount}X`;
        rerollBtn.className = 'button';
        rerollBtn.id = 'reroll-btn';
        rerollBtn.onclick = () => {
            gameState.rerollCount--;
            showEventScreen();
        };
        eventScreen.insertBefore(rerollBtn, continueBtn);
    }
    
    eventScreen.insertBefore(specialCardElement, continueBtn);
    eventScreen.insertBefore(handContainer, continueBtn);
    
    // Show sell zone
    showSellZone();
}

function showShopScreen() {
    document.getElementById('shop-screen').style.display = 'block';
    document.getElementById('shop-title').textContent = '🛒 Shop';
    document.getElementById('shop-description').textContent = 'This is a shop placeholder.';
    
    // Show sell zone
    showSellZone();
}

function showSellZone() {
    // Create sell zone if it doesn't exist
    let sellZone = document.getElementById('sell-zone');
    if (!sellZone) {
        sellZone = document.createElement('div');
        sellZone.id = 'sell-zone';
        sellZone.className = 'sell-zone';
        sellZone.innerHTML = 'SELL';
        sellZone.ondragover = allowDrop;
        sellZone.ondrop = sellCard;
        document.body.appendChild(sellZone);
    }
    sellZone.style.display = 'block';
}

function hideSellZone() {
    const sellZone = document.getElementById('sell-zone');
    if (sellZone) {
        sellZone.style.display = 'none';
    }
}

function sellCard(event) {
    event.preventDefault();
    event.target.classList.remove('drag-over');
    
    // Get card data
    let dragData;
    try {
        dragData = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch {
        dragData = { title: event.dataTransfer.getData('text/plain'), type: 'article' };
    }
    
    const cardTitle = dragData.title;
    
    // Find and remove card from player's collection
    let soldCard = null;
    
    // Check slots first
    for (const [slot, card] of Object.entries(gameState.playerSlots)) {
        if (card && card.title === cardTitle) {
            soldCard = card;
            gameState.playerSlots[slot] = null;
            break;
        }
    }
    
    // Check hand if not found in slots
    if (!soldCard) {
        const cardIndex = gameState.playerCards.findIndex(card => card.title === cardTitle);
        if (cardIndex !== -1) {
            soldCard = gameState.playerCards.splice(cardIndex, 1)[0];
        }
    }
    
    if (soldCard) {
        // Add tokens
        gameState.tokens += soldCard.sellValue;
        
        // Update UI
        updateStats();
        renderPlayerSlots();
        renderPlayerHand();
        updateBattleButtonState();
        
        // Show feedback
        showSellFeedback(soldCard);
    }
}

function showSellFeedback(card) {
    const feedback = document.createElement('div');
    feedback.className = 'sell-feedback';
    feedback.textContent = `+${card.sellValue} tokens`;
    feedback.style.position = 'fixed';
    feedback.style.bottom = '120px';
    feedback.style.right = '50px';
    feedback.style.backgroundColor = '#4CAF50';
    feedback.style.color = 'white';
    feedback.style.padding = '10px';
    feedback.style.borderRadius = '5px';
    feedback.style.zIndex = '1000';
    feedback.style.animation = 'fadeInUp 0.5s, fadeOut 0.5s 1.5s';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function getRandomArticles(count) {
    const shuffled = [...articlePool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(article => article.clone());
}

// Fixed card creation with proper hover functionality
function createCardElement(card, isPlayer = true) {
    const isPerk = card instanceof PerkCard;
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (isPlayer) {
        cardEl.draggable = true;
        cardEl.ondragstart = (e) => dragStart(e, card);
    }

    // Create tooltip content
    let tooltipContent = '';
    if (isPerk) {
        tooltipContent = `
            <div><strong>Playable:</strong> ${card.playable ? 'Yes' : 'No'}</div>
            <div><strong>One-Time:</strong> ${card.oneTime ? 'Yes' : 'No'}</div>
            <div><strong>Effect:</strong> ${card.effect}</div>
            <div><strong>Buy:</strong> ${card.buyValue} tokens</div>
            <div><strong>Sell:</strong> ${card.sellValue} tokens</div>
        `;
    } else {
        // For articles, show revealed stats or "???"
        const wordsText = card.revealed.words ? card.words.toLocaleString() : '???';
        const viewsText = card.revealed.views ? card.views.toLocaleString() : '???';
        const linksText = card.revealed.links ? card.links.toString() : '???';
        
        tooltipContent = `
            <div><strong>Words:</strong> ${wordsText}</div>
            <div><strong>Views:</strong> ${viewsText}</div>
            <div><strong>Links:</strong> ${linksText}</div>
            <div><strong>Buy:</strong> ${card.buyValue} tokens</div>
            <div><strong>Sell:</strong> ${card.sellValue} tokens</div>
        `;
    }

    cardEl.innerHTML = `
        <div class="card-title">${card.title}</div>
        <div class="card-tooltip">${tooltipContent}</div>
    `;

    // Style perk cards differently
    if (isPerk) {
        cardEl.classList.add('perk-card');
        if (card.oneTime) {
            cardEl.classList.add('one-time');
        }
    }
    return cardEl;
}

function dealCards() {
    // Only deal new player cards if they don't exist (first round or after game over)
    if (gameState.playerCards.length === 0) {
        gameState.playerCards = getRandomArticles(3);
    }
    
    // Always deal new opponent cards
    gameState.opponentCards = getRandomArticles(3);
    
    // Clear previous cards from hand
    const playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';
    
    // Display player cards (add cards that aren't in slots back to hand)
    gameState.playerCards.forEach(article => {
        // Check if this card is currently in a slot
        const inSlot = Object.values(gameState.playerSlots).some(slotCard => 
            slotCard && slotCard.title === article.title
        );
        
        // Only add to hand if not in a slot
        if (!inSlot) {
            const cardElement = createCardElement(article, true);
            playerHand.appendChild(cardElement);
        }
    });
    
    // Place opponent cards randomly
    const slots = ['words', 'views', 'links'];
    const shuffledSlots = [...slots].sort(() => 0.5 - Math.random());
    
    gameState.opponentCards.forEach((article, index) => {
        const slot = shuffledSlots[index];
        gameState.opponentSlots[slot] = article;
        const slotElement = document.getElementById(`opp-${slot}`);
        slotElement.innerHTML = '';
        const opponentCard = createCardElement(article, false);
        slotElement.appendChild(opponentCard);
    });
    
    // Reset battle state
    gameState.battleInProgress = false;
    document.getElementById('battle-btn').disabled = true;
    document.getElementById('battle-btn').style.display = 'inline-block';
    
    // Hide results
    document.getElementById('battle-result').style.display = 'none';
    document.getElementById('next-round-btn').style.display = 'none';
    document.getElementById('new-game-btn').style.display = 'none';
}

function dragStart(event, card) {
    const type = card instanceof PerkCard ? 'perk' : 'article';
    event.dataTransfer.setData('text/plain', JSON.stringify({ title: card.title, type }));
    event.target.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('drag-over');
}

function drop(event, slotType) {
    event.preventDefault();
    event.target.classList.remove('drag-over');

    // Retrieve drag data
    let dragData;
    try {
        dragData = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch {
        dragData = { title: event.dataTransfer.getData('text/plain'), type: 'article' };
    }
    const cardTitle = dragData.title;

    // Find the actual card object and its source location
    let actualCard = null;
    let sourceLocation = null;

    // Check if dragging from a slot
    for (const [slot, card] of Object.entries(gameState.playerSlots)) {
        if (card && card.title === cardTitle) {
            actualCard = card;
            sourceLocation = { type: 'slot', slot };
            break;
        }
    }

    // If not found in slots, check hand
    if (!actualCard) {
        actualCard = gameState.playerCards.find(card => card.title === cardTitle);
        if (actualCard) {
            sourceLocation = { type: 'hand' };
        }
    }

    // If still not found, abort
    if (!actualCard) return;

    // If there's already a card in the drop slot, swap it back to source
    const existingCard = gameState.playerSlots[slotType];
    if (existingCard) {
        if (sourceLocation.type === 'slot') {
            gameState.playerSlots[sourceLocation.slot] = existingCard;
        } else {
            // Add back to hand if dragging from hand
            if (!gameState.playerCards.find(c => c.title === existingCard.title)) {
                gameState.playerCards.push(existingCard);
            }
        }
    }

    // Place the dragged card into the new slot
    gameState.playerSlots[slotType] = actualCard;

    // Remove from original location
    if (sourceLocation.type === 'slot') {
        gameState.playerSlots[sourceLocation.slot] = null;
    } else {
        gameState.playerCards = gameState.playerCards.filter(c => c.title !== cardTitle);
    }

    // Refresh UI
    renderPlayerSlots();
    renderPlayerHand();
    updateBattleButtonState();
}

function applyPassivePerks() {
    for (const card of gameState.playerCards) {
        if (card instanceof PerkCard && !card.playable) {
            if (card.title === "Wordsworth") {
                // Multiply words of all slotted cards
                for (const slot of ['words', 'views', 'links']) {
                    const cardInSlot = gameState.playerSlots[slot];
                    if (cardInSlot) {
                        cardInSlot.words = Math.floor(cardInSlot.words * 1.5);
                        cardInSlot.revealed.words = true; // ensure visible
                    }
                }
            }

            // TODO: Add other passive perk effects here
        }
    }
}

function startBattle() {
    if (gameState.battleInProgress) return;

    applyPassivePerks()
    
    gameState.battleInProgress = true;
    document.getElementById('battle-btn').style.display = 'none';
    
    const results = [];
    const slots = ['words', 'views', 'links'];
    
    slots.forEach(slot => {
        const playerCard = gameState.playerSlots[slot];
        const opponentCard = gameState.opponentSlots[slot];
        
        let playerWins = false;
        let comparison = '';
        
        if (slot === 'words') {
            playerWins = playerCard.words > opponentCard.words;
            comparison = `${playerCard.words.toLocaleString()} vs ${opponentCard.words.toLocaleString()}`;
        } else if (slot === 'views') {
            playerWins = playerCard.views > opponentCard.views;
            comparison = `${playerCard.views.toLocaleString()} vs ${opponentCard.views.toLocaleString()}`;
        } else if (slot === 'links') {
            playerWins = playerCard.links > opponentCard.links;
            comparison = `${playerCard.links} vs ${opponentCard.links}`;
        }
        
        results.push({
            slot,
            playerWins,
            comparison,
            playerCard: playerCard.title,
            opponentCard: opponentCard.title
        });
    });
    
    // Display results
    displayBattleResults(results);
    
    // Calculate winner
    const playerWins = results.filter(r => r.playerWins).length;
    const roundWon = playerWins >= 2;
    
    if (roundWon) {
        gameState.wins++;
        gameState.score += gameState.round * 100;
        
        // Reveal one attribute on one of the player's cards
        revealRandomAttribute();
        
        document.getElementById('next-round-btn').style.display = 'inline-block';
    } else {
        // Game over
        document.getElementById('new-game-btn').style.display = 'inline-block';
        document.getElementById('final-rounds').textContent = gameState.round;
        document.getElementById('game-over').style.display = 'block';
    }
}

function revealRandomAttribute() {
    // Get all player cards (both in slots and hand)
    const allPlayerCards = [...gameState.playerCards, ...Object.values(gameState.playerSlots).filter(card => card !== null)];
    
    // Find cards with unrevealed attributes
    const cardsWithHiddenAttributes = allPlayerCards.filter(card => {
        return !card.revealed.words || !card.revealed.views || !card.revealed.links;
    });
    
    if (cardsWithHiddenAttributes.length > 0) {
        // Pick a random card
        const randomCard = cardsWithHiddenAttributes[Math.floor(Math.random() * cardsWithHiddenAttributes.length)];
        
        // Find hidden attributes
        const hiddenAttributes = [];
        if (!randomCard.revealed.words) hiddenAttributes.push('words');
        if (!randomCard.revealed.views) hiddenAttributes.push('views');
        if (!randomCard.revealed.links) hiddenAttributes.push('links');
        
        // Reveal a random attribute
        if (hiddenAttributes.length > 0) {
            const randomAttribute = hiddenAttributes[Math.floor(Math.random() * hiddenAttributes.length)];
            randomCard.revealed[randomAttribute] = true;

            // Update the visual representation immediately
            updateCardVisuals(randomCard);
        }
    }
}

function displayBattleResults(results) {
    const battleResult = document.getElementById('battle-result');
    const resultGrid = document.getElementById('result-grid');
    const overallResult = document.getElementById('overall-result');
    
    resultGrid.innerHTML = '';
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.playerWins ? 'result-win' : 'result-lose'}`;
        resultItem.innerHTML = `
            <strong>${result.slot.toUpperCase()}</strong><br>
            ${result.playerWins ? '✅ WIN' : '❌ LOSE'}<br>
            <small>${result.comparison}</small>
        `;
        resultGrid.appendChild(resultItem);
        
        // Highlight winning/losing cards
        const playerSlot = document.getElementById(`player-${result.slot}`);
        const opponentSlot = document.getElementById(`opp-${result.slot}`);
        
        if (result.playerWins) {
            playerSlot.querySelector('.card').classList.add('winner');
            opponentSlot.querySelector('.card').classList.add('loser');
        } else {
            playerSlot.querySelector('.card').classList.add('loser');
            opponentSlot.querySelector('.card').classList.add('winner');
        }
    });
    
    const playerWins = results.filter(r => r.playerWins).length;
    const roundWon = playerWins >= 2;
    
    overallResult.innerHTML = `
        <h4>${roundWon ? '🎉 Victory!' : '💀 Defeat!'}</h4>
        <p>You won ${playerWins}/3 battles</p>
    `;
    
    battleResult.style.display = 'block';
}

function nextRound() {
    gameState.round++;
    gameState.currentEventIndex++;
    gameState.battleInProgress = false;
    
    // Check if game is complete
    if (gameState.currentEventIndex >= gameState.gameMap.length) {
        // Player completed all events - victory!
        document.getElementById('final-rounds').textContent = gameState.round - 1;
        document.getElementById('game-over').style.display = 'block';
        return;
    }
    
    // Reset opponent slots
    gameState.opponentSlots = { words: null, views: null, links: null };

    // Move player's slotted cards back to hand and clear player slots
    for (const slot of ['words', 'views', 'links']) {
        const card = gameState.playerSlots[slot];
        if (card && !gameState.playerCards.includes(card)) {
            gameState.playerCards.push(card);
        }
        gameState.playerSlots[slot] = null;

        // Clear slot visuals
        const playerSlot = document.getElementById(`player-${slot}`);
        playerSlot.innerHTML = '';

        const opponentSlot = document.getElementById(`opp-${slot}`);
        opponentSlot.innerHTML = '';
    }

    // Rebuild the hand display
    const playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';
    gameState.playerCards.forEach(article => {
        const cardElement = createCardElement(article, true);
        playerHand.appendChild(cardElement);
    });

    // Hide results and buttons
    document.getElementById('battle-result').style.display = 'none';
    document.getElementById('next-round-btn').style.display = 'none';
    document.getElementById('new-game-btn').style.display = 'none';
    
    // Remove winner/loser styling from previous round
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('winner', 'loser');
    });
    
    updateStats();
    updateMapDisplay();
    showCurrentEvent();
}

function updateStats() {
    document.getElementById('round').textContent = gameState.round;
    document.getElementById('tokens').textContent = gameState.tokens;
}
function restartGame() {
    gameState = {
        round: 1,
        wins: 0,
        score: 0,
        tokens: 5,
        playerCards: [],
        opponentCards: [],
        playerSlots: { words: null, views: null, links: null },
        opponentSlots: { words: null, views: null, links: null },
        battleInProgress: false,
        gameMap: generateGameMap(),
        currentEventIndex: 0
    };
    
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('battle-result').style.display = 'none';
    document.getElementById('next-round-btn').style.display = 'none';
    document.getElementById('new-game-btn').style.display = 'none';
    
    // Clear slots
    ['words', 'views', 'links'].forEach(slot => {
        const playerSlot = document.getElementById(`player-${slot}`);
        const opponentSlot = document.getElementById(`opp-${slot}`);
        playerSlot.innerHTML = '';
        opponentSlot.innerHTML = '';
    });
    
    // Hide sell zone when game restarts
    hideSellZone();
    
    updateStats();
    updateMapDisplay();
    showCurrentEvent();
}

// Update the updateCardVisuals function to use the new createCardElement
function updateCardVisuals(updatedCard) {
    // Update card in player hand
    renderPlayerHand();
    
    // Update card in player slots
    renderPlayerSlots();
}

// Add missing render functions
function renderPlayerSlots() {
    ['words', 'views', 'links'].forEach(slot => {
        const slotElement = document.getElementById(`player-${slot}`);
        slotElement.innerHTML = '';
        
        const card = gameState.playerSlots[slot];
        if (card) {
            const cardElement = createCardElement(card, true);
            slotElement.appendChild(cardElement);
        }
    });
}

function renderPlayerHand() {
    const playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';
    
    // Only show cards that aren't in slots
    gameState.playerCards.forEach(card => {
        const inSlot = Object.values(gameState.playerSlots).some(slotCard => 
            slotCard && slotCard.title === card.title
        );
        
        if (!inSlot) {
            const cardElement = createCardElement(card, true);
            playerHand.appendChild(cardElement);
        }
    });
}

function updateBattleButtonState() {
    const battleBtn = document.getElementById('battle-btn');
    const allSlotsFilled = Object.values(gameState.playerSlots).every(slot => slot !== null);
    
    if (battleBtn) {
        battleBtn.disabled = !allSlotsFilled || gameState.battleInProgress;
    }
}

function autoWin() {
    console.log("Auto-Win triggered");

    // Skip to victory flow
    gameState.wins++;
    gameState.score += gameState.round * 100;

    // Reveal a random attribute as a reward
    revealRandomAttribute();

    // Hide battle button and show next round
    document.getElementById('battle-btn').style.display = 'none';

    // Fake battle result for UI (optional)
    const resultGrid = document.getElementById('result-grid');
    resultGrid.innerHTML = `
        <div class="result-item result-win"><strong>WORDS</strong><br>✅ WIN<br><small>Auto-win</small></div>
        <div class="result-item result-win"><strong>VIEWS</strong><br>✅ WIN<br><small>Auto-win</small></div>
        <div class="result-item result-win"><strong>LINKS</strong><br>✅ WIN<br><small>Auto-win</small></div>
    `;

    const overallResult = document.getElementById('overall-result');
    overallResult.innerHTML = `
        <h4>🎉 Auto-Victory!</h4>
        <p>You won 3/3 battles</p>
    `;

    document.getElementById('battle-result').style.display = 'block';
    document.getElementById('next-round-btn').style.display = 'inline-block';
}


// Fixed drag event handlers
document.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
});

document.addEventListener('dragleave', (e) => {
    if (e.target.classList.contains('player-slot')) {
        e.target.classList.remove('drag-over');
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    gameState.gameMap = generateGameMap();
    updateMapDisplay();
    showCurrentEvent();
});

