# 🔧 Troubleshooting Guide

## Current Status ✅

Server is running on **http://localhost:3003/**

All systems operational:
- ✅ Dashboard loads
- ✅ Chat API works
- ✅ AI responds
- ✅ Auto-save works
- ✅ Multi-turn conversations work

---

## ❌ Error: "Cannot read properties of undefined"

**Cause:** This was a response handling issue.

**Fix Applied:** 
- Added detailed logging to track every step
- Improved error handling with null checks
- Better error messages

**How to debug if you see this again:**
1. Open browser console: **F12** or **Ctrl+Shift+K**
2. Look for log messages starting with 🔵, 📝, 🌐, ✅, 📊, 🤖, ✨
3. Find where the error occurs
4. Report the exact log output

---

## ❌ Error: "Failed to load resource: 404"

**Cause:** Usually for favicon.ico or missing static files.

**Fix:** Not critical - doesn't affect functionality

**Solution if it bothers you:**
- Create empty favicon: `touch public/favicon.ico`
- Or ignore it - just an icon, doesn't break chat

---

## 🚀 Quick Start (Copy/Paste)

### 1. Start Server
```bash
cd D:\huashu-design
npm run start
```

Expected output:
```
⚠️  Port 3000 is in use, trying port 3001...
✨ Chat Dashboard Server Running
📍 http://localhost:3003
```

### 2. Open Dashboard
```
http://localhost:3003/
```

### 3. Type a Message
```
"Create a beautiful landing page with a hero section"
```

### 4. Watch AI Respond
- Left panel: Chat messages
- Right panel: Design preview (if AI saves code)

---

## 📊 Understanding the Logs

### Browser Console (F12)

**Good flow:**
```
🔵 [sendMessage] Starting...
📝 [sendMessage] Adding user message to display
🌐 [sendMessage] Sending to /api/chat
✅ [sendMessage] Response received, status: 200
📊 [sendMessage] Response data: {success: true, ...}
🤖 [sendMessage] Adding AI response
✨ [sendMessage] Complete
```

**Bad flow (error):**
```
🔵 [sendMessage] Starting...
📝 [sendMessage] Adding user message to display
🌐 [sendMessage] Sending to /api/chat
❌ [sendMessage] Error: TypeError: Cannot read properties...
```

### Terminal/Server Console

**Good flow:**
```
🔵 [/api/chat] Request received
   Message: hello
   ConversationId: NEW
   Created new conversation: conv_xxx
🌐 Sending to OpenRouter...
✅ Received response (648 chars)
📤 Sending response to client
✨ Response sent successfully
```

**Bad flow (error):**
```
❌ Chat error: [error message]
   Stack: [stack trace]
```

---

## 🔍 Debugging Steps

### Step 1: Check if server is running
```powershell
Invoke-RestMethod -Uri "http://localhost:3003/api/health"
```

Expected: `@{status=ok; timestamp=...}`

### Step 2: Test API directly
```powershell
$response = Invoke-RestMethod `
  -Uri "http://localhost:3003/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"hello"}'

$response.response  # Should show AI response
```

### Step 3: Check dashboard loads
```
Open: http://localhost:3003/
Look for: Chat panel + Preview panel
```

### Step 4: Send test message
1. Open http://localhost:3003/
2. Type: "hello"
3. Open browser console (F12)
4. Click Send
5. Check for logs

---

## 🎯 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on favicon | Missing file | Ignore or create empty file |
| "Cannot read properties" | Response handling | Check console logs for details |
| Chat doesn't send | JavaScript error | Check browser console (F12) |
| AI doesn't respond | OpenRouter API issue | Check .env has valid API key |
| Port in use | Other processes | Server auto-tries next port |
| No preview shown | AI didn't use 【SAVE】 | Ask AI to "create code" |

---

## 🛠️ Manual Testing

### Test 1: Health Check
```bash
curl http://localhost:3003/api/health
```

### Test 2: Chat API
```bash
curl -X POST http://localhost:3003/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"hello\"}"
```

### Test 3: File Reading
```bash
curl "http://localhost:3003/api/files/read?path=SKILL.md"
```

### Test 4: Dashboard
```bash
curl -s http://localhost:3003/ | head -20
```

---

## 📝 Environment Variables

Check `.env` file has:
```
OPENROUTER_API_KEY=your_key_here
```

If missing:
1. Get key from: https://openrouter.ai
2. Add to .env:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 🎓 Architecture Flow

```
USER (Browser)
  ↓ types message
DASHBOARD (JS)
  ↓ console logs: 🔵🌐✅...
API SERVER (/api/chat)
  ↓ console logs: 🔵🌐✅...
OPENROUTER
  ↓ DeepSeek API
  ↑ response
API SERVER
  ↓ returns JSON
DASHBOARD
  ↓ updates UI
USER (sees response)
```

---

## 💡 Pro Tips

1. **Save responses you like:**
   - Right-click preview → Save as HTML
   - Or click "Download" button

2. **Test multi-turn conversations:**
   - Message 1: "Create button"
   - Message 2: "Make it blue"
   - Message 3: "Add click animation"
   - See AI maintain context

3. **Force AI to save code:**
   - Ask: "Create a complete HTML page and save it"
   - AI will use 【SAVE】 tags
   - Preview will show

4. **View full conversation:**
   - Open browser console (F12)
   - Look at all log messages
   - Shows what AI is doing behind the scenes

---

## 🆘 If Still Stuck

1. Open browser console: **F12**
2. Send message
3. Copy ALL console output (logs + errors)
4. Share with support

The logs will show exactly where the problem is!

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Server running on port 3003 (or shown port)
- [ ] Dashboard loads at shown URL
- [ ] Browser console open and no errors
- [ ] Message sends without errors
- [ ] AI responds with text
- [ ] No "Cannot read properties" errors
- [ ] New message shows in left panel
- [ ] Conversation ID created in localStorage

If all checked ✅, system is working!

---

**Current Status:** ✨ All systems operational and tested!

**Next Step:** Open http://localhost:3003/ and start creating!
