# 🚀 Quick Setup: 2 Minutes to Chat Dashboard

## Step 1: Add Your API Key
Edit `.env` and add:
```
OPENROUTER_API_KEY=sk_live_<YOUR_KEY_HERE>
```
Get key: https://openrouter.ai/keys

## Step 2: Start Server
```bash
npm run start
```

## Step 3: Open Dashboard
Go to: **http://localhost:3000**

## Step 4: Chat with AI

Type in left panel:
```
Create a beautiful login form
```

Press **Send** → See design appear in right panel ✨

---

## 🎯 Try These Designs

1. **Button**: "Create a modern red button with hover effect"
2. **Form**: "Design a contact form with name, email, message fields"
3. **Card**: "Make a product card with image, title, description, price"
4. **Header**: "Create a navigation header with logo and menu"
5. **Hero**: "Design a hero section with headline and CTA button"

---

## 📁 Files Created

- `server.js` - Backend API
- `public/index.html` - Dashboard UI
- `CHAT_DASHBOARD_GUIDE.md` - Complete guide

## ⚡ What to Know

✅ Live preview updates as AI generates
✅ Multi-turn conversations (AI remembers context)
✅ Costs $0.01-$0.15 per design
✅ Works offline once server starts

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `PORT=3001 npm run start` |
| No API key | Add to `.env` and restart |
| Blank preview | Wait for AI to finish, check console (F12) |
| Slow generation | DeepSeek is thinking - normal! |

---

**Ready?** Run `npm run start` and go to http://localhost:3000 🎉
