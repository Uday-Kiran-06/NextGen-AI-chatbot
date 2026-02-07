import https from 'https';

const urls = [
    'https://image.pollinations.ai/prompt/cool%20cyberpunk%20city?model=flux',
    'https://pollinations.ai/p/cool%20cyberpunk%20city',
    'https://gen.pollinations.ai/image/cool%20cyberpunk%20city' // Guessing this one
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
