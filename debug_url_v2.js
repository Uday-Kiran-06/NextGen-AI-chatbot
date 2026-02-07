const https = require('https');

const prompt = 'cute cat';
const encodedPrompt = encodeURIComponent(prompt);
const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';

const scenarios = [
    {
        name: 'Gen Endpoint',
        url: `https://gen.pollinations.ai/image/${encodedPrompt}?nologo=true&key=${apiKey}`
    },
    {
        name: 'P Endpoint with .jpg',
        url: `https://pollinations.ai/p/${encodedPrompt}.jpg?nologo=true&key=${apiKey}&width=1024&height=1024&seed=123&model=flux`
    },
    {
        name: 'Image Endpoint (Global)',
        url: `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&key=${apiKey}`
    }
];

function testUrl(scenario) {
    console.log(`Testing: ${scenario.name}`);
    console.log(`URL: ${scenario.url}`);

    const req = https.get(scenario.url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        if (res.statusCode >= 300 && res.statusCode < 400) {
            console.log(`Redirect: ${res.headers.location}`);
        }

        let data = '';
        res.on('data', chunk => data += chunk.toString().slice(0, 100)); // Just sneak peek
        res.on('end', () => {
            // Check for HTML signature
            if (data.trim().startsWith('<')) {
                console.log('Body start: HTML detected');
            } else {
                console.log('Body start: (Binary/Image data)');
            }
            console.log('--------------------------------------------------');
        });
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

scenarios.forEach((s, i) => setTimeout(() => testUrl(s), i * 1500));
