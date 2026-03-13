const CityEvents = {
    cities: [
        'Dallas, TX',
        'Little Rock, AR',
        'Memphis, TN',
        'St. Louis, MO',
        'Indianapolis, IN',
        'Fort Wayne, IN',
        'Toledo, OH'
    ],
    
    getCityArrivalEvent() {
        const cityName = this.cities[Math.floor(Math.random() * this.cities.length)];
        GameState.inCity = true;
        GameState.currentCityName = cityName;
        
        return {
            id: 'city_arrival',
            title: `Arriving at ${cityName}`,
            description: `You've reached ${cityName}! It's a small city with some stores and restaurants. What do you want to do?`,
            condition: () => true,
            weight: 100,
            choices: [
                {
                    text: 'Small snack run ($15) - 20 snacks [😊 Morale +5]',
                    condition: () => GameState.money >= 15,
                    effect: () => {
                        GameState.money -= 15;
                        GameState.snacks += 20;
                        GameState.party.forEach(p => { if (p.alive) p.morale += 5; });
                        return 'Grabbed some chips and drinks. Better than nothing!';
                    }
                },
                {
                    text: 'Medium grocery trip ($30) - 50 snacks [😊 Morale +15]',
                    condition: () => GameState.money >= 30,
                    effect: () => {
                        GameState.money -= 30;
                        GameState.snacks += 50;
                        GameState.party.forEach(p => { if (p.alive) p.morale += 15; });
                        return 'Stocked up on snacks! Everyone is happy to have fresh food.';
                    }
                },
                {
                    text: 'Big grocery haul ($50) - 90 snacks [😊 Morale +20]',
                    condition: () => GameState.money >= 50,
                    effect: () => {
                        GameState.money -= 50;
                        GameState.snacks += 90;
                        GameState.party.forEach(p => { if (p.alive) p.morale += 20; });
                        return 'Loaded up the trunk with snacks! The family is thrilled.';
                    }
                },
                {
                    text: 'Fill up gas tank ($50)',
                    condition: () => GameState.money >= 50,
                    effect: () => {
                        GameState.money -= 50;
                        GameState.gas = 100;
                        return 'Tank is full! Ready to hit the road.';
                    }
                },
                {
                    text: 'Quick meal at diner ($40) [😊 Morale +25]',
                    condition: () => GameState.money >= 40,
                    effect: () => {
                        GameState.money -= 40;
                        GameState.party.forEach(p => { if (p.alive) p.morale += 25; });
                        return 'A hot meal really hit the spot! Everyone feels better.';
                    }
                },
                {
                    text: 'Just keep driving [😠 Morale -10]',
                    condition: () => true,
                    effect: () => {
                        GameState.inCity = false;
                        GameState.party.forEach(p => { if (p.alive) p.morale -= 10; });
                        return 'You drove right through. The family is disappointed.';
                    }
                }
            ]
        };
    },
    
    getEndOfDayEvent() {
        return {
            id: 'end_of_day',
            title: 'End of Day - Time to Rest',
            description: 'You\'ve been driving for 8 hours. Everyone is tired and needs to sleep. Where will you stay tonight?',
            condition: () => true,
            weight: 100,
            choices: [
                {
                    text: 'Luxury Hotel ($120) [😊 Morale +35]',
                    condition: () => GameState.money >= 120,
                    effect: () => {
                        GameState.money -= 120;
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                p.morale = Math.min(100, p.morale + 35);
                                p.health = Math.min(100, p.health + 15);
                            }
                        });
                        return 'The pool and room service were amazing! Everyone is refreshed and happy.';
                    }
                },
                {
                    text: 'Mid-range Motel ($60) [😊 Morale +20]',
                    condition: () => GameState.money >= 60,
                    effect: () => {
                        GameState.money -= 60;
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                p.morale = Math.min(100, p.morale + 20);
                                p.health = Math.min(100, p.health + 10);
                            }
                        });
                        return 'Clean beds and continental breakfast. Not bad!';
                    }
                },
                {
                    text: 'Budget Motel ($35) [😐 Morale +5]',
                    condition: () => GameState.money >= 35,
                    effect: () => {
                        GameState.money -= 35;
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                p.morale = Math.min(100, p.morale + 5);
                                p.health = Math.min(100, p.health + 5);
                            }
                        });
                        return 'The room smells weird and the AC is loud, but at least you have beds.';
                    }
                },
                {
                    text: 'Sleep in the car (Free) [😠 Morale -20]',
                    condition: () => true,
                    effect: () => {
                        GameState.party.forEach(p => { 
                            if (p.alive) {
                                p.morale = Math.max(0, p.morale - 20);
                                p.health = Math.max(0, p.health - 10);
                            }
                        });
                        return 'Nobody slept well. Everyone is stiff and cranky.';
                    }
                }
            ]
        };
    }
};
