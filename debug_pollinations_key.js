const https = require('https');

const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
const prompt = 'cool cyberpunk city';
const encodedPrompt = encodeURIComponent(prompt);
const seed = 12345;

const scenarios = [
    {
        name: 'With nologo and Key',
        url: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true&key=${apiKey}`
    },
    {
        name: 'With Key only',
        url: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&key=${apiKey}`
    },
    {
        name: 'With nologo only (No Key)',
        url: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`
    }
];

function testUrl(scenario) {
    console.log(`Testing: ${scenario.name}`);
    console.log(`URL: ${scenario.url}`);

    const req = https.get(scenario.url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (res.statusCode >= 400) {
                console.log(`Body: ${data}`);
            } else {
                console.log(`Success! (Body length: ${data.length})`);
            }
            console.log('--------------------------------------------------');
        });
    });

    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
        console.log('--------------------------------------------------');
    });
}

scenarios.forEach((scenario, index) => {
    setTimeout(() => testUrl(scenario), index * 2000);
});
