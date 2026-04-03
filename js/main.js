let gameLoop;

async function init() {
    // Load images first
    console.log('Loading images...');
    await ImageLoader.init();
    console.log('Images loaded!');
    
    Profile.init();
    Badges.init();
    Stereo.init();
    Renderer.init();
    UI.init();
    EventSystem.init();
    Locations.init();
    
    document.getElementById('close-badges-btn').addEventListener('click', () => {
        document.getElementById('badges-modal').style.display = 'none';
    });
    
    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        showSettingsScreen();
    });
    
    document.getElementById('back-settings-btn').addEventListener('click', () => {
        document.getElementById('settings-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    // Profile dropdown toggle
    document.getElementById('menu-profile-clickable').addEventListener('click', (e) => {
        // Don't toggle if clicking a button inside
        if (e.target.tagName === 'BUTTON') return;
        const dropdown = document.getElementById('profile-dropdown');
        dropdown.classList.toggle('active');
    });
    
    // Dropdown buttons
    document.getElementById('dropdown-car-btn').addEventListener('click', () => {
        document.getElementById('profile-dropdown').classList.remove('active');
        showCarScreen();
    });
    
    document.getElementById('dropdown-badges-btn').addEventListener('click', () => {
        document.getElementById('profile-dropdown').classList.remove('active');
        showBadgesModal();
    });
    
    document.getElementById('dropdown-stats-btn').addEventListener('click', () => {
        document.getElementById('profile-dropdown').classList.remove('active');
        showStatsScreen();
    });
    
    // Corner icons
    document.getElementById('corner-challenges-btn').addEventListener('click', () => {
        showChallengesScreen();
    });
    
    document.getElementById('corner-profile-btn').addEventListener('click', () => {
        // If logged in, populate manage profile fields
        if (Profile.data.isRegistered) {
            document.getElementById('manage-username-input').value = Profile.data.username || '';
            document.getElementById('manage-email-display').textContent = Profile.data.email || '';
            
            // Show/hide profile photo
            const photoImg = document.getElementById('profile-photo-img');
            const photoPlaceholder = document.getElementById('profile-photo-placeholder');
            if (Profile.data.profilePhoto) {
                photoImg.src = Profile.data.profilePhoto;
                photoImg.style.display = 'block';
                photoPlaceholder.style.display = 'none';
            } else {
                photoImg.style.display = 'none';
                photoPlaceholder.style.display = 'block';
            }
        }
        
        document.getElementById('main-menu').classList.remove('active');
        document.getElementById('manage-profile-screen').classList.add('active');
    });
    
    // Create account button (for logged out users)
    document.getElementById('create-account-btn').addEventListener('click', () => {
        const username = document.getElementById('create-username-input').value.trim();
        const email = document.getElementById('create-email-input').value.trim();
        const password = document.getElementById('create-password-input').value;
        const confirmPassword = document.getElementById('create-password-confirm').value;
        
        const error = Profile.validateSignup(username, email, password, confirmPassword);
        if (error) {
            alert(error);
            return;
        }
        
        Profile.register(username, email, password);
        document.getElementById('manage-profile-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    // Back button for create account screen
    document.getElementById('back-create-btn').addEventListener('click', () => {
        document.getElementById('manage-profile-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    // Go to login from create account screen
    document.getElementById('go-to-login-from-create').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('manage-profile-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
    });
    
    document.getElementById('back-car-btn').addEventListener('click', () => {
        document.getElementById('car-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    // Family button
    document.getElementById('family-btn').addEventListener('click', () => {
        showFamilyScreen();
    });
    
    document.getElementById('back-family-btn').addEventListener('click', () => {
        document.getElementById('family-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    document.getElementById('save-family-btn').addEventListener('click', () => {
        saveFamily();
    });
    
    // Dog breed search
    document.getElementById('dog-breed-search').addEventListener('input', (e) => {
        const value = e.target.value;
        const breed = DOG_BREEDS.find(b => b.toLowerCase() === value.toLowerCase());
        if (breed) {
            Profile.data.family.dogBreed = breed.toLowerCase();
            document.getElementById('selected-breed').textContent = breed;
        }
    });
    
    document.getElementById('back-challenges-btn').addEventListener('click', () => {
        document.getElementById('challenges-screen').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    });
    
    // Stereo toggle
    document.getElementById('stereo-toggle-btn').addEventListener('click', () => {
        const panel = document.getElementById('stereo-panel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            panel.innerHTML = Stereo.renderStereoPanel();
            Stereo.setupEventListeners();
        }
    });
    
    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        toggleDarkMode(e.target.checked);
    });
    
    // Apply saved dark mode on load
    if (Profile.data.darkMode && Profile.data.level >= 5) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').checked = true;
    }
    
    // Escape key to close modals and screens
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close badges modal
            const badgesModal = document.getElementById('badges-modal');
            if (badgesModal.style.display === 'flex') {
                badgesModal.style.display = 'none';
                return;
            }
            
            // Close badge detail popup
            const badgeDetail = document.getElementById('badge-detail-popup');
            if (badgeDetail && badgeDetail.style.display === 'flex') {
                badgeDetail.style.display = 'none';
                return;
            }
            
            // Close other screens and return to main menu
            const screens = ['profile-screen', 'manage-profile-screen', 'stats-screen', 'settings-screen', 'car-screen', 'family-screen', 'challenges-screen', 'friends-screen', 'friend-profile-screen', 'setup-screen'];
            screens.forEach(screenId => {
                const screen = document.getElementById(screenId);
                if (screen && screen.classList.contains('active')) {
                    screen.classList.remove('active');
                    document.getElementById('main-menu').classList.add('active');
                }
            });
        }
    });
    
    startGameLoop();
}

function showSettingsScreen() {
    const level = Profile.data.level || 1;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeDesc = document.getElementById('dark-mode-desc');
    const darkModeSetting = document.getElementById('dark-mode-setting');
    
    if (level >= 5) {
        darkModeToggle.disabled = false;
        darkModeDesc.textContent = 'A darker theme for night driving';
        darkModeSetting.classList.remove('locked');
        darkModeToggle.checked = Profile.data.darkMode || false;
    } else {
        darkModeToggle.disabled = true;
        darkModeDesc.textContent = `Unlocks at Level 5 (You're Level ${level})`;
        darkModeSetting.classList.add('locked');
    }
    
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('settings-screen').classList.add('active');
}

function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    Profile.data.darkMode = enabled;
    Profile.save();
}

// Dog breeds (24 most common + pitbull)
const DOG_BREEDS = [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'German Shorthaired Pointer',
    'Dachshund', 'Pembroke Welsh Corgi', 'Australian Shepherd', 'Yorkshire Terrier',
    'Boxer', 'Cavalier King Charles Spaniel', 'Doberman Pinscher', 'Great Dane',
    'Miniature Schnauzer', 'Siberian Husky', 'Shih Tzu', 'Boston Terrier',
    'Bernese Mountain Dog', 'Pomeranian', 'Havanese', 'Pitbull', 'Mixed'
];

// Daily challenge templates
const CHALLENGE_TEMPLATES = [
    { text: 'Finish a trip with over ${amount} dollars', type: 'money', baseAmount: 50, scaling: 10 },
    { text: 'Complete a trip with all family members alive', type: 'survival', baseAmount: 0, scaling: 0 },
    { text: 'Finish a trip with over ${amount} snacks remaining', type: 'snacks', baseAmount: 30, scaling: 5 },
    { text: 'Complete a trip in under ${amount} days', type: 'speed', baseAmount: 8, scaling: -0.1 },
    { text: 'Finish with average morale above ${amount}%', type: 'morale', baseAmount: 60, scaling: 2 },
    { text: 'Complete a trip without visiting the grocery store', type: 'noGrocery', baseAmount: 0, scaling: 0 },
    { text: 'Finish a trip with over ${amount} total miles driven', type: 'distance', baseAmount: 400, scaling: 20 },
    { text: 'Complete a trip spending less than ${amount} dollars', type: 'frugal', baseAmount: 150, scaling: -5 }
];

function showFamilyScreen() {
    const level = Profile.data.level || 1;
    
    // Ensure family data exists
    if (!Profile.data.family) {
        Profile.data.family = {
            dad: 'Dad', mom: 'Mom', son: 'Boy', daughter: 'Girl', dog: 'Buddy', dogBreed: 'mixed'
        };
    }
    
    // Fill in current values
    document.getElementById('family-dad').value = Profile.data.family.dad || 'Dad';
    document.getElementById('family-mom').value = Profile.data.family.mom || 'Mom';
    document.getElementById('family-son').value = Profile.data.family.son || 'Boy';
    document.getElementById('family-daughter').value = Profile.data.family.daughter || 'Girl';
    document.getElementById('family-dog').value = Profile.data.family.dog || 'Buddy';
    
    // Dog breed section
    const breedSection = document.getElementById('dog-breed-section');
    const breedUnlockInfo = document.getElementById('breed-unlock-info');
    const breedList = document.getElementById('breed-list');
    
    if (level >= 11) {
        breedSection.classList.remove('locked');
        breedUnlockInfo.textContent = '';
        // Populate breed datalist
        breedList.innerHTML = DOG_BREEDS.map(b => `<option value="${b}">`).join('');
        document.getElementById('selected-breed').textContent = 
            Profile.data.family.dogBreed ? Profile.data.family.dogBreed.charAt(0).toUpperCase() + Profile.data.family.dogBreed.slice(1) : 'Mixed';
    } else {
        breedSection.classList.add('locked');
        breedUnlockInfo.textContent = '(Unlocks at Lvl 11)';
    }
    
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('family-screen').classList.add('active');
}

function saveFamily() {
    if (!Profile.data.family) {
        Profile.data.family = { dad: 'Dad', mom: 'Mom', son: 'Boy', daughter: 'Girl', dog: 'Buddy', dogBreed: 'mixed' };
    }
    Profile.data.family.dad = document.getElementById('family-dad').value || 'Dad';
    Profile.data.family.mom = document.getElementById('family-mom').value || 'Mom';
    Profile.data.family.son = document.getElementById('family-son').value || 'Boy';
    Profile.data.family.daughter = document.getElementById('family-daughter').value || 'Girl';
    Profile.data.family.dog = document.getElementById('family-dog').value || 'Buddy';
    Profile.save();
    
    document.getElementById('family-screen').classList.remove('active');
    document.getElementById('main-menu').classList.add('active');
}

function showStatsScreen() {
    // Update stats values
    document.getElementById('stats-total-xp').textContent = Profile.data.totalXP || 0;
    document.getElementById('stats-level').textContent = Profile.data.level || 1;
    document.getElementById('stats-trips').textContent = Profile.data.tripsCompleted || 0;
    document.getElementById('stats-best-score').textContent = Profile.data.bestScore || 0;
    document.getElementById('stats-members-lost').textContent = Profile.data.membersLost || 0;
    
    // Render next reward
    document.getElementById('next-reward-container').innerHTML = Perks.renderNextReward();
    
    // Render roadmap
    document.getElementById('reward-roadmap-container').innerHTML = Perks.renderRoadmap();
    
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('stats-screen').classList.add('active');
}

function showChallengesScreen() {
    const level = Profile.data.level || 1;
    const card = document.getElementById('daily-challenge-card');
    
    if (level < 4) {
        // Show locked message
        card.innerHTML = `
            <div class="challenge-locked">
                <div class="lock-icon">&#128274;</div>
                <h3>Daily Challenges</h3>
                <p>Unlocks at Level 4</p>
                <p>You are Level ${level}</p>
            </div>
        `;
    } else {
        // Generate or load today's challenge
        const today = new Date().toDateString();
        
        if (!Profile.data.dailyChallenge || Profile.data.dailyChallenge.date !== today) {
            // Generate new challenge
            const challenge = generateDailyChallenge(level);
            Profile.data.dailyChallenge = {
                date: today,
                challenge: challenge,
                completed: false
            };
            Profile.save();
        }
        
        const challenge = Profile.data.dailyChallenge.challenge;
        const completed = Profile.data.dailyChallenge.completed;
        
        // Rebuild the card HTML to ensure elements exist
        const statusClass = completed ? 'completed' : '';
        const statusIcon = completed ? '&#9989;' : '&#8987;';
        const statusText = completed ? 'Completed!' : 'Not completed';
        
        card.innerHTML = `
            <div class="challenge-header">
                <h3>Today's Challenge</h3>
                <span class="challenge-date">${today}</span>
            </div>
            <div class="challenge-content">
                <p class="challenge-text">${challenge.text}</p>
                <p class="challenge-reward">Reward: +${challenge.xpReward} XP</p>
            </div>
            <div class="challenge-status ${statusClass}">
                <span class="status-icon">${statusIcon}</span>
                <span class="status-text">${statusText}</span>
            </div>
        `;
    }
    
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('challenges-screen').classList.add('active');
}

function generateDailyChallenge(level) {
    // Use date as seed for consistent daily challenge
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const templateIndex = seed % CHALLENGE_TEMPLATES.length;
    const template = CHALLENGE_TEMPLATES[templateIndex];
    
    // Calculate difficulty based on level
    let amount = template.baseAmount + Math.floor(template.scaling * level);
    if (template.type === 'speed') {
        amount = Math.max(4, Math.floor(template.baseAmount + template.scaling * level));
    }
    if (template.type === 'frugal') {
        amount = Math.max(50, template.baseAmount + Math.floor(template.scaling * level));
    }
    
    const text = template.text.replace('${amount}', amount);
    const xpReward = 25 + (level * 5);
    
    return {
        text: text,
        type: template.type,
        targetAmount: amount,
        xpReward: xpReward
    };
}

// Car customization data
const CarCustomization = {
    carTypes: [
        { id: 'minivan', name: 'Minivan', bonus: 'None', bonusDesc: 'The classic family road trip vehicle', unlockLevel: 1, icon: '🚐' },
        { id: 'crossover', name: 'Crossover', bonus: 'snackSaver', bonusDesc: '-1 snack consumption per person per turn', unlockLevel: 8, icon: '🚙' },
        { id: 'sedan', name: 'Sedan', bonus: 'speed15', bonusDesc: '15% speed increase', unlockLevel: 15, icon: '🚗' },
        { id: 'hatchback', name: 'Hatchback', bonus: 'fuelSaver', bonusDesc: '33% less fuel consumption per turn', unlockLevel: 25, icon: '🚘' },
        { id: 'suv', name: 'SUV', bonus: 'moraleSaver', bonusDesc: '20% less morale decrease per person per turn', unlockLevel: 36, icon: '🛻' },
        { id: 'roadster', name: 'Roadster', bonus: 'speed33', bonusDesc: '33.3% speed increase', unlockLevel: 49, icon: '🏎️' }
    ],
    colors: {
        primary: [
            { name: 'red', hex: '#dc2626', unlockLevel: 10 },
            { name: 'blue', hex: '#2563eb', unlockLevel: 10 },
            { name: 'yellow', hex: '#eab308', unlockLevel: 10 },
            { name: 'black', hex: '#1f2937', unlockLevel: 10 },
            { name: 'white', hex: '#f3f4f6', unlockLevel: 10 },
            { name: 'orange', hex: '#ea580c', unlockLevel: 20 },
            { name: 'green', hex: '#16a34a', unlockLevel: 20 },
            { name: 'purple', hex: '#9333ea', unlockLevel: 20 }
        ],
        secondary: [
            { name: 'red', hex: '#dc2626', unlockLevel: 30 },
            { name: 'blue', hex: '#2563eb', unlockLevel: 30 },
            { name: 'yellow', hex: '#eab308', unlockLevel: 30 },
            { name: 'black', hex: '#1f2937', unlockLevel: 30 },
            { name: 'white', hex: '#f3f4f6', unlockLevel: 30 },
            { name: 'orange', hex: '#ea580c', unlockLevel: 35 },
            { name: 'green', hex: '#16a34a', unlockLevel: 35 },
            { name: 'purple', hex: '#9333ea', unlockLevel: 35 }
        ]
    },
    states: {
        contiguous: [
            'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
            'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
            'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
            'WV', 'WI', 'WY', 'DC'
        ],
        territories: [
            'HI', 'AK', 'PR', 'VI', 'GU', 'AS', 'MP', 'UM', 'FM', 'MH', 'PW'
        ]
    }
};

function showCarScreen() {
    const level = Profile.data.level || 1;
    
    // Ensure car data exists
    if (!Profile.data.car) {
        Profile.data.car = {
            type: 'minivan',
            primaryColor: 'white',
            secondaryColor: 'black',
            licensePlate: 'MICH-TRL',
            plateState: 'TX'
        };
    }
    if (!Profile.data.car.type) {
        Profile.data.car.type = 'minivan';
    }
    
    // Update unlock info
    document.getElementById('primary-unlock-info').textContent = 
        level >= 10 ? '' : `(Unlocks at Lvl 10)`;
    document.getElementById('secondary-unlock-info').textContent = 
        level >= 30 ? '' : `(Unlocks at Lvl 30)`;
    document.getElementById('state-unlock-info').textContent = 
        level >= 6 ? (level >= 14 ? '' : '(Territories at Lvl 14)') : '(Unlocks at Lvl 6)';
    
    // Render car types
    const carTypeGrid = document.getElementById('car-type-grid');
    carTypeGrid.innerHTML = CarCustomization.carTypes.map(car => {
        const unlocked = level >= car.unlockLevel;
        const selected = Profile.data.car.type === car.id;
        return `<div class="car-type-item ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" data-car-type="${car.id}">
            <span class="car-type-icon">${car.icon}</span>
            <div class="car-type-info">
                <div class="car-type-name">${car.name}</div>
                <div class="car-type-bonus">${car.bonusDesc}</div>
            </div>
            <div class="car-type-unlock">${unlocked ? '✓' : '🔒 Lvl ' + car.unlockLevel}</div>
        </div>`;
    }).join('');
    
    // Render primary colors
    const primaryGrid = document.getElementById('primary-colors');
    primaryGrid.innerHTML = CarCustomization.colors.primary.map(color => {
        const unlocked = level >= color.unlockLevel;
        const selected = Profile.data.car.primaryColor === color.name;
        return `<div class="color-swatch ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" 
                     style="background: ${color.hex}" 
                     data-color="${color.name}" 
                     data-type="primary"
                     title="${color.name}${unlocked ? '' : ' (Lvl ' + color.unlockLevel + ')'}"></div>`;
    }).join('');
    
    // Render secondary colors
    const secondaryGrid = document.getElementById('secondary-colors');
    secondaryGrid.innerHTML = CarCustomization.colors.secondary.map(color => {
        const unlocked = level >= color.unlockLevel;
        const selected = Profile.data.car.secondaryColor === color.name;
        return `<div class="color-swatch ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" 
                     style="background: ${color.hex}" 
                     data-color="${color.name}" 
                     data-type="secondary"
                     title="${color.name}${unlocked ? '' : ' (Lvl ' + color.unlockLevel + ')'}"></div>`;
    }).join('');
    
    // Render states
    const stateGrid = document.getElementById('state-grid');
    let statesHtml = '';
    
    CarCustomization.states.contiguous.forEach(state => {
        const unlocked = level >= 6;
        const selected = Profile.data.car.plateState === state;
        statesHtml += `<button class="state-btn ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" 
                              data-state="${state}">${state}</button>`;
    });
    
    CarCustomization.states.territories.forEach(state => {
        const unlocked = level >= 14;
        const selected = Profile.data.car.plateState === state;
        statesHtml += `<button class="state-btn ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" 
                              data-state="${state}">${state}</button>`;
    });
    
    stateGrid.innerHTML = statesHtml;
    
    // Set license plate input
    document.getElementById('plate-text-input').value = Profile.data.car.licensePlate || 'MICH-TRL';
    
    // Update preview
    updateCarPreview();
    
    // Add event listeners
    setupCarEventListeners();
    
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('car-screen').classList.add('active');
}

function setupCarEventListeners() {
    const level = Profile.data.level || 1;
    
    // Tab switching
    document.querySelectorAll('.car-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.car-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.car-tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(tabName + '-tab').classList.remove('hidden');
            
            // Update preview on customize tab
            if (tabName === 'customize') {
                updateCarPreview();
            }
        });
    });
    
    // Car type selection
    document.querySelectorAll('.car-type-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('locked')) return;
            
            Profile.data.car.type = item.dataset.carType;
            document.querySelectorAll('.car-type-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            Profile.save();
            updateCarPreview();
        });
    });
    
    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            if (swatch.classList.contains('locked')) return;
            
            const color = swatch.dataset.color;
            const type = swatch.dataset.type;
            
            if (type === 'primary') {
                Profile.data.car.primaryColor = color;
                document.querySelectorAll('.color-swatch[data-type="primary"]').forEach(s => s.classList.remove('selected'));
            } else {
                Profile.data.car.secondaryColor = color;
                document.querySelectorAll('.color-swatch[data-type="secondary"]').forEach(s => s.classList.remove('selected'));
            }
            
            swatch.classList.add('selected');
            Profile.save();
            updateCarPreview();
        });
    });
    
    // State buttons
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked')) return;
            
            Profile.data.car.plateState = btn.dataset.state;
            document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            Profile.save();
            updateCarPreview();
        });
    });
    
    // License plate input
    const plateInput = document.getElementById('plate-text-input');
    plateInput.addEventListener('input', () => {
        Profile.data.car.licensePlate = plateInput.value.toUpperCase();
        Profile.save();
        updateCarPreview();
    });
}

function updateCarPreview() {
    const car = Profile.data.car;
    
    // Get color hex values
    const primaryColor = CarCustomization.colors.primary.find(c => c.name === car.primaryColor);
    const secondaryColor = CarCustomization.colors.secondary.find(c => c.name === car.secondaryColor);
    
    // Update both car previews (vehicle tab and customize tab)
    const carBodies = [document.getElementById('car-preview-body'), document.getElementById('car-preview-body-2')];
    const carAccents = [document.getElementById('car-preview-accent'), document.getElementById('car-preview-accent-2')];
    const platePreview = document.getElementById('license-plate-preview');
    
    carBodies.forEach(carBody => {
        if (carBody && primaryColor) {
            carBody.style.background = primaryColor.hex;
        }
    });
    
    carAccents.forEach(carAccent => {
        if (carAccent && secondaryColor) {
            carAccent.style.background = secondaryColor.hex;
        }
    });
    
    if (platePreview) {
        platePreview.querySelector('.plate-state').textContent = car.plateState || 'TX';
        platePreview.querySelector('.plate-text').textContent = car.licensePlate || 'MICH-TRL';
    }
}

function showBadgesModal() {
    const modal = document.getElementById('badges-modal');
    const container = document.getElementById('badges-container');
    
    const allBadges = Badges.getAllBadges();
    
    const categories = {
        'welcome': 'Welcome Badges',
        'trips': 'Trip Milestones',
        'streaks': 'Streak Badges',
        'events': 'Event Badges',
        'milestones': 'Milestone Badges',
        'gameplay': 'Gameplay Badges',
        'profile': 'Profile Badges',
        'achievements': 'Achievements',
        'setup': 'Setup Badges',
        'ultimate': 'Ultimate'
    };
    
    let html = '';
    
    for (const [catId, catName] of Object.entries(categories)) {
        const catBadges = allBadges.filter(b => b.category === catId);
        if (catBadges.length === 0) continue;
        
        html += `<div class="badge-category">
            <h3>${catName}</h3>
            <div class="badge-grid">`;
        
        catBadges.forEach(badge => {
            const earnedClass = badge.earned ? 'earned' : 'locked';
            html += `
                <div class="badge-item ${earnedClass}" data-badge-id="${badge.id}" data-badge-name="${badge.name}" data-badge-desc="${badge.description}" data-badge-icon="${badge.icon}" data-badge-earned="${badge.earned}">
                    <span class="badge-icon">${badge.earned ? badge.icon : '🔒'}</span>
                    <span class="badge-name">${badge.name}</span>
                </div>`;
        });
        
        html += `</div></div>`;
    }
    
    container.innerHTML = html;
    
    // Add click handlers for badge details
    container.querySelectorAll('.badge-item').forEach(item => {
        item.addEventListener('click', () => {
            showBadgeDetail(
                item.dataset.badgeName,
                item.dataset.badgeDesc,
                item.dataset.badgeIcon,
                item.dataset.badgeEarned === 'true'
            );
        });
    });
    
    modal.style.display = 'flex';
}

function showBadgeDetail(name, description, icon, earned) {
    let popup = document.getElementById('badge-detail-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'badge-detail-popup';
        popup.className = 'badge-detail-popup';
        document.body.appendChild(popup);
    }
    
    popup.innerHTML = `
        <div class="badge-detail-content">
            <span class="badge-detail-icon">${earned ? icon : '🔒'}</span>
            <h3 class="badge-detail-name">${name}</h3>
            <p class="badge-detail-desc">${description}</p>
            <p class="badge-detail-status">${earned ? '✅ Earned!' : '🔒 Not yet earned'}</p>
            <button class="badge-detail-close">Close</button>
        </div>
    `;
    
    popup.style.display = 'flex';
    
    popup.querySelector('.badge-detail-close').addEventListener('click', () => {
        popup.style.display = 'none';
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });
}

function startGameLoop() {
    gameLoop = setInterval(() => {
        if (GameState.phase === 'title' || GameState.phase === 'gameOver' || GameState.phase === 'won') {
            return;
        }
        
        Renderer.render();
    }, 1000 / 30);
}

window.addEventListener('load', init);
