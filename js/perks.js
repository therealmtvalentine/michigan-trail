const Perks = {
    allPerks: [
        { id: 'heated_driver_seat', name: 'Heated Driver\'s Seat', description: '+1 morale per turn for dad', unlockLevel: 2, icon: '🔥' },
        { id: 'heated_passenger_seat', name: 'Heated Passenger\'s Seat', description: '+1 morale per turn for mom', unlockLevel: 3, icon: '🔥' },
        { id: 'good_parenting', name: 'Good Parenting', description: 'Kids lose 10% less morale from your decisions', unlockLevel: 9, icon: '👨‍👩‍👧‍👦' },
        { id: 'power_brick', name: 'Power Brick', description: '+1 morale per turn for kids', unlockLevel: 13, icon: '🔋' }
    ],
    
    allRewards: [
        { level: 2, reward: 'Heated Driver\'s Seat', icon: '🔥', type: 'perk' },
        { level: 3, reward: 'Heated Passenger\'s Seat', icon: '🔥', type: 'perk' },
        { level: 4, reward: 'Daily Challenges', icon: '🎯', type: 'feature' },
        { level: 5, reward: 'Dark Mode', icon: '🌙', type: 'feature' },
        { level: 6, reward: 'License Plate States (48 States)', icon: '🔢', type: 'feature' },
        { level: 8, reward: 'Crossover Car', icon: '🚙', type: 'car' },
        { level: 9, reward: 'Good Parenting Perk', icon: '👨‍👩‍👧‍👦', type: 'perk' },
        { level: 11, reward: 'Dog Breed Selection', icon: '🐕', type: 'feature' },
        { level: 13, reward: 'Power Brick', icon: '🔋', type: 'perk' },
        { level: 14, reward: 'License Plate Territories', icon: '🏝️', type: 'feature' },
        { level: 15, reward: 'Sedan Car', icon: '🚗', type: 'car' },
        { level: 25, reward: 'Hatchback Car', icon: '🚘', type: 'car' },
        { level: 36, reward: 'SUV Car', icon: '🛻', type: 'car' },
        { level: 49, reward: 'Roadster Car', icon: '🏎️', type: 'car' }
    ],
    
    getUnlockedPerks() {
        const level = Profile.data.level || 1;
        return this.allPerks.filter(p => level >= p.unlockLevel);
    },
    
    hasPerk(perkId) {
        const level = Profile.data.level || 1;
        const perk = this.allPerks.find(p => p.id === perkId);
        return perk && level >= perk.unlockLevel;
    },
    
    getNextReward() {
        const level = Profile.data.level || 1;
        return this.allRewards.find(r => r.level > level);
    },
    
    getRewardsUpToLevel(maxLevel) {
        return this.allRewards.filter(r => r.level <= maxLevel);
    },
    
    applyTurnPerks(party) {
        const level = Profile.data.level || 1;
        
        party.forEach(member => {
            if (!member.alive) return;
            
            // Heated Driver's Seat - +1 morale per turn for dad
            if (member.role === 'husband' && level >= 2) {
                member.morale = Math.min(100, member.morale + 1);
            }
            
            // Heated Passenger's Seat - +1 morale per turn for mom
            if (member.role === 'wife' && level >= 3) {
                member.morale = Math.min(100, member.morale + 1);
            }
            
            // Power Brick - +1 morale per turn for kids
            if ((member.role === 'son' || member.role === 'daughter') && level >= 13) {
                member.morale = Math.min(100, member.morale + 1);
            }
        });
    },
    
    getMoraleLossModifier(member) {
        const level = Profile.data.level || 1;
        
        if ((member.role === 'son' || member.role === 'daughter') && level >= 9) {
            return 0.9;
        }
        return 1.0;
    },
    
    renderRoadmap() {
        const level = Profile.data.level || 1;
        let html = '<div class="reward-roadmap">';
        html += '<h3>Reward Roadmap</h3>';
        html += '<div class="roadmap-list">';
        
        this.allRewards.forEach(reward => {
            const unlocked = level >= reward.level;
            const isCurrent = reward.level === level;
            const isNext = !unlocked && this.getNextReward()?.level === reward.level;
            
            let classes = 'roadmap-item';
            if (unlocked) classes += ' unlocked';
            if (isCurrent) classes += ' current';
            if (isNext) classes += ' next';
            
            html += `
                <div class="${classes}">
                    <span class="roadmap-level">Lvl ${reward.level}</span>
                    <span class="roadmap-icon">${reward.icon}</span>
                    <span class="roadmap-reward">${reward.reward}</span>
                    <span class="roadmap-status">${unlocked ? '✓' : '🔒'}</span>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    },
    
    renderNextReward() {
        const nextReward = this.getNextReward();
        if (!nextReward) {
            return '<div class="next-reward">You\'ve unlocked everything! 🎉</div>';
        }
        
        return `
            <div class="next-reward">
                <span class="next-label">Next Unlock:</span>
                <span class="next-icon">${nextReward.icon}</span>
                <span class="next-name">${nextReward.reward}</span>
                <span class="next-level">(Level ${nextReward.level})</span>
            </div>
        `;
    }
};
