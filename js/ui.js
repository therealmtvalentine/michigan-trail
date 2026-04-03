const UI = {
    screens: {},
    modal: null,
    messageLog: null,
    allocations: {
        money: 3,
        snacks: 3,
        morale: 3
    },
    difficulty: 'alone',
    
    init() {
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            profile: document.getElementById('profile-screen'),
            manageProfile: document.getElementById('manage-profile-screen'),
            stats: document.getElementById('stats-screen'),
            settings: document.getElementById('settings-screen'),
            car: document.getElementById('car-screen'),
            family: document.getElementById('family-screen'),
            challenges: document.getElementById('challenges-screen'),
            title: document.getElementById('title-screen'),
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            gameOver: document.getElementById('game-over-screen')
        };
        
        this.modal = document.getElementById('event-modal');
        this.messageLog = document.getElementById('message-log');
        
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => {
            this.showSetupScreen();
        });
        
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.updateNameInputs();
                this.updateAllocationDisplay();
            });
        });
        
        document.getElementById('money-slider').addEventListener('input', (e) => {
            this.updateAllocation('money', parseInt(e.target.value));
        });
        
        document.getElementById('snacks-slider').addEventListener('input', (e) => {
            this.updateAllocation('snacks', parseInt(e.target.value));
        });
        
        document.getElementById('morale-slider').addEventListener('input', (e) => {
            this.updateAllocation('morale', parseInt(e.target.value));
        });
        
        document.getElementById('begin-trip').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('continue-trail').addEventListener('click', () => {
            this.continueTrail();
        });
        
        document.getElementById('stop-here-btn').addEventListener('click', () => {
            this.stopHere();
        });
        
        document.getElementById('pace-btn').addEventListener('click', () => {
            this.showPaceModal();
        });
        
        document.querySelectorAll('.pace-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pace = e.currentTarget.dataset.pace;
                this.setPace(pace);
            });
        });
        
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });
    },
    
    showPaceModal() {
        const modal = document.getElementById('pace-modal');
        modal.style.display = 'flex';
        this.updatePaceDisplay();
    },
    
    hidePaceModal() {
        document.getElementById('pace-modal').style.display = 'none';
    },
    
    setPace(pace) {
        GameState.pace = pace;
        this.updatePaceDisplay();
        this.hidePaceModal();
        
        const paceNames = { slow: 'Slow', steady: 'Steady', fast: 'Fast' };
        this.addMessage(`Pace set to ${paceNames[pace]}.`);
    },
    
    updatePaceDisplay() {
        const paceNames = { slow: 'Slow', steady: 'Steady', fast: 'Fast' };
        const display = document.getElementById('current-pace-display');
        if (display) {
            display.innerHTML = `Current pace: <strong>${paceNames[GameState.pace]}</strong>`;
        }
    },
    
    updateNameInputs() {
        const showMom = ['couple', 'family', 'nightmare'].includes(this.difficulty);
        const showKids = ['family', 'nightmare'].includes(this.difficulty);
        const showDog = this.difficulty === 'nightmare';
        
        document.getElementById('name-mom-container').style.display = showMom ? 'flex' : 'none';
        document.getElementById('name-boy-container').style.display = showKids ? 'flex' : 'none';
        document.getElementById('name-girl-container').style.display = showKids ? 'flex' : 'none';
        document.getElementById('name-dog-container').style.display = showDog ? 'flex' : 'none';
    },
    
    stopHere() {
        if (GameState.phase === 'gameOver' || GameState.phase === 'won') {
            return;
        }
        const cityEvent = CityEvents.getCityArrivalEvent();
        this.showEvent(cityEvent);
        this.addMessage('You decided to make a stop.');
    },
    
    showSetupScreen() {
        this.showScreen('setup');
        this.allocations = { money: 3, snacks: 3, morale: 3 };
        this.updateAllocationDisplay();
        
        // Pre-fill family names from profile
        if (!Profile.data.family) {
            Profile.data.family = { dad: 'Dad', mom: 'Mom', son: 'Boy', daughter: 'Girl', dog: 'Buddy', dogBreed: 'mixed' };
        }
        document.getElementById('name-dad').value = Profile.data.family.dad || 'Dad';
        document.getElementById('name-mom').value = Profile.data.family.mom || 'Mom';
        document.getElementById('name-boy').value = Profile.data.family.son || 'Boy';
        document.getElementById('name-girl').value = Profile.data.family.daughter || 'Girl';
        document.getElementById('name-dog').value = Profile.data.family.dog || 'Buddy';
    },
    
    updateAllocation(type, value) {
        this.allocations[type] = value;
        this.updateAllocationDisplay();
    },
    
    updateAllocationDisplay() {
        const totalCredits = this.allocations.money + this.allocations.snacks + this.allocations.morale;
        const remaining = 10 - totalCredits;
        
        document.getElementById('credits-remaining').textContent = remaining;
        document.getElementById('credits-remaining').style.color = remaining >= 0 ? '#44ff44' : '#ff4444';
        
        const difficultyModifiers = {
            'alone': 0.90,
            'couple': 1.00,
            'family': 1.15,
            'nightmare': 1.30
        };
        const modifier = difficultyModifiers[this.difficulty] || 1.00;
        const baseAmount = Math.floor(80 * modifier);
        const perAllocation = Math.floor(50 * modifier);
        
        document.getElementById('money-level').textContent = this.allocations.money;
        document.getElementById('money-amount').textContent = baseAmount + (this.allocations.money * perAllocation);
        
        document.getElementById('snacks-level').textContent = this.allocations.snacks;
        document.getElementById('snacks-amount').textContent = 40 + (this.allocations.snacks * 20);
        
        document.getElementById('morale-level').textContent = this.allocations.morale;
        document.getElementById('morale-amount').textContent = 60 + (this.allocations.morale * 10);
        
        const beginButton = document.getElementById('begin-trip');
        const errorDiv = document.getElementById('allocation-error');
        
        if (remaining < 0) {
            beginButton.disabled = true;
            errorDiv.style.display = 'block';
        } else {
            beginButton.disabled = false;
            errorDiv.style.display = 'none';
        }
    },
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    },
    
    startGame() {
        GameState.init();
        EventSystem.init();
        Locations.init();
        GroceryEvent.reset();
        
        const dadName = document.getElementById('name-dad').value || 'Dad';
        const momName = document.getElementById('name-mom').value || 'Mom';
        const boyName = document.getElementById('name-boy').value || 'Boy';
        const girlName = document.getElementById('name-girl').value || 'Girl';
        const dogName = document.getElementById('name-dog').value || 'Buddy';
        
        GameState.difficulty = this.difficulty;
        GameState.party = [];
        
        GameState.party.push({ 
            name: dadName, role: 'husband', health: 100, morale: 100, alive: true,
            personality: { foodBonus: 1.0, musicBonus: 1.5, patience: 0.8, gameBonus: 0.7 }
        });
        
        if (['couple', 'family', 'nightmare'].includes(this.difficulty)) {
            GameState.party.push({ 
                name: momName, role: 'wife', health: 100, morale: 100, alive: true,
                personality: { foodBonus: 1.2, musicBonus: 1.0, patience: 1.5, gameBonus: 0.5 }
            });
        }
        
        if (['family', 'nightmare'].includes(this.difficulty)) {
            GameState.party.push({ 
                name: boyName, role: 'son', health: 100, morale: 100, alive: true,
                personality: { foodBonus: 1.3, musicBonus: 0.6, patience: 0.5, gameBonus: 1.8 }
            });
            GameState.party.push({ 
                name: girlName, role: 'daughter', health: 100, morale: 100, alive: true,
                personality: { foodBonus: 0.8, musicBonus: 1.4, patience: 0.6, gameBonus: 1.5 }
            });
        }
        
        if (this.difficulty === 'nightmare') {
            GameState.party.push({ 
                name: dogName, role: 'dog', health: 100, morale: 100, alive: true,
                personality: { foodBonus: 2.0, musicBonus: 0.3, patience: 0.3, gameBonus: 0.5 }
            });
        }
        
        const difficultyModifiers = {
            'alone': 0.90,    // Easy: -10%
            'couple': 1.00,   // Medium: +0%
            'family': 1.15,   // Hard: +15%
            'nightmare': 1.30 // Nightmare: +30%
        };
        
        const modifier = difficultyModifiers[this.difficulty] || 1.00;
        const baseAmount = Math.floor(80 * modifier);
        const perAllocation = Math.floor(50 * modifier);
        
        GameState.money = baseAmount + (this.allocations.money * perAllocation);
        GameState.snacks = 40 + (this.allocations.snacks * 20);
        const startingMorale = 60 + (this.allocations.morale * 10);
        GameState.party.forEach(member => {
            member.morale = startingMorale;
        });
        
        // Allocation badges
        if (this.allocations.morale === 5) Badges.unlock('happy_family');
        if (this.allocations.money === 5) Badges.unlock('scrooge_mcduck');
        if (this.allocations.snacks === 5) Badges.unlock('burp');
        if (this.allocations.morale === 1) Badges.unlock('temper_tantrum');
        if (this.allocations.money === 1) Badges.unlock('chapter_11');
        if (this.allocations.snacks === 1) Badges.unlock('hungry');
        
        const streakResult = Profile.checkAndUpdateStreak();
        if (streakResult.streakBonus > 0) {
            GameState.money += streakResult.streakBonus;
            GameState.streakBonus = streakResult.streakBonus;
        }
        
        GameState.phase = 'playing';
        this.showScreen('game');
        this.updateStats();
        
        if (streakResult.streakBonus > 0) {
            this.addMessage(`🔥 ${streakResult.weekStreak} WEEK STREAK! You earned $${streakResult.streakBonus} bonus!`);
        } else if (streakResult.dayStreak > 0) {
            this.addMessage(`🔥 ${streakResult.dayStreak} day streak! Play ${7 - (streakResult.dayStreak % 7)} more days for a $200 bonus!`);
        }
        
        let tripMessage = 'Road trip time! ';
        if (this.difficulty === 'alone') {
            tripMessage += `Just ${dadName} heading to Michigan. Peace and quiet!`;
        } else if (this.difficulty === 'couple') {
            tripMessage += `${dadName} and ${momName} heading to Michigan together!`;
        } else if (this.difficulty === 'family') {
            tripMessage += `The whole family is heading to Michigan! Let\'s hope everyone survives...`;
        } else {
            tripMessage += `Everyone AND the dog?! This is going to be chaos...`;
        }
        this.addMessage(tripMessage);
    },
    
    continueTrail() {
        if (GameState.phase === 'gameOver' || GameState.phase === 'won') {
            return;
        }
        
        const result = GameState.advanceDay();
        this.updateStats();
        
        if (GameState.speedingTicket) {
            this.addMessage(`🚨 Pulled over! Speeding ticket: -$50`);
            GameState.speedingTicket = false;
            Badges.unlock('nice_try');
        }
        
        const leftMembers = GameState.party.filter(p => !p.alive && p.leftMessage);
        leftMembers.forEach(member => {
            if (member.leftMessage) {
                this.addMessage(`⚠️ ${member.leftMessage}`);
                member.leftMessage = null;
            }
        });
        
        if (GameState.phase === 'gameOver') {
            const dad = GameState.party.find(p => p.role === 'husband');
            if (dad && dad.morale <= 0) {
                this.gameOver(GameState.getLeaveMessage(dad));
            } else if (GameState.gas <= 0) {
                this.gameOver('Your party has run out of gas on the highway.');
            } else {
                this.gameOver('Your road trip has ended in disaster.');
            }
            return;
        } else if (GameState.phase === 'won') {
            this.gameWon();
            return;
        }
        
        if (result === 'endOfDay') {
            const hotelEvent = CityEvents.getEndOfDayEvent();
            this.showEvent(hotelEvent);
            this.addMessage(`You've been driving for 8 hours. Time to find a place to sleep.`);
            return;
        }
        
        const locationCheck = Locations.checkLocationArrival();
        if (locationCheck.arrived) {
            this.addMessage(`You have arrived at ${locationCheck.location.name}! ${locationCheck.location.description}`);
            
            if (locationCheck.location.hasStore) {
                this.addMessage('There is a store here where you can buy supplies.');
            }
        }
        
        if (GroceryEvent.shouldTriggerGrocery()) {
            const groceryEvent = GroceryEvent.getGroceryEvent();
            this.showEvent(groceryEvent);
            this.addMessage('You spotted a grocery store! Good chance to stock up.');
            return;
        }
        
        const routePoint = RouteEvents.checkForRouteDecision();
        if (routePoint) {
            const routeEvent = RouteEvents.getRouteEvent(routePoint);
            this.showEvent(routeEvent);
            this.addMessage(`Approaching ${routePoint.name}...`);
            return;
        }
        
        const hasDog = GameState.party.some(p => p.role === 'dog' && p.alive);
        if (hasDog && Math.random() < 0.25) {
            const dogEvent = DogEvents.getRandomDogEvent();
            if (dogEvent) {
                this.showEvent(dogEvent);
                return;
            }
        }
        
        const cityArrival = Math.random() < 0.5;
        if (cityArrival) {
            const cityEvent = CityEvents.getCityArrivalEvent();
            this.showEvent(cityEvent);
            return;
        }
        
        const event = EventSystem.checkForEvent();
        if (event) {
            this.showEvent(event);
            return;
        }
        
        if (GameState.snacks <= 0) {
            this.addMessage('⚠️ WARNING: You are out of snacks!');
        }
        
        if (GameState.gas <= 20) {
            this.addMessage('⚠️ WARNING: Gas is running low!');
        }
    },
    
    checkSupplies() {
        const aliveCount = GameState.party.filter(p => p.alive).length;
        const deadCount = GameState.party.length - aliveCount;
        
        let message = '=== SUPPLIES ===\n';
        message += `Money: $${GameState.money}\n`;
        message += `Snacks: ${GameState.snacks} units\n`;
        message += `Gas: ${GameState.gas} gallons\n`;
        message += `Car Health: ${GameState.carHealth}%\n`;
        message += `Spare Parts: ${GameState.carParts}\n\n`;
        message += `=== FAMILY ===\n`;
        message += `Still in car: ${aliveCount}\n`;
        if (deadCount > 0) {
            message += `Left at rest stop: ${deadCount}\n`;
        }
        message += `\nFamily Members:\n`;
        GameState.party.forEach(member => {
            const status = member.alive ? `Health: ${member.health}%, Morale: ${member.morale}%` : 'ABANDONED';
            message += `- ${member.name}: ${status}\n`;
        });
        
        this.addMessage(message);
    },
    
    updateStats() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const date = GameState.date;
        document.getElementById('current-date').textContent = 
            `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        
        document.getElementById('distance').textContent = 
            `${GameState.distance} / ${GameState.totalDistance} mi`;
        
        const hour = GameState.currentHour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        document.getElementById('current-time').textContent = `${displayHour}:00 ${ampm}`;
        
        document.getElementById('money').textContent = `$${GameState.money}`;
        document.getElementById('food').textContent = `${GameState.snacks} snacks`;
        
        const gasBarFill = document.getElementById('gas-bar-fill');
        const gasPercent = GameState.gas;
        gasBarFill.style.width = `${gasPercent}%`;
        
        if (gasPercent < 20) {
            gasBarFill.style.background = 'linear-gradient(to right, #ff0000, #ff4444)';
        } else if (gasPercent < 40) {
            gasBarFill.style.background = 'linear-gradient(to right, #ff8800, #ffaa44)';
        } else if (gasPercent < 60) {
            gasBarFill.style.background = 'linear-gradient(to right, #ffaa44, #ffcc66)';
        } else {
            gasBarFill.style.background = 'linear-gradient(to right, #44ff44, #88ff88)';
        }
        
        const dad = GameState.party.find(p => p.role === 'husband');
        const mom = GameState.party.find(p => p.role === 'wife');
        const boy = GameState.party.find(p => p.role === 'son');
        const girl = GameState.party.find(p => p.role === 'daughter');
        const dog = GameState.party.find(p => p.role === 'dog');
        
        if (dad) {
            const dadMorale = dad.morale;
            let dadStatus = 'Happy';
            if (dadMorale < 20) dadStatus = 'Miserable';
            else if (dadMorale < 40) dadStatus = 'Grumpy';
            else if (dadMorale < 60) dadStatus = 'Neutral';
            else if (dadMorale < 80) dadStatus = 'Content';
            
            document.getElementById('health').textContent = `${dad.name}: ${dadStatus} (${Math.round(dadMorale)})`;
            const healthElement = document.getElementById('health');
            healthElement.className = '';
            if (dadMorale < 40) {
                healthElement.style.color = '#ff4444';
            } else if (dadMorale < 70) {
                healthElement.style.color = '#ffaa44';
            } else {
                healthElement.style.color = '#44ff44';
            }
        }
        
        const momContainer = document.getElementById('morale-mom')?.parentElement;
        const boyContainer = document.getElementById('morale-boy')?.parentElement;
        const girlContainer = document.getElementById('morale-girl')?.parentElement;
        const dogContainer = document.getElementById('morale-dog')?.parentElement;
        
        if (momContainer) momContainer.style.display = mom ? 'block' : 'none';
        if (boyContainer) boyContainer.style.display = boy ? 'block' : 'none';
        if (girlContainer) girlContainer.style.display = girl ? 'block' : 'none';
        if (dogContainer) dogContainer.style.display = dog ? 'block' : 'none';
        
        if (mom) {
            const momElement = document.getElementById('morale-mom');
            if (mom.alive) {
                momElement.textContent = `${mom.name}: ${Math.round(mom.morale)}`;
                momElement.style.color = mom.morale < 40 ? '#ff4444' : mom.morale < 70 ? '#ffaa44' : '#44ff44';
            } else {
                momElement.textContent = `${mom.name}: Gone`;
                momElement.style.color = '#888888';
            }
        }
        
        if (boy) {
            const boyElement = document.getElementById('morale-boy');
            if (boy.alive) {
                boyElement.textContent = `${boy.name}: ${Math.round(boy.morale)}`;
                boyElement.style.color = boy.morale < 40 ? '#ff4444' : boy.morale < 70 ? '#ffaa44' : '#44ff44';
            } else {
                boyElement.textContent = `${boy.name}: Gone`;
                boyElement.style.color = '#888888';
            }
        }
        
        if (girl) {
            const girlElement = document.getElementById('morale-girl');
            if (girl.alive) {
                girlElement.textContent = `${girl.name}: ${Math.round(girl.morale)}`;
                girlElement.style.color = girl.morale < 40 ? '#ff4444' : girl.morale < 70 ? '#ffaa44' : '#44ff44';
            } else {
                girlElement.textContent = `${girl.name}: Gone`;
                girlElement.style.color = '#888888';
            }
        }
        
        if (dog) {
            const dogElement = document.getElementById('morale-dog');
            if (dogElement) {
                if (dog.alive) {
                    dogElement.textContent = `${dog.name}: ${Math.round(dog.morale)}`;
                    dogElement.style.color = dog.morale < 40 ? '#ff4444' : dog.morale < 70 ? '#ffaa44' : '#44ff44';
                } else {
                    dogElement.textContent = `${dog.name}: Gone`;
                    dogElement.style.color = '#888888';
                }
            }
        }
    },
    
    addMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        this.messageLog.appendChild(p);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
        
        if (this.messageLog.children.length > 20) {
            this.messageLog.removeChild(this.messageLog.firstChild);
        }
    },
    
    showEvent(event) {
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-description').textContent = event.description;
        
        // Call onTrigger if defined (for badge unlocks etc)
        if (event.onTrigger) {
            event.onTrigger();
        }
        
        const choicesContainer = document.getElementById('event-choices');
        choicesContainer.innerHTML = '';
        
        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            
            if (!choice.condition()) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
                button.title = 'Insufficient money';
            }
            
            button.addEventListener('click', () => {
                if (choice.condition()) {
                    const result = choice.effect();
                    this.addMessage(`${event.title}: ${result}`);
                    this.updateStats();
                    this.hideModal();
                    
                    if (GameState.phase === 'gameOver') {
                        this.gameOver('Your party has perished on the trail.');
                    }
                }
            });
            choicesContainer.appendChild(button);
        });
        
        this.modal.classList.add('active');
    },
    
    hideModal() {
        this.modal.classList.remove('active');
    },
    
    gameOver(message) {
        document.getElementById('game-over-title').textContent = 'Road Trip Failed';
        document.getElementById('game-over-message').textContent = 
            `${message}\n\nYou made it ${GameState.distance} miles in ${GameState.daysTraveled} days before disaster struck.`;
        
        setTimeout(() => {
            this.showScreen('gameOver');
        }, 1000);
    },
    
    gameWon() {
        const scoreBreakdown = this.calculateScore();
        const membersLost = scoreBreakdown.totalCount - scoreBreakdown.aliveCount;
        
        document.getElementById('game-over-title').textContent = 'You Made It!';
        
        // Check for badges
        Badges.checkTripBadges();
        
        // Nightmare difficulty badge
        if (this.difficulty === 'nightmare') {
            Badges.unlock('you_deserve_better');
        }
        
        // High morale badge (200+ morale)
        const highMoraleMember = GameState.party.find(p => p.alive && p.morale >= 200);
        if (highMoraleMember) {
            Badges.unlock('wow');
        }
        
        let xpMessage = '';
        if (Profile.data.isRegistered) {
            const tripResult = Profile.completeTrip(scoreBreakdown.total, membersLost);
            xpMessage = `<strong>+${tripResult.xpGained} XP earned!</strong>` +
                (tripResult.leveledUp ? `<br>🎉 LEVEL UP! You are now level ${tripResult.newLevel}!` : '');
        } else {
            xpMessage = `<em>Create a profile to save your stats and earn XP!</em><br>` +
                `<button id="create-profile-endgame" style="margin-top: 10px; padding: 10px 20px;">👤 Create Profile</button>`;
        }
        
        document.getElementById('game-over-message').innerHTML = 
            `You survived the family road trip to Michigan!<br><br>` +
            `<strong>═══ SCORE BREAKDOWN ═══</strong><br><br>` +
            `<strong>Family Members:</strong> ${scoreBreakdown.aliveCount}/${scoreBreakdown.totalCount} still with you = ${scoreBreakdown.aliveBonus} pts<br>` +
            `<strong>Money Remaining:</strong> $${GameState.money} = ${scoreBreakdown.moneyBonus} pts<br>` +
            `<strong>Snacks Remaining:</strong> ${GameState.snacks} = ${scoreBreakdown.snacksBonus} pts<br>` +
            `<strong>Morale Bonus:</strong> ${scoreBreakdown.moraleDetails} = ${scoreBreakdown.moraleBonus} pts<br><br>` +
            `<strong>═══ TOTAL SCORE: ${scoreBreakdown.total} ═══</strong><br><br>` +
            xpMessage +
            `<br><br>The family will never forget this trip (therapy pending).`;
        
        setTimeout(() => {
            this.showScreen('gameOver');
            
            const createProfileBtn = document.getElementById('create-profile-endgame');
            if (createProfileBtn) {
                createProfileBtn.addEventListener('click', () => {
                    this.showScreen('mainMenu');
                    document.getElementById('profile-modal').classList.remove('hidden');
                    document.getElementById('profile-username-input').focus();
                });
            }
        }, 1000);
    },
    
    calculateScore() {
        const aliveMembers = GameState.party.filter(p => p.alive);
        const aliveCount = aliveMembers.length;
        const totalCount = GameState.party.length;
        const aliveBonus = aliveCount * 300;
        
        const moneyBonus = GameState.money * 2;
        const snacksBonus = GameState.snacks * 3;
        
        let moraleBonus = 0;
        let moraleDetails = [];
        aliveMembers.forEach(p => {
            const bonus = Math.round(p.morale);
            moraleBonus += bonus;
            moraleDetails.push(`${p.name}: ${bonus}`);
        });
        
        const total = Math.max(0, aliveBonus + moneyBonus + snacksBonus + moraleBonus);
        
        return {
            aliveCount,
            totalCount,
            aliveBonus,
            moneyBonus,
            snacksBonus,
            moraleBonus,
            moraleDetails: moraleDetails.join(', '),
            total
        };
    },
    
    restartGame() {
        this.messageLog.innerHTML = '';
        Profile.updateDisplay();
        this.showScreen('mainMenu');
    }
};
