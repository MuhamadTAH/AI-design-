# 🔌 AI-to-Repository Connection Plan

## Current State vs. Connected State

### ❌ CURRENT (Disconnected)

```
┌──────────────────────────────────────────────────────────────────┐
│                    CHAT DASHBOARD                                │
├────────────────────────────────┬─────────────────────────────────┤
│   LEFT: Chat Interface          │  RIGHT: Preview (HTML only)     │
│                                 │                                 │
│  You: "Create animation"        │  [Shows plain HTML preview]     │
│  ↓                              │                                 │
│  AI imagines HTML code          │  No video export                │
│  ↓                              │  No device frames               │
│  Shows HTML blob                │  No PPTX support                │
│                                 │  No quality assurance           │
└────────────────────────────────┴─────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│         HUASHU-DESIGN REPO (Unused in background)                │
├──────────────────────────────────────────────────────────────────┤
│  • Animation engine (Stage + Sprite)                              │
│  • Device frames (iOS, Mac, Browser)                              │
│  • Video renderer (MP4/GIF)                                       │
│  • PPTX exporter                                                  │
│  • Brand asset protocol                                           │
│  • Playwright verification                                        │
│                                                                   │
│  STATUS: ❌ DISCONNECTED - Not used                              │
└──────────────────────────────────────────────────────────────────┘
```

---

### ✅ CONNECTED (Proposed)

```
┌──────────────────────────────────────────────────────────────────┐
│                    CHAT DASHBOARD                                │
├────────────────────────────────┬─────────────────────────────────┤
│   LEFT: Chat Interface          │  RIGHT: Live Preview            │
│                                 │                                 │
│  You: "Create iOS app animation"│  [Loading...]                   │
│  ↓                              │                                 │
│  ┌─ AI LAYER ─────────────┐     │  [Progress: Generating...]      │
│  │                        │     │                                 │
│  │ Thinks:                │     │  ↓ (AI done - rendering)       │
│  │ "This needs:           │     │                                 │
│  │  - iOS device frame    │     │  [MP4 Preview loading...]       │
│  │  - Timeline animation  │     │                                 │
│  │  - 3 screens + taps"   │     │  [30 seconds of animation]      │
│  │                        │     │                                 │
│  │ Outputs:               │     │  ✓ Ready to download!          │
│  │ - JSX code             │     │                                 │
│  │ - Animation config     │     │  [Download MP4] [Download GIF] │
│  │ - Device wrapper       │     │                                 │
│  └────────┬──────────────┘     │                                 │
│           │                      │                                 │
│           ↓                      │                                 │
│  ┌─ TEMPLATE LAYER ────────┐    │                                 │
│  │                         │    │                                 │
│  │ Pick template:          │    │                                 │
│  │ c1-ios-prototype.html   │    │                                 │
│  │                         │    │                                 │
│  │ Fill with AI content    │    │                                 │
│  │ + animations            │    │                                 │
│  └────────┬────────────────┘    │                                 │
│           │                      │                                 │
│           ↓                      │                                 │
│  ┌─ PROCESSING LAYER ────────┐  │                                 │
│  │                           │  │                                 │
│  │ 1. Validate JSX           │  │                                 │
│  │ 2. Wrap in ios_frame.jsx  │  │                                 │
│  │ 3. Call render-video.js   │  │                                 │
│  │ 4. Generate MP4 + GIF     │  │                                 │
│  │ 5. Return URLs            │  │                                 │
│  └────────┬────────────────┘   │                                 │
│           │                      │                                 │
│           ↓                      │                                 │
│  ✅ Complete MP4 file           │                                 │
│     Ready for download          │                                 │
│                                 │                                 │
└────────────────────────────────┴─────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│         HUASHU-DESIGN REPO (Active)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ Animation engine (Stage + Sprite)                            │
│      ↑ AI uses for timeline control                              │
│                                                                   │
│  ✅ Device frames (iOS, Mac, Browser)                            │
│      ↑ Server wraps AI output in device frame                    │
│                                                                   │
│  ✅ Video renderer (MP4/GIF)                                     │
│      ↑ Server calls render-video.js with AI output               │
│                                                                   │
│  ✅ PPTX exporter                                                │
│      ↑ Server calls html2pptx.js for presentations               │
│                                                                   │
│  ✅ Brand asset protocol                                         │
│      ↑ AI passes brand info to system prompt                     │
│                                                                   │
│  ✅ Playwright verification                                      │
│      ↑ Server verifies interactivity before showing              │
│                                                                   │
│  STATUS: ✅ FULLY CONNECTED                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Comparison

### CURRENT (HTML Only)

```
User Input
    ↓
┌─ Server ──────────────┐
│ OpenRouter API call   │
│ Response: "html": "..."│
└──────────┬────────────┘
           ↓
Browser iframe renders HTML
           ↓
Preview appears (static)
```

---

### CONNECTED (Full Pipeline)

```
User Input: "Create iOS app with animation"
    ↓
┌─ Server ───────────────────────────┐
│ 1. Send to DeepSeek with system    │
│    prompt: "Use iOS template"      │
│ 2. Receive JSX code                │
│ 3. Write to temp file              │
│ 4. Call render-video.js            │
│ 5. Get MP4 back                    │
└──────────┬──────────────────────────┘
           ↓
┌─ Processing ───────────────────────┐
│ render-video.js:                   │
│  • Opens HTML in Playwright        │
│  • Records WebM video              │
│  • Converts to MP4 (ffmpeg)        │
│  • Optional: 60fps interpolation   │
│  • Optional: add BGM               │
└──────────┬──────────────────────────┘
           ↓
Browser receives MP4 URL
           ↓
Preview shows video player
           ↓
User can download MP4/GIF/etc.
```

---

## Implementation Layers

```
Layer 5: OUTPUT FORMATS
┌─────────────────────────────┐
│ MP4 | GIF | PPTX | PDF | SVG│
└────────────┬────────────────┘

Layer 4: RENDERING PIPELINE
┌──────────────────────────────────┐
│ render-video.js                   │
│ html2pptx.js                      │
│ export_deck_pdf.mjs               │
│ verify.py (Playwright)            │
└────────────┬─────────────────────┘

Layer 3: TEMPLATE SYSTEM
┌──────────────────────────────────┐
│ demos/c*.html (templates)         │
│ assets/*.jsx (components)         │
│ Brand asset protocol              │
└────────────┬─────────────────────┘

Layer 2: AI CONTENT GENERATION
┌──────────────────────────────────┐
│ DeepSeek generates JSX/HTML       │
│ Fills templates with content      │
│ Configures animations             │
└────────────┬─────────────────────┘

Layer 1: USER INTERFACE
┌──────────────────────────────────┐
│ Browser chat + preview            │
│ server.js (Express)               │
│ openrouter-client.js              │
└──────────────────────────────────┘
```

---

## Integration Points (Red = New, Green = Existing)

```
┌─ Browser ────────────┐
│  index.html ✅       │
│  Chat UI ✅          │
│  Preview ✅          │
└──────┬───────────────┘
       │
       ↓
┌─ server.js ────────────────────┐
│  Express app ✅                │
│                                │
│  POST /api/chat ✅             │
│    → openrouter-client.js ✅   │
│    → Returns HTML ✅           │
│                                │
│  POST /api/chat-video 🔴       │
│    → openrouter-client.js ✅   │
│    → Receives JSX 🔴           │
│    → Write to temp file 🔴     │
│    → Call render-video.js 🟢   │
│    → Return MP4 URL 🔴        │
│                                │
│  POST /api/chat-pptx 🔴        │
│    → Call html2pptx.js 🟢      │
│    → Return PPTX URL 🔴        │
└─────────────────────────────────┘
       │
       ↓
┌─ assets/ 🟢 ────────────────────┐
│  animations.jsx                 │
│  ios_frame.jsx                  │
│  browser_window.jsx             │
│  deck_stage.js                  │
│  BGM library                    │
└─────────────────────────────────┘
       │
       ↓
┌─ scripts/ 🟢 ────────────────────┐
│  render-video.js                │
│    └─→ Playwright               │
│    └─→ ffmpeg                   │
│                                │
│  html2pptx.js                   │
│    └─→ pptxgen                  │
│                                │
│  verify.py                      │
│    └─→ Playwright               │
└─────────────────────────────────┘

Legend:
✅ = Already implemented
🟢 = Repository feature (not yet connected)
🔴 = Needs to be built for connection
```

---

## System Prompt Evolution

### CURRENT

```javascript
"You are an expert UI/UX designer. Your task is to:
1. Understand the user's design request
2. Generate BEAUTIFUL, FUNCTIONAL HTML/CSS
3. Include inline CSS (no external stylesheets)
4. Respond in JSON: { description, html }"
```

---

### CONNECTED (Proposed)

```javascript
"You are an expert UI/UX designer & motion designer. 
Your task is to:

1. ANALYZE the user's request:
   - Is it an APP? (→ use c1-ios-prototype template)
   - Is it a PRESENTATION? (→ use c2-slides-pptx template)
   - Is it an ANIMATION? (→ use c3-motion-design template)
   - Is it DATA VIZ? (→ use c5-infographic template)

2. FILL the template with content:
   - Write JSX components for React
   - Configure Stage + Sprite for animations
   - Set easing functions & timings
   - Structure for device frame wrapping

3. CONFIGURE outputs:
   - MP4 video? (set duration, fps, bgm)
   - PPTX presentation? (set slide count)
   - PDF/PNG? (set resolution)

4. RETURN response in format:
   {
     type: 'ios-app' | 'animation' | 'presentation' | 'infographic',
     jsx: '<React JSX code>',
     html: '<fallback HTML>',
     config: { duration, format, bgm, ... },
     description: 'What was created'
   }

5. USE BRAND ASSETS when available:
   - Pass received brand info to templates
   - Use real logos, not generic icons
   - Use exact color values from brand spec"
```

---

## Benefits of Connection

### For the User

| Before | After |
|--------|-------|
| Static HTML previews | MP4 videos with animations |
| Basic design mockups | Interactive clickable prototypes |
| Chat output only | Downloadable PPTX presentations |
| No device framing | Realistic iPhone/Mac previews |
| Manual export | One-click MP4/GIF/PDF export |
| Generic designs | Brand-aware designs with real assets |
| No verification | Playwright-verified interactivity |

### For the AI

| Before | After |
|--------|-------|
| Blank canvas (imagine from nothing) | Rich templates to work with |
| Generate random HTML | Structured JSX in components |
| Limited capabilities | Access to animation engine, video renderer, PPTX exporter |
| One format (HTML) | Multiple formats (MP4, PPTX, PDF, SVG) |
| No asset integration | Brand protocol for real assets |

---

## Example Journey: Before vs. After

### ❌ BEFORE

```
User: "Create a 10-second product animation"

AI thinks: 
  "Hmm, animations... I guess I'll create an HTML div
   with CSS animations and jQuery?"

Output: 
  <div style="animation: fade 2s;"></div>

User: 
  "This is... just a fading box. I need an MP4 file
   I can download and use in my video editor."

Result: ❌ Fail - Wrong format, wrong content
```

---

### ✅ AFTER

```
User: "Create a 10-second product animation"

AI thinks:
  "Animation request! I'll use c3-motion-design.html template
   with Stage + Sprite components. I'll:
   - Set duration to 10 seconds
   - Create 3 scenes with different easing
   - Add background music track
   - Configure MP4 export to 60fps"

Output:
  {
    type: 'animation',
    jsx: '<Stage duration={10}>...',
    config: { format: 'mp4', fps: 60, bgm: 'tech' },
    description: 'Product reveal animation with text transitions'
  }

Server processes:
  1. Writes JSX to temp file
  2. Calls render-video.js
  3. Generates MP4 at 1920x1080 @ 60fps
  4. Adds background music
  5. Returns download URL

User:
  "Perfect! Downloaded the MP4, editing it into my video now!"

Result: ✅ Success - Right format, professional quality
```

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI generates invalid JSX | Rendering fails | Validate JSX syntax before processing |
| Video rendering is slow | User waits long | Implement job queuing + background tasks |
| ffmpeg not installed | No MP4 export | Auto-check & guide user to install |
| Disk fills with temp files | Server crashes | Auto-cleanup + size limits |
| PPTX conversion fails | Export fails | Fallback to PDF or HTML alternative |
| Brand assets not found | Generic design | Fallback to internal defaults |
| XSS in generated JSX | Security issue | Sandbox render + content security policy |

---

## Success Criteria

After connection, these should work:

✅ User says "Create iOS app" → Get clickable prototype
✅ User says "Make animation" → Get MP4 file
✅ User says "Build deck" → Get PPTX (editable)
✅ User says "Design infographic" → Get PDF (print-ready)
✅ All outputs show in preview first
✅ All outputs downloadable
✅ AI picks right template automatically
✅ Brand assets used when available
✅ Video renders within 60 seconds
✅ Playwright verifies interactivity

---

## Next Document to Read

Once you understand this architecture, read: `CONNECTION_IMPLEMENTATION_ROADMAP.md` (not yet created - will guide actual implementation)
