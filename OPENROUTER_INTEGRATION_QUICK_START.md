# 🚀 OpenRouter + DeepSeek Integration Quick Start

Your huashu-design repo is now connected to OpenRouter with the DeepSeek model!

## ⚙️ Setup (3 steps)

### Step 1: Get API Key
1. Go to https://openrouter.ai
2. Sign up / Login
3. Click **[API Keys](https://openrouter.ai/keys)**
4. Create a new key
5. Copy it

### Step 2: Add to `.env`
Edit `.env` and paste your key:
```env
OPENROUTER_API_KEY=sk_live_your_key_here
```

### Step 3: Test
```bash
npm run example:chat
```

If it works, you'll see DeepSeek's response!

---

## 📝 Usage

### Basic Chat
```javascript
const client = require('./lib/openrouter-client');

const response = await client.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 1000
});
console.log(response);
```

### Design Brief Generator
```bash
npm run example:design-brief
```

---

## 📂 What's Included

```
huashu-design/
├── .env                        ← Add your API key here
├── package.json               ← Dependencies (dotenv)
├── lib/
│   └── openrouter-client.js   ← The API wrapper
├── examples/
│   ├── example-chat.js        ← Simple chat demo
│   └── example-design-brief.js ← AI design brief generator
├── OPENROUTER_SETUP.md        ← Detailed guide
└── OPENROUTER_INTEGRATION_QUICK_START.md (this file)
```

---

## 🎯 Available Models

The integration defaults to **DeepSeek Chat**, but you can change `OPENROUTER_MODEL` in `.env` to:

- `deepseek/deepseek-chat` (default, fast & cheap)
- `openai/gpt-4-turbo` (most capable)
- `anthropic/claude-3-opus` (best for complex tasks)
- [See all models](https://openrouter.ai/models)

---

## 💡 Next Steps

1. **Integrate into your design workflow** — Use DeepSeek to generate design recommendations before building HTML
2. **Create custom scripts** — Add your own examples in `examples/`
3. **Extend the client** — Add streaming, image support, etc. in `lib/openrouter-client.js`

---

## ❓ Need Help?

- **Setup issues?** → See `OPENROUTER_SETUP.md`
- **API errors?** → Check your API key at https://openrouter.ai/keys
- **Cost?** → https://openrouter.ai/pricing

---

**Status**: ✅ Fully integrated and ready to use!
