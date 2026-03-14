let gameLoop;

function init() {
    Profile.init();
    Badges.init();
    Renderer.init();
    UI.init();
    EventSystem.init();
    Locations.init();
    
    document.getElementById('badges-btn').addEventListener('click', () => {
        showBadgesModal();
    });
    
    document.getElementById('close-badges-btn').addEventListener('click', () => {
        document.getElementById('badges-modal').style.display = 'none';
    });
    
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
            const screens = ['profile-screen', 'manage-profile-screen', 'stats-screen', 'friends-screen', 'friend-profile-screen', 'setup-screen'];
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
