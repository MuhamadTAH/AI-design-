const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { chat } = require('./lib/openrouter-client');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// DASHBOARD ROUTE
// ============================================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ============================================================================
// SYSTEM PROMPT: SKILL.md + Tool Use Instructions + Save Tag Rules
// ============================================================================

// Read SKILL.md but use a compact version to save tokens
const SKILL_MD_COMPACT = `You are Huashu-Design, an HTML/CSS/JavaScript designer AI.

YOUR CORE IDENTITY:
- Expert in high-fidelity HTML prototypes, interactive demos, animations, and design systems
- Think like a designer, not a programmer
- Deliver polished, production-ready code
- Always verify facts against existing context

YOUR WORKFLOW:
1. Understand the user's request
2. Check if you need reference files (animation guidelines, brand specs, etc.)
3. Call read_reference() if needed
4. Generate HTML/CSS/JavaScript (clean, modern, no bloat)
5. Wrap final code in 【SAVE】 tags for auto-saving
6. Examples shown inline (no tags) - they're not saved

DESIGN PRINCIPLES:
- Modern, minimalist aesthetic
- Accessibility first (semantic HTML, ARIA labels)
- Mobile responsive (flexbox, grid)
- Performance optimized (no unnecessary scripts)
- Smooth animations (60fps, GPU accelerated)

WHEN TO USE 【SAVE】 TAGS:
【SAVE】
<!DOCTYPE html>
<html>
...final code...
</html>
【/SAVE】

EXAMPLES (shown without tags, not saved):
<!-- Just showing, not saving -->
<div>example</div>

BE CONCISE AND CLEAR IN RESPONSES.`;


const TOOL_USE_INSTRUCTIONS = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ TOOL USE PROTOCOL (Critical for multi-turn conversations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have the ability to call functions to fetch repository files on-demand:

function read_reference(filename: string)
  Purpose: Read ANY file from the repository
  Example: read_reference("references/animation-best-practices.md")
           read_reference("designs/conv_123_v1.html")
           read_reference("SKILL.md")

HOW TOOL CALLING WORKS:

1️⃣ You say:
   "I need to read references/animation-best-practices.md to understand animation rules"

2️⃣ System processes your request:
   Fetches file from disk and returns result with role: "tool"

3️⃣ You see response as:
   {
     "role": "tool",
     "content": "[Complete file content]",
     "tool_call_id": "..."
   }

4️⃣ YOU UNDERSTAND IT AS:
   - role: "tool" = This is the answer to my request
   - content = The file I asked for
   - Not a conversation, but DATA I requested
   - I should NOW use this data to continue my task

5️⃣ NEXT STEP:
   - If you need more files, keep calling
   - If you have enough info, generate design
   - DON'T re-ask for same file twice

⚠️ KEY DIFFERENCES:

❌ WRONG: After getting a tool response, ask "Can you give me this file?"
✅ RIGHT: Recognize "role: tool" as your answer, then USE it

EXAMPLE WORKFLOW:

You: "I need animation rules to design this correctly"
System: [returns tool result with animation guidelines]
You: "Good! I have those. Now let me also check brand specifications"
System: [returns tool result with brand specs]
You: "Perfect. Now I have everything. Here's my design:"
[HTML/CSS code]

CRITICAL RULE: This is NOT you "looking at history" — you're USING history
to make intelligent decisions about what files to fetch and how to design.
`;

const SAVE_TAG_RULES = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 CODE SAVING PROTOCOL (【SAVE】 Tags)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When you create code (HTML, CSS, JavaScript, React, etc.):

1️⃣ FOR FINAL, DELIVERABLE CODE:
   Wrap ONLY in 【SAVE】 tags:
   
   【SAVE】
   \`\`\`html
   <!DOCTYPE html>
   <html>
   ... your final code ...
   </html>
   \`\`\`
   【/SAVE】

2️⃣ FOR EXAMPLES OR REFERENCE CODE:
   DO NOT use any tags - show them inline naturally:
   
   "Here's a bad example of what NOT to do:
   \`\`\`html
   <div style="all: bad;">Wrong</div>
   \`\`\`"

3️⃣ ONLY【SAVE】 TAGGED CODE GETS:
   ✅ Saved to /public/designs/ directory
   ✅ Tracked in version history (v1, v2, v3...)
   ✅ Stored for user to access/download
   
4️⃣ EXAMPLES (without tags) ARE:
   ✅ Shown to user for reference
   ❌ NOT saved to files
   ❌ NOT added to version history
   ❌ NOT polluting the design progression

5️⃣ YOU CAN HAVE MULTIPLE【SAVE】 BLOCKS:
   【SAVE】
   \`\`\`html
   [page.html content]
   \`\`\`
   【/SAVE】
   
   Then explain something...
   
   【SAVE】
   \`\`\`css
   [styles.css content]
   \`\`\`
   【/SAVE】

CRITICAL: Be explicit about your intention:
✅ Mark final work with 【SAVE】
✅ Don't accidentally save examples
✅ Users depend on this distinction
`;

const COMPLETE_SYSTEM_PROMPT = `${SKILL_MD_COMPACT}

${TOOL_USE_INSTRUCTIONS}

${SAVE_TAG_RULES}`;

// ============================================================================
// IN-MEMORY STORAGE (for demo; upgrade to DB for production)
// ============================================================================

const conversations = {};      // conversationId -> message array
const savedFiles = {};         // conversationId -> file list
let conversationCounter = 0;

function generateConversationId() {
  conversationCounter++;
  return `conv_${Date.now()}_${conversationCounter}`;
}

function getVersionNumber(conversationId) {
  return (savedFiles[conversationId]?.length || 0) + 1;
}

function detectLanguage(content) {
  if (content.includes('<!DOCTYPE') || content.includes('<html')) return 'html';
  if (content.includes('import React') || content.includes('function ')) return 'jsx';
  if (content.includes('const ') && content.includes('{')) return 'js';
  if (content.includes('::') || content.includes('@media')) return 'css';
  return 'txt';
}

function parseSaveTags(content) {
  const saveBlocks = [];
  const saveRegex = /【SAVE】\n([\s\S]*?)\n【\/SAVE】/g;
  
  let match;
  while ((match = saveRegex.exec(content)) !== null) {
    const code = match[1];
    saveBlocks.push({
      code: code,
      language: detectLanguage(code)
    });
  }
  
  // Remove save tags for display
  const cleanContent = content.replace(saveRegex, '').trim();
  
  return {
    blocks: saveBlocks,
    displayText: cleanContent
  };
}

// ============================================================================
// ENDPOINTS
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// FILE READING ENDPOINT (for AI tool calling)
// ============================================================================
app.get('/api/files/read', (req, res) => {
  try {
    const { path: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({ error: 'path parameter required' });
    }
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Read from repo root
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: `File not found: ${filePath}` });
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    res.json({
      success: true,
      path: filePath,
      content: content,
      size: content.length
    });
  } catch (error) {
    console.error('File read error:', error);
    res.status(500).json({
      error: 'Failed to read file',
      message: error.message
    });
  }
});

// ============================================================================
// MAIN CHAT ENDPOINT (with conversation history + file reading + auto-save)
// ============================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId: providedConvId } = req.body;

    console.log('\n🔵 [/api/chat] Request received');
    console.log('   Message:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    console.log('   ConversationId:', providedConvId || 'NEW');

    if (!message || message.trim() === '') {
      console.log('⚠️ [/api/chat] Message validation failed');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation
    let conversationId = providedConvId;
    if (!conversationId) {
      conversationId = generateConversationId();
      console.log('   Created new conversation:', conversationId);
      conversations[conversationId] = [];
      savedFiles[conversationId] = [];
    }

    // Initialize conversation if first message
    if (!conversations[conversationId]) {
      console.log('   Initializing conversation storage');
      conversations[conversationId] = [];
      savedFiles[conversationId] = [];
    }

    // Add user message to history
    conversations[conversationId].push({
      role: 'user',
      content: message
    });
    console.log('   History length:', conversations[conversationId].length);

    // Build message array with system prompt + limited history
    // Keep only last 4 messages to avoid token limits
    const historyToSend = conversations[conversationId].slice(-4);
    
    const messages = [
      {
        role: 'system',
        content: COMPLETE_SYSTEM_PROMPT
      },
      ...historyToSend
    ];

    console.log('   Total history messages:', conversations[conversationId].length);
    console.log('   Messages to send:', messages.length, `(last 4 of ${conversations[conversationId].length})`);

    // Call DeepSeek via OpenRouter
    console.log(`🌐 [${conversationId}] Sending to OpenRouter...`);
    const response = await chat({ messages });

    console.log(`✅ [${conversationId}] Received response (${response?.length || 0} chars)`);
    console.log(`   Response preview: ${(response || '').substring(0, 100)}...`);

    // Parse for 【SAVE】 tags
    const parsed = parseSaveTags(response);
    console.log(`   Found ${parsed.blocks.length} code blocks to save`);
    console.log(`   Display text length: ${parsed.displayText?.length || 0} chars`);
    
    const savedFilesList = [];

    // Auto-save any marked code blocks
    for (const block of parsed.blocks) {
      const version = getVersionNumber(conversationId);
      const ext = block.language;
      const fileName = `${conversationId}_v${version}.${ext}`;
      const designsPath = path.join(__dirname, 'public', 'designs');
      
      // Create designs directory if it doesn't exist
      if (!fs.existsSync(designsPath)) {
        fs.mkdirSync(designsPath, { recursive: true });
      }
      
      const filePath = path.join(designsPath, fileName);
      
      // Write file
      fs.writeFileSync(filePath, block.code, 'utf-8');
      console.log(`   💾 Saved: ${fileName} (${block.code.length} bytes)`);
      
      // Track saved file
      const fileRecord = {
        version: version,
        filename: fileName,
        url: `/designs/${fileName}`,
        type: ext,
        timestamp: new Date().toISOString(),
        size: block.code.length
      };
      
      savedFiles[conversationId].push(fileRecord);
      savedFilesList.push(fileRecord);
    }

    // Add AI response to history
    conversations[conversationId].push({
      role: 'assistant',
      content: response,
      savedFiles: savedFilesList
    });

    // Return response
    console.log(`📤 [${conversationId}] Sending response to client`);
    res.json({
      success: true,
      conversationId: conversationId,
      response: parsed.displayText,  // Clean text without 【SAVE】 tags
      savedFiles: savedFilesList,
      designCount: savedFiles[conversationId].length,
      messageCount: conversations[conversationId].length,
      isFirstMessage: conversations[conversationId].length === 2  // system + user message
    });
    console.log(`✨ [${conversationId}] Response sent successfully\n`);

  } catch (error) {
    console.error('❌ Chat error:', error);
    console.error('   Stack:', error.stack);
    res.status(500).json({
      error: 'Failed to generate design',
      message: error.message
    });
  }
});

// ============================================================================
// VERSION HISTORY ENDPOINT
// ============================================================================
app.get('/api/versions/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    
    if (!savedFiles[conversationId]) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({
      success: true,
      conversationId: conversationId,
      versions: savedFiles[conversationId],
      totalVersions: savedFiles[conversationId].length
    });
  } catch (error) {
    console.error('Version history error:', error);
    res.status(500).json({ error: 'Failed to get version history' });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ============================================================================
// START SERVER WITH AUTO PORT FINDING
// ============================================================================
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n✨ Chat Dashboard Server Running`);
    console.log(`📍 http://localhost:${port}`);
    console.log(`\n🎯 Features enabled:`);
    console.log(`   ✅ SKILL.md system prompt (Huashu-Design)`);
    console.log(`   ✅ File reading API (/api/files/read)`);
    console.log(`   ✅ Conversation history tracking`);
    console.log(`   ✅ Auto-save with 【SAVE】 tags`);
    console.log(`   ✅ Version management (v1, v2, v3...)`);
    console.log(`\nOpen your browser: http://localhost:${port}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}...\n`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
