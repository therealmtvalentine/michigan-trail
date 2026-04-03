const ImageLoader = {
    images: {},
    loaded: false,
    loadedCount: 0,
    totalCount: 0,
    
    imagePaths: {
        // Backgrounds
        backgrounds: {
            houston: 'resources/images/backgrounds/houston.png',
            bucees: 'resources/images/backgrounds/bucees.png',
            texarkana: 'resources/images/backgrounds/texarkana.png',
            little_rock: 'resources/images/backgrounds/little_rock.png',
            memphis: 'resources/images/backgrounds/memphis.png',
            mount_vernon: 'resources/images/backgrounds/mount_vernon.png',
            chicago: 'resources/images/backgrounds/chicago.png',
            detroit: 'resources/images/backgrounds/detroit.png',
            road_split: 'resources/images/backgrounds/road_split.png',
            wilderness_1: 'resources/images/backgrounds/wilderness_1.png',
            wilderness_2: 'resources/images/backgrounds/wilderness_2.png',
            wilderness_3: 'resources/images/backgrounds/wilderness_3.png',
            view_from_dashboard: 'resources/images/backgrounds/view_from_dashboard.png'
        },
        // Landmarks
        landmarks: {
            space_center_nasa: 'resources/images/landmarks/space_center_nasa.png',
            two_states_at_once: 'resources/images/landmarks/two_states_at_once_sign.png',
            little_rock_central_high: 'resources/images/landmarks/little_rock_central_high.png',
            civil_rights_museum: 'resources/images/landmarks/national_civil_rights_museum.png',
            mount_vernon_square: 'resources/images/landmarks/historic_mount_vernon_square.png',
            cloud_gate: 'resources/images/landmarks/cloud_gate.png',
            motown_museum: 'resources/images/landmarks/motown_museum.png'
        },
        // Sprites
        sprites: {
            car_with_family: 'resources/images/sprites/car_with_family.png'
        },
        // Popups
        popups: {
            popped_tire: 'resources/images/popups/popped_tire.png',
            beaver_nuggets: 'resources/images/popups/beaver_nuggets.png'
        }
    },
    
    init() {
        return new Promise((resolve) => {
            this.images = {
                backgrounds: {},
                landmarks: {},
                sprites: {},
                popups: {}
            };
            
            // Count total images
            for (const category in this.imagePaths) {
                this.totalCount += Object.keys(this.imagePaths[category]).length;
            }
            
            if (this.totalCount === 0) {
                this.loaded = true;
                resolve();
                return;
            }
            
            // Load all images
            for (const category in this.imagePaths) {
                for (const name in this.imagePaths[category]) {
                    const img = new Image();
                    img.onload = () => {
                        this.loadedCount++;
                        console.log(`Loaded: ${name} (${this.loadedCount}/${this.totalCount})`);
                        if (this.loadedCount >= this.totalCount) {
                            this.loaded = true;
                            console.log('All images loaded!');
                            resolve();
                        }
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load: ${this.imagePaths[category][name]}`);
                        this.loadedCount++;
                        if (this.loadedCount >= this.totalCount) {
                            this.loaded = true;
                            resolve();
                        }
                    };
                    img.src = this.imagePaths[category][name];
                    this.images[category][name] = img;
                }
            }
        });
    },
    
    getBackground(name) {
        return this.images.backgrounds[name] || null;
    },
    
    getLandmark(name) {
        return this.images.landmarks[name] || null;
    },
    
    getSprite(name) {
        return this.images.sprites[name] || null;
    },
    
    getPopup(name) {
        return this.images.popups[name] || null;
    },
    
    getLoadProgress() {
        if (this.totalCount === 0) return 100;
        return Math.floor((this.loadedCount / this.totalCount) * 100);
    }
};
