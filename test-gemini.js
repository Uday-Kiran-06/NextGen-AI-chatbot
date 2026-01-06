const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }
    console.log('Using Key:', apiKey.substring(0, 5) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    try {
        console.log('Testing model: gemini-2.5-flash...');
        const result = await model.generateContent('Hello, are you there?');
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Error Details:', JSON.stringify(error.response, null, 2));
        }
    }
}

test();
