/**
 * Simple chat example with DeepSeek via OpenRouter
 * 
 * Usage:
 *   npm install
 *   node examples/example-chat.js
 */

const client = require('../lib/openrouter-client');

async function main() {
  try {
    console.log('🤖 OpenRouter + DeepSeek Chat Example\n');
    console.log(`Using model: ${client.MODEL}`);
    console.log(`API endpoint: ${client.BASE_URL}\n`);

    // Simple chat
    console.log('📝 Sending message to DeepSeek...\n');
    
    const response = await client.chat({
      messages: [
        {
          role: 'user',
          content: 'What are the best practices for designing a product launch animation? Give me 5 key points.'
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    console.log('✅ DeepSeek Response:\n');
    console.log(response);
    console.log('\n---\n');

    // Multi-turn conversation
    console.log('💬 Multi-turn conversation example:\n');

    const messages = [
      { role: 'user', content: 'What is the difference between UI and UX design?' },
    ];

    let reply = await client.chat({
      messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    console.log('User: What is the difference between UI and UX design?');
    console.log(`DeepSeek: ${reply}\n`);

    // Follow-up
    messages.push({ role: 'assistant', content: reply });
    messages.push({ role: 'user', content: 'Give me examples of UI design tools.' });

    reply = await client.chat({
      messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    console.log('User: Give me examples of UI design tools.');
    console.log(`DeepSeek: ${reply}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
