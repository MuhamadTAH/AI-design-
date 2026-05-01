# 🧪 How to Test Locally

This OpenRouter integration is a **Node.js library** (not a web app), so you DON'T need production setup. Just run it locally!

## 🚀 Test Now (Choose One)

### Option 1: Run the Quick Test (BEST FOR FIRST TEST)
```bash
npm run test:local
```

This will:
- ✅ Check your API key is loaded
- ✅ Test simple message
- ✅ Test multi-turn conversation
- ✅ Test system prompts
- ✅ Test design tasks

### Option 2: Run the Chat Example
```bash
npm run example:chat
```

Simple chat and multi-turn demo.

### Option 3: Run the Design Brief Generator
```bash
npm run example:design-brief
```

AI design recommendations and color palettes.

### Option 4: Run a Dev Server (for development)
```bash
npm run dev
```

Same as `npm run example:chat` (configurable).

---

## 📋 Step-by-Step Testing

### Step 1: Make Sure API Key is Set
Edit `.env`:
```env
OPENROUTER_API_KEY=sk_live_your_actual_key_here
```

### Step 2: Run a Test
```bash
cd D:\huashu-design
npm run test:local
```

Expected output:
```
🧪 Testing OpenRouter API Connection

✅ API Key loaded from .env
📍 Model: deepseek/deepseek-chat
📍 Endpoint: https://openrouter.ai/api/v1

Test 1️⃣  — Simple message...
✅ Response: Hello from OpenRouter + DeepSeek!

Test 2️⃣  — Multi-turn conversation...
✅ Year is 2026

[... more tests ...]

✅ ALL TESTS PASSED!
```

### Step 3: You're Done!
Now use the API in your projects.

---

## 💻 Available Commands

```bash
# Test the connection (4 quick tests)
npm run test:local

# Run chat example
npm run example:chat

# Run design brief generator
npm run example:design-brief

# Run dev (same as example:chat)
npm run dev
```

---

## 🔧 Create Your Own Test

Create a new file like `my-test.js`:

```javascript
const client = require('./lib/openrouter-client');

async function myTest() {
  const response = await client.chat({
    messages: [
      { role: 'user', content: 'Your question here' }
    ],
    max_tokens: 1000
  });
  console.log(response);
}

myTest();
```

Run it:
```bash
node my-test.js
```

---

## ❓ Do I Need Production Setup?

**SHORT ANSWER: No**

This is a **Node.js library**, not a web app. It:
- ✅ Runs locally on your machine
- ✅ Works with `npm` commands
- ✅ No server needed
- ✅ Uses environment variables (`.env`)
- ✅ Perfect for testing

### When to Deploy to Production

You'd deploy to production if:
1. You build a **web app** (Express, Next.js, etc.) using this library
2. You want to run it on a **server** (AWS, Heroku, etc.)
3. You need it to be **always running** (like an API)

For now, just test locally! 🎉

---

## 🎯 Testing Flow

```
1. Edit .env (add API key)
   ↓
2. npm run test:local (verify connection)
   ↓
3. npm run example:chat (try interactive chat)
   ↓
4. npm run example:design-brief (try design task)
   ↓
5. Create your own script (my-test.js)
   ↓
6. Use in your projects!
```

---

## 📊 What Gets Tested

The test script checks:

| Test | What It Does |
|------|------------|
| 1️⃣ API Key | Verifies .env is loaded |
| 2️⃣ Simple Message | Sends basic chat message |
| 3️⃣ Multi-turn | Tests conversation history |
| 4️⃣ System Prompt | Tests role-playing (pirate!) |
| 5️⃣ Design Task | Tests design use case |

---

## ❌ Troubleshooting

**Error: "OPENROUTER_API_KEY not found"**
- Add key to `.env`: `OPENROUTER_API_KEY=sk_live_...`

**Error: "API error (401)"**
- Your key is invalid
- Get a fresh one: https://openrouter.ai/keys

**Error: "Cannot find module"**
- Run `npm install` first

**No output / Script hangs**
- Your internet might be slow
- Or OpenRouter is having issues
- Check: https://openrouter.ai/status

---

## ✅ You're Ready!

Just run:
```bash
npm run test:local
```

If it works, you're good to go! 🚀
