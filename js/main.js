let gameLoop;

function init() {
    Renderer.init();
    UI.init();
    EventSystem.init();
    Locations.init();
    
    startGameLoop();
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
