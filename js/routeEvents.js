const RouteEvents = {
    routePoints: [
        { distance: 200, name: 'Dallas Fork' },
        { distance: 450, name: 'Arkansas Crossroads' },
        { distance: 700, name: 'Memphis Junction' },
        { distance: 950, name: 'St. Louis Split' },
        { distance: 1150, name: 'Indiana Interchange' }
    ],
    
    checkForRouteDecision() {
        const nextRoute = this.routePoints.find(r => 
            GameState.distance >= r.distance && 
            GameState.routeDecisionsMade < this.routePoints.indexOf(r) + 1
        );
        return nextRoute || null;
    },
    
    getRouteEvent(routePoint) {
        GameState.routeDecisionsMade++;
        
        const events = [
            {
                id: 'route_highway_backroad',
                title: `Route Decision: ${routePoint.name}`,
                description: 'You can take the highway (faster but more traffic) or the back roads (scenic but slower).',
                choices: [
                    {
                        text: 'Take the highway [Faster, may hit traffic]',
                        condition: () => true,
                        effect: () => {
                            GameState.inCity = true;
                            const variation = Math.floor(Math.random() * 6) - 2;
                            GameState.party.forEach(p => {
                                if (p.alive) p.morale += variation;
                            });
                            return 'Taking the highway. Hope traffic is light!';
                        }
                    },
                    {
                        text: 'Take the back roads [Slower, scenic +10 morale]',
                        condition: () => true,
                        effect: () => {
                            GameState.inCity = false;
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 6) - 2;
                                    p.morale += 10 + variation;
                                }
                            });
                            GameState.distance -= 20;
                            return 'The scenic route! Beautiful views but adds some distance.';
                        }
                    }
                ]
            },
            {
                id: 'route_toll_free',
                title: `Route Decision: ${routePoint.name}`,
                description: 'There\'s a toll road ahead that\'s faster, or you can take the free route.',
                choices: [
                    {
                        text: 'Pay the toll ($15) [Faster, no delays]',
                        condition: () => GameState.money >= 15,
                        effect: () => {
                            GameState.money -= 15;
                            GameState.distance += 25;
                            return 'Paid the toll. Smooth sailing ahead!';
                        }
                    },
                    {
                        text: 'Take the free route [Slower, -5 morale]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 4) - 2;
                                    p.morale -= 5 + variation;
                                }
                            });
                            Badges.unlock('cheap');
                            return 'Taking the long way around to save money.';
                        }
                    }
                ]
            },
            {
                id: 'route_rest_push',
                title: `Route Decision: ${routePoint.name}`,
                description: 'There\'s a nice rest area coming up. Stop or push through?',
                choices: [
                    {
                        text: 'Stop at rest area [+15 morale, uses time]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 6) - 2;
                                    p.morale += 15 + variation;
                                }
                            });
                            GameState.drivingHours += 1;
                            return 'Nice break! Everyone stretched their legs.';
                        }
                    },
                    {
                        text: 'Push through [-8 morale, save time]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 4) - 2;
                                    p.morale -= 8 + variation;
                                }
                            });
                            GameState.distance += 15;
                            return 'No stops! Making good time but everyone is antsy.';
                        }
                    }
                ]
            },
            {
                id: 'route_detour_attraction',
                title: `Route Decision: ${routePoint.name}`,
                description: 'The kids spotted a sign for a roadside attraction. "Can we go? Please?!"',
                choices: [
                    {
                        text: 'Visit the attraction ($25) [Kids +25, Parents +5]',
                        condition: () => GameState.money >= 25,
                        effect: () => {
                            GameState.money -= 25;
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 6) - 2;
                                    if (p.role === 'son' || p.role === 'daughter') {
                                        p.morale += 25 + variation;
                                    } else {
                                        p.morale += 5 + variation;
                                    }
                                }
                            });
                            GameState.drivingHours += 1;
                            return 'World\'s Largest Ball of Twine! The kids loved it.';
                        }
                    },
                    {
                        text: 'Keep driving [Kids -12, Parents +3]',
                        condition: () => true,
                        effect: () => {
                            GameState.party.forEach(p => {
                                if (p.alive) {
                                    const variation = Math.floor(Math.random() * 4) - 2;
                                    if (p.role === 'son' || p.role === 'daughter') {
                                        p.morale -= 12 + variation;
                                    } else {
                                        p.morale += 3 + variation;
                                    }
                                }
                            });
                            return '"Maybe on the way back..." The kids are disappointed.';
                        }
                    }
                ]
            },
            {
                id: 'route_shortcut',
                title: `Route Decision: ${routePoint.name}`,
                description: 'GPS shows a shortcut through some back roads. Could save time or get you lost.',
                choices: [
                    {
                        text: 'Take the shortcut [50/50: +30 miles or -20 miles]',
                        condition: () => true,
                        effect: () => {
                            if (Math.random() >= 0.5) {
                                GameState.distance += 30;
                                GameState.party.forEach(p => {
                                    if (p.alive) p.morale += 8;
                                });
                                return 'The shortcut worked! Great find!';
                            } else {
                                GameState.distance -= 20;
                                GameState.party.forEach(p => {
                                    if (p.alive) p.morale -= 10;
                                });
                                return 'Got lost on dirt roads. That was a mistake.';
                            }
                        }
                    },
                    {
                        text: 'Stick to the main road [Safe, no change]',
                        condition: () => true,
                        effect: () => {
                            return 'Playing it safe on the main road.';
                        }
                    }
                ]
            }
        ];
        
        return events[GameState.routeDecisionsMade % events.length];
    }
};
