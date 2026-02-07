const https = require('https');

const prompt = 'cute cat';
const encodedPrompt = encodeURIComponent(prompt);
const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';

const urls = [
    `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&key=${apiKey}`, // Old
    `https://pollinations.ai/p/${encodedPrompt}?nologo=true&key=${apiKey}`, // Current (Suspected HTML)
    `https://gen.pollinations.ai/image/${encodedPrompt}?nologo=true&key=${apiKey}` // Search result
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`URL: ${url}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        if (res.statusCode >= 300 && res.statusCode < 400) {
            console.log(`Redirect: ${res.headers.location}`);
        }
        console.log('---');
    }).on('error', (e) => {
        console.error(`Error fetching ${url}: ${e.message}`);
    });
});
