# 🎨 OpenRouter + DeepSeek API Integration Guide

Your **huashu-design** repository now has full OpenRouter API integration with DeepSeek model support!

## 🚀 3-Minute Setup

### Step 1: Get Your API Key (1 minute)
1. Visit **[openrouter.ai](https://openrouter.ai)**
2. Sign up or log in
3. Go to **[API Keys](https://openrouter.ai/keys)**
4. Click "Create API Key"
5. Copy the key

### Step 2: Add to `.env` (30 seconds)
Open `.env` file and replace:
```env
OPENROUTER_API_KEY=your_actual_key_here
```

Example:
```env
OPENROUTER_API_KEY=sk_live_abc123def456...
```

### Step 3: Test It! (30 seconds)
```bash
npm run example:chat
```

Expected output:
```
🤖 OpenRouter + DeepSeek Chat Example

Using model: deepseek/deepseek-chat
API endpoint: https://openrouter.ai/api/v1

✅ DeepSeek Response:
[AI-generated response about design animations]
```

**That's it!** 🎉 You're ready to use DeepSeek API in your projects.

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `.env` | **← ADD YOUR API KEY HERE** |
| `.env.example` | Template showing required variables |
| `lib/openrouter-client.js` | Core API client module |
| `examples/example-chat.js` | Simple chat & multi-turn demo |
| `examples/example-design-brief.js` | Design brief generator |
| `package.json` | Node dependencies |
| `OPENROUTER_SETUP.md` | Full technical documentation |
| `OPENROUTER_INTEGRATION_QUICK_START.md` | Quick reference |
| `INTEGRATION_SUMMARY.md` | Integration details |

---

## 💻 Usage Examples

### Simple Chat
```javascript
const client = require('./lib/openrouter-client');

const response = await client.chat({
  messages: [
    { role: 'user', content: 'Design a loading animation' }
  ],
  max_tokens: 1000
});

console.log(response);
```

### Multi-turn Conversation
```javascript
const messages = [
  { role: 'user', content: 'What is good animation?' }
];

let reply = await client.chat({ messages, max_tokens: 1000 });
console.log('DeepSeek:', reply);

// Follow-up
messages.push({ role: 'assistant', content: reply });
messages.push({ role: 'user', content: 'Give me examples' });

reply = await client.chat({ messages, max_tokens: 1000 });
console.log('DeepSeek:', reply);
```

### With System Prompt
```javascript
const response = await client.chat({
  messages: [
    {
      role: 'system',
      content: 'You are a world-class UI/UX designer specializing in motion design.'
    },
    {
      role: 'user',
      content: 'Suggest 3 animation styles for a SaaS product launch.'
    }
  ],
  max_tokens: 2000,
  temperature: 0.8  // More creative
});
```

### Design Brief Generator
```bash
npm run example:design-brief
```
Generates AI-powered design recommendations and color palettes.

---

## 🎯 Common Tasks

### Generate Design Recommendations
```javascript
const design = await client.chat({
  messages: [
    { role: 'system', content: 'You are a design strategist.' },
    { role: 'user', content: 'Recommend visual directions for a fintech dashboard' }
  ],
  max_tokens: 2000
});
```

### Get Color Palettes
```javascript
const colors = await client.chat({
  messages: [
    { role: 'user', content: 'Create 3 modern color palettes with HEX codes' }
  ],
  max_tokens: 1000
});
```

### Generate HTML Content
```javascript
const html = await client.chat({
  messages: [
    { role: 'user', content: 'Generate HTML for a hero section about AI' }
  ],
  max_tokens: 2000
});
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
# Required - Your OpenRouter API key
OPENROUTER_API_KEY=sk_live_your_key_here

# Optional - Model to use (defaults to DeepSeek)
OPENROUTER_MODEL=deepseek/deepseek-chat

# Optional - API endpoint
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### API Parameters

```javascript
client.chat({
  messages: [...],           // Required
  max_tokens: 1000,         // Optional: response length (default: 1000)
  temperature: 0.7,         // Optional: creativity 0-2 (default: 0.7)
  top_p: 1                  // Optional: diversity control (default: 1)
})
```

**Temperature Guide:**
- `0.0` = Deterministic, factual
- `0.7` = Balanced (default)
- `1.5+` = Creative, unpredictable

---

## 📊 Pricing & Models

### Default: DeepSeek Chat
- **Cost:** ~$0.14 / 1M input tokens, ~$0.28 / 1M output tokens
- **Speed:** Very fast
- **Quality:** Excellent for design tasks

### Alternative Models
Change `OPENROUTER_MODEL` in `.env`:

- `openai/gpt-4-turbo` — Most capable ($0.01/$0.03 per 1K tokens)
- `anthropic/claude-3-opus` — Best for complex reasoning ($0.015/$0.075 per 1K)
- `meta-llama/llama-2-70b-chat` — Open source, very cheap
- [View all models →](https://openrouter.ai/models)

---

## 🔒 Security

✅ **Your API key is protected:**
- `.env` is in `.gitignore` — won't be committed to Git
- Use environment variables — never hardcode keys

⚠️ **Never:**
- Share your API key
- Commit `.env` to version control
- Embed keys in client-side code

🔄 **If compromised:**
1. Go to https://openrouter.ai/keys
2. Delete the old key
3. Generate a new one
4. Update `.env`

---

## ❓ Troubleshooting

### "Missing OPENROUTER_API_KEY in .env file"
```
Solution: Add your key to .env:
OPENROUTER_API_KEY=sk_live_...
```

### "OpenRouter API error (401)"
```
Solution: Your API key is invalid
- Get fresh key from https://openrouter.ai/keys
- Restart your terminal after updating .env
```

### "OpenRouter API error (429)"
```
Solution: Rate limited
- Wait 1-2 minutes before retrying
- Check your usage at https://openrouter.ai
```

### "Network error / timeout"
```
Solution: Check connection
curl https://openrouter.ai/api/v1/models
```

---

## 📖 Documentation Files

- **OPENROUTER_SETUP.md** — Comprehensive setup guide with all details
- **OPENROUTER_INTEGRATION_QUICK_START.md** — Quick reference (3 steps)
- **INTEGRATION_SUMMARY.md** — Technical integration details
- **README.md (this file)** — Getting started

---

## 🔗 Resources

- **OpenRouter:** https://openrouter.ai
- **API Documentation:** https://openrouter.ai/docs
- **API Keys:** https://openrouter.ai/keys
- **Available Models:** https://openrouter.ai/models
- **DeepSeek:** https://www.deepseek.com
- **Pricing:** https://openrouter.ai/pricing

---

## 🎓 Integration Ideas

### Idea 1: Design Assistant
Integrate with your design workflow to get instant recommendations.

### Idea 2: Content Generator
Generate HTML, CSS, or design briefs automatically.

### Idea 3: Code Review
Ask DeepSeek to review your animation code.

### Idea 4: Inspiration Engine
Get design direction suggestions for new projects.

---

## ✨ What's Included

✅ Core API client (`lib/openrouter-client.js`)
✅ Two working examples (`examples/`)
✅ Environment variable setup (`.env`)
✅ npm package.json with dependencies
✅ Comprehensive documentation
✅ Git protection for secrets

---

## 🚀 Next Steps

1. ✅ **Setup** — Add API key to `.env` (2 min)
2. ✅ **Test** — Run `npm run example:chat` (1 min)
3. **Explore** — Try the design brief generator (2 min)
4. **Integrate** — Use in your projects
5. **Extend** — Create custom examples

---

## 📞 Need Help?

- Check `OPENROUTER_SETUP.md` for detailed troubleshooting
- Visit https://openrouter.ai/docs for API documentation
- Your API key at https://openrouter.ai/keys

---

**Happy designing with AI!** 🎨🤖
