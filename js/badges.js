const Badges = {
    definitions: {
        // Welcome badges (city activities)
        'welcome_houston': {
            name: 'Welcome to Houston',
            description: 'Go to the Space Center NASA',
            icon: '🚀',
            category: 'welcome'
        },
        'welcome_bucees': {
            name: "Welcome to Buc-ee's",
            description: 'Stock up on Beaver Nuggets',
            icon: '🦫',
            category: 'welcome'
        },
        'welcome_texarkana': {
            name: 'Welcome to Texarkana',
            description: 'Take a photo at the Two States Sign',
            icon: '📸',
            category: 'welcome'
        },
        'welcome_littlerock': {
            name: 'Welcome to Little Rock',
            description: 'Visit Central High School Historic Site',
            icon: '🏛️',
            category: 'welcome'
        },
        'welcome_memphis': {
            name: 'Welcome to Memphis',
            description: 'Visit the National Civil Rights Museum',
            icon: '✊',
            category: 'welcome'
        },
        'welcome_mountvernon': {
            name: 'Welcome to Mount Vernon',
            description: 'Visit the Historic Town Square',
            icon: '🏘️',
            category: 'welcome'
        },
        'welcome_chicago': {
            name: 'Welcome to Chicago',
            description: 'Get a photo at Cloud Gate',
            icon: '🫘',
            category: 'welcome'
        },
        'welcome_detroit': {
            name: 'Welcome to Detroit',
            description: 'Visit the Motown Museum',
            icon: '🎵',
            category: 'welcome'
        },
        
        // Trip count badges
        'scout': {
            name: 'Scout',
            description: 'Go on 1 trip',
            icon: '🥾',
            category: 'trips',
            requirement: 1
        },
        'wanderer': {
            name: 'Wanderer',
            description: 'Go on 5 trips',
            icon: '🚶',
            category: 'trips',
            requirement: 5
        },
        'trekker': {
            name: 'Trekker',
            description: 'Go on 10 trips',
            icon: '🎒',
            category: 'trips',
            requirement: 10
        },
        'pathfinder': {
            name: 'Pathfinder',
            description: 'Go on 25 trips',
            icon: '🧭',
            category: 'trips',
            requirement: 25
        },
        'explorer': {
            name: 'Explorer',
            description: 'Go on 50 trips',
            icon: '🗺️',
            category: 'trips',
            requirement: 50
        },
        'adventurer': {
            name: 'Adventurer',
            description: 'Go on 100 trips',
            icon: '⛰️',
            category: 'trips',
            requirement: 100
        },
        'voyager': {
            name: 'Voyager',
            description: 'Go on 250 trips',
            icon: '🛳️',
            category: 'trips',
            requirement: 250
        },
        'navigator': {
            name: 'Navigator',
            description: 'Go on 500 trips',
            icon: '🌟',
            category: 'trips',
            requirement: 500
        },
        'expeditioner': {
            name: 'Expeditioner',
            description: 'Go on 750 trips',
            icon: '🏔️',
            category: 'trips',
            requirement: 750
        },
        'trailblazer': {
            name: 'Trailblazer',
            description: 'Go on 1000 trips',
            icon: '🔥',
            category: 'trips',
            requirement: 1000
        },
        'pioneer': {
            name: 'Pioneer',
            description: 'Go on 5000 trips',
            icon: '👑',
            category: 'trips',
            requirement: 5000
        },
        
        // Streak badges
        'dedication': {
            name: 'Dedication',
            description: 'Get a 1 month streak (30 days)',
            icon: '📅',
            category: 'streaks',
            requirement: 30
        },
        'extreme_dedication': {
            name: 'Extreme Dedication',
            description: 'Get a 6 month streak (180 days)',
            icon: '💪',
            category: 'streaks',
            requirement: 180
        },
        'addiction': {
            name: 'Addiction',
            description: 'Get a 1 year streak (365 days)',
            icon: '🏆',
            category: 'streaks',
            requirement: 365
        },
        
        // Negative event badges (single)
        'custody_battle': {
            name: 'Custody Battle',
            description: 'Have your spouse file for divorce',
            icon: '💔',
            category: 'events'
        },
        'didnt_need_em': {
            name: "Didn't Need Em' Anyway",
            description: 'Have your kids get taken away by CPS',
            icon: '👶',
            category: 'events'
        },
        'kristi_noem': {
            name: 'Kristi Noem Award',
            description: 'Have your dog leave you',
            icon: '🐕',
            category: 'events'
        },
        'move_out_soon': {
            name: "I'll Move Out Soon! Promise!",
            description: "Move to your mom's basement",
            icon: '🏠',
            category: 'events'
        },
        
        // Negative event badges (repeated)
        'permanent_separation': {
            name: 'Permanent Separation',
            description: 'Have your spouse file for divorce 25 times',
            icon: '💔',
            category: 'milestones',
            requirement: 25
        },
        'cps_subscription': {
            name: 'CPS Subscription',
            description: 'Have your kids get taken away by CPS 25 times',
            icon: '📋',
            category: 'milestones',
            requirement: 25
        },
        'deserted_kennel': {
            name: 'Deserted Kennel',
            description: 'Have your dog leave you 25 times',
            icon: '🦴',
            category: 'milestones',
            requirement: 25
        },
        'all_your_base': {
            name: 'All Your Base',
            description: "Move to your mom's basement 25 times",
            icon: '🎮',
            category: 'milestones',
            requirement: 25
        },
        
        // Gameplay badges
        'grumpy_bunch': {
            name: 'Grumpy Bunch',
            description: '"Keep Driving" instead of stopping 20 times',
            icon: '😤',
            category: 'gameplay',
            requirement: 20
        },
        'full_tank': {
            name: 'Full Tank',
            description: 'Gas up 100 times',
            icon: '⛽',
            category: 'gameplay',
            requirement: 100
        },
        'parks_and_rec': {
            name: 'Parks and Rec',
            description: 'Stop at a rest stop 20 times',
            icon: '🌳',
            category: 'gameplay',
            requirement: 20
        },
        
        // Weather/location badges
        'windy_city': {
            name: 'The Windy City',
            description: 'Encounter bad weather in Chicago',
            icon: '🌬️',
            category: 'events'
        },
        
        // Profile badges
        'mistaken_identity': {
            name: 'Mistaken Identity',
            description: 'Add a profile picture',
            icon: '🖼️',
            category: 'profile'
        },
        
        // Difficulty badges
        'you_deserve_better': {
            name: 'You Deserve Better',
            description: 'Complete a game on nightmare',
            icon: '😈',
            category: 'achievements'
        },
        
        // Credit allocation badges
        'happy_family': {
            name: 'Happy Family',
            description: 'Spend 5 credits on morale',
            icon: '😊',
            category: 'setup'
        },
        'scrooge_mcduck': {
            name: 'Scrooge McDuck',
            description: 'Spend 5 credits on money',
            icon: '💰',
            category: 'setup'
        },
        'burp': {
            name: '*Burp*',
            description: 'Spend 5 credits on snacks',
            icon: '🍿',
            category: 'setup'
        },
        'temper_tantrum': {
            name: 'Temper Tantrum',
            description: 'Spend 1 credit on morale',
            icon: '😠',
            category: 'setup'
        },
        'chapter_11': {
            name: 'Chapter 11',
            description: 'Spend 1 credit on money',
            icon: '📉',
            category: 'setup'
        },
        'hungry': {
            name: '"IIIIIIII\'m Hungry!"',
            description: 'Spend 1 credit on snacks',
            icon: '🍕',
            category: 'setup'
        },
        
        // Car trouble badges
        'blam': {
            name: 'Blam!',
            description: 'Pop a tire',
            icon: '💥',
            category: 'events'
        },
        'muy_caliente': {
            name: 'Muy Caliente',
            description: 'Have your engine overheat',
            icon: '🔥',
            category: 'events'
        },
        'nice_try': {
            name: 'Nice Try',
            description: 'Get a speeding ticket',
            icon: '🚔',
            category: 'events'
        },
        
        // Completion badges
        'wow': {
            name: 'Wow',
            description: 'Finish a round with someone over 200 morale',
            icon: '🤩',
            category: 'achievements'
        },
        
        // Choice badges
        'cheap': {
            name: 'Cheap',
            description: 'Decide not to pay a toll',
            icon: '🪙',
            category: 'gameplay'
        },
        'lol': {
            name: 'LOL',
            description: 'Stay at a luxury hotel',
            icon: '🏨',
            category: 'gameplay'
        },
        'my_back_hurts': {
            name: 'My Back Hurts',
            description: 'Sleep in the car',
            icon: '🚗',
            category: 'gameplay'
        },
        
        // Ultimate badge
        'perfectionist': {
            name: 'Perfectionist',
            description: 'Get all other badges',
            icon: '✨',
            category: 'ultimate'
        }
    },
    
    // Stats tracking for badge progress
    stats: {
        keepDrivingCount: 0,
        gasUpCount: 0,
        restStopCount: 0,
        divorceCount: 0,
        cpsCount: 0,
        dogLeftCount: 0,
        basementCount: 0,
        luxuryHotelCount: 0,
        sleepInCarCount: 0,
        tollSkippedCount: 0
    },
    
    init() {
        this.loadStats();
    },
    
    loadStats() {
        const saved = localStorage.getItem('michiganTrailBadgeStats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    },
    
    saveStats() {
        localStorage.setItem('michiganTrailBadgeStats', JSON.stringify(this.stats));
    },
    
    incrementStat(statName) {
        if (this.stats.hasOwnProperty(statName)) {
            this.stats[statName]++;
            this.saveStats();
        }
    },
    
    unlock(badgeId) {
        if (!Profile.data.badges) {
            Profile.data.badges = [];
        }
        
        if (!Profile.data.badges.includes(badgeId) && this.definitions[badgeId]) {
            Profile.data.badges.push(badgeId);
            Profile.save();
            this.showNotification(badgeId);
            this.checkPerfectionist();
            return true;
        }
        return false;
    },
    
    has(badgeId) {
        return Profile.data.badges && Profile.data.badges.includes(badgeId);
    },
    
    showNotification(badgeId) {
        const badge = this.definitions[badgeId];
        if (!badge) return;
        
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <span class="badge-icon">${badge.icon}</span>
                <div class="badge-info">
                    <div class="badge-earned">Badge Earned!</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-desc">${badge.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },
    
    checkTripBadges() {
        const trips = Profile.data.tripsCompleted || 0;
        const tripBadges = ['scout', 'wanderer', 'trekker', 'pathfinder', 'explorer', 
                           'adventurer', 'voyager', 'navigator', 'expeditioner', 'trailblazer', 'pioneer'];
        
        tripBadges.forEach(badgeId => {
            const badge = this.definitions[badgeId];
            if (badge && trips >= badge.requirement && !this.has(badgeId)) {
                this.unlock(badgeId);
            }
        });
    },
    
    checkStreakBadges() {
        const dayStreak = Profile.data.dayStreak || 0;
        
        if (dayStreak >= 30 && !this.has('dedication')) {
            this.unlock('dedication');
        }
        if (dayStreak >= 180 && !this.has('extreme_dedication')) {
            this.unlock('extreme_dedication');
        }
        if (dayStreak >= 365 && !this.has('addiction')) {
            this.unlock('addiction');
        }
    },
    
    checkStatBadges() {
        if (this.stats.keepDrivingCount >= 20 && !this.has('grumpy_bunch')) {
            this.unlock('grumpy_bunch');
        }
        if (this.stats.gasUpCount >= 100 && !this.has('full_tank')) {
            this.unlock('full_tank');
        }
        if (this.stats.restStopCount >= 20 && !this.has('parks_and_rec')) {
            this.unlock('parks_and_rec');
        }
        if (this.stats.divorceCount >= 25 && !this.has('permanent_separation')) {
            this.unlock('permanent_separation');
        }
        if (this.stats.cpsCount >= 25 && !this.has('cps_subscription')) {
            this.unlock('cps_subscription');
        }
        if (this.stats.dogLeftCount >= 25 && !this.has('deserted_kennel')) {
            this.unlock('deserted_kennel');
        }
        if (this.stats.basementCount >= 25 && !this.has('all_your_base')) {
            this.unlock('all_your_base');
        }
    },
    
    checkPerfectionist() {
        const allBadges = Object.keys(this.definitions).filter(id => id !== 'perfectionist');
        const earnedBadges = Profile.data.badges || [];
        
        const hasAll = allBadges.every(id => earnedBadges.includes(id));
        if (hasAll && !this.has('perfectionist')) {
            this.unlock('perfectionist');
        }
    },
    
    getEarnedBadges() {
        const badges = Profile.data.badges || [];
        return badges.map(id => ({
            id,
            ...this.definitions[id]
        })).filter(b => b.name);
    },
    
    getAllBadges() {
        return Object.entries(this.definitions).map(([id, badge]) => ({
            id,
            ...badge,
            earned: this.has(id)
        }));
    }
};
