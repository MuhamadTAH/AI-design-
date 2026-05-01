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
const SKILL_MD_COMPACT = `🚨 CRITICAL RULE: YOU MUST WRAP ALL CODE IN 【SAVE】 TAGS OR IT WON'T BE SAVED!

You are Huashu-Design, an HTML/CSS/JavaScript designer AI.

🎯 CRITICAL: ALWAYS GENERATE COMPLETE HTML FILES, NOT SNIPPETS

YOUR CORE IDENTITY:
- Expert in high-fidelity HTML prototypes, interactive demos, animations, and design systems
- Deliver polished, production-ready code
- EVERY design must be a COMPLETE HTML file with <!DOCTYPE html>
- EVERY design MUST include tweaks panel

MOST IMPORTANT: Use 【SAVE】 and 【/SAVE】 tags around EVERY HTML file you generate!

COMPLETE HTML STRUCTURE (MANDATORY):
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Design</title>
  <style>
    /* Your CSS here */
  </style>
</head>
<body>
  <!-- Your HTML content here -->
  <script>
    // Your JavaScript here
  </script>
</body>
</html>

YOUR WORKFLOW:
1. User requests design
2. Create COMPLETE standalone HTML file (not snippets)
3. Include tweaks panel in <body> before </body>
4. Use CSS variables: --primary, --font-size, --dark
5. Wrap in 【SAVE】 tags

TWEAKS PANEL (AUTOMATIC INJECTION):
The system will auto-inject tweaks if you generate complete HTML.
If tweaks don't appear, it means your code wasn't complete HTML.

EXAMPLES OF CORRECT DESIGNS:

EXAMPLE 1 - Button Component:
【SAVE】
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Button</title>
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    button { padding: 12px 24px; background: var(--primary, #D97757); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
    button:hover { opacity: 0.8; }
  </style>
</head>
<body>
  <button>Click Me</button>
</body>
</html>
【/SAVE】

EXAMPLE 2 - Card Component:
【SAVE】
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Card</title>
  <style>
    body { background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: system-ui; }
    .card { background: white; border-radius: 12px; padding: 24px; max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    h2 { color: var(--primary, #D97757); margin: 0 0 12px 0; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Card Title</h2>
    <p>This is a card component with customizable colors.</p>
  </div>
</body>
</html>
【/SAVE】

DESIGN PRINCIPLES:
- Modern, minimalist aesthetic
- Mobile responsive (flexbox, grid)
- Use CSS variables for colors: var(--primary, #D97757)
- Performance optimized
- Smooth animations (60fps)

WHEN TO USE 【SAVE】 TAGS:
【SAVE】
<!DOCTYPE html>
<html>
...complete, standalone HTML file...
</html>
【/SAVE】

NEVER OUTPUT:
- CSS-only snippets (must be in HTML <style> tags)
- JavaScript-only snippets (must be in HTML <script> tags)
- Partial HTML (must have <!DOCTYPE html> and complete structure)
- Markdown code blocks (generate actual HTML files)

EVERY DESIGN IS A COMPLETE HTML FILE OR IT'S NOT A DESIGN.`;


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

// Inject tweaks panel into HTML if not already present
function injectTweaksPanel(html) {
  // Skip if tweaks already included
  if (html.includes('tweaksPanel')) {
    console.log('   ℹ️  Tweaks already present, skipping injection');
    return html;
  }
  
  // Check if has </body>
  if (!html.includes('</body>')) {
    console.log('   ⚠️  No </body> tag found, cannot inject tweaks');
    return html;
  }
  
  console.log('   🔧 Injecting tweaks panel into HTML...');
  
  const tweaksCode = `
<script>
const TWEAKS = {
  primaryColor: '#D97757',
  fontSize: 16,
  darkMode: false
};

const stored = localStorage.getItem('design-tweaks');
const tweaks = stored ? {...TWEAKS, ...JSON.parse(stored)} : TWEAKS;

const root = document.documentElement;
root.style.setProperty('--primary', tweaks.primaryColor);
root.style.setProperty('--font-size', tweaks.fontSize + 'px');
document.body.style.background = tweaks.darkMode ? '#0A0A0A' : '#FAFAFA';
document.body.style.color = tweaks.darkMode ? '#FAFAFA' : '#1A1A1A';

function updateTweak(key, value) {
  tweaks[key] = value;
  localStorage.setItem('design-tweaks', JSON.stringify(tweaks));
  if (key === 'primaryColor') root.style.setProperty('--primary', value);
  if (key === 'fontSize') root.style.setProperty('--font-size', value + 'px');
  if (key === 'darkMode') {
    document.body.style.background = value ? '#0A0A0A' : '#FAFAFA';
    document.body.style.color = value ? '#FAFAFA' : '#1A1A1A';
  }
}
</script>

<!-- Tweaks Panel -->
<div id="tweaksContainer" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: system-ui;">
  <button id="tweaksToggle" style="background: #1A1A1A; color: white; border: none; border-radius: 50%; padding: 12px 16px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">⚙ Tweaks</button>
  <div id="tweaksPanel" style="display: none; background: white; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); width: 280px; position: absolute; bottom: 60px; right: 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <strong style="font-size: 14px;">Tweaks</strong>
      <button id="closeBtn" style="border: none; background: none; cursor: pointer; font-size: 16px; padding: 0; width: 20px; height: 20px;">×</button>
    </div>
    <label style="display: block; margin-bottom: 12px;">
      <div style="margin-bottom: 4px; color: #666; font-size: 12px;">Primary Color</div>
      <input type="color" id="colorInput" value="#D97757" style="width: 100%; height: 32px; border: 1px solid #e5e5e5; border-radius: 6px; cursor: pointer;" />
    </label>
    <label style="display: block; margin-bottom: 12px;">
      <div style="margin-bottom: 4px; color: #666; font-size: 12px;">Font Size (<span id="sizeDisplay">16</span>px)</div>
      <input type="range" id="sizeInput" min="12" max="24" step="1" value="16" style="width: 100%; cursor: pointer;" />
    </label>
    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
      <input type="checkbox" id="darkInput" style="cursor: pointer;" />
      <span style="font-size: 13px;">Dark Mode</span>
    </label>
    <button id="resetBtn" style="width: 100%; padding: 8px 12px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">Reset</button>
  </div>
</div>

<script>
document.getElementById('tweaksToggle').onclick = () => {
  document.getElementById('tweaksPanel').style.display = 'block';
};
document.getElementById('closeBtn').onclick = () => {
  document.getElementById('tweaksPanel').style.display = 'none';
};
document.getElementById('colorInput').onchange = (e) => updateTweak('primaryColor', e.target.value);
document.getElementById('sizeInput').oninput = (e) => {
  updateTweak('fontSize', +e.target.value);
  document.getElementById('sizeDisplay').textContent = e.target.value;
};
document.getElementById('darkInput').onchange = (e) => updateTweak('darkMode', e.target.checked);
document.getElementById('resetBtn').onclick = () => {
  localStorage.removeItem('design-tweaks');
  location.reload();
};
</script>
`;

  // Inject before </body>
  const modified = html.replace('</body>', tweaksCode + '\n</body>');
  console.log('   ✅ Tweaks injected successfully');
  return modified;
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

    // Call DeepSeek via OpenRouter (very conservative to preserve low credits)
    console.log(`🌐 [${conversationId}] Sending to OpenRouter...`);
    const response = await chat({ messages, max_tokens: 250 });

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
      
      // Inject tweaks panel into HTML files
      let fileContent = block.code;
      if (ext === 'html') {
        fileContent = injectTweaksPanel(fileContent);
      }
      
      // Write file
      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log(`   💾 Saved: ${fileName} (${fileContent.length} bytes)`);
      
      // Track saved file
      const fileRecord = {
        version: version,
        filename: fileName,
        url: `/designs/${fileName}`,
        type: ext,
        timestamp: new Date().toISOString(),
        size: fileContent.length
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
    console.error('❌ Chat error (FULL DETAILS):');
    console.error('   Message:', error.message);
    console.error('   Type:', error.constructor.name);
    console.error('   Stack:', error.stack);
    console.error('   Full error:', JSON.stringify(error, null, 2));
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
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
