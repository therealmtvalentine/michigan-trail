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
        
        this.party = [
            { name: 'Dad', role: 'husband', health: 100, morale: 100, alive: true },
            { name: 'Mom', role: 'wife', health: 100, morale: 100, alive: true },
            { name: 'Boy', role: 'son', health: 100, morale: 100, alive: true },
            { name: 'Girl', role: 'daughter', health: 100, morale: 100, alive: true }
        ];
    },
    
    advanceDay() {
        let milesThisSegment = 0;
        let gasConsumption = 0;
        let hoursThisSegment = 0;
        
        switch(this.pace) {
            case 'slow': 
                milesThisSegment = 50;
                gasConsumption = 2;
                hoursThisSegment = 2;
                break;
            case 'steady': 
                milesThisSegment = 75;
                gasConsumption = 3;
                hoursThisSegment = 2;
                break;
            case 'fast': 
                milesThisSegment = 100;
                gasConsumption = 4.5;
                hoursThisSegment = 2;
                break;
        }
        
        this.distance += milesThisSegment;
        this.gas -= gasConsumption;
        this.drivingHours += hoursThisSegment;
        this.lastMilesDriven = milesThisSegment;
        
        if (this.drivingHours >= 8) {
            this.date.setDate(this.date.getDate() + 1);
            this.daysTraveled++;
            this.drivingHours = 0;
            return 'endOfDay';
        }
        
        let snackConsumption = 0;
        const aliveParty = this.party.filter(p => p.alive).length;
        switch(this.snackLevel) {
            case 'minimal': snackConsumption = 2 * aliveParty; break;
            case 'normal': snackConsumption = 4 * aliveParty; break;
            case 'generous': snackConsumption = 6 * aliveParty; break;
        }
        
        this.snacks -= snackConsumption;
        
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
            moraleChange -= 20;
        } else if (this.snacks <= 20) {
            healthChange -= 3;
            moraleChange -= 12;
        } else if (this.snacks <= 40) {
            moraleChange -= 5;
        } else if (this.snackLevel === 'minimal') {
            moraleChange -= 3;
        } else if (this.snackLevel === 'normal') {
            moraleChange += 1;
        } else if (this.snackLevel === 'generous') {
            moraleChange += 2;
        }
        
        if (this.pace === 'fast') {
            moraleChange -= 3;
        }
        
        if (this.gas <= 20) {
            moraleChange -= 5;
        }
        
        this.party.forEach(member => {
            if (member.alive) {
                member.health += healthChange;
                member.morale += moraleChange;
                member.health = Math.max(0, Math.min(100, member.health));
                member.morale = Math.max(0, Math.min(100, member.morale));
                
                if (member.health <= 0) {
                    member.alive = false;
                }
                
                if (member.morale <= 0) {
                    this.phase = 'gameOver';
                }
            }
        });
        
        const aliveParty = this.party.filter(p => p.alive);
        if (aliveParty.length === 0) {
            this.phase = 'gameOver';
        }
        
        const avgHealth = aliveParty.reduce((sum, p) => sum + p.health, 0) / aliveParty.length;
        const avgMorale = aliveParty.reduce((sum, p) => sum + p.morale, 0) / aliveParty.length;
        this.health = Math.round(avgHealth);
        this.morale = Math.round(avgMorale);
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
                    member.morale = Math.min(100, member.morale + 10);
                }
            });
            
            const aliveParty = this.party.filter(p => p.alive).length;
            const snackConsumption = 5 * aliveParty;
            this.snacks -= snackConsumption;
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
                member.morale = Math.min(100, member.morale + 5);
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
