const Stereo = {
    currentTrack: null,
    audio: null,
    isPlaying: false,
    volume: 0.5,
    
    musicPacks: [
        {
            id: 'pack1',
            name: 'Road Trip Classics',
            unlockLevel: 16,
            songs: [
                { id: 'p1_s1', title: 'Highway Cruise', file: 'sounds/pack1_song1.mp3' },
                { id: 'p1_s2', title: 'Sunset Drive', file: 'sounds/pack1_song2.mp3' },
                { id: 'p1_s3', title: 'Open Road', file: 'sounds/pack1_song3.mp3' },
                { id: 'p1_s4', title: 'Mile Marker', file: 'sounds/pack1_song4.mp3' }
            ]
        },
        {
            id: 'pack2',
            name: 'Family Favorites',
            unlockLevel: 26,
            songs: [
                { id: 'p2_s1', title: 'Sing Along', file: 'sounds/pack2_song1.mp3' },
                { id: 'p2_s2', title: 'Road Games', file: 'sounds/pack2_song2.mp3' },
                { id: 'p2_s3', title: 'Rest Stop Groove', file: 'sounds/pack2_song3.mp3' },
                { id: 'p2_s4', title: 'Almost There', file: 'sounds/pack2_song4.mp3' }
            ]
        },
        {
            id: 'pack3',
            name: 'Michigan Beats',
            unlockLevel: 46,
            songs: [
                { id: 'p3_s1', title: 'Great Lakes', file: 'sounds/pack3_song1.mp3' },
                { id: 'p3_s2', title: 'Detroit Rhythm', file: 'sounds/pack3_song2.mp3' },
                { id: 'p3_s3', title: 'Northern Lights', file: 'sounds/pack3_song3.mp3' },
                { id: 'p3_s4', title: 'Final Stretch', file: 'sounds/pack3_song4.mp3' }
            ]
        }
    ],
    
    init() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.addEventListener('ended', () => this.onTrackEnd());
    },
    
    getUnlockedPacks() {
        const level = Profile.data.level || 1;
        return this.musicPacks.filter(pack => level >= pack.unlockLevel);
    },
    
    getUnlockedSongs() {
        const unlockedPacks = this.getUnlockedPacks();
        let songs = [];
        unlockedPacks.forEach(pack => {
            pack.songs.forEach(song => {
                songs.push({ ...song, packName: pack.name });
            });
        });
        return songs;
    },
    
    play(songId) {
        const songs = this.getUnlockedSongs();
        const song = songs.find(s => s.id === songId);
        
        if (!song) return;
        
        if (this.currentTrack === songId && this.isPlaying) {
            this.pause();
            return;
        }
        
        this.currentTrack = songId;
        this.audio.src = song.file;
        this.audio.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
        this.isPlaying = true;
        this.updateUI();
    },
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
    },
    
    resume() {
        if (this.currentTrack) {
            this.audio.play().catch(e => {
                console.log('Audio playback failed:', e);
            });
            this.isPlaying = true;
            this.updateUI();
        }
    },
    
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.currentTrack = null;
        this.updateUI();
    },
    
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.audio.volume = this.volume;
    },
    
    nextTrack() {
        const songs = this.getUnlockedSongs();
        if (songs.length === 0) return;
        
        const currentIndex = songs.findIndex(s => s.id === this.currentTrack);
        const nextIndex = (currentIndex + 1) % songs.length;
        this.play(songs[nextIndex].id);
    },
    
    prevTrack() {
        const songs = this.getUnlockedSongs();
        if (songs.length === 0) return;
        
        const currentIndex = songs.findIndex(s => s.id === this.currentTrack);
        const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
        this.play(songs[prevIndex].id);
    },
    
    onTrackEnd() {
        this.nextTrack();
    },
    
    updateUI() {
        const playBtn = document.getElementById('stereo-play-btn');
        const nowPlaying = document.getElementById('stereo-now-playing');
        
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
        
        if (nowPlaying) {
            if (this.currentTrack && this.isPlaying) {
                const songs = this.getUnlockedSongs();
                const song = songs.find(s => s.id === this.currentTrack);
                nowPlaying.textContent = song ? song.title : 'No track';
            } else {
                nowPlaying.textContent = this.currentTrack ? 'Paused' : 'No track';
            }
        }
        
        // Update song list active states
        document.querySelectorAll('.stereo-song').forEach(el => {
            el.classList.remove('active', 'playing');
            if (el.dataset.songId === this.currentTrack) {
                el.classList.add('active');
                if (this.isPlaying) el.classList.add('playing');
            }
        });
    },
    
    renderStereoPanel() {
        const level = Profile.data.level || 1;
        const unlockedPacks = this.getUnlockedPacks();
        const allPacks = this.musicPacks;
        
        let html = '<div class="stereo-header"><h3>&#127926; Car Stereo</h3></div>';
        
        if (unlockedPacks.length === 0) {
            html += `
                <div class="stereo-locked">
                    <p>&#128274; Music packs unlock at Level 16</p>
                    <p>You are Level ${level}</p>
                </div>
            `;
        } else {
            html += `
                <div class="stereo-controls">
                    <button id="stereo-prev-btn" class="stereo-btn">&#9198;</button>
                    <button id="stereo-play-btn" class="stereo-btn stereo-play">${this.isPlaying ? '⏸' : '▶'}</button>
                    <button id="stereo-next-btn" class="stereo-btn">&#9197;</button>
                    <div class="stereo-volume">
                        <span>&#128266;</span>
                        <input type="range" id="stereo-volume" min="0" max="100" value="${this.volume * 100}">
                    </div>
                </div>
                <div class="stereo-now-playing">
                    <span>Now Playing:</span>
                    <span id="stereo-now-playing">${this.currentTrack && this.isPlaying ? this.getUnlockedSongs().find(s => s.id === this.currentTrack)?.title || 'No track' : 'No track'}</span>
                </div>
            `;
            
            allPacks.forEach(pack => {
                const isUnlocked = level >= pack.unlockLevel;
                html += `<div class="stereo-pack ${isUnlocked ? '' : 'locked'}">`;
                html += `<h4>${pack.name} ${isUnlocked ? '' : '&#128274; Lvl ' + pack.unlockLevel}</h4>`;
                
                if (isUnlocked) {
                    html += '<div class="stereo-songs">';
                    pack.songs.forEach(song => {
                        const isActive = this.currentTrack === song.id;
                        const isPlaying = isActive && this.isPlaying;
                        html += `
                            <div class="stereo-song ${isActive ? 'active' : ''} ${isPlaying ? 'playing' : ''}" data-song-id="${song.id}">
                                <span class="song-icon">${isPlaying ? '&#9835;' : '&#9834;'}</span>
                                <span class="song-title">${song.title}</span>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                html += '</div>';
            });
        }
        
        return html;
    },
    
    setupEventListeners() {
        const panel = document.getElementById('stereo-panel');
        if (!panel) return;
        
        // Play/Pause button
        const playBtn = document.getElementById('stereo-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pause();
                } else if (this.currentTrack) {
                    this.resume();
                } else {
                    const songs = this.getUnlockedSongs();
                    if (songs.length > 0) this.play(songs[0].id);
                }
            });
        }
        
        // Next/Prev buttons
        const nextBtn = document.getElementById('stereo-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        const prevBtn = document.getElementById('stereo-prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevTrack());
        }
        
        // Volume slider
        const volumeSlider = document.getElementById('stereo-volume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
        
        // Song selection
        document.querySelectorAll('.stereo-song').forEach(el => {
            el.addEventListener('click', () => {
                const songId = el.dataset.songId;
                this.play(songId);
            });
        });
    }
};
