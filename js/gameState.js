const GameState = {
    phase: 'title',
    
    date: new Date(2026, 2, 1),
    
    distance: 0,
    totalDistance: 1300,
    
    money: 500,
    snacks: 100,
    gas: 80,
    carHealth: 100,
    carParts: 2,
    
    health: 100,
    morale: 100,
    pace: 'steady',
    snackLevel: 'normal',
    
    party: [
        { name: 'Dad', role: 'husband', health: 100, morale: 100, alive: true },
        { name: 'Mom', role: 'wife', health: 100, morale: 100, alive: true },
        { name: 'Boy', role: 'son', health: 100, morale: 100, alive: true },
        { name: 'Girl', role: 'daughter', health: 100, morale: 100, alive: true }
    ],
    
    currentLocation: 'Houston, TX',
    nextLocation: 'Buc-ee\'s (Madisonville)',
    
    weather: 'clear',
    
    daysTraveled: 0,
    drivingHours: 0,
    inCity: false,
    currentCityName: '',
    lastMilesDriven: 0,
    currentHour: 8,
    routeDecisionsMade: 0,
    hasConstruction: false,
    
    streakBonus: 0,
    speedingTicket: false,
    
    init() {
        this.phase = 'title';
        this.date = new Date(2026, 2, 1);
        this.distance = 0;
        this.money = 500;
        this.snacks = 100;
        this.gas = 80;
        this.carHealth = 100;
        this.carParts = 2;
        this.health = 100;
        this.morale = 100;
        this.pace = 'steady';
        this.snackLevel = 'normal';
        this.daysTraveled = 0;
        this.drivingHours = 0;
        this.inCity = false;
        this.currentCityName = '';
        this.lastMilesDriven = 0;
        this.weather = 'clear';
        this.currentLocation = 'Houston, TX';
        this.nextLocation = 'Buc-ee\'s (Madisonville)';
        this.currentHour = 8;
        this.routeDecisionsMade = 0;
        this.hasConstruction = false;
        
        this.party = [
            { name: 'Dad', role: 'husband', health: 100, morale: 100, alive: true, 
              personality: { foodBonus: 1.0, musicBonus: 1.5, patience: 0.8, gameBonus: 0.7 } },
            { name: 'Mom', role: 'wife', health: 100, morale: 100, alive: true, 
              personality: { foodBonus: 1.2, musicBonus: 1.0, patience: 1.5, gameBonus: 0.5 } },
            { name: 'Boy', role: 'son', health: 100, morale: 100, alive: true, 
              personality: { foodBonus: 1.3, musicBonus: 0.6, patience: 0.5, gameBonus: 1.8 } },
            { name: 'Girl', role: 'daughter', health: 100, morale: 100, alive: true, 
              personality: { foodBonus: 0.8, musicBonus: 1.4, patience: 0.6, gameBonus: 1.5 } }
        ];
    },
    
    isRushHour() {
        return (this.currentHour >= 7 && this.currentHour <= 9) || 
               (this.currentHour >= 16 && this.currentHour <= 18);
    },
    
    updateWeather() {
        const roll = Math.random();
        if (this.weather === 'clear') {
            if (roll < 0.1) this.weather = 'rain';
            else if (roll < 0.15) this.weather = 'heavy_rain';
        } else if (this.weather === 'rain') {
            if (roll < 0.3) this.weather = 'clear';
            else if (roll < 0.4) this.weather = 'heavy_rain';
        } else if (this.weather === 'heavy_rain') {
            if (roll < 0.4) this.weather = 'rain';
            else if (roll < 0.5) this.weather = 'clear';
        }
        
        // Check for Windy City badge
        if ((this.weather === 'rain' || this.weather === 'heavy_rain') && this.currentCityName && this.currentCityName.includes('Chicago')) {
            Badges.unlock('windy_city');
        }
        
        if (Math.random() < 0.08) {
            this.hasConstruction = !this.hasConstruction;
        }
    },
    
    advanceDay() {
        let milesThisSegment = 0;
        let gasConsumption = 0;
        let hoursThisSegment = 2;
        
        switch(this.pace) {
            case 'slow': 
                milesThisSegment = 50;
                gasConsumption = 2;
                break;
            case 'steady': 
                milesThisSegment = 75;
                gasConsumption = 3;
                break;
            case 'fast': 
                milesThisSegment = 100;
                gasConsumption = 4.5;
                break;
        }
        
        this.updateWeather();
        
        if (this.weather === 'rain') {
            milesThisSegment = Math.round(milesThisSegment * 0.8);
        } else if (this.weather === 'heavy_rain') {
            milesThisSegment = Math.round(milesThisSegment * 0.6);
        }
        
        if (this.hasConstruction) {
            milesThisSegment = Math.round(milesThisSegment * 0.7);
        }
        
        if (this.isRushHour() && this.inCity) {
            milesThisSegment = Math.round(milesThisSegment * 0.5);
        }
        
        this.currentHour += hoursThisSegment;
        if (this.currentHour >= 24) {
            this.currentHour -= 24;
        }
        
        this.distance += milesThisSegment;
        this.gas -= gasConsumption;
        this.drivingHours += hoursThisSegment;
        this.lastMilesDriven = milesThisSegment;
        
        if (this.drivingHours >= 10) {
            this.date.setDate(this.date.getDate() + 1);
            this.daysTraveled++;
            this.drivingHours = 0;
            this.currentHour = 8;
            return 'endOfDay';
        }
        
        let snackConsumption = 0;
        const aliveParty = this.party.filter(p => p.alive).length;
        switch(this.snackLevel) {
            case 'minimal': snackConsumption = 2 * aliveParty; break;
            case 'normal': snackConsumption = 4 * aliveParty; break;
            case 'generous': snackConsumption = 6 * aliveParty; break;
        }
        
        this.snacks = Math.max(0, this.snacks - snackConsumption);
        
        this.updateHealth();
        
        if (this.distance >= this.totalDistance) {
            this.phase = 'won';
        }
        
        if (this.gas <= 0) {
            this.phase = 'gameOver';
        }
    },
    
    updateHealth() {
        let healthChange = 0;
        let moraleChange = 0;
        
        if (this.snacks <= 0) {
            healthChange -= 8;
            moraleChange -= 10;
        } else if (this.snacks <= 20) {
            healthChange -= 3;
            moraleChange -= 6;
        } else if (this.snacks <= 40) {
            moraleChange -= 3;
        } else if (this.snackLevel === 'minimal') {
            moraleChange -= 2;
        } else if (this.snackLevel === 'normal') {
            moraleChange -= 1;
        } else if (this.snackLevel === 'generous') {
            moraleChange -= 1;
        }
        
        if (this.pace === 'slow') {
            const aliveMembers = this.party.filter(p => p.alive);
            const perPersonPenalty = Math.ceil(5 / aliveMembers.length);
            aliveMembers.forEach(p => {
                p.morale = Math.max(0, p.morale - perPersonPenalty);
            });
        } else if (this.pace === 'fast') {
            const aliveMembers = this.party.filter(p => p.alive);
            const perPersonBonus = Math.ceil(5 / aliveMembers.length);
            aliveMembers.forEach(p => {
                p.morale = Math.min(100, p.morale + perPersonBonus);
            });
            
            if (Math.random() < 0.07) {
                this.money -= 50;
                this.speedingTicket = true;
            }
        }
        
        if (this.gas <= 20) {
            moraleChange -= 5;
        }
        
        this.party.forEach(member => {
            if (member.alive) {
                member.health += healthChange;
                
                let adjustedMoraleChange = moraleChange;
                if (member.role === 'wife') {
                    adjustedMoraleChange = Math.ceil(moraleChange * 0.5);
                }
                
                member.morale += adjustedMoraleChange;
                member.health = Math.max(0, Math.min(100, member.health));
                member.morale = Math.max(0, member.morale);
                
                if (member.health <= 0) {
                    member.alive = false;
                }
                
                if (member.morale <= 0 && member.alive) {
                    member.alive = false;
                    member.leftMessage = this.getLeaveMessage(member);
                    
                    // Badge triggers for family leaving
                    if (member.role === 'wife') {
                        Badges.unlock('custody_battle');
                        Badges.incrementStat('divorceCount');
                        Badges.checkStatBadges();
                    } else if (member.role === 'son' || member.role === 'daughter') {
                        Badges.unlock('didnt_need_em');
                        Badges.incrementStat('cpsCount');
                        Badges.checkStatBadges();
                    } else if (member.role === 'dog') {
                        Badges.unlock('kristi_noem');
                        Badges.incrementStat('dogLeftCount');
                        Badges.checkStatBadges();
                    }
                    
                    if (member.role === 'husband') {
                        Badges.unlock('move_out_soon');
                        Badges.incrementStat('basementCount');
                        Badges.checkStatBadges();
                        this.phase = 'gameOver';
                    }
                }
            }
        });
        
        const mom = this.party.find(p => p.role === 'wife');
        const dad = this.party.find(p => p.role === 'husband');
        if (mom && dad && mom.alive && dad.alive) {
            if (mom.morale < 50) {
                dad.morale -= 10;
                dad.morale = Math.max(0, dad.morale);
            }
            if (mom.morale < 30) {
                dad.morale -= 15;
                dad.morale = Math.max(0, dad.morale);
            }
        }
        
        const aliveParty = this.party.filter(p => p.alive);
        
        const avgHealth = aliveParty.length > 0 ? aliveParty.reduce((sum, p) => sum + p.health, 0) / aliveParty.length : 0;
        const avgMorale = aliveParty.length > 0 ? aliveParty.reduce((sum, p) => sum + p.morale, 0) / aliveParty.length : 0;
        this.health = Math.round(avgHealth);
        this.morale = Math.round(avgMorale);
    },
    
    getLeaveMessage(member) {
        switch(member.role) {
            case 'wife':
                return `${member.name} has had enough. She files for divorce and takes an Uber home.`;
            case 'son':
                return `${member.name} develops an anxiety disorder from the trip stress. CPS shows up and takes him away.`;
            case 'daughter':
                return `${member.name} develops an anxiety disorder from the trip stress. CPS shows up and takes her away.`;
            case 'husband':
                return `${member.name} gives up on life and moves into his mom's basement.`;
            case 'dog':
                return `${member.name} bites you then runs off to find a better owner.`;
            default:
                return `${member.name} has left the trip.`;
        }
    },
    
    getHealthStatus() {
        if (this.health >= 80) return 'Good';
        if (this.health >= 60) return 'Fair';
        if (this.health >= 40) return 'Poor';
        return 'Very Poor';
    },
    
    getMoraleStatus() {
        if (this.morale >= 80) return 'Happy';
        if (this.morale >= 60) return 'OK';
        if (this.morale >= 40) return 'Grumpy';
        if (this.morale >= 20) return 'Miserable';
        return 'Mutinous';
    },
    
    rest(days = 1) {
        for (let i = 0; i < days; i++) {
            this.date.setDate(this.date.getDate() + 1);
            this.daysTraveled++;
            
            this.party.forEach(member => {
                if (member.alive) {
                    member.health = Math.min(100, member.health + 5);
                    member.morale += 10;
                }
            });
            
            const aliveParty = this.party.filter(p => p.alive).length;
            const snackConsumption = 5 * aliveParty;
            this.snacks = Math.max(0, this.snacks - snackConsumption);
            this.money -= 50;
        }
        
        this.updateHealth();
    },
    
    fastFood() {
        if (this.money < 30) {
            return { success: false, message: "Not enough money for fast food." };
        }
        
        this.money -= 30;
        
        const snacksGained = Math.floor(Math.random() * 20) + 20;
        this.snacks += snacksGained;
        
        this.party.forEach(member => {
            if (member.alive) {
                member.morale += 5;
            }
        });
        
        return { success: true, message: `Stopped for fast food! Gained ${snacksGained} snacks and everyone is happier.` };
    },
    
    buyItem(item, quantity, pricePerUnit) {
        const totalCost = quantity * pricePerUnit;
        
        if (this.money < totalCost) {
            return { success: false, message: "Not enough money." };
        }
        
        this.money -= totalCost;
        
        switch(item) {
            case 'snacks':
                this.snacks += quantity;
                break;
            case 'gas':
                this.gas += quantity;
                break;
            case 'carParts':
                this.carParts += quantity;
                break;
        }
        
        return { success: true, message: `Purchased ${quantity} ${item} for $${totalCost}.` };
    }
};
