const fs = require('fs');
const path = require('path');

// Read API key from .env file manually
const envPath = path.join(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
const OUTPUT_DIR = path.join(__dirname, 'test_images');

// Test images to generate - a sample from each category
const testImages = [
    {
        name: 'test_car_sprite_v7_no_dog',
        prompt: 'Pixel art GREEN station wagon car sprite side view, dad driving, mom in passenger seat, boy and girl in back seat, luggage on roof rack, NO DOG, NO PETS, 1980s Oregon Trail video game style, 16-bit graphics, transparent background',
        width: 128,
        height: 64
    },
    {
        name: 'test_car_sprite_v7_with_dog',
        prompt: 'Pixel art GREEN station wagon car sprite side view, dad driving, mom in passenger seat, boy and girl in back seat, small dog visible through rear window in cargo area, luggage on roof rack only, 1980s Oregon Trail video game style, 16-bit graphics, transparent background',
        width: 128,
        height: 64
    }
];

async function generateImage(imageConfig) {
    // Use Imagen 4 model for image generation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
    
    const requestBody = {
        instances: [{
            prompt: imageConfig.prompt
        }],
        parameters: {
            sampleCount: 1,
            aspectRatio: imageConfig.width > imageConfig.height ? "16:9" : "1:1"
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
        
        // Extract image from Imagen response format
        if (data.predictions && data.predictions[0]) {
            const prediction = data.predictions[0];
            if (prediction.bytesBase64Encoded) {
                const imageData = prediction.bytesBase64Encoded;
                const filename = `${imageConfig.name}.png`;
                const filepath = path.join(OUTPUT_DIR, filename);
                
                fs.writeFileSync(filepath, Buffer.from(imageData, 'base64'));
                console.log(`  Saved: ${filename}`);
                return filepath;
            }
        }
        
        console.log(`  Warning: No image in response for ${imageConfig.name}`);
        console.log('  Response:', JSON.stringify(data, null, 2));
        return null;
        
    } catch (error) {
        console.error(`  Error generating ${imageConfig.name}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('Michigan Trail - Test Image Generation');
    console.log('======================================\n');
    
    if (!API_KEY) {
        console.error('Error: GEMINI_API_KEY not found in .env file');
        process.exit(1);
    }
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    console.log(`Output directory: ${OUTPUT_DIR}\n`);
    
    const results = [];
    for (const imageConfig of testImages) {
        const result = await generateImage(imageConfig);
        results.push({ name: imageConfig.name, path: result });
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n======================================');
    console.log('Generation Complete!\n');
    
    const successful = results.filter(r => r.path);
    const failed = results.filter(r => !r.path);
    
    console.log(`Successful: ${successful.length}/${results.length}`);
    if (failed.length > 0) {
        console.log('Failed:', failed.map(r => r.name).join(', '));
    }
    
    console.log(`\nCheck ${OUTPUT_DIR} for generated images.`);
}

main();
