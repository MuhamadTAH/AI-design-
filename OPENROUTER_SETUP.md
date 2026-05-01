# OpenRouter + DeepSeek Integration Guide

This project now includes OpenRouter API integration with the DeepSeek model for AI-powered design assistance.

## 🚀 Quick Start

### 1. Get Your OpenRouter API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in
3. Go to **[API Keys](https://openrouter.ai/keys)**
4. Create a new API key
5. Copy your key

### 2. Configure `.env` File

Edit `.env` in the project root and paste your API key:

```env
OPENROUTER_API_KEY=your_actual_api_key_here
OPENROUTER_MODEL=deepseek/deepseek-chat
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**Security**: Never commit `.env` to Git. It's already in `.gitignore`.

### 3. Install Dependencies

```bash
npm install
```

This installs `dotenv` for environment variable management.

### 4. Test the Connection

Run the example chat:

```bash
npm run example:chat
```

Expected output:
```
🤖 OpenRouter + DeepSeek Chat Example

Using model: deepseek/deepseek-chat
API endpoint: https://openrouter.ai/api/v1

📝 Sending message to DeepSeek...

✅ DeepSeek Response:
[Response from DeepSeek]
```

## 📚 Usage Examples

### Simple Chat

```javascript
const client = require('./lib/openrouter-client');

const response = await client.chat({
  messages: [
    { role: 'user', content: 'Hello, DeepSeek!' }
  ],
  max_tokens: 1000
});

console.log(response);
```

### Multi-turn Conversation

```javascript
const messages = [
  { role: 'user', content: 'What is design thinking?' }
];

let reply = await client.chat({ messages, max_tokens: 1000 });

messages.push({ role: 'assistant', content: reply });
messages.push({ role: 'user', content: 'How do I apply it to a web project?' });

reply = await client.chat({ messages, max_tokens: 1000 });
```

### With System Prompt (Design Brief)

```javascript
const response = await client.chat({
  messages: [
    {
      role: 'system',
      content: 'You are a professional UI/UX designer.'
    },
    {
      role: 'user',
      content: 'Design a landing page for a SaaS product'
    }
  ],
  temperature: 0.8,  // More creative
  max_tokens: 2000
});
```

## 🎛️ API Parameters

```javascript
await client.chat({
  messages: [...],           // Required: array of messages
  max_tokens: 1000,         // Optional: max response length (default: 1000)
  temperature: 0.7,         // Optional: 0-2, higher = more creative (default: 0.7)
  top_p: 1                  // Optional: nucleus sampling (default: 1)
});
```

### Parameter Guide

- **max_tokens**: Response length limit
  - Design briefs: 1500-2000
  - Quick responses: 500-1000
  - Chat: 1000-1500

- **temperature**: Randomness/creativity
  - 0.0 = deterministic
  - 0.7 = balanced (default)
  - 1.5-2.0 = very creative

- **top_p**: Diversity control (usually leave at 1)

## 📁 File Structure

```
huashu-design/
├── .env                        # Your API key (not in Git)
├── .env.example               # Template for .env
├── package.json               # Node dependencies
├── lib/
│   └── openrouter-client.js   # API client module
├── examples/
│   ├── example-chat.js        # Simple chat example
│   └── example-design-brief.js # Design brief generator
└── OPENROUTER_SETUP.md        # This file
```

## 🔌 Integration with huashu-design

The API client can be used in Node.js scripts to:

1. **Generate design briefs** before creating HTML prototypes
2. **Get design recommendations** for color palettes, typography
3. **Refine design directions** with AI feedback
4. **Generate HTML content** with AI assistance

Example workflow:

```bash
# 1. Use DeepSeek to generate design recommendations
node examples/example-design-brief.js

# 2. Use the recommendations to inform your HTML design
# 3. Iterate with AI feedback

npm run example:design-brief
```

## ❓ Troubleshooting

### Error: "Missing OPENROUTER_API_KEY in .env file"
- Make sure `.env` exists in the project root
- Check that `OPENROUTER_API_KEY=your_key_here` is set
- Restart your terminal after adding the key

### Error: "OpenRouter API error (401)"
- Your API key is invalid or expired
- Get a fresh key from https://openrouter.ai/keys

### Error: "OpenRouter API error (429)"
- Rate limit exceeded
- Wait a few minutes before trying again

### Error: "No response from API"
- Check your internet connection
- Verify the API is accessible: `curl https://openrouter.ai/api/v1/models`

## 💡 Tips

1. **Test locally first**: Run the examples before integrating into your project
2. **Monitor costs**: Each request costs tokens. Check your OpenRouter dashboard
3. **System prompts**: Use them to set the tone/expertise (e.g., "You are a minimalist designer")
4. **Keep conversations short**: Long conversations use more tokens
5. **Use temperature wisely**: Higher for creative tasks, lower for factual

## 🔗 Resources

- OpenRouter: https://openrouter.ai
- DeepSeek Model: https://www.deepseek.com
- OpenRouter Docs: https://openrouter.ai/docs
- API Models List: https://openrouter.ai/models

## 📝 License

This integration follows the huashu-design license (Personal Use Only).
