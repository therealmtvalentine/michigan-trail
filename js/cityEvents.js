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
    
    bigCities: [
        'Houston, TX',
        'Texarkana, TX/AR',
        'Little Rock, AR',
        'Memphis, TN',
        'Nashville, TN',
        'Louisville, KY',
        'Indianapolis, IN',
        'Detroit, MI'
    ],
    
    cityActivities: {
        'Houston': {
            name: 'Go to Space Center NASA',
            cost: 50,
            perPerson: false,
            time: 1.5,
            morale: 25,
            message: 'Amazing visit to NASA! Everyone learned about space exploration.'
        },
        'Buc-ee': {
            name: 'Stock up on Beaver Nuggets',
            cost: 10,
            perPerson: true,
            time: 0.5,
            snacks: 30,
            morale: 10,
            message: 'Loaded up on delicious Beaver Nuggets!'
        },
        'Texarkana': {
            name: 'Photo at Two States Sign',
            cost: 0,
            perPerson: false,
            time: 1,
            morale: 15,
            message: 'Great photo standing in two states at once!'
        },
        'Little Rock': {
            name: 'Visit Central High School Historic Site',
            cost: 15,
            perPerson: true,
            time: 1.5,
            morale: 20,
            message: 'Powerful visit to this important civil rights landmark.'
        },
        'Memphis': {
            name: 'Visit National Civil Rights Museum',
            cost: 20,
            perPerson: true,
            time: 1.5,
            morale: 25,
            message: 'Moving experience at the National Civil Rights Museum.'
        },
        'Mount Vernon': {
            name: 'Visit Historic Town Square',
            cost: 5,
            perPerson: true,
            time: 1,
            morale: 12,
            message: 'Nice stroll through the historic town square.'
        },
        'Chicago': {
            name: 'Photo at Cloud Gate (The Bean)',
            cost: 0,
            perPerson: false,
            time: 1,
            morale: 18,
            message: 'Got a great photo at the famous Bean!'
        },
        'Detroit': {
            name: 'Visit Motown Museum',
            cost: 21,
            perPerson: true,
            time: 1.5,
            morale: 22,
            message: 'Hitsville U.S.A.! Amazing Motown history.'
        }
    },
    
    getCityActivity(cityName) {
        for (const key in this.cityActivities) {
            if (cityName.includes(key)) {
                return this.cityActivities[key];
            }
        }
        return null;
    },
    
    getPriceModifier() {
        const progress = GameState.distance / GameState.totalDistance;
        const baseVariation = Math.floor(Math.random() * 6) - 2;
        const progressBonus = Math.floor(progress * 10);
        return baseVariation + progressBonus;
    },
    
    isLargeCity() {
        const currentLocation = Locations.getCurrentLocation();
        if (!currentLocation) return false;
        return this.bigCities.some(city => currentLocation.name.includes(city) || city.includes(currentLocation.name.split(',')[0]));
    },
    
    getCityArrivalEvent() {
        const currentLocation = Locations.getCurrentLocation();
        const cityName = currentLocation ? currentLocation.name : 'a small town';
        GameState.inCity = true;
        GameState.currentCityName = cityName;
        
        const priceVar = this.getPriceModifier();
        const gasPrice = 50 + priceVar;
        const mealPrice = 40 + priceVar;
        const snackPrice = 20 + Math.floor(priceVar / 2);
        
        const choices = [
            {
                text: `Fill up gas tank ($${gasPrice}) [😊 +5]`,
                condition: () => GameState.money >= gasPrice,
                effect: () => {
                    GameState.money -= gasPrice;
                    GameState.gas = 100;
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 5) - 2;
                            p.morale += 5 + variation;
                        }
                    });
                    Badges.incrementStat('gasUpCount');
                    Badges.checkStatBadges();
                    return 'Tank is full! Ready to hit the road.';
                }
            },
            {
                text: `Quick meal at diner ($${mealPrice}) [😊 +20]`,
                condition: () => GameState.money >= mealPrice,
                effect: () => {
                    GameState.money -= mealPrice;
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 8) - 2;
                            const personalityMod = Math.round(4 * ((p.personality?.foodBonus || 1.0) - 1));
                            p.morale += 20 + variation + personalityMod;
                        }
                    });
                    return 'A hot meal really hit the spot! Everyone feels better.';
                }
            },
            {
                text: `Get snacks from gas station ($${snackPrice}) [😊 +10]`,
                condition: () => GameState.money >= snackPrice,
                effect: () => {
                    GameState.money -= snackPrice;
                    GameState.snacks += 35;
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 6) - 2;
                            const personalityMod = Math.round(3 * ((p.personality?.foodBonus || 1.0) - 1));
                            p.morale += 10 + variation + personalityMod;
                        }
                    });
                    return 'Got some road snacks!';
                }
            },
            {
                text: 'Stretch legs at rest stop (free) [😊 +8]',
                condition: () => true,
                effect: () => {
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 6) - 2;
                            const personalityMod = Math.round(3 * ((p.personality?.patience || 1.0) - 1));
                            p.morale += 8 + variation + personalityMod;
                        }
                    });
                    Badges.incrementStat('restStopCount');
                    Badges.checkStatBadges();
                    return 'Quick stretch break. Everyone feels a bit better.';
                }
            }
        ];
        
        const activity = this.getCityActivity(cityName);
        if (activity) {
            const partySize = GameState.party.filter(p => p.alive).length;
            const totalCost = activity.perPerson ? activity.cost * partySize : activity.cost;
            const costText = activity.perPerson ? `$${activity.cost}/person` : (activity.cost > 0 ? `$${activity.cost}` : 'Free');
            const timeText = activity.time === 1 ? '1 hr' : `${activity.time} hrs`;
            
            const badgeKey = Object.keys(this.cityActivities).find(k => cityName.includes(k));
            choices.unshift({
                text: `${activity.name} (${costText}) [⏱️ ${timeText}] [+${activity.morale}]`,
                condition: () => GameState.money >= totalCost,
                effect: () => {
                    GameState.money -= totalCost;
                    GameState.drivingHours += activity.time;
                    if (activity.snacks) {
                        GameState.snacks += activity.snacks;
                    }
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 6) - 2;
                            p.morale += activity.morale + variation;
                        }
                    });
                    
                    // Unlock welcome badges
                    const badgeMap = {
                        'Houston': 'welcome_houston',
                        'Buc-ee': 'welcome_bucees',
                        'Texarkana': 'welcome_texarkana',
                        'Little Rock': 'welcome_littlerock',
                        'Memphis': 'welcome_memphis',
                        'Mount Vernon': 'welcome_mountvernon',
                        'Chicago': 'welcome_chicago',
                        'Detroit': 'welcome_detroit'
                    };
                    if (badgeKey && badgeMap[badgeKey]) {
                        Badges.unlock(badgeMap[badgeKey]);
                    }
                    
                    return activity.message;
                }
            });
        }
        
        choices.push({
            text: 'Keep driving [😠 -10]',
            condition: () => true,
            effect: () => {
                GameState.inCity = false;
                GameState.party.forEach(p => { 
                    if (p.alive) {
                        const variation = Math.floor(Math.random() * 6) - 2;
                        const personalityMod = Math.round(4 * (1 - (p.personality?.patience || 1.0)));
                        p.morale = Math.max(0, p.morale - 10 + variation + personalityMod);
                    }
                });
                Badges.incrementStat('keepDrivingCount');
                Badges.checkStatBadges();
                return 'No stop. The family is disappointed.';
            }
        });
        
        return {
            id: 'city_arrival',
            title: `Stopping at ${cityName}`,
            description: `You're passing through ${cityName}! There are some stores and restaurants nearby. What do you want to do?`,
            condition: () => true,
            weight: 100,
            choices: choices
        };
    },
    
    getEndOfDayEvent() {
        const priceVar = this.getPriceModifier();
        const luxuryPrice = 120 + priceVar;
        const midPrice = 60 + priceVar;
        const budgetPrice = 35 + Math.floor(priceVar / 2);
        const isLarge = this.isLargeCity();
        
        const choices = [];
        
        if (isLarge) {
            choices.push({
                text: `Luxury Hotel with pool ($${luxuryPrice}) [😊 +35]`,
                condition: () => GameState.money >= luxuryPrice,
                effect: () => {
                    GameState.money -= luxuryPrice;
                    GameState.party.forEach(p => { 
                        if (p.alive) {
                            const variation = Math.floor(Math.random() * 10) - 3;
                            let boost = 35 + variation;
                            if (p.role === 'son' || p.role === 'daughter') boost += 8;
                            p.morale += boost;
                            p.health = Math.min(100, p.health + 15);
                        }
                    });
                    Badges.unlock('lol');
                    return 'The pool and room service were amazing! Everyone is refreshed.';
                }
            });
        }
        
        choices.push({
            text: `Mid-range Motel ($${midPrice}) [😊 +20]`,
            condition: () => GameState.money >= midPrice,
            effect: () => {
                GameState.money -= midPrice;
                GameState.party.forEach(p => { 
                    if (p.alive) {
                        const variation = Math.floor(Math.random() * 8) - 3;
                        const personalityMod = Math.round(3 * ((p.personality?.patience || 1.0) - 1));
                        p.morale += 20 + variation + personalityMod;
                        p.health = Math.min(100, p.health + 10);
                    }
                });
                return 'Clean beds and continental breakfast. Not bad!';
            }
        });
        
        choices.push({
            text: `Budget Motel ($${budgetPrice}) [😐 +5]`,
            condition: () => GameState.money >= budgetPrice,
            effect: () => {
                GameState.money -= budgetPrice;
                GameState.party.forEach(p => { 
                    if (p.alive) {
                        const variation = Math.floor(Math.random() * 8) - 4;
                        const personalityMod = Math.round(3 * ((p.personality?.patience || 1.0) - 1));
                        p.morale = Math.max(0, p.morale + 5 + variation + personalityMod);
                        p.health = Math.min(100, p.health + 5);
                    }
                });
                return 'The room smells weird but at least you have beds.';
            }
        });
        
        choices.push({
            text: 'Sleep in the car (Free) [😠 -20]',
            condition: () => true,
            effect: () => {
                GameState.party.forEach(p => { 
                    if (p.alive) {
                        const variation = Math.floor(Math.random() * 8) - 2;
                        const personalityMod = Math.round(5 * (1 - (p.personality?.patience || 1.0)));
                        p.morale = Math.max(0, p.morale - 20 + variation + personalityMod);
                        p.health = Math.max(0, p.health - 10);
                    }
                });
                Badges.unlock('my_back_hurts');
                return 'Nobody slept well. Everyone is stiff and cranky.';
            }
        });
        
        return {
            id: 'end_of_day',
            title: 'End of Day - Time to Rest',
            description: isLarge ? 
                'You\'ve been driving for 8 hours. Everyone is tired and needs to sleep. This city has plenty of lodging options!' :
                'You\'ve been driving for 8 hours. Everyone is tired and needs to sleep. This small town has limited options.',
            condition: () => true,
            weight: 100,
            choices: choices
        };
    }
};
