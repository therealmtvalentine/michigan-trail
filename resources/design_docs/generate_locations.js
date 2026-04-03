const fs = require('fs');
const path = require('path');

// Read API key from .env file manually
const envPath = path.join(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
const OUTPUT_DIR = path.join(__dirname, 'generated_images');

// Location and scene images to generate
const images = [
    // BACKGROUNDS (1024x576, 16:9)
    {
        name: 'houston',
        prompt: 'Houston Texas city skyline with downtown skyscrapers, highway in foreground, oil refineries in distance, clear blue sky with clouds, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, dithering effects, wide landscape scene',
        aspectRatio: '16:9'
    },
    {
        name: 'bucees',
        prompt: 'Buc-ee\'s giant gas station and convenience store, beaver mascot sign, many fuel pumps, parking lot with cars, Texas highway, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide scene',
        aspectRatio: '16:9'
    },
    {
        name: 'texarkana',
        prompt: 'Texarkana border town scene, state line marker visible, small town main street, Texas and Arkansas flags, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide landscape',
        aspectRatio: '16:9'
    },
    {
        name: 'little_rock',
        prompt: 'Little Rock Arkansas city skyline, Arkansas River, downtown buildings, state capitol dome visible, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide landscape scene',
        aspectRatio: '16:9'
    },
    {
        name: 'memphis',
        prompt: 'Memphis Tennessee cityscape, Beale Street neon signs, music notes, Mississippi River, blues and rock n roll theme, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide scene',
        aspectRatio: '16:9'
    },
    {
        name: 'mount_vernon',
        prompt: 'Small town Mount Vernon Illinois, historic courthouse square, American small town main street, midwestern charm, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide landscape',
        aspectRatio: '16:9'
    },
    {
        name: 'chicago',
        prompt: 'Chicago Illinois city skyline, Willis Tower, Lake Michigan, downtown skyscrapers, urban landscape, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide scene',
        aspectRatio: '16:9'
    },
    {
        name: 'detroit',
        prompt: 'Detroit Michigan city skyline, Renaissance Center, automotive industry theme, urban landscape, destination city, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, wide scene',
        aspectRatio: '16:9'
    },
    {
        name: 'road_split',
        prompt: 'Fork in the road, two paths diverging, road signs pointing different directions, American highway landscape, decision point, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels',
        aspectRatio: '16:9'
    },
    {
        name: 'wilderness_1',
        prompt: 'Rural highway through forest landscape, pine trees, rolling hills, sunny day with blue sky, empty road with no vehicles, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, side-scrolling perspective, parallax background layers',
        aspectRatio: '16:9'
    },
    {
        name: 'wilderness_2',
        prompt: 'Rural highway through plains landscape, wheat fields, farmland, big sky with clouds, empty road no cars, American heartland, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, side-scrolling perspective',
        aspectRatio: '16:9'
    },
    {
        name: 'wilderness_3',
        prompt: 'Rural highway through hilly terrain, autumn trees with fall colors, winding road, scenic overlook, empty road no vehicles, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, side-scrolling perspective',
        aspectRatio: '16:9'
    },
    {
        name: 'view_from_dashboard',
        prompt: 'First person view from inside car dashboard, hands on steering wheel, road ahead through windshield, family road trip, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels',
        aspectRatio: '16:9'
    },
    
    // LANDMARKS (512x384, 4:3)
    {
        name: 'space_center_nasa',
        prompt: 'NASA Johnson Space Center entrance, Saturn V rocket display, American flag, visitor center building, astronaut statue, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    {
        name: 'two_states_at_once_sign',
        prompt: 'Texarkana state line photo spot, person standing in two states at once, Texas Arkansas border marker, historic downtown, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics',
        aspectRatio: '4:3'
    },
    {
        name: 'little_rock_central_high',
        prompt: 'Little Rock Central High School historic building, 1950s architecture, civil rights memorial, American flag, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    {
        name: 'national_civil_rights_museum',
        prompt: 'National Civil Rights Museum at Lorraine Motel, historic building facade, memorial wreath, civil rights history, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    {
        name: 'historic_mount_vernon_square',
        prompt: 'Historic Mount Vernon Illinois town square, courthouse, gazebo, small town America, charming storefronts, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    {
        name: 'cloud_gate',
        prompt: 'Cloud Gate sculpture the Bean in Millennium Park Chicago, reflective surface, city skyline reflection, tourists, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    {
        name: 'motown_museum',
        prompt: 'Motown Museum Hitsville USA building, historic recording studio, musical notes, Detroit landmark, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, centered composition',
        aspectRatio: '4:3'
    },
    
    // POPUPS (256x256, 1:1)
    {
        name: 'popped_tire',
        prompt: 'Close-up of flat tire on green station wagon, family looking worried in background, roadside scene, dust and gravel, pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, dramatic event illustration',
        aspectRatio: '1:1'
    },
    {
        name: 'beaver_nuggets',
        prompt: 'Bag of Beaver Nuggets snack, Buc-ee\'s branded packaging, caramel corn puffs, pixel art, 1980s retro video game style, 16-bit graphics, item icon, transparent background',
        aspectRatio: '1:1'
    }
];

async function generateImage(imageConfig) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
    
    const requestBody = {
        instances: [{
            prompt: imageConfig.prompt
        }],
        parameters: {
            sampleCount: 1,
            aspectRatio: imageConfig.aspectRatio
        }
    };

    console.log(`Generating: ${imageConfig.name}...`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.predictions && data.predictions[0]) {
            const prediction = data.predictions[0];
            if (prediction.bytesBase64Encoded) {
                const imageData = prediction.bytesBase64Encoded;
                const filename = `${imageConfig.name}.png`;
                const filepath = path.join(OUTPUT_DIR, filename);
                
                fs.writeFileSync(filepath, Buffer.from(imageData, 'base64'));
                console.log(`  ✓ Saved: ${filename}`);
                return filepath;
            }
        }
        
        console.log(`  ✗ Warning: No image in response for ${imageConfig.name}`);
        return null;
        
    } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('Michigan Trail - Location Image Generation');
    console.log('==========================================\n');
    
    if (!API_KEY) {
        console.error('Error: GEMINI_API_KEY not found in .env file');
        process.exit(1);
    }
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log(`Images to generate: ${images.length}\n`);
    
    const results = [];
    for (let i = 0; i < images.length; i++) {
        const imageConfig = images[i];
        console.log(`[${i + 1}/${images.length}]`);
        const result = await generateImage(imageConfig);
        results.push({ name: imageConfig.name, path: result });
        
        // Delay between requests to avoid rate limiting
        if (i < images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
    
    console.log('\n==========================================');
    console.log('Generation Complete!\n');
    
    const successful = results.filter(r => r.path);
    const failed = results.filter(r => !r.path);
    
    console.log(`Successful: ${successful.length}/${results.length}`);
    if (failed.length > 0) {
        console.log('Failed:', failed.map(r => r.name).join(', '));
    }
    
    console.log(`\nImages saved to: ${OUTPUT_DIR}`);
}

main();
