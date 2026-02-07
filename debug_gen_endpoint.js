const https = require('https');

const prompt = 'cute cat';
const encodedPrompt = encodeURIComponent(prompt);
const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';

const scenarios = [
    {
        name: 'Gen Base with Key',
        url: `https://gen.pollinations.ai/image/${encodedPrompt}?nologo=true&key=${apiKey}&model=flux`
    },
    {
        name: 'Gen with .jpg and Key',
        url: `https://gen.pollinations.ai/image/${encodedPrompt}.jpg?nologo=true&key=${apiKey}&model=flux`
    }
];

function testUrl(scenario) {
    console.log(`Testing: ${scenario.name}`);
    console.log(`URL: ${scenario.url}`);

    const req = https.get(scenario.url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);

        let data = '';
        res.on('data', chunk => data += chunk.toString().slice(0, 100));
        res.on('end', () => {
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
