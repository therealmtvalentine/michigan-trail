const Locations = {
    landmarks: [],
    wildernessBackgrounds: ['wilderness_1', 'wilderness_2', 'wilderness_3'],
    
    init() {
        this.landmarks = [
            {
                name: 'Houston, TX',
                distance: 0,
                type: 'city',
                description: 'Starting point - loaded up and ready to go!',
                hasStore: true,
                background: 'houston',
                landmark: 'space_center_nasa'
            },
            {
                name: 'A Buc-ee\'s',
                distance: 100,
                type: 'rest_stop',
                description: 'The legendary Texas rest stop with clean bathrooms.',
                hasStore: true,
                background: 'bucees',
                landmark: null
            },
            {
                name: 'Texarkana, TX/AR',
                distance: 240,
                type: 'city',
                description: 'On the Texas-Arkansas border.',
                hasStore: true,
                background: 'texarkana',
                landmark: 'two_states_at_once'
            },
            {
                name: 'Little Rock, AR',
                distance: 360,
                type: 'city',
                description: 'Capital of Arkansas, good place to stop.',
                hasStore: true,
                background: 'little_rock',
                landmark: 'little_rock_central_high'
            },
            {
                name: 'Memphis, TN',
                distance: 560,
                type: 'city',
                description: 'Home of BBQ and blues music.',
                hasStore: true,
                background: 'memphis',
                landmark: 'civil_rights_museum'
            },
            {
                name: 'Nashville, TN',
                distance: 770,
                type: 'city',
                description: 'Music City! Almost halfway there.',
                hasStore: true,
                background: null,
                landmark: null
            },
            {
                name: 'Louisville, KY',
                distance: 950,
                type: 'city',
                description: 'Derby City on the Ohio River.',
                hasStore: true,
                background: null,
                landmark: null
            },
            {
                name: 'Indianapolis, IN',
                distance: 1000,
                type: 'city',
                description: 'Racing capital, getting close now!',
                hasStore: true,
                background: null,
                landmark: null
            },
            {
                name: 'Chicago, IL',
                distance: 1100,
                type: 'city',
                description: 'The Windy City! Deep dish pizza time.',
                hasStore: true,
                background: 'chicago',
                landmark: 'cloud_gate'
            },
            {
                name: 'Detroit, MI',
                distance: 1200,
                type: 'city',
                description: 'Motor City! Welcome to Michigan!',
                hasStore: true,
                background: 'detroit',
                landmark: 'motown_museum'
            },
            {
                name: 'Destination: Michigan!',
                distance: 1300,
                type: 'city',
                description: 'You made it! The family road trip is complete!',
                hasStore: true,
                background: 'detroit',
                landmark: null
            }
        ];
        
        // Wilderness backgrounds for driving between locations
        this.wildernessBackgrounds = ['wilderness_1', 'wilderness_2', 'wilderness_3'];
    },
    
    getWildernessBackground() {
        // Rotate through wilderness backgrounds based on distance
        if (!this.wildernessBackgrounds || this.wildernessBackgrounds.length === 0) {
            return 'wilderness_1';
        }
        const index = Math.floor(GameState.distance / 50) % this.wildernessBackgrounds.length;
        return this.wildernessBackgrounds[index];
    },
    
    getCurrentLocation() {
        for (let i = this.landmarks.length - 1; i >= 0; i--) {
            if (GameState.distance >= this.landmarks[i].distance) {
                return this.landmarks[i];
            }
        }
        return this.landmarks[0];
    },
    
    getNextLocation() {
        const current = this.getCurrentLocation();
        const currentIndex = this.landmarks.indexOf(current);
        
        if (currentIndex < this.landmarks.length - 1) {
            return this.landmarks[currentIndex + 1];
        }
        return null;
    },
    
    getDistanceToNext() {
        const next = this.getNextLocation();
        if (next) {
            return next.distance - GameState.distance;
        }
        return 0;
    },
    
    checkLocationArrival() {
        const current = this.getCurrentLocation();
        
        if (current.name !== GameState.currentLocation) {
            GameState.currentLocation = current.name;
            const next = this.getNextLocation();
            GameState.nextLocation = next ? next.name : 'Detroit, MI';
            
            return {
                arrived: true,
                location: current
            };
        }
        
        return { arrived: false };
    }
};
