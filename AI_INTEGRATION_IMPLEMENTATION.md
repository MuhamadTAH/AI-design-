# 🎨 AI-Repo Integration Implementation Guide

**Status**: ✅ **COMPLETE & TESTED**  
**Date**: 2026-05-01  
**Version**: 1.0.0

---

## 📋 What Was Implemented

This document describes the complete architecture for connecting AI to the Huashu-Design repository with full conversation history, smart file reading, and auto-save functionality.

### Core Features Enabled

✅ **SKILL.md System Prompt** - AI follows all Huashu-Design principles  
✅ **File Reading API** - AI can fetch any repo file on-demand  
✅ **Conversation History** - Full multi-turn context preservation  
✅ **Auto-Save with Tags** - Code automatically saved when tagged with 【SAVE】  
✅ **Version Management** - Automatic v1, v2, v3... progression  
✅ **Dashboard UI** - Chat + preview + version history  

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  User Dashboard (browser)                               │
│  - Chat input                                           │
│  - Design preview (iframe)                              │
│  - Version history dropdown                             │
└────────────┬────────────────────────────────────────────┘
             │ conversationId + message
             ↓
┌─────────────────────────────────────────────────────────┐
│  Server (Express)                                       │
│                                                         │
│  POST /api/chat                                         │
│  ├─ Get conversation history                            │
│  ├─ Build messages: [system + full history + new msg]  │
│  └─ Send to OpenRouter                                  │
│                                                         │
│  GET /api/files/read?path=FILENAME                      │
│  └─ Fetch repo file (called by AI)                      │
└────────────┬────────────────────────────────────────────┘
             │ Full history + system prompt
             ↓
┌─────────────────────────────────────────────────────────┐
│  OpenRouter API + DeepSeek Model                        │
│                                                         │
│  AI receives:                                           │
│  - SKILL.md (complete system prompt)                    │
│  - Tool Use Instructions (how to use files)             │
│  - Save Tag Rules (【SAVE】...【/SAVE】)                  │
│  - Full conversation history                           │
│                                                         │
│  AI can:                                               │
│  - Call read_reference() to fetch files                 │
│  - Read and understand entire conversation              │
│  - Generate code wrapped in 【SAVE】 tags               │
└────────────┬────────────────────────────────────────────┘
             │ Response with possible tool calls
             ↓
┌─────────────────────────────────────────────────────────┐
│  Server Processing                                      │
│                                                         │
│  1. Parse response for 【SAVE】 tags                      │
│  2. Auto-save marked code to /public/designs/           │
│  3. Track version number (v1, v2, v3...)               │
│  4. Store in conversation history                       │
│  5. Return to user                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Changes

### Modified Files

**`server.js`** (completely rewritten)
- Loads SKILL.md from file system
- Implements Tool Use Instructions protocol
- Implements Save Tag Rules
- Maintains conversation history in-memory
- Automatically parses 【SAVE】 tags
- Saves versioned files to `/public/designs/`
- Tracks file metadata in database structure
- Implements `/api/files/read` endpoint
- Implements `/api/chat` endpoint with full history
- Implements `/api/versions/:conversationId` endpoint

### New Files

**`public/dashboard.html`** (new)
- Updated two-column layout (chat + preview)
- Conversation persistence (localStorage)
- Version history management
- Tab switching (preview vs versions)
- Real-time message display
- Download functionality

**`AI_INTEGRATION_IMPLEMENTATION.md`** (this file)
- Complete architecture documentation
- Implementation guide
- Testing instructions

---

## 🎯 System Prompt Components

The AI receives a complete system prompt consisting of:

### 1. SKILL.md (33 KB)
The complete Huashu-Design skill definition including:
- Core identity: "Designer working with HTML"
- 6 core principles (fact verification, asset protocol, etc.)
- Design Direction Advisor mode (8 phases)
- Anti-AI slop checklist
- App/iOS prototype rules
- All workflow guidelines

### 2. Tool Use Instructions (1 KB)
Explains:
- How to call `read_reference(filename)`
- How to interpret `role: "tool"` responses
- When to fetch files vs continue
- Example workflows

### 3. Save Tag Rules (1 KB)
Specifies:
- Use 【SAVE】...【/SAVE】 for final code only
- Examples/snippets shown inline without tags
- Only tagged code gets saved
- Can have multiple 【SAVE】 blocks

---

## 🔄 Message Flow Example

### Message 1: User creates design

```
STEP 1: User sends message
POST /api/chat
{
  "message": "Create an animation dashboard",
  "conversationId": null  // New conversation
}

STEP 2: Server builds system prompt
messages = [
  { role: "system", content: "[SKILL.md + Tool Instructions + Save Rules]" },
  { role: "user", content: "Create an animation dashboard" }
]

STEP 3: Send to OpenRouter
AI receives full system prompt + message
AI thinks: "I need animation best practices"
AI calls: read_reference("references/animation-best-practices.md")

STEP 4: AI gets file back
messages = [
  { role: "system", ... },
  { role: "user", content: "Create animation..." },
  { role: "tool", content: "[Animation guidelines]" }
]

STEP 5: AI generates design
AI creates 500-line HTML wrapped in 【SAVE】:
【SAVE】
<!DOCTYPE html>
... design code ...
【/SAVE】

STEP 6: Server processes response
1. Parse for 【SAVE】 tag
2. Extract code: 500 lines
3. Save to: /public/designs/conv_abc_v1.html
4. Return to user with file info

RESPONSE:
{
  "success": true,
  "conversationId": "conv_abc",
  "response": "[Design explanation without 【SAVE】 tags]",
  "savedFiles": [
    {
      "version": 1,
      "filename": "conv_abc_v1.html",
      "url": "/public/designs/conv_abc_v1.html",
      "type": "html",
      "size": 50000
    }
  ]
}
```

### Message 2: User asks for modification

```
STEP 1: User sends followup
POST /api/chat
{
  "message": "Make the colors match our brand",
  "conversationId": "conv_abc"  // Same conversation!
}

STEP 2: Server retrieves full history
messages = [
  { role: "system", ... },
  { role: "user", content: "Create animation..." },
  { role: "assistant", content: "..." },
  { role: "user", content: "Make colors match brand" }
]

STEP 3: AI reads history
"Oh! User created animation before. Now wants brand colors.
I should:
1. Fetch brand-spec.md to get colors
2. Fetch prev design to modify it
3. Update colors
4. Save new version"

STEP 4: AI calls files
read_reference("brand-spec.md")
read_reference("designs/conv_abc_v1.html")

STEP 5: AI modifies and saves
【SAVE】
```diff
- old colors
+ new brand colors
```
【/SAVE】

STEP 6: Server merges and saves
1. Parse patch format
2. Merge with v1.html
3. Save as: /public/designs/conv_abc_v2.html
4. Track as version 2

RESPONSE:
{
  "success": true,
  "conversationId": "conv_abc",
  "response": "[Updated design explanation]",
  "savedFiles": [
    { version: 2, filename: "conv_abc_v2.html", ... }
  ]
}
```

---

## 🔌 API Endpoints

### POST /api/chat
**Create or continue a conversation**

Request:
```json
{
  "message": "Your design request here",
  "conversationId": "conv_abc..."  // Optional, creates new if omitted
}
```

Response:
```json
{
  "success": true,
  "conversationId": "conv_1777604932536_1",
  "response": "Design explanation (clean text, no 【SAVE】 tags)",
  "savedFiles": [
    {
      "version": 1,
      "filename": "conv_1777604932536_1_v1.html",
      "url": "/public/designs/conv_1777604932536_1_v1.html",
      "type": "html",
      "timestamp": "2026-05-01T03:08:32Z",
      "size": 1200
    }
  ],
  "designCount": 1,
  "messageCount": 2
}
```

### GET /api/files/read
**Fetch any repository file (called by AI)**

Request:
```
GET /api/files/read?path=references/animation-best-practices.md
```

Response:
```json
{
  "success": true,
  "path": "references/animation-best-practices.md",
  "content": "... full file content ...",
  "size": 5234
}
```

### GET /api/versions/:conversationId
**Get all versions for a conversation**

Request:
```
GET /api/versions/conv_abc
```

Response:
```json
{
  "success": true,
  "conversationId": "conv_abc",
  "versions": [
    {
      "version": 1,
      "filename": "conv_abc_v1.html",
      "url": "/public/designs/conv_abc_v1.html",
      "type": "html",
      "timestamp": "2026-05-01T03:08:32Z",
      "size": 1200
    },
    {
      "version": 2,
      "filename": "conv_abc_v2.html",
      "url": "/public/designs/conv_abc_v2.html",
      "type": "html",
      "timestamp": "2026-05-01T03:10:45Z",
      "size": 1250
    }
  ],
  "totalVersions": 2
}
```

---

## 💾 Data Storage

### In-Memory (Current)
```javascript
conversations[conversationId] = [
  { role: "system", content: "..." },
  { role: "user", content: "User message" },
  { role: "assistant", content: "AI response" },
  ...
]

savedFiles[conversationId] = [
  { version: 1, filename: "...", url: "...", ... },
  { version: 2, filename: "...", url: "...", ... }
]
```

### Files on Disk
```
/public/designs/
├── conv_1777604932536_1_v1.html  (1.2 KB)
├── conv_1777604932536_1_v2.html  (1.3 KB)
├── conv_abc_v1.jsx               (2.5 KB)
└── conv_xyz_v1.css               (0.8 KB)
```

---

## 🧪 Testing

### Test 1: Health Check ✅
```bash
curl http://localhost:3000/api/health
```

**Result**: Server running, responds with `{"status": "ok"}`

### Test 2: File Reading ✅
```bash
curl "http://localhost:3000/api/files/read?path=SKILL.md"
```

**Result**: Returns SKILL.md content (33 KB)

### Test 3: Chat with Auto-Save ✅
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a welcome page"}'
```

**Result**:
- Conversation created
- File saved to `/public/designs/conv_..._v1.html`
- Response contains file URL
- Dashboard can preview design

---

## 🚀 Usage Guide

### For Users

1. **Open Dashboard**
   ```
   http://localhost:3000/public/dashboard.html
   ```

2. **Send Design Request**
   ```
   "Create an iOS app prototype for a social app"
   ```

3. **AI Will**
   - Read SKILL.md (automatically included)
   - Fetch relevant files (animation-best-practices.md, design-styles.md)
   - Generate HTML design
   - Save as v1

4. **Make Modification**
   ```
   "Add dark mode support"
   ```

5. **AI Will**
   - Read previous conversation history
   - Fetch brand-spec.md
   - Read previous v1.html
   - Modify code
   - Save as v2

6. **View Versions**
   - Click "Versions" tab
   - See all versions with timestamps
   - Download any version
   - Click to preview

---

## 🔐 Security Considerations

### Path Traversal Prevention
```javascript
// ✅ SAFE: Only allow relative paths
if (filePath.includes('..')) {
  return res.status(403).json({ error: 'Access denied' });
}
```

### API Key Protection
- OpenRouter API key in `.env` file
- Never exposed in responses
- Used only server-side

### File System Sandboxing
- All reads relative to project root
- Cannot read files outside repository
- Auto-save only to `/public/designs/`

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Kill existing Node processes
Get-Process node | Stop-Process -Force

# Restart server
npm run start
```

### Issue: SKILL.md Not Found
```bash
# Make sure SKILL.md exists in project root
ls SKILL.md
```

### Issue: Files Not Saving
```bash
# Check /public/designs/ folder exists
ls -la public/designs/

# Check file permissions
chmod 755 public/designs/
```

### Issue: AI Not Reading Files
- Check file path is correct
- Ensure file exists in repository
- Check for typos in path

---

## 📈 Future Enhancements

### Phase 2: Production Database
```javascript
// Replace in-memory storage with SQLite/PostgreSQL
- conversations table
- saved_files table
- version history table
- User accounts & auth
```

### Phase 3: Advanced Features
- Multi-user collaboration
- Real-time co-editing
- File diff visualization
- Design system templates
- Custom code snippets
- Export to Figma

### Phase 4: AI Improvements
- Function calling for direct saves
- Streaming responses
- Model selection UI
- Token counting
- Cost tracking

---

## 📚 Key Concepts

### Conversation ID
- Unique identifier per chat thread
- Stored in localStorage
- Persists across browser refresh
- Format: `conv_{timestamp}_{counter}`

### Version Numbers
- Auto-incrementing v1, v2, v3...
- Per conversation
- File naming: `conv_abc_v1.html`
- Tracks complete progression

### Save Tags
- `【SAVE】...【/SAVE】` marks code to save
- Only tagged code gets saved
- Examples shown inline without tags
- Prevents version history pollution

### Conversation History
- Full message array sent with each request
- AI sees complete context
- Enables intelligent multi-turn design
- System prompt included every request

---

## ✨ Summary

This implementation enables:

1. **Smart AI** - SKILL.md + Tool Use + Full History
2. **File Access** - AI can read any repo file on-demand
3. **Auto-Save** - 【SAVE】 tags trigger automatic versioning
4. **Conversation** - Multi-turn with full context preservation
5. **Dashboard** - User-friendly chat + preview interface
6. **Scaling** - Ready for database migration

**Total Implementation Time**: Complete  
**Status**: Production-ready for local use  
**Next Step**: Deploy to cloud or upgrade storage to database

---

## 📞 Support

For issues or questions:
1. Check server logs: `npm run start`
2. Test endpoints: curl localhost:3000/api/health
3. Check file paths: ls -la public/designs/
4. Review error messages in browser console

