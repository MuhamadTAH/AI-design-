# 🏗️ Huashu-Design Repository: Complete Architecture Analysis

## 📋 Executive Summary

**The Huashu-Design repository is a complete design system that can create:**
- Interactive prototypes (clickable App/Web mockups)
- Motion design videos (MP4, GIF with 60fps interpolation)
- Presentation slides (HTML + editable PPTX)
- Infographics/Data visualizations
- Design direction recommendations
- Professional design reviews

**Currently, the dashboard AI is DISCONNECTED from this system.** It only generates plain HTML from imagination. To unleash full power, we need to **connect the AI to the repository's design engine.**

---

## 🗂️ Repository Structure

```
huashu-design/
├── assets/                    ← Design components & animations
│   ├── animations.jsx        ← Timeline animation engine (Stage + Sprite)
│   ├── ios_frame.jsx         ← iPhone device frame generator
│   ├── browser_window.jsx    ← Browser chrome frame
│   ├── deck_stage.js         ← Slide deck controller
│   └── bgm/                  ← Background music library (6 tracks)
│
├── demos/                     ← 20 reference HTML files
│   ├── c1-ios-prototype.html ← App prototype template
│   ├── c2-slides-pptx.html   ← Presentation slides template
│   ├── c3-motion-design.html ← Animation demo template
│   ├── c4-tweaks.html        ← Real-time variant switching
│   ├── c5-infographic.html   ← Data visualization template
│   └── c6-expert-review.html ← Design rating system (5D radar)
│
├── scripts/                   ← Processing pipeline
│   ├── render-video.js       ← HTML → MP4/GIF converter (uses Playwright)
│   ├── html2pptx.js          ← HTML slides → editable PPTX
│   ├── export_deck_pptx.mjs  ← PowerPoint batch export
│   ├── verify.py             ← Playwright verification tool
│   └── convert-formats.sh    ← Format conversion pipeline
│
├── lib/
│   └── openrouter-client.js  ← AI API wrapper (NEW - we added this)
│
├── public/                    ← Web dashboard (NEW - we added this)
│   └── index.html            ← Chat UI with preview
│
├── server.js                  ← Express server (NEW - we added this)
│
└── examples/
    └── example-chat.js        ← Basic AI integration example
```

---

## 🤖 How the System Currently Works

### Current Pipeline (Disconnected)

```
User Chat → OpenRouter (DeepSeek) → Imagine HTML → Browser Preview
                    ⬆️
                    │
        System Prompt: "You're a designer"
        
Repository Components:
  ├── Animation engine
  ├── Device frames
  ├── MP4 renderer
  ├── PPTX exporter
  └── Brand protocols
                    
        ❌ COMPLETELY UNUSED!
```

### What the Repository CAN Do (But AI Can't Access)

| Capability | Mechanism | Output | Time |
|---|---|---|---|
| **Interactive Prototypes** | React JSX + device frame wrapper | Clickable HTML (verified with Playwright) | 10-15 min |
| **Motion Videos** | Stage component + Sprite timeline | MP4, GIF, 60fps interpolation | 8-12 min |
| **Presentations** | HTML slides + html2pptx.js | HTML deck + editable .PPTX | 15-25 min |
| **Infographics** | CSS Grid + data-driven rendering | PDF, PNG (300dpi), SVG | 10 min |
| **Design Variants** | CSS variables + tweaks UI | Multiple designs side-by-side | 10 min |
| **Design Review** | 5-dimension analysis | Radar chart + action items | 3 min |

---

## 🔧 Key Components Explained

### 1. **Animation Engine** (`assets/animations.jsx`)

**What it does:**
- Provides Timeline-based animation (like Adobe After Effects in code)
- Two core primitives:
  - `Stage`: Container, holds duration & global time
  - `Sprite`: Time slice, shows during `start` to `end` seconds

**Example:**
```jsx
<Stage duration={10}>
  <Sprite start={0} end={3}>
    {/* Appears in first 3 seconds */}
  </Sprite>
  <Sprite start={2} end={5}>
    {/* Appears from 2-5 seconds (overlaps previous) */}
  </Sprite>
</Stage>
```

**API:**
- `useTime()` → Current global time (0-10 seconds)
- `useSprite()` → Local progress {t: 0→1, elapsed, duration}
- `interpolate(t, [in0, in1], [out0, out1], easing?)` → Smooth transitions
- `Easing.*` → 8 easing functions (linear, easeIn, easeOut, spring, etc.)

**Output:** HTML that can be rendered as video

### 2. **Device Frame Generators** (JSX files)

**Available:**
- `ios_frame.jsx` → iPhone 15 Pro (with notch, home indicator, exact bezels)
- `browser_window.jsx` → Desktop browser chrome
- `macos_window.jsx` → macOS window

**How they work:**
- Wrap your HTML content in a frame
- Add realistic shadows, bezel, status bar
- Render as screenshot or video

### 3. **Video Renderer** (`scripts/render-video.js`)

**Pipeline:**
```
HTML file (with animations)
  ↓ (Playwright opens)
Browser renders
  ↓ (Records WebM video)
Playwright extracts WebM
  ↓ (ffmpeg converts)
MP4 (optionally with 60fps interpolation)
  ↓
GIF (with palette optimization)
```

**Usage:**
```bash
node scripts/render-video.js design.html --duration=30 --width=1920 --height=1080
# Output: design.mp4, design.gif
```

**Requirements:**
- Playwright (browser automation)
- ffmpeg (video encoding)
- Animation must set `window.__ready = true` when ready

### 4. **PPTX Exporter** (`scripts/html2pptx.js`)

**What it does:**
- Converts HTML DOM to PowerPoint objects
- Preserves:
  - Text (as editable text boxes)
  - Positioning (x, y, width, height)
  - Colors, fonts, gradients
  - Images

**Process:**
```
HTML Slide
  ↓ (Playwright reads DOM)
Extract positions & styles
  ↓ (Convert to EMUs - PowerPoint units)
Create PowerPoint objects
  ↓ (pptxgen library)
Editable .PPTX file
```

**Result:** Users can double-click text in PowerPoint to edit!

### 5. **Verification Tool** (`scripts/verify.py`)

**What it does:**
- Renders HTML in headless browser
- Takes screenshots at different viewports
- Verifies interactivity with Playwright clicks
- Captures console errors

**Usage:**
```bash
python verify.py design.html --viewports 1440x900,375x667 --output ./screenshots/
# Output: screenshots/design-1440x900.png, design-375x667.png
```

---

## 📊 Design System Architecture

### Core Design Patterns

**1. Junior Designer Workflow**
- Don't hide work in progress
- Show assumptions + placeholders early
- Get feedback → iterate

**2. Brand Asset Protocol** (Strongest)
- If brand mentioned: MUST find logo, product image, UI screenshots
- Color values extracted from actual assets (not memory)
- Fallback: generic design if no brand given

**3. Design Direction Fallback** (When requirements unclear)
- Offer 3 different design styles from 5 design schools (Pentagram, Field.io, Kenya Hara, etc.)
- Generate visual demo for each
- User picks one → full design continues

---

## 🔌 How to Connect AI to Repository

### Current Disconnect

```
┌─────────────────────┐
│   Browser Chat      │
│   (Left panel)      │
└──────────┬──────────┘
           │ User types: "Create animation"
           ↓
┌─────────────────────┐
│   Node.js Server    │
│   (server.js)       │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   DeepSeek AI       │
│   (Cloud)           │
└──────────┬──────────┘
           │ Returns HTML
           ↓
┌─────────────────────┐
│   Preview Panel     │
│   (Right panel)     │
└─────────────────────┘

❌ Repository is never contacted!
```

### Proposed Connection

```
┌─────────────────────┐
│   Browser Chat      │
└──────────┬──────────┘
           │ "Create iOS app"
           ↓
┌─────────────────────┐
│   Node.js Server    │
│   (enhanced)        │
└──────────┬──────────┘
           │
           ├─→ Call DeepSeek for planning
           │
           ├─→ Generate JSX/HTML using templates
           │
           ├─→ Wrap in iOS frame (ios_frame.jsx)
           │
           ├─→ Call render-video.js for MP4
           │   (if animation requested)
           │
           ├─→ Call html2pptx.js for PPTX
           │   (if presentation requested)
           │
           └─→ Return to preview panel
           
✅ Repository fully utilized!
```

---

## 🎯 Connection Strategy (Multi-phase)

### Phase 1: Template System
**Goal:** AI learns to use repo templates

```javascript
// AI receives system prompt like:
"When user says 'iOS app', use template from assets/ios_frame.jsx
When user says 'presentation', use demos/c2-slides-pptx.html
etc."
```

### Phase 2: Template Generation
**Goal:** AI fills templates with content

```javascript
// AI not just imagining HTML, but:
// 1. Picks right template based on request
// 2. Fills in content (screens, slides, scenes)
// 3. Configures animations/interactions
// 4. Returns JSX/HTML to server
```

### Phase 3: Rendering Pipeline
**Goal:** Server processes AI output

```javascript
// Server receives AI-generated JSX/HTML:
// 1. Validates it's valid React/HTML
// 2. Writes to temp file
// 3. Calls render-video.js if MP4 needed
// 4. Calls html2pptx.js if PPTX needed
// 5. Returns URLs to preview
```

### Phase 4: Brand Integration
**Goal:** Real brand assets, not generic

```javascript
// When user mentions brand:
// 1. Search for logo, product images
// 2. Extract color values
// 3. Pass to AI in system prompt
// 4. AI uses real assets in design
```

---

## 🚀 Technical Integration Points

### 1. **System Prompt Modification**
Current: "Generate HTML/CSS"
New: "Use templates + fill with content + call render functions"

### 2. **Server Enhancement**
Add endpoints:
- `POST /api/generate-prototype` → Call render-video for interactivity test
- `POST /api/generate-video` → MP4 export
- `POST /api/generate-pptx` → Slide export
- `POST /api/generate-assets` → Brand asset search

### 3. **AI Output Format**
Change from: `{ description: "", html: "" }`
To: `{ type: "ios-app" | "animation" | "presentation", jsx: "", templateSettings: {...} }`

### 4. **File Generation**
- Create temp directory for AI outputs
- Write JSX/HTML files
- Call scripts/render-video.js or html2pptx.js
- Return file URLs to browser
- Clean up temp files

### 5. **Dependency Management**
Currently available: ✅
- Playwright
- ffmpeg
- pptxgen

Need to verify/add:
- React (for JSX rendering)
- Babel (for JSX transpilation)
- Sharp (for image processing)

---

## 🎨 Use Cases After Connection

### 1. **Animated Product Launch Video**
```
User: "Create a 30-second launch video for my AI app"
↓
AI: "I'll create an animation with timeline, text reveals, color transitions"
↓
Server: Generates HTML + calls render-video.js
↓
Result: MP4 with 60fps interpolation + optional music
```

### 2. **Interactive App Prototype**
```
User: "Design an iOS weather app with 3 screens"
↓
AI: "I'll create screens in ios_frame.jsx with tap interactions"
↓
Server: Wraps in device frame, verifies with Playwright
↓
Result: Clickable prototype in iPhone bezel
```

### 3. **Presentation Deck**
```
User: "Create a product pitch deck, 10 slides"
↓
AI: "I'll design each slide in HTML with layout"
↓
Server: Converts to editable PPTX
↓
Result: PowerPoint file user can edit + present
```

### 4. **Infographic with Data**
```
User: "Create infographic showing AI trends 2024-2026"
↓
AI: "I'll structure data, use CSS Grid for layout"
↓
Server: Generates, exports as PDF + PNG (300dpi)
↓
Result: Print-ready graphics
```

---

## 🔍 Key Files to Understand

| File | Purpose | Lines |
|------|---------|-------|
| `assets/animations.jsx` | Timeline animation engine | ~300 |
| `assets/ios_frame.jsx` | iPhone device wrapper | ~150 |
| `assets/deck_stage.js` | Slide controller | ~200 |
| `scripts/render-video.js` | HTML → MP4/GIF | ~300 |
| `scripts/html2pptx.js` | HTML → PPTX | ~250 |
| `scripts/verify.py` | Screenshot & verify | ~150 |
| `demos/c1-ios-prototype.html` | App template | ~500 |
| `demos/c3-motion-design.html` | Animation template | ~600 |

---

## 🔐 Constraints & Requirements

### Playwright/Chromium
- Used by render-video.js and verify.py
- Needs fresh install: `npm install -g playwright && playwright install chromium`

### ffmpeg
- Required for video export
- Must be on system PATH
- Check: `ffmpeg -version`

### File System Access
- Server needs to write temp files
- Clean up after processing (avoid disk bloat)

### Resource Limits
- Video rendering takes 30-60 seconds per output
- MP4 generation CPU-intensive
- Should implement queuing for multiple requests

### Security
- Validate AI-generated JSX/HTML before rendering (XSS risk)
- Sandbox render operations
- Don't execute untrusted JavaScript directly

---

## 📈 Integration Complexity Estimate

| Phase | Complexity | Time |
|-------|-----------|------|
| Phase 1: Template System | Low | 2-3 hours |
| Phase 2: Template Generation | Medium | 4-6 hours |
| Phase 3: Rendering Pipeline | Medium | 6-8 hours |
| Phase 4: Brand Integration | High | 8-12 hours |
| Testing & Refinement | Medium | 4-6 hours |
| **Total** | **Medium-High** | **24-35 hours** |

---

## ✅ Benefits After Connection

### For Users
- ✨ AI-powered professional designs
- 🎬 Video export from chat
- 📊 Interactive prototypes
- 📈 Design variations on demand
- ⚡ 70-98% faster than hiring designers
- 💰 $0.05-0.15 cost per design

### For AI
- 🧠 Access to real design capabilities
- 🎨 Templates + components (not blank canvas)
- 📦 Brand asset protocol (real assets, not generic)
- 🎯 Output validation via Playwright
- 🚀 Video/PPTX export (not just HTML)

---

## 🎓 Next Steps for Implementation

1. ✅ **Understanding** - Read this doc + examine key files
2. ⏳ **Planning** - Design API contracts & data flows
3. ⏳ **Phase 1** - Integrate template system
4. ⏳ **Phase 2** - Connect AI output to templates
5. ⏳ **Phase 3** - Add rendering pipeline
6. ⏳ **Phase 4** - Add brand protocol
7. ⏳ **Testing** - Verify all outputs work

---

## 🎯 Bottom Line

**The Repository provides:**
- Complete design system (components, templates, engines)
- Professional output formats (MP4, PPTX, PDF, SVG)
- Brand asset integration
- Quality assurance (Playwright verification)

**The AI provides:**
- Creative ideation
- Content generation
- Design direction
- Decision making

**When connected:** 
🤝 AI creative + Repository capability = **Professional designs in minutes**

---

This analysis is complete. **No code changes needed yet** - just understanding the architecture for the connection strategy.
