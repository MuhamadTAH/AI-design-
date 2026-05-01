/**
 * OpenRouter API Client for DeepSeek Model
 * 
 * Usage:
 *   const client = require('./lib/openrouter-client');
 *   const response = await client.chat({
 *     messages: [{ role: 'user', content: 'Hello' }],
 *     max_tokens: 1000
 *   });
 */

const https = require('https');
const http = require('http');
require('dotenv').config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
const BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

if (!API_KEY) {
  throw new Error(
    'Missing OPENROUTER_API_KEY in .env file\n' +
    'Get your API key at: https://openrouter.ai/keys'
  );
}

/**
 * Make a request to OpenRouter API
 * @param {string} endpoint - API endpoint (e.g., '/chat/completions')
 * @param {object} data - Request payload
 * @returns {Promise<object>} Response from API
 */
function makeRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const payload = JSON.stringify(data);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://github.com/alchaincyf/huashu-design',
        'X-Title': 'Huashu Design'
      }
    };

    const req = client.request(url, options, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          
          if (res.statusCode !== 200) {
            reject(new Error(
              `OpenRouter API error (${res.statusCode}): ${parsed.error?.message || body}`
            ));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Send a chat message to DeepSeek via OpenRouter
 * @param {object} options - Chat options
 * @param {array} options.messages - Chat messages [{ role: 'user'|'assistant'|'system', content: string }]
 * @param {number} options.max_tokens - Maximum tokens in response (default: 1000)
 * @param {number} options.temperature - Temperature for sampling (0-2, default: 0.7)
 * @param {number} options.top_p - Nucleus sampling parameter (default: 1)
 * @returns {Promise<string>} Response text from DeepSeek
 */
async function chat(options = {}) {
  const {
    messages,
    max_tokens = 1000,
    temperature = 0.7,
    top_p = 1
  } = options;

  if (!messages || !Array.isArray(messages)) {
    throw new Error('messages must be an array');
  }

  if (messages.length === 0) {
    throw new Error('messages cannot be empty');
  }

  const payload = {
    model: MODEL,
    messages,
    max_tokens,
    temperature,
    top_p
  };

  const response = await makeRequest('/chat/completions', payload);
  
  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content;
  }

  throw new Error('No response from API');
}

/**
 * Stream a chat response (for real-time output)
 * @param {object} options - Chat options (same as chat())
 * @param {function} onChunk - Callback for each chunk of response
 * @returns {Promise<string>} Full response text
 */
async function chatStream(options = {}, onChunk) {
  const {
    messages,
    max_tokens = 1000,
    temperature = 0.7,
    top_p = 1
  } = options;

  if (!onChunk || typeof onChunk !== 'function') {
    throw new Error('onChunk callback is required');
  }

  // Note: Full streaming implementation would require WebSocket or Server-Sent Events
  // For now, we'll use the non-streaming endpoint and emit chunks
  const response = await chat(options);
  
  // Simulate streaming by emitting word by word
  const words = response.split(' ');
  let accumulated = '';
  
  for (const word of words) {
    accumulated += word + ' ';
    onChunk(word + ' ');
  }

  return accumulated.trim();
}

module.exports = {
  chat,
  chatStream,
  MODEL,
  BASE_URL
};
