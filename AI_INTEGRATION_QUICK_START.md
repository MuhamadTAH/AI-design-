# 🚀 Quick Start Guide

## ✅ What's Ready Now

Your AI-repo integration is **fully implemented and tested**!

### Features Enabled:
- ✅ SKILL.md system prompt loaded
- ✅ AI can read any repo file on-demand
- ✅ Conversation history tracked automatically
- ✅ Auto-save with 【SAVE】 tags
- ✅ Version management (v1, v2, v3...)
- ✅ Dashboard with chat + preview

---

## 🎯 How to Use

### 1. Start the Server
```bash
npm run start
```

Expected output:
```
✨ Chat Dashboard Server Running
📍 http://localhost:3000
🎯 Features enabled:
   ✅ SKILL.md system prompt (Huashu-Design)
   ✅ File reading API (/api/files/read)
   ✅ Conversation history tracking
   ✅ Auto-save with 【SAVE】 tags
   ✅ Version management (v1, v2, v3...)
```

### 2. Open Dashboard
```
http://localhost:3000/public/dashboard.html
```

### 3. Chat with AI

**Send a message:**
```
"Create an iOS app prototype for a social media app"
```

**What happens:**
1. Server sends to AI with full SKILL.md
2. AI reads repo files (animation-best-practices.md, design-styles.md)
3. AI generates 500-line HTML wrapped in 【SAVE】 tags
4. Server auto-saves to `/public/designs/conv_xxx_v1.html`
5. Preview appears in dashboard

**Follow up:**
```
"Add dark mode support"
```

**What happens:**
1. Server retrieves previous conversation
2. AI sees full history (original request + design created)
3. AI reads brand-spec.md + previous v1.html
4. AI modifies code (patch format)
5. Server merges and saves as v2
6. Preview updates

---

## 📊 Current Architecture

```
USER
  ↓ (sends message + conversationId)
DASHBOARD (chat-panel)
  ↓
SERVER (Express)
  ├─ GET /api/files/read?path=FILENAME
  │  └─ Called by AI to fetch repo files
  └─ POST /api/chat
     ├─ Loads full conversation history
     ├─ Builds: [SKILL.md + history + new message]
     ├─ Sends to OpenRouter
     ├─ Parses 【SAVE】 tags
     ├─ Auto-saves to /public/designs/
     └─ Returns response + file info
  ↓
AI (DeepSeek via OpenRouter)
  ├─ Sees: SKILL.md system prompt
  ├─ Sees: Full conversation history
  ├─ Can: Call read_reference() to fetch files
  ├─ Can: Generate code with 【SAVE】 tags
  └─ Returns: Design with explanations
  ↓
DASHBOARD (preview-panel)
  ├─ Shows iframe preview
  ├─ Shows version history (v1, v2, v3...)
  └─ Allows download
```

---

## 🎨 Example Workflow

### Step 1: New Conversation
```
User: "Make an animation dashboard"
↓
AI reads: SKILL.md + animation-best-practices.md
AI generates: 500-line HTML
Server saves: v1
```

### Step 2: Add Brand Colors
```
User: "Use our brand colors (red: #D4594C)"
↓
AI reads: Previous v1 + brand color info
AI modifies: Color values in CSS
Server saves: v2 (patch)
```

### Step 3: Add Interactions
```
User: "Make the buttons clickable"
↓
AI reads: v2 + app-prototype-rules.md
AI enhances: Add click handlers
Server saves: v3
```

### Step 4: Review Design
```
User: (switches to Versions tab)
↓
Shows: v1, v2, v3 with timestamps
User: (clicks "View" on v2)
↓
Preview switches to v2.html
```

---

## 📁 Key Files

### System Prompt
- **SKILL.md** (33 KB) - Complete Huashu-Design skill definition
- Loaded in server.js as main system prompt
- AI follows all principles, workflows, anti-slop rules

### Server Implementation
- **server.js** - Complete rewrite with:
  - `/api/chat` endpoint
  - `/api/files/read` endpoint
  - Conversation history tracking
  - Auto-save with 【SAVE】 tag parsing
  - Version management

### Dashboard
- **public/dashboard.html** - New UI with:
  - Chat panel (left)
  - Preview panel (right)
  - Version history dropdown
  - Conversation persistence (localStorage)

### Documentation
- **AI_INTEGRATION_IMPLEMENTATION.md** - Complete architecture guide
- **AI_INTEGRATION_QUICK_START.md** - This file

---

## 🧪 Test Commands

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### 2. Read File
```bash
curl "http://localhost:3000/api/files/read?path=SKILL.md"
```

Expected: SKILL.md content (33 KB)

### 3. Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Create a welcome page"}'
```

Expected: 
- Conversation ID created
- File saved to /public/designs/
- Response with file info

---

## 🔧 Configuration

### System Prompt (server.js)
```javascript
// Line 13-20
const COMPLETE_SYSTEM_PROMPT = `${SKILL_MD} + Tool Instructions + Save Rules`
```

This is what AI receives every request.

### File Reading (server.js)
```javascript
// Line 130-160
app.get('/api/files/read', ...)
```

AI calls this via `read_reference(filename)`

### Auto-Save (server.js)
```javascript
// Line 205-230
parseSaveTags(response)
fs.writeFileSync(...) // Saves 【SAVE】 tagged code
```

Files saved to `/public/designs/`

---

## 🎯 What the AI Can Do Now

### ✅ Enabled
- Read SKILL.md (automatically included)
- Fetch animation-best-practices.md
- Fetch design-styles.md
- Fetch brand-spec.md (if exists)
- Read previous versions of own code
- Generate HTML/CSS/JSX
- Understand full conversation history
- Make multi-turn iterations

### ⏳ Future (Phase 2)
- Function calling for direct saves
- Streaming responses
- Direct file system access
- Template library
- Design system components

---

## 📝 Important Notes

### About 【SAVE】 Tags
```
【SAVE】
<!DOCTYPE html>
<html>...
</html>
【/SAVE】
```

Only code between these tags gets saved.  
Examples shown inline without tags.

### About Conversation History
```javascript
// First request
messages = [system, user_message]

// Second request (same conversationId)
messages = [system, user_msg_1, ai_resp_1, user_msg_2]

// Third request
messages = [system, user_msg_1, ai_resp_1, user_msg_2, ai_resp_2, user_msg_3]
```

Full history sent every time for context.

### About localStorage
Dashboard stores `conversationId` in browser localStorage.  
Persists across page refreshes.  
Clear with "New" button to start fresh conversation.

---

## 🚨 Troubleshooting

### Port 3000 in use?
```bash
Get-Process node | Stop-Process -Force
npm run start
```

### SKILL.md not loading?
```bash
# Verify file exists
ls SKILL.md

# Check file size
(Get-Item SKILL.md).Length
```

### Files not saving?
```bash
# Create designs folder if needed
mkdir -p public/designs

# Check permissions
chmod 755 public/designs
```

### AI not reading files?
- Check file path spelling
- Verify file exists in repo
- Look at server logs for errors

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| SKILL.md prompt | ✅ | Fully loaded |
| File reading | ✅ | GET /api/files/read working |
| Conversation history | ✅ | In-memory tracking |
| Auto-save | ✅ | 【SAVE】 tags parsed |
| Version management | ✅ | v1, v2, v3... auto-incrementing |
| Dashboard | ✅ | Full UI implemented |
| API endpoints | ✅ | 3 main endpoints working |

**Production Ready For**: Local development, testing, prototyping  
**Not Ready For**: Multi-user production (needs database)

---

## 🎓 Learning Path

1. **Understand the system**
   - Read: AI_INTEGRATION_IMPLEMENTATION.md

2. **Try it out**
   - Open: http://localhost:3000/public/dashboard.html
   - Send a design request
   - Watch AI work

3. **Modify for your needs**
   - Edit system prompt in server.js
   - Add custom references
   - Configure new endpoints

4. **Upgrade to production**
   - Replace in-memory storage with database
   - Add user authentication
   - Deploy to cloud

---

## 📞 Quick Reference

| Need | How |
|------|-----|
| Start server | `npm run start` |
| Open dashboard | `http://localhost:3000/public/dashboard.html` |
| Check health | `curl http://localhost:3000/api/health` |
| Read file | `curl http://localhost:3000/api/files/read?path=SKILL.md` |
| View saved files | `ls public/designs/` |
| Stop server | `Ctrl+C` or `Stop-Process -Name node` |
| New conversation | Click "New" button |
| Download design | Click version → "Download" |

---

## ✨ You're All Set!

The AI-repo integration is **complete and working**.

Start designing with AI! 🚀

```
http://localhost:3000/public/dashboard.html
```

