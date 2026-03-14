const Locations = {
    landmarks: [],
    
    init() {
        this.landmarks = [
            {
                name: 'Houston, TX',
                distance: 0,
                type: 'city',
                description: 'Starting point - loaded up and ready to go!',
                hasStore: true
            },
            {
                name: 'A Buc-ee\'s',
                distance: 100,
                type: 'rest_stop',
                description: 'The legendary Texas rest stop with clean bathrooms.',
                hasStore: true
            },
            {
                name: 'Texarkana, TX/AR',
                distance: 240,
                type: 'city',
                description: 'On the Texas-Arkansas border.',
                hasStore: true
            },
            {
                name: 'Little Rock, AR',
                distance: 360,
                type: 'city',
                description: 'Capital of Arkansas, good place to stop.',
                hasStore: true
            },
            {
                name: 'Memphis, TN',
                distance: 560,
                type: 'city',
                description: 'Home of BBQ and blues music.',
                hasStore: true
            },
            {
                name: 'Nashville, TN',
                distance: 770,
                type: 'city',
                description: 'Music City! Almost halfway there.',
                hasStore: true
            },
            {
                name: 'Louisville, KY',
                distance: 950,
                type: 'city',
                description: 'Derby City on the Ohio River.',
                hasStore: true
            },
            {
                name: 'Indianapolis, IN',
                distance: 1000,
                type: 'city',
                description: 'Racing capital, getting close now!',
                hasStore: true
            },
            {
                name: 'Detroit, MI',
                distance: 1200,
                type: 'city',
                description: 'Motor City! Welcome to Michigan!',
                hasStore: true
            },
            {
                name: 'Destination: Michigan!',
                distance: 1300,
                type: 'city',
                description: 'You made it! The family road trip is complete!',
                hasStore: true
            }
        ];
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
