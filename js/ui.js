const UI = {
    screens: {},
    modal: null,
    messageLog: null,
    allocations: {
        money: 3,
        snacks: 3,
        morale: 3
    },
    
    init() {
        this.screens = {
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
        
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });
    },
    
    showSetupScreen() {
        this.showScreen('setup');
        this.allocations = { money: 3, snacks: 3, morale: 3 };
        this.updateAllocationDisplay();
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
        
        document.getElementById('money-level').textContent = this.allocations.money;
        document.getElementById('money-amount').textContent = 50 + (this.allocations.money * 40);
        
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
        
        GameState.money = 50 + (this.allocations.money * 40);
        GameState.snacks = 40 + (this.allocations.snacks * 20);
        const startingMorale = 60 + (this.allocations.morale * 10);
        GameState.party.forEach(member => {
            member.morale = startingMorale;
        });
        
        this.showScreen('game');
        this.updateStats();
        this.addMessage('Road trip time! Loading up the minivan in Houston. Destination: Michigan! Let\'s hope everyone survives...');
    },
    
    continueTrail() {
        if (GameState.phase === 'gameOver' || GameState.phase === 'won') {
            return;
        }
        
        const result = GameState.advanceDay();
        this.updateStats();
        
        if (GameState.phase === 'gameOver') {
            const lowMoraleMember = GameState.party.find(p => p.morale <= 0);
            if (lowMoraleMember) {
                this.gameOver(`${lowMoraleMember.name}'s morale hit rock bottom. The family refuses to continue the trip.`);
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
        
        const dad = GameState.party.find(p => p.name === 'Dad');
        const mom = GameState.party.find(p => p.name === 'Mom');
        const boy = GameState.party.find(p => p.name === 'Boy');
        const girl = GameState.party.find(p => p.name === 'Girl');
        
        if (dad) {
            const dadMorale = dad.morale;
            let dadStatus = 'Happy';
            if (dadMorale < 20) dadStatus = 'Miserable';
            else if (dadMorale < 40) dadStatus = 'Grumpy';
            else if (dadMorale < 60) dadStatus = 'Neutral';
            else if (dadMorale < 80) dadStatus = 'Content';
            
            document.getElementById('health').textContent = dadStatus;
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
        
        if (mom) {
            const momElement = document.getElementById('morale-mom');
            momElement.textContent = mom.morale;
            if (mom.morale < 40) {
                momElement.style.color = '#ff4444';
            } else if (mom.morale < 70) {
                momElement.style.color = '#ffaa44';
            } else {
                momElement.style.color = '#44ff44';
            }
        }
        
        if (boy) {
            const boyElement = document.getElementById('morale-boy');
            boyElement.textContent = boy.morale;
            if (boy.morale < 40) {
                boyElement.style.color = '#ff4444';
            } else if (boy.morale < 70) {
                boyElement.style.color = '#ffaa44';
            } else {
                boyElement.style.color = '#44ff44';
            }
        }
        
        if (girl) {
            const girlElement = document.getElementById('morale-girl');
            girlElement.textContent = girl.morale;
            if (girl.morale < 40) {
                girlElement.style.color = '#ff4444';
            } else if (girl.morale < 70) {
                girlElement.style.color = '#ffaa44';
            } else {
                girlElement.style.color = '#44ff44';
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
        
        const choicesContainer = document.getElementById('event-choices');
        choicesContainer.innerHTML = '';
        
        event.choices.forEach((choice, index) => {
            if (choice.condition()) {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.addEventListener('click', () => {
                    const result = choice.effect();
                    this.addMessage(`${event.title}: ${result}`);
                    this.updateStats();
                    this.hideModal();
                    
                    if (GameState.phase === 'gameOver') {
                        this.gameOver('Your party has perished on the trail.');
                    }
                });
                choicesContainer.appendChild(button);
            }
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
        document.getElementById('game-over-title').textContent = 'You Made It!';
        document.getElementById('game-over-message').textContent = 
            `You survived the family road trip to Michigan!\n\nYou traveled ${GameState.totalDistance} miles in ${GameState.daysTraveled} days.\n\nFinal Score: ${this.calculateScore()} points\n\nThe family will never forget this trip (therapy pending).`;
        
        setTimeout(() => {
            this.showScreen('gameOver');
        }, 1000);
    },
    
    calculateScore() {
        const aliveBonus = GameState.party.filter(p => p.alive).length * 500;
        const moraleBonus = GameState.morale * 10;
        const suppliesBonus = (GameState.snacks + GameState.money + (GameState.gas * 3));
        const speedBonus = Math.max(0, 5000 - (GameState.daysTraveled * 20));
        
        return aliveBonus + moraleBonus + suppliesBonus + speedBonus;
    },
    
    restartGame() {
        this.messageLog.innerHTML = '';
        this.startGame();
    }
};
