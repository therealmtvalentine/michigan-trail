const Profile = {
    data: {
        username: 'Guest',
        email: '',
        password: '',
        profilePhoto: '',
        totalXP: 0,
        level: 1,
        tripsCompleted: 0,
        bestScore: 0,
        membersLost: 0,
        isRegistered: false,
        friends: [],
        friendRequests: [],
        sentRequests: [],
        lastPlayDate: null,
        lastCompletedDate: null,
        dayStreak: 0,
        weekStreakClaimed: 0,
        badges: [],
        darkMode: false,
        car: {
            type: 'minivan',
            primaryColor: 'white',
            secondaryColor: 'black',
            licensePlate: 'MICH-TRL',
            plateState: 'TX'
        },
        family: {
            dad: 'Dad',
            mom: 'Mom',
            son: 'Boy',
            daughter: 'Girl',
            dog: 'Buddy',
            dogBreed: 'mixed'
        },
        dailyChallenge: {
            date: null,
            challenge: null,
            completed: false
        }
    },
    
    allProfiles: [],
    
    levelThresholds: [
        0,      // Level 1: 0 XP
        50,     // Level 2: 50 XP
        100,    // Level 3: 100 XP
        200,    // Level 4: 200 XP
        300,    // Level 5: 300 XP
        500,    // Level 6: 500 XP
        750,    // Level 7: 750 XP
        1000,   // Level 8: 1000 XP
        1250,   // Level 9: 1250 XP
        1500,   // Level 10: 1500 XP
        1750,   // Level 11: 1750 XP
        2000,   // Level 12: 2000 XP
        2250,   // Level 13: 2250 XP
        2500,   // Level 14: 2500 XP
        2750,   // Level 15: 2750 XP
        3000,   // Level 16: 3000 XP
        3250,   // Level 17: 3250 XP
        3500,   // Level 18: 3500 XP
        3750,   // Level 19: 3750 XP
        4000,   // Level 20: 4000 XP
        4250,   // Level 21: 4250 XP
        4500,   // Level 22: 4500 XP
        4750,   // Level 23: 4750 XP
        5000,   // Level 24: 5000 XP
        5500,   // Level 25: 5500 XP
        6000,   // Level 26: 6000 XP
        6500,   // Level 27: 6500 XP
        7000,   // Level 28: 7000 XP
        7500,   // Level 29: 7500 XP
        8000,   // Level 30: 8000 XP
        8500,   // Level 31: 8500 XP
        9000,   // Level 32: 9000 XP
        9500,   // Level 33: 9500 XP
        10000,  // Level 34: 10000 XP
        11000,  // Level 35: 11000 XP
        12000,  // Level 36: 12000 XP
        13000,  // Level 37: 13000 XP
        14000,  // Level 38: 14000 XP
        15000,  // Level 39: 15000 XP
        16000,  // Level 40: 16000 XP
        17000,  // Level 41: 17000 XP
        18000,  // Level 42: 18000 XP
        19000,  // Level 43: 19000 XP
        20000,  // Level 44: 20000 XP
        25000,  // Level 45: 25000 XP
        30000,  // Level 46: 30000 XP
        35000,  // Level 47: 35000 XP
        40000,  // Level 48: 40000 XP
        45000,  // Level 49: 45000 XP
        50000,  // Level 50: 50000 XP
        100000  // Level 51 (max): 100000 XP
    ],
    
    init() {
        this.load();
        this.updateDisplay();
        this.setupEventListeners();
    },
    
    load() {
        const saved = localStorage.getItem('michiganTrailProfile');
        if (saved) {
            const loadedData = JSON.parse(saved);
            // Merge loaded data with defaults to preserve all fields
            this.data = { ...this.data, ...loadedData };
            if (!this.data.friends) this.data.friends = [];
            if (!this.data.friendRequests) this.data.friendRequests = [];
            if (!this.data.sentRequests) this.data.sentRequests = [];
            if (!this.data.family) {
                this.data.family = {
                    dad: 'Dad',
                    mom: 'Mom',
                    son: 'Boy',
                    daughter: 'Girl',
                    dog: 'Buddy',
                    dogBreed: 'mixed'
                };
            }
            if (!this.data.dailyChallenge) {
                this.data.dailyChallenge = {
                    date: null,
                    challenge: null,
                    completed: false
                };
            }
            // Fix data inconsistency: if username is set and not Guest, mark as registered
            if (this.data.username && this.data.username !== 'Guest' && !this.data.isRegistered) {
                this.data.isRegistered = true;
                this.save();
            }
            console.log('Profile loaded, isRegistered:', this.data.isRegistered, 'username:', this.data.username);
        }
        this.loadAllProfiles();
    },
    
    save() {
        localStorage.setItem('michiganTrailProfile', JSON.stringify(this.data));
        if (this.data.isRegistered && this.data.username !== 'Guest') {
            localStorage.setItem('michiganTrailProfile_' + this.data.username, JSON.stringify(this.data));
        }
        this.saveToAllProfiles();
    },
    
    loadAllProfiles() {
        const saved = localStorage.getItem('michiganTrailAllProfiles');
        if (saved) {
            this.allProfiles = JSON.parse(saved);
        }
    },
    
    saveAllProfiles() {
        localStorage.setItem('michiganTrailAllProfiles', JSON.stringify(this.allProfiles));
    },
    
    saveToAllProfiles() {
        if (!this.data.isRegistered) return;
        const index = this.allProfiles.findIndex(p => p.username === this.data.username);
        const publicData = {
            username: this.data.username,
            profilePhoto: this.data.profilePhoto,
            totalXP: this.data.totalXP,
            level: this.data.level,
            tripsCompleted: this.data.tripsCompleted,
            bestScore: this.data.bestScore,
            membersLost: this.data.membersLost
        };
        if (index >= 0) {
            this.allProfiles[index] = publicData;
        } else {
            this.allProfiles.push(publicData);
        }
        this.saveAllProfiles();
    },
    
    searchUsers(query) {
        if (!query || query.length < 2) return [];
        const lowerQuery = query.toLowerCase();
        return this.allProfiles.filter(p => 
            p.username.toLowerCase().includes(lowerQuery) && 
            p.username !== this.data.username
        );
    },
    
    sendFriendRequest(username) {
        if (this.data.friends.includes(username)) return 'Already friends';
        if (this.data.sentRequests.includes(username)) return 'Request already sent';
        
        this.data.sentRequests.push(username);
        this.save();
        
        const targetProfile = localStorage.getItem('michiganTrailProfile_' + username);
        if (targetProfile) {
            const target = JSON.parse(targetProfile);
            if (!target.friendRequests) target.friendRequests = [];
            if (!target.friendRequests.includes(this.data.username)) {
                target.friendRequests.push(this.data.username);
                localStorage.setItem('michiganTrailProfile_' + username, JSON.stringify(target));
            }
        }
        
        return 'Request sent!';
    },
    
    acceptFriendRequest(username) {
        const index = this.data.friendRequests.indexOf(username);
        if (index === -1) return;
        
        this.data.friendRequests.splice(index, 1);
        if (!this.data.friends.includes(username)) {
            this.data.friends.push(username);
        }
        this.save();
        this.updateFriendsDisplay();
    },
    
    declineFriendRequest(username) {
        const index = this.data.friendRequests.indexOf(username);
        if (index >= 0) {
            this.data.friendRequests.splice(index, 1);
            this.save();
            this.updateFriendsDisplay();
        }
    },
    
    getFriendData(username) {
        return this.allProfiles.find(p => p.username === username);
    },
    
    updateFriendsDisplay() {
        const requestsList = document.getElementById('friend-requests-list');
        const friendsList = document.getElementById('friends-list');
        
        if (this.data.friendRequests && this.data.friendRequests.length > 0) {
            requestsList.innerHTML = this.data.friendRequests.map(username => {
                const userData = this.getFriendData(username);
                return `
                    <div class="request-item">
                        <div class="friend-info">
                            <div class="friend-avatar">👤</div>
                            <div>
                                <div class="friend-name">${username}</div>
                                <div class="friend-level">Level ${userData ? userData.level : 1}</div>
                            </div>
                        </div>
                        <div class="request-actions">
                            <button class="accept-btn" onclick="Profile.acceptFriendRequest('${username}')">✓</button>
                            <button class="decline-btn" onclick="Profile.declineFriendRequest('${username}')">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            requestsList.innerHTML = '<p class="empty-message">No pending requests</p>';
        }
        
        if (this.data.friends && this.data.friends.length > 0) {
            friendsList.innerHTML = this.data.friends.map(username => {
                const userData = this.getFriendData(username);
                return `
                    <div class="friend-item" onclick="Profile.viewFriendProfile('${username}')">
                        <div class="friend-info">
                            <div class="friend-avatar">👤</div>
                            <div>
                                <div class="friend-name">${username}</div>
                                <div class="friend-level">Level ${userData ? userData.level : 1} • ${userData ? userData.totalXP : 0} XP</div>
                            </div>
                        </div>
                        <div class="friend-actions">
                            <button onclick="event.stopPropagation(); Profile.viewFriendProfile('${username}')">View</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            friendsList.innerHTML = '<p class="empty-message">No friends yet. Search for users to add!</p>';
        }
    },
    
    viewFriendProfile(username) {
        const userData = this.getFriendData(username);
        if (!userData) return;
        
        document.getElementById('friend-profile-name').textContent = username;
        document.getElementById('friend-level').textContent = userData.level;
        document.getElementById('friend-xp').textContent = userData.totalXP;
        document.getElementById('friend-trips').textContent = userData.tripsCompleted;
        document.getElementById('friend-best-score').textContent = userData.bestScore;
        document.getElementById('friend-members-lost').textContent = userData.membersLost;
        
        const photoImg = document.getElementById('friend-photo-img');
        const photoPlaceholder = document.getElementById('friend-photo-placeholder');
        if (userData.profilePhoto) {
            photoImg.src = userData.profilePhoto;
            photoImg.style.display = 'block';
            photoPlaceholder.style.display = 'none';
        } else {
            photoImg.style.display = 'none';
            photoPlaceholder.style.display = 'block';
        }
        
        this.showScreen('friend-profile-screen');
    },
    
    searchAndDisplayResults(query) {
        const results = this.searchUsers(query);
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = query.length >= 2 ? 
                '<p class="empty-message">No users found</p>' : 
                '<p class="empty-message">Enter at least 2 characters</p>';
            return;
        }
        
        resultsContainer.innerHTML = results.map(user => {
            const isFriend = this.data.friends.includes(user.username);
            const requestSent = this.data.sentRequests.includes(user.username);
            
            let buttonHtml = '';
            if (isFriend) {
                buttonHtml = '<button disabled>Friends ✓</button>';
            } else if (requestSent) {
                buttonHtml = '<button disabled>Pending...</button>';
            } else {
                buttonHtml = `<button onclick="Profile.sendFriendRequestAndUpdate('${user.username}')">Add Friend</button>`;
            }
            
            return `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <div class="friend-avatar">👤</div>
                        <div>
                            <div class="friend-name">${user.username}</div>
                            <div class="friend-level">Level ${user.level} • ${user.totalXP} XP</div>
                        </div>
                    </div>
                    <div class="friend-actions">
                        ${buttonHtml}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    sendFriendRequestAndUpdate(username) {
        const result = this.sendFriendRequest(username);
        const query = document.getElementById('friend-search-input').value;
        this.searchAndDisplayResults(query);
    },
    
    calculateLevel(xp) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (xp >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    },
    
    getXPForCurrentLevel() {
        const level = this.data.level;
        const currentThreshold = this.levelThresholds[level - 1] || 0;
        return this.data.totalXP - currentThreshold;
    },
    
    getXPNeededForNextLevel() {
        const level = this.data.level;
        if (level >= this.levelThresholds.length) {
            return 0; // Max level
        }
        const nextThreshold = this.levelThresholds[level];
        const currentThreshold = this.levelThresholds[level - 1] || 0;
        return nextThreshold - currentThreshold;
    },
    
    getTotalXPForLevel(level) {
        if (level >= this.levelThresholds.length) {
            return this.levelThresholds[this.levelThresholds.length - 1];
        }
        return this.levelThresholds[level] || this.levelThresholds[this.levelThresholds.length - 1];
    },
    
    addXP(amount) {
        const oldLevel = this.data.level;
        this.data.totalXP += amount;
        this.data.level = this.calculateLevel(this.data.totalXP);
        this.save();
        this.updateDisplay();
        
        if (this.data.level > oldLevel) {
            return true;
        }
        return false;
    },
    
    completeTrip(score, membersLost) {
        this.data.tripsCompleted++;
        if (score > this.data.bestScore) {
            this.data.bestScore = score;
        }
        this.data.membersLost += membersLost;
        
        const xpGained = Math.floor(score / 10);
        const leveledUp = this.addXP(xpGained);
        
        // Update streak on game completion
        const streakResult = this.updateStreakOnCompletion();
        
        this.save();
        return { xpGained, leveledUp, newLevel: this.data.level, streakResult };
    },
    
    updateStreakOnCompletion() {
        if (!this.data.isRegistered) return { streakBonus: 0, weekStreak: 0, dayStreak: 0 };
        
        const today = this.getDateString(new Date());
        const lastCompletedDate = this.data.lastCompletedDate;
        
        let streakBonus = 0;
        
        if (!lastCompletedDate) {
            this.data.dayStreak = 1;
            this.data.lastCompletedDate = today;
        } else if (lastCompletedDate === today) {
            // Already completed a game today, no change to streak
        } else {
            const lastDate = new Date(lastCompletedDate);
            const currentDate = new Date(today);
            const daysDiff = Math.round((currentDate - lastDate) / (24 * 60 * 60 * 1000));
            
            if (daysDiff === 1) {
                // Consecutive day - increase streak
                this.data.dayStreak++;
                this.data.lastCompletedDate = today;
            } else {
                // Missed a day - reset streak
                this.data.dayStreak = 1;
                this.data.lastCompletedDate = today;
                this.data.weekStreakClaimed = 0;
            }
        }
        
        const currentWeekStreak = Math.floor(this.data.dayStreak / 7);
        
        if (currentWeekStreak > this.data.weekStreakClaimed) {
            const newWeeks = currentWeekStreak - this.data.weekStreakClaimed;
            streakBonus = 200 * newWeeks;
            this.data.weekStreakClaimed = currentWeekStreak;
        }
        
        this.save();
        this.updateDisplay();
        
        // Check streak badges
        if (typeof Badges !== 'undefined') {
            Badges.checkStreakBadges();
        }
        
        return { streakBonus, weekStreak: currentWeekStreak, dayStreak: this.data.dayStreak };
    },
    
    getDateString(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    
    checkAndUpdateStreak() {
        if (!this.data.isRegistered) return { streakBonus: 0, weekStreak: 0 };
        
        const today = this.getDateString(new Date());
        const lastPlayDate = this.data.lastPlayDate;
        
        let streakBonus = 0;
        
        if (!lastPlayDate) {
            this.data.dayStreak = 1;
            this.data.lastPlayDate = today;
        } else if (lastPlayDate === today) {
            // Same day, no change to streak
        } else {
            const lastDate = new Date(lastPlayDate);
            const currentDate = new Date(today);
            const daysDiff = Math.round((currentDate - lastDate) / (24 * 60 * 60 * 1000));
            
            if (daysDiff === 1) {
                this.data.dayStreak++;
                this.data.lastPlayDate = today;
            } else {
                this.data.dayStreak = 1;
                this.data.lastPlayDate = today;
            }
        }
        
        const currentWeekStreak = Math.floor(this.data.dayStreak / 7);
        
        if (currentWeekStreak > this.data.weekStreakClaimed) {
            const newWeeks = currentWeekStreak - this.data.weekStreakClaimed;
            streakBonus = 200 * newWeeks;
            this.data.weekStreakClaimed = currentWeekStreak;
        }
        
        this.save();
        this.updateDisplay();
        
        // Check streak badges
        if (typeof Badges !== 'undefined') {
            Badges.checkStreakBadges();
        }
        
        return { streakBonus, weekStreak: currentWeekStreak, dayStreak: this.data.dayStreak };
    },
    
    register(username, email, password) {
        this.data.username = username;
        this.data.email = email;
        this.data.password = password;
        this.data.isRegistered = true;
        this.data.friends = this.data.friends || [];
        this.data.friendRequests = this.data.friendRequests || [];
        this.data.sentRequests = this.data.sentRequests || [];
        this.save();
        localStorage.setItem('michiganTrailProfile_' + username, JSON.stringify(this.data));
        this.updateDisplay();
    },
    
    validateSignup(username, email, password, confirmPassword) {
        if (!username || username.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (!email || !email.includes('@')) {
            return 'Please enter a valid email';
        }
        if (!password || password.length < 4) {
            return 'Password must be at least 4 characters';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    },
    
    updateUsername(newUsername) {
        if (newUsername && newUsername.length >= 3) {
            this.data.username = newUsername;
            this.save();
            this.updateDisplay();
            return true;
        }
        return false;
    },
    
    setProfilePhoto(photoData) {
        this.data.profilePhoto = photoData;
        this.save();
        this.updatePhotoDisplay();
        Badges.unlock('mistaken_identity');
    },
    
    updatePhotoDisplay() {
        const img = document.getElementById('profile-photo-img');
        const placeholder = document.getElementById('profile-photo-placeholder');
        if (this.data.profilePhoto) {
            img.src = this.data.profilePhoto;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            img.style.display = 'none';
            placeholder.style.display = 'block';
        }
    },
    
    logout() {
        localStorage.setItem('michiganTrailProfile_' + this.data.username, JSON.stringify(this.data));
        
        this.data = {
            username: 'Guest',
            email: '',
            password: '',
            profilePhoto: '',
            totalXP: 0,
            level: 1,
            tripsCompleted: 0,
            bestScore: 0,
            membersLost: 0,
            isRegistered: false,
            friends: [],
            friendRequests: [],
            sentRequests: []
        };
        localStorage.removeItem('michiganTrailProfile');
        this.updateDisplay();
    },
    
    login(username, password) {
        const savedProfile = localStorage.getItem('michiganTrailProfile_' + username);
        if (!savedProfile) {
            return 'Account not found';
        }
        
        const profile = JSON.parse(savedProfile);
        if (profile.password !== password) {
            return 'Incorrect password';
        }
        
        this.data = profile;
        this.data.friends = this.data.friends || [];
        this.data.friendRequests = this.data.friendRequests || [];
        this.data.sentRequests = this.data.sentRequests || [];
        this.save();
        this.updateDisplay();
        return null;
    },
    
    deleteAccount() {
        const username = this.data.username;
        this.data = {
            username: 'Guest',
            email: '',
            password: '',
            profilePhoto: '',
            totalXP: 0,
            level: 1,
            tripsCompleted: 0,
            bestScore: 0,
            membersLost: 0,
            isRegistered: false,
            friends: [],
            friendRequests: [],
            sentRequests: []
        };
        localStorage.removeItem('michiganTrailProfile');
        localStorage.removeItem('michiganTrailProfile_' + username);
        
        const index = this.allProfiles.findIndex(p => p.username === username);
        if (index >= 0) {
            this.allProfiles.splice(index, 1);
            this.saveAllProfiles();
        }
        
        this.updateDisplay();
    },
    
    updateDisplay() {
        const profileLoggedIn = document.getElementById('profile-logged-in');
        const profileLoggedOut = document.getElementById('profile-logged-out');
        const manageLoggedIn = document.getElementById('manage-logged-in');
        const manageLoggedOut = document.getElementById('manage-logged-out');
        
        if (this.data.isRegistered) {
            // Show logged-in views
            if (profileLoggedIn) profileLoggedIn.style.display = 'block';
            if (profileLoggedOut) profileLoggedOut.style.display = 'none';
            if (manageLoggedIn) manageLoggedIn.style.display = 'block';
            if (manageLoggedOut) manageLoggedOut.style.display = 'none';
            
            // Update profile info
            document.getElementById('profile-name').textContent = this.data.username;
            document.getElementById('profile-xp').textContent = `${this.data.totalXP} XP`;
            document.getElementById('profile-level').textContent = this.data.level;
            
            const currentLevelXP = this.getXPForCurrentLevel();
            const xpNeededForNext = this.getXPNeededForNextLevel();
            const totalXPNeeded = this.getTotalXPForLevel(this.data.level);
            const xpBarFill = document.getElementById('xp-bar-fill');
            if (xpBarFill) {
                if (xpNeededForNext > 0) {
                    xpBarFill.style.width = `${(currentLevelXP / xpNeededForNext) * 100}%`;
                } else {
                    xpBarFill.style.width = '100%'; // Max level
                }
            }
            
            const xpProgress = document.getElementById('xp-progress');
            if (xpProgress) {
                xpProgress.textContent = `${this.data.totalXP}/${totalXPNeeded} XP`;
            }
            
            const profileStreak = document.getElementById('profile-streak');
            const streakDays = document.getElementById('streak-days');
            if (profileStreak && streakDays) {
                if (this.data.dayStreak > 0) {
                    profileStreak.style.display = 'block';
                    streakDays.textContent = this.data.dayStreak;
                } else {
                    profileStreak.style.display = 'none';
                }
            }
        } else {
            // Show logged-out views
            if (profileLoggedIn) profileLoggedIn.style.display = 'none';
            if (profileLoggedOut) profileLoggedOut.style.display = 'block';
            if (manageLoggedIn) manageLoggedIn.style.display = 'none';
            if (manageLoggedOut) manageLoggedOut.style.display = 'block';
            
            const profileStreak = document.getElementById('profile-streak');
            if (profileStreak) profileStreak.style.display = 'none';
        }
        
        const statsTotalXP = document.getElementById('stats-total-xp');
        if (statsTotalXP) statsTotalXP.textContent = this.data.totalXP;
        
        const statsTrips = document.getElementById('stats-trips');
        if (statsTrips) statsTrips.textContent = this.data.tripsCompleted;
        
        const statsBestScore = document.getElementById('stats-best-score');
        if (statsBestScore) statsBestScore.textContent = this.data.bestScore;
        
        const statsMembersLost = document.getElementById('stats-members-lost');
        if (statsMembersLost) statsMembersLost.textContent = this.data.membersLost;
    },
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },
    
    setupEventListeners() {
        document.getElementById('new-trip-btn').addEventListener('click', () => {
            this.showScreen('setup-screen');
        });
        
        
        document.getElementById('save-profile-btn').addEventListener('click', () => {
            const username = document.getElementById('profile-username-input').value.trim();
            const email = document.getElementById('profile-email-input').value.trim();
            const password = document.getElementById('profile-password-input').value;
            const confirmPassword = document.getElementById('profile-password-confirm').value;
            
            const error = this.validateSignup(username, email, password, confirmPassword);
            const errorEl = document.getElementById('profile-error');
            
            if (error) {
                errorEl.textContent = error;
                errorEl.style.display = 'block';
                return;
            }
            
            this.register(username, email, password);
            this.showScreen('main-menu');
        });
        
        document.getElementById('cancel-profile-btn').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('back-stats-btn').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('back-manage-btn').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('save-manage-btn').addEventListener('click', () => {
            const newUsername = document.getElementById('manage-username-input').value.trim();
            if (this.updateUsername(newUsername)) {
                this.showScreen('main-menu');
            }
        });
        
        document.getElementById('upload-photo-btn').addEventListener('click', () => {
            document.getElementById('profile-photo-input').click();
        });
        
        document.getElementById('profile-photo-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.setProfilePhoto(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
            this.showScreen('main-menu');
        });
        
        document.getElementById('delete-account-btn').addEventListener('click', () => {
            document.getElementById('delete-confirm').classList.remove('hidden');
        });
        
        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            document.getElementById('delete-confirm').classList.add('hidden');
        });
        
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            this.deleteAccount();
            this.showScreen('main-menu');
        });
        
        document.getElementById('show-password-toggle').addEventListener('change', (e) => {
            const type = e.target.checked ? 'text' : 'password';
            document.getElementById('profile-password-input').type = type;
            document.getElementById('profile-password-confirm').type = type;
        });
        
        document.getElementById('friends-btn').addEventListener('click', () => {
            if (!this.data.isRegistered) {
                alert('Please create a profile first to add friends!');
                return;
            }
            document.getElementById('friend-search-input').value = '';
            document.getElementById('search-results').innerHTML = '';
            this.updateFriendsDisplay();
            this.showScreen('friends-screen');
        });
        
        document.getElementById('search-friend-btn').addEventListener('click', () => {
            const query = document.getElementById('friend-search-input').value.trim();
            this.searchAndDisplayResults(query);
        });
        
        document.getElementById('friend-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = document.getElementById('friend-search-input').value.trim();
                this.searchAndDisplayResults(query);
            }
        });
        
        document.getElementById('back-friends-btn').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('back-from-friend-btn').addEventListener('click', () => {
            this.showScreen('friends-screen');
        });
        
        document.getElementById('go-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-username-input').value = '';
            document.getElementById('login-password-input').value = '';
            document.getElementById('login-error').style.display = 'none';
            this.showScreen('login-screen');
        });
        
        document.getElementById('go-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('profile-screen');
        });
        
        document.getElementById('login-btn').addEventListener('click', () => {
            const username = document.getElementById('login-username-input').value.trim();
            const password = document.getElementById('login-password-input').value;
            const errorEl = document.getElementById('login-error');
            
            if (!username || !password) {
                errorEl.textContent = 'Please enter username and password';
                errorEl.style.display = 'block';
                return;
            }
            
            const error = this.login(username, password);
            if (error) {
                errorEl.textContent = error;
                errorEl.style.display = 'block';
                return;
            }
            
            this.showScreen('main-menu');
        });
        
        document.getElementById('cancel-login-btn').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('show-login-password-toggle').addEventListener('change', (e) => {
            const type = e.target.checked ? 'text' : 'password';
            document.getElementById('login-password-input').type = type;
        });
        
        document.getElementById('google-signup-btn').addEventListener('click', () => {
            this.initiateGoogleSignIn('signup');
        });
        
        document.getElementById('google-login-btn').addEventListener('click', () => {
            this.initiateGoogleSignIn('login');
        });
    },
    
    initiateGoogleSignIn(mode) {
        if (typeof google === 'undefined') {
            alert('Google Sign-In is loading. Please try again in a moment.');
            return;
        }
        
        this.googleSignInMode = mode;
        
        google.accounts.id.initialize({
            client_id: 'demo-client-id.apps.googleusercontent.com',
            callback: (response) => this.handleGoogleSignIn(response),
            auto_select: false
        });
        
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                this.simulateGoogleSignIn(mode);
            }
        });
    },
    
    simulateGoogleSignIn(mode) {
        const googleEmail = prompt('Enter your Google email to sign in:');
        if (!googleEmail || !googleEmail.includes('@')) {
            return;
        }
        
        const username = googleEmail.split('@')[0];
        
        const existingProfile = localStorage.getItem('michiganTrailProfile_google_' + username);
        
        if (existingProfile) {
            const profile = JSON.parse(existingProfile);
            this.data = profile;
            this.data.friends = this.data.friends || [];
            this.data.friendRequests = this.data.friendRequests || [];
            this.data.sentRequests = this.data.sentRequests || [];
            this.save();
            this.updateDisplay();
            this.showScreen('main-menu');
        } else {
            if (mode === 'login') {
                const createNew = confirm('No account found with this Google account. Would you like to create one?');
                if (!createNew) return;
            }
            
            this.data.username = username;
            this.data.email = googleEmail;
            this.data.password = 'google_oauth_' + Date.now();
            this.data.isRegistered = true;
            this.data.isGoogleAccount = true;
            this.data.friends = [];
            this.data.friendRequests = [];
            this.data.sentRequests = [];
            this.save();
            localStorage.setItem('michiganTrailProfile_google_' + username, JSON.stringify(this.data));
            this.updateDisplay();
            this.showScreen('main-menu');
        }
    },
    
    handleGoogleSignIn(response) {
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const email = payload.email;
            const name = payload.name || email.split('@')[0];
            
            const existingProfile = localStorage.getItem('michiganTrailProfile_google_' + name);
            
            if (existingProfile) {
                const profile = JSON.parse(existingProfile);
                this.data = profile;
                this.save();
                this.updateDisplay();
            } else {
                this.data.username = name;
                this.data.email = email;
                this.data.password = 'google_oauth_' + payload.sub;
                this.data.isRegistered = true;
                this.data.isGoogleAccount = true;
                this.data.friends = [];
                this.data.friendRequests = [];
                this.data.sentRequests = [];
                this.save();
                localStorage.setItem('michiganTrailProfile_google_' + name, JSON.stringify(this.data));
                this.updateDisplay();
            }
            
            this.showScreen('main-menu');
        } catch (e) {
            console.error('Google sign-in error:', e);
            this.simulateGoogleSignIn(this.googleSignInMode);
        }
    }
};
