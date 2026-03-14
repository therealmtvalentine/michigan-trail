const GroceryEvent = {
    hasVisitedGrocery: false,
    
    getGroceryEvent() {
        return {
            id: 'grocery_store',
            title: 'Grocery Store Stop',
            description: 'You\'ve found a grocery store! This is a good chance to stock up on snacks for the rest of the trip.',
            condition: () => true,
            weight: 100,
            choices: [
                {
                    text: 'Stock up on snacks ($35) - 80 snacks',
                    condition: () => GameState.money >= 35,
                    effect: () => {
                        GameState.money -= 35;
                        const previousSnacks = GameState.snacks;
                        GameState.snacks += 80;
                        
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                let boost = 15;
                                if (p.morale < 50) boost += 20;
                                if (p.morale < 30) boost += 15;
                                if (previousSnacks < 30) boost += 10;
                                p.morale += boost;
                            }
                        });
                        
                        GroceryEvent.hasVisitedGrocery = true;
                        return 'Loaded up on snacks! The hungry family members are especially happy.';
                    }
                },
                {
                    text: 'Just get a few things ($15) - 30 snacks',
                    condition: () => GameState.money >= 15,
                    effect: () => {
                        GameState.money -= 15;
                        const previousSnacks = GameState.snacks;
                        GameState.snacks += 30;
                        
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                let boost = 8;
                                if (p.morale < 50) boost += 10;
                                if (previousSnacks < 30) boost += 5;
                                p.morale += boost;
                            }
                        });
                        
                        GroceryEvent.hasVisitedGrocery = true;
                        return 'Got some snacks. Better than nothing!';
                    }
                },
                {
                    text: 'Skip the grocery store',
                    condition: () => true,
                    effect: () => {
                        GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                        return 'You passed on the grocery store. Hope you have enough snacks...';
                    }
                }
            ]
        };
    },
    
    shouldTriggerGrocery() {
        const progress = GameState.distance / GameState.totalDistance;
        return !this.hasVisitedGrocery && progress >= 0.4 && progress <= 0.6;
    },
    
    reset() {
        this.hasVisitedGrocery = false;
    }
};
