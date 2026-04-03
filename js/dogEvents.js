const DogEvents = {
    events: [
        {
            id: 'dog_bathroom',
            title: 'Dog Needs to Go!',
            description: 'The dog is whining and pawing at the window. Nature calls!',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive),
            weight: 25,
            choices: [
                {
                    text: 'Pull over immediately [+10 dog morale]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) {
                            dog.morale += 15;
                            const variation = Math.floor(Math.random() * 6) - 3;
                            GameState.party.forEach(p => {
                                if (p.alive && p.role !== 'dog') p.morale -= 3 + variation;
                            });
                        }
                        return `${dog.name} is much happier now! Quick pit stop.`;
                    }
                },
                {
                    text: '"Hold it!" [-15 dog morale, risk]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (Math.random() > 0.5) {
                            if (dog) dog.morale -= 15;
                            return `${dog.name} is uncomfortable but holding it.`;
                        } else {
                            if (dog) dog.morale -= 10;
                            GameState.party.forEach(p => {
                                if (p.alive) p.morale -= 20;
                            });
                            GameState.snacks -= 5;
                            return `Accident in the car! Everyone is miserable. Lost some snacks to the mess.`;
                        }
                    }
                }
            ]
        },
        {
            id: 'dog_barking',
            title: 'Non-Stop Barking!',
            description: 'The dog won\'t stop barking at something outside. WOOF WOOF WOOF!',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive),
            weight: 20,
            choices: [
                {
                    text: 'Give the dog a treat [Uses 5 snacks]',
                    condition: () => GameState.snacks >= 5,
                    effect: () => {
                        GameState.snacks -= 5;
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale += 10;
                        return `${dog.name} is happily munching. Peace restored!`;
                    }
                },
                {
                    text: 'Turn up the music to drown it out',
                    condition: () => true,
                    effect: () => {
                        GameState.party.forEach(p => {
                            if (p.alive) {
                                const variation = Math.floor(Math.random() * 6) - 3;
                                const musicMod = Math.round(5 * ((p.personality?.musicBonus || 1.0) - 1));
                                p.morale -= 5 + variation - musicMod;
                            }
                        });
                        return 'The barking continues over the music. Headaches all around.';
                    }
                },
                {
                    text: 'Yell at the dog [-10 dog morale]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        const kids = GameState.party.filter(p => p.role === 'son' || p.role === 'daughter');
                        if (dog) dog.morale -= 10;
                        kids.forEach(k => { if (k.alive) k.morale -= 8; });
                        return `${dog.name} looks sad. The kids are upset you yelled.`;
                    }
                }
            ]
        },
        {
            id: 'dog_car_sick',
            title: 'Dog Looks Queasy',
            description: 'The dog is drooling excessively and looks like it might be car sick...',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive),
            weight: 15,
            choices: [
                {
                    text: 'Pull over and let dog walk [+5 dog, -5 time]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale += 5;
                        GameState.drivingHours += 0.5;
                        return `${dog.name} feels better after a walk. Crisis averted!`;
                    }
                },
                {
                    text: 'Open the window and hope for the best',
                    condition: () => true,
                    effect: () => {
                        if (Math.random() > 0.4) {
                            const dog = GameState.party.find(p => p.role === 'dog');
                            if (dog) dog.morale += 3;
                            return `Fresh air helped! ${dog.name} is feeling better.`;
                        } else {
                            GameState.party.forEach(p => {
                                if (p.alive) p.morale -= 15;
                            });
                            GameState.snacks -= 10;
                            return 'Too late! Dog threw up everywhere. Lost snacks and morale.';
                        }
                    }
                }
            ]
        },
        {
            id: 'dog_wants_food',
            title: 'Puppy Dog Eyes',
            description: 'The dog is staring at everyone\'s snacks with those big sad eyes...',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive) && GameState.snacks > 10,
            weight: 18,
            choices: [
                {
                    text: 'Share some snacks with the dog [Uses 8 snacks]',
                    condition: () => GameState.snacks >= 8,
                    effect: () => {
                        GameState.snacks -= 8;
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale += 20;
                        const kids = GameState.party.filter(p => p.role === 'son' || p.role === 'daughter');
                        kids.forEach(k => { if (k.alive) k.morale += 5; });
                        return `${dog.name} is SO happy! The kids love watching the dog eat.`;
                    }
                },
                {
                    text: 'Ignore the dog',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale -= 8;
                        return `${dog.name} sighs dramatically and lies down.`;
                    }
                }
            ]
        },
        {
            id: 'dog_escape_attempt',
            title: 'Dog Tries to Escape!',
            description: 'At a rest stop, the dog suddenly bolts when the door opens!',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive),
            weight: 12,
            choices: [
                {
                    text: 'Chase the dog! [Risk: May take a while]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (Math.random() > 0.3) {
                            GameState.drivingHours += 0.5;
                            if (dog) dog.morale += 10;
                            GameState.party.forEach(p => {
                                if (p.alive && p.role !== 'dog') p.morale -= 5;
                            });
                            return `Caught ${dog.name} after a chase! Lost some time but dog had fun.`;
                        } else {
                            GameState.drivingHours += 1;
                            GameState.party.forEach(p => {
                                if (p.alive) p.morale -= 15;
                            });
                            return `Took forever to catch ${dog.name}! Everyone is exhausted.`;
                        }
                    }
                },
                {
                    text: 'Use treats to lure dog back [Uses 5 snacks]',
                    condition: () => GameState.snacks >= 5,
                    effect: () => {
                        GameState.snacks -= 5;
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale += 5;
                        return `${dog.name} came right back for the treats! Smart thinking.`;
                    }
                }
            ]
        },
        {
            id: 'dog_sleeping',
            title: 'Peaceful Pup',
            description: 'The dog has fallen asleep and is snoring softly. Everyone is calm.',
            condition: () => GameState.party.some(p => p.role === 'dog' && p.alive && p.morale > 50),
            weight: 10,
            choices: [
                {
                    text: 'Enjoy the peace [+5 everyone]',
                    condition: () => true,
                    effect: () => {
                        GameState.party.forEach(p => {
                            if (p.alive) {
                                const variation = Math.floor(Math.random() * 4) - 1;
                                p.morale += 5 + variation;
                            }
                        });
                        return 'A rare moment of peace on the road trip!';
                    }
                }
            ]
        },
        {
            id: 'dog_breed_compliment',
            title: 'Fellow Dog Lover!',
            description: () => {
                const dog = GameState.party.find(p => p.role === 'dog');
                const breed = Profile.data.family && Profile.data.family.dogBreed ? Profile.data.family.dogBreed : 'mixed';
                const breedName = breed.charAt(0).toUpperCase() + breed.slice(1);
                return `At a rest stop, someone approaches your car. "What a beautiful ${breedName}! I have one just like ${dog ? dog.name : 'yours'} at home!"`;
            },
            condition: () => Profile.data.level >= 11 && GameState.party.some(p => p.role === 'dog' && p.alive),
            weight: 8,
            choices: [
                {
                    text: 'Chat about your dog [+10 dog morale, +5 everyone]',
                    condition: () => true,
                    effect: () => {
                        const dog = GameState.party.find(p => p.role === 'dog');
                        if (dog) dog.morale += 10;
                        GameState.party.forEach(p => {
                            if (p.alive && p.role !== 'dog') p.morale += 5;
                        });
                        const breed = Profile.data.family && Profile.data.family.dogBreed ? Profile.data.family.dogBreed : 'mixed';
                        return `You had a lovely chat about ${breed}s. ${dog ? dog.name : 'The dog'} loved the attention!`;
                    }
                },
                {
                    text: 'Politely decline and continue',
                    condition: () => true,
                    effect: () => {
                        return 'You wave politely and get back on the road.';
                    }
                }
            ]
        }
    ],
    
    getRandomDogEvent() {
        const validEvents = this.events.filter(e => e.condition());
        if (validEvents.length === 0) return null;
        
        const totalWeight = validEvents.reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const event of validEvents) {
            random -= event.weight;
            if (random <= 0) return event;
        }
        return validEvents[0];
    }
};
