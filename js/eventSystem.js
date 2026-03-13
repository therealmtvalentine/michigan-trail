const EventSystem = {
    events: [],
    
    init() {
        this.events = [
            {
                id: 'flat_tire',
                title: 'Flat Tire!',
                description: 'You hear a loud POP! The car has a flat tire.',
                condition: () => true,
                weight: 15,
                choices: [
                    {
                        text: 'Use spare tire [No morale change]',
                        condition: () => GameState.carParts > 0,
                        effect: () => {
                            GameState.carParts--;
                            return 'You changed the tire and got back on the road.';
                        }
                    },
                    {
                        text: 'Call roadside assistance ($75) [😠 Morale -5]',
                        condition: () => GameState.money >= 75,
                        effect: () => {
                            GameState.money -= 75;
                            GameState.date.setDate(GameState.date.getDate() + 1);
                            return 'Roadside assistance arrived and fixed the tire. Lost a day waiting.';
                        }
                    },
                    {
                        text: 'Try to drive on it slowly [😠 Morale -10, Car damage]',
                        condition: () => true,
                        effect: () => {
                            GameState.carHealth -= 20;
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 10; });
                            return 'Bad idea. You damaged the rim and everyone is annoyed.';
                        }
                    }
                ]
            },
            {
                id: 'are_we_there_yet',
                title: '"Are We There Yet?"',
                description: 'The kids are getting restless. "Are we there yet? Are we there yet?"',
                condition: () => GameState.party.some(p => p.alive && p.morale < 60),
                weight: 20,
                choices: [
                    {
                        text: 'Stop for ice cream ($20) [😊 Morale +15]',
                        condition: () => GameState.money >= 20,
                        effect: () => {
                            GameState.money -= 20;
                            GameState.party.forEach(p => { if (p.alive) p.morale += 15; });
                            return 'Ice cream fixes everything! Morale restored.';
                        }
                    },
                    {
                        text: 'Play car games [😊 Morale +10 or 😠 -5]',
                        condition: () => true,
                        effect: () => {
                            const success = Math.random() > 0.5;
                            if (success) {
                                GameState.party.forEach(p => { if (p.alive) p.morale += 10; });
                                return 'I Spy and the License Plate Game kept everyone entertained!';
                            } else {
                                GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                                return 'The games turned into arguments. Not helpful.';
                            }
                        }
                    },
                    {
                        text: 'Turn up the music and ignore them [😠 Morale -5]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                            return 'Everyone is grumpy now. Great parenting.';
                        }
                    }
                ]
            },
            {
                id: 'bathroom_emergency',
                title: 'Bathroom Emergency!',
                description: '"I REALLY have to go!" There\'s no rest stop for 50 miles.',
                condition: () => true,
                weight: 18,
                choices: [
                    {
                        text: 'Pull over at sketchy gas station [😐 Neutral]',
                        condition: () => true,
                        effect: () => {
                            const outcome = Math.random();
                            if (outcome > 0.7) {
                                GameState.money -= 10;
                                return 'Bathroom was disgusting but you bought overpriced snacks.';
                            } else {
                                return 'Crisis averted. The bathroom was surprisingly clean!';
                            }
                        }
                    },
                    {
                        text: 'Emergency roadside stop [😠 Morale -10]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 10; });
                            return 'Nature calls. Everyone is traumatized but relieved.';
                        }
                    },
                    {
                        text: '"Hold it!" [😠 Morale -15 to -25]',
                        condition: () => true,
                        effect: () => {
                            const success = Math.random() > 0.6;
                            if (success) {
                                GameState.party.forEach(p => { if (p.alive) p.morale -= 15; });
                                return 'They made it but are NOT happy about it.';
                            } else {
                                GameState.party.forEach(p => { if (p.alive) p.morale -= 25; });
                                GameState.snacks -= 10;
                                return 'Accident. Car cleanup required. Morale destroyed.';
                            }
                        }
                    }
                ]
            },
            {
                id: 'traffic_jam',
                title: 'Traffic Jam',
                description: 'Brake lights as far as the eye can see. Construction zone ahead.',
                condition: () => true,
                weight: 16,
                choices: [
                    {
                        text: 'Wait it out [😠 Morale -10, Gas -5]',
                        condition: () => true,
                        effect: () => {
                            GameState.gas -= 5;
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 10; });
                            return 'Sat in traffic for 2 hours. Wasted gas idling.';
                        }
                    },
                    {
                        text: 'Take the detour [😐 Risk/Reward]',
                        condition: () => true,
                        effect: () => {
                            const outcome = Math.random();
                            if (outcome > 0.5) {
                                GameState.distance += 50;
                                return 'Found a scenic route! Actually faster.';
                            } else {
                                GameState.gas -= 10;
                                return 'Got lost. Wasted gas and time.';
                            }
                        }
                    }
                ]
            },
            {
                id: 'check_engine_light',
                title: 'Check Engine Light',
                description: 'The dreaded check engine light just came on.',
                condition: () => GameState.carHealth < 70,
                weight: 14,
                choices: [
                    {
                        text: 'Stop at mechanic ($150) [😊 Car fixed]',
                        condition: () => GameState.money >= 150,
                        effect: () => {
                            GameState.money -= 150;
                            GameState.carHealth = 100;
                            GameState.date.setDate(GameState.date.getDate() + 1);
                            return 'Mechanic fixed it. Car is running great! Lost a day.';
                        }
                    },
                    {
                        text: 'Ignore it and hope [😐 Risky!]',
                        condition: () => true,
                        effect: () => {
                            const outcome = Math.random();
                            if (outcome > 0.6) {
                                return 'It was just a loose gas cap. Crisis averted!';
                            } else {
                                GameState.carHealth -= 20;
                                return 'Car is making weird noises now. This was a mistake.';
                            }
                        }
                    }
                ]
            },
            {
                id: 'sibling_fight',
                title: 'Sibling Fight',
                description: '"Mom! He\'s touching me!" "Am not!" "Are too!"',
                condition: () => true,
                weight: 12,
                choices: [
                    {
                        text: 'Threaten to turn the car around [😐 50/50]',
                        condition: () => true,
                        effect: () => {
                            const success = Math.random() > 0.4;
                            if (success) {
                                return 'The classic threat works. Temporary peace achieved.';
                            } else {
                                GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                                return 'They called your bluff. Fighting continues.';
                            }
                        }
                    },
                    {
                        text: 'Separate them with snacks [😊 Morale +5]',
                        condition: () => GameState.snacks >= 10,
                        effect: () => {
                            GameState.snacks -= 10;
                            GameState.party.forEach(p => { if (p.alive) p.morale += 5; });
                            return 'Snacks = silence. Parenting win!';
                        }
                    }
                ]
            },
            {
                id: 'scenic_overlook',
                title: 'Scenic Overlook',
                description: 'A beautiful scenic overlook! Perfect for a photo op.',
                condition: () => true,
                weight: 10,
                choices: [
                    {
                        text: 'Stop and take pictures [😊 Morale +10]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale += 10; });
                            return 'Great family photos! Everyone is smiling (for once).';
                        }
                    },
                    {
                        text: 'Keep driving [+20 miles]',
                        condition: () => true,
                        effect: () => {
                            GameState.distance += 20;
                            return 'No time for sightseeing! Made good progress.';
                        }
                    }
                ]
            },
            {
                id: 'forgot_something',
                title: 'Forgot Something!',
                description: '"Wait... did we remember to lock the house?"',
                condition: () => true,
                weight: 8,
                choices: [
                    {
                        text: 'Turn around and check',
                        condition: () => GameState.distance < 500,
                        effect: () => {
                            GameState.gas -= 20;
                            GameState.date.setDate(GameState.date.getDate() + 1);
                            return 'Drove all the way back. House was locked. Wasted a day.';
                        }
                    },
                    {
                        text: 'Call a neighbor',
                        condition: () => true,
                        effect: () => {
                            return 'Neighbor checked. Everything is fine. Anxiety relieved!';
                        }
                    },
                    {
                        text: 'Too late now, keep going',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                            return 'Anxiety for the rest of the trip. Great.';
                        }
                    }
                ]
            },
            {
                id: 'fast_food_debate',
                title: 'Fast Food Debate',
                description: 'Everyone wants to eat at a different restaurant.',
                condition: () => true,
                weight: 11,
                choices: [
                    {
                        text: 'Democracy! Take a vote [😊 Morale +3]',
                        condition: () => true,
                        effect: () => {
                            const result = GameState.fastFood();
                            GameState.party.forEach(p => { if (p.alive) p.morale += 3; });
                            return result.message + ' Democracy wins!';
                        }
                    },
                    {
                        text: 'Driver picks',
                        condition: () => true,
                        effect: () => {
                            const result = GameState.fastFood();
                            const loser = GameState.party[Math.floor(Math.random() * GameState.party.length)];
                            if (loser.alive) loser.morale -= 10;
                            return result.message + ' Someone is pouting.';
                        }
                    }
                ]
            },
            {
                id: 'toll_road',
                title: 'Toll Road',
                description: 'Toll booth ahead. $15 or take the long way.',
                condition: () => GameState.distance > 1000,
                weight: 9,
                choices: [
                    {
                        text: 'Pay the toll ($15)',
                        condition: () => GameState.money >= 15,
                        effect: () => {
                            GameState.money -= 15;
                            return 'Paid the toll. Highway is smooth and fast!';
                        }
                    },
                    {
                        text: 'Take the free route',
                        condition: () => true,
                        effect: () => {
                            GameState.gas -= 8;
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 5; });
                            return 'Saved money but hit every red light. Took forever.';
                        }
                    }
                ]
            },
            {
                id: 'car_karaoke',
                title: 'Car Karaoke',
                description: 'Everyone\'s favorite road trip song comes on the radio!',
                condition: () => true,
                weight: 7,
                choices: [
                    {
                        text: 'Sing along! [😊 Morale +15]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale += 15; });
                            return 'Epic family singalong! Best moment of the trip!';
                        }
                    },
                    {
                        text: 'Change the station [😠 Morale -10]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => { if (p.alive) p.morale -= 10; });
                            return 'You monster. Everyone is disappointed.';
                        }
                    }
                ]
            }
        ];
    },
    
    checkForEvent() {
        const eventChance = Math.random();
        
        if (eventChance > 0.7) {
            const availableEvents = this.events.filter(e => e.condition());
            
            if (availableEvents.length === 0) return null;
            
            const totalWeight = availableEvents.reduce((sum, e) => sum + e.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (let event of availableEvents) {
                random -= event.weight;
                if (random <= 0) {
                    return event;
                }
            }
        }
        
        return null;
    }
};
