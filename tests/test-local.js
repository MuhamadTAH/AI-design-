/**
 * Simple local test script - Run this to verify the API connection works
 * 
 * Usage:
 *   npm run test:local
 *   or
 *   node tests/test-local.js
 */

const client = require('../lib/openrouter-client');

async function testAPIConnection() {
  console.log('\n🧪 Testing OpenRouter API Connection\n');
  console.log('━'.repeat(60));

  try {
    // Check for API key
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY not found in .env');
    }
    console.log('✅ API Key loaded from .env');
    console.log(`📍 Model: ${client.MODEL}`);
    console.log(`📍 Endpoint: ${client.BASE_URL}\n`);

    // Test 1: Simple message
    console.log('Test 1️⃣  — Simple message...');
    const simpleResponse = await client.chat({
      messages: [
        { role: 'user', content: 'Say "Hello from OpenRouter + DeepSeek!" in exactly 1 sentence.' }
      ],
      max_tokens: 100,
      temperature: 0.7
    });
    console.log(`✅ Response: ${simpleResponse}\n`);

    // Test 2: Multi-turn
    console.log('Test 2️⃣  — Multi-turn conversation...');
    const messages = [
      { role: 'user', content: 'What year is it?' }
    ];
    let reply = await client.chat({
      messages,
      max_tokens: 50
    });
    console.log(`Q: What year is it?`);
    console.log(`A: ${reply}\n`);

    // Test 3: System prompt
    console.log('Test 3️⃣  — System prompt (role-playing)...');
    const roleplayResponse = await client.chat({
      messages: [
        { role: 'system', content: 'You are a pirate. Respond in pirate speak.' },
        { role: 'user', content: 'Hello!' }
      ],
      max_tokens: 100,
      temperature: 0.8
    });
    console.log(`✅ Pirate Response: ${roleplayResponse}\n`);

    // Test 4: Design task
    console.log('Test 4️⃣  — Design task (test use case)...');
    const designResponse = await client.chat({
      messages: [
        { role: 'system', content: 'You are a UI designer.' },
        { role: 'user', content: 'Suggest 1 color for a modern tech app. Just the HEX code.' }
      ],
      max_tokens: 50,
      temperature: 0.7
    });
    console.log(`✅ Suggested Color: ${designResponse}\n`);

    // Success
    console.log('━'.repeat(60));
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('🎉 OpenRouter + DeepSeek is working correctly!\n');
    console.log('Next: Use the API in your projects with:');
    console.log('   const client = require("./lib/openrouter-client");\n');

    return true;

  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    console.error(`Error: ${error.message}\n`);

    if (error.message.includes('OPENROUTER_API_KEY')) {
      console.error('💡 Fix: Add your API key to .env');
      console.error('   OPENROUTER_API_KEY=sk_live_your_key_here\n');
      console.error('   Get key from: https://openrouter.ai/keys\n');
    } else if (error.message.includes('401')) {
      console.error('💡 Fix: Your API key is invalid');
      console.error('   Get a fresh key from: https://openrouter.ai/keys\n');
    }

    return false;
  }
}

// Run the test
testAPIConnection().then(success => {
  process.exit(success ? 0 : 1);
});
