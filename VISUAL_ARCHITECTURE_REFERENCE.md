# 📊 Quick Visual Reference: Repository Architecture

## The Repository at a Glance

### What Each Part Does

```
┌─────────────────────────────────────────────────────────────────┐
│                    HUASHU-DESIGN SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

INPUT (What you give)
    ↓
    ├─ "Create iOS app"
    ├─ "Make animation"
    ├─ "Build presentation"
    ├─ "Design infographic"
    └─ "Review this design"

    ↓

PROCESSING (What repository does)

    ┌─────────────────────────────────┐
    │ TEMPLATE LAYER                  │
    ├─────────────────────────────────┤
    │ Templates (20 HTML files):      │
    │ • c1-ios-prototype.html         │
    │ • c2-slides-pptx.html           │
    │ • c3-motion-design.html         │
    │ • c4-tweaks.html                │
    │ • c5-infographic.html           │
    │ • c6-expert-review.html         │
    └─────────────┬───────────────────┘
                  │
    ┌─────────────▼───────────────────┐
    │ COMPONENT LAYER                 │
    ├─────────────────────────────────┤
    │ Reusable parts (JSX):           │
    │ • animations.jsx (Stage/Sprite) │
    │ • ios_frame.jsx (device frame)  │
    │ • browser_window.jsx            │
    │ • deck_stage.js (slide control) │
    │ • bgm library (6 music tracks)  │
    └─────────────┬───────────────────┘
                  │
    ┌─────────────▼───────────────────┐
    │ RENDERING LAYER                 │
    ├─────────────────────────────────┤
    │ Output processors:              │
    │ • render-video.js               │
    │   └─ Playwright → ffmpeg → MP4  │
    │ • html2pptx.js                  │
    │   └─ DOM parsing → PPTX         │
    │ • convert-formats.sh            │
    │   └─ Format conversions         │
    │ • verify.py                     │
    │   └─ Quality verification       │
    └─────────────┬───────────────────┘
                  │
OUTPUT (What you get)
    ├─ MP4 video (with 60fps + music)
    ├─ GIF animation
    ├─ Editable PPTX
    ├─ PDF (print-ready)
    ├─ PNG (300dpi)
    ├─ SVG (vector)
    └─ HTML (preview)
```

---

## Component Details

### 1. ANIMATIONS ENGINE
```javascript
<Stage duration={10}>          ← Timeline: 10 seconds
  <Sprite start={0} end={3}>   ← Scene 1: 0-3 seconds
    {/* Animated content */}
  </Sprite>
  <Sprite start={2} end={5}>   ← Scene 2: 2-5 seconds (overlaps!)
    {/* Another content */}
  </Sprite>
</Stage>

API available:
• useTime() → Current time in timeline
• useSprite() → Local progress in sprite
• interpolate() → Smooth number transitions
• Easing.* → 8 easing functions
```

### 2. DEVICE FRAMES
```
┌─────────────────────────────┐
│      iOS Frame (iPhone)     │ ← Realistic notch
├─ Notch ─────────────────────┤
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   Your HTML content     │ │
│ │   renders here          │ │
│ │                         │ │
│ └─────────────────────────┘ │
├─ Home Indicator ────────────┤ ← Real bezel styling
└─────────────────────────────┘

Also available:
• browser_window.jsx → Chrome/Safari window
• macos_window.jsx → macOS window frame
```

### 3. VIDEO RENDERING PIPELINE
```
HTML Animation File
        ↓
[Playwright launches browser]
        ↓
[Records video: WebM format]
        ↓
[ffmpeg converts to MP4]
        ↓
[Optional: 60fps interpolation]
        ↓
[Optional: Add background music]
        ↓
[Optional: Convert to GIF]
        ↓
MP4 / GIF Ready!

Command:
node render-video.js animation.html --duration=30 --fps=60
```

### 4. PPTX EXPORTER
```
HTML Presentation
        ↓
[Playwright opens in browser]
        ↓
[Extract DOM elements]
        ↓
[Parse CSS styles & positions]
        ↓
[Convert pixels to PowerPoint units (EMUs)]
        ↓
[Create PPTX objects]
        ↓
[Editable PowerPoint File!]

User can now:
• Double-click text to edit
• Move shapes around
• Change colors
• Present in any PowerPoint version
```

---

## The 6 Core Templates

### Template 1: iOS App Prototype
```html
What it contains:
├─ iOS device frame (notch, home indicator)
├─ Multiple screens (tap to switch)
├─ Real images (from Wikimedia/Unsplash)
├─ Interactive buttons
└─ Playwright verification

Output: Clickable prototype in realistic iPhone frame
Time: 10-15 minutes
```

### Template 2: Presentation Slides
```html
What it contains:
├─ Cover slide (hero image)
├─ Content slides (text + visuals)
├─ Transition animations
├─ Speaker notes
└─ PPTX export ready

Output: HTML deck + editable PowerPoint
Time: 15-25 minutes
```

### Template 3: Motion Design
```html
What it contains:
├─ Stage component (timeline container)
├─ Sprite sections (scenes)
├─ Easing animations
├─ Background music config
└─ MP4 export ready

Output: MP4 video (1920x1080, 60fps)
Time: 8-12 minutes
```

### Template 4: Real-time Tweaks
```html
What it contains:
├─ CSS variables (colors, sizes)
├─ Side panel controls
├─ Live preview switching
├─ localStorage persistence
└─ Design variant comparison

Output: Multiple designs you can switch between
Time: 10 minutes
```

### Template 5: Infographics
```html
What it contains:
├─ CSS Grid layout (precise positioning)
├─ Data-driven visualization
├─ Typography refinement
├─ Multi-format export (PDF/PNG/SVG)
└─ Print-ready quality

Output: Magazine-quality infographics
Time: 10 minutes
```

### Template 6: Expert Design Review
```html
What it contains:
├─ 5-dimension rating system
│  ├─ Philosophy consistency
│  ├─ Visual hierarchy
│  ├─ Execution detail
│  ├─ Functionality
│  └─ Innovation
├─ Radar chart visualization
├─ Keep/Fix/Quick Wins analysis
└─ Actionable feedback

Output: Professional design critique
Time: 3 minutes
```

---

## Current vs. Connected Flow

### CURRENT: AI Imagination Only
```
┌────────────────────────────────────────┐
│ USER: "Create iOS app"                 │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ AI: "I'll imagine an iPhone mockup"    │
│ Generates: <div style="...">...</div>  │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ Preview: Shows HTML in browser         │
│ Result: Plain HTML, no device frame    │
└────────────────────────────────────────┘
```

### CONNECTED: AI + Repository
```
┌────────────────────────────────────────┐
│ USER: "Create iOS app"                 │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ SYSTEM PROMPT:                         │
│ "Use c1-ios-prototype template"        │
│ + animations.jsx for interactions      │
│ + ios_frame.jsx for device wrapping    │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ AI: "I'll use the iOS template"        │
│ Generates: React JSX + config          │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ SERVER:                                │
│ 1. Write JSX to file                   │
│ 2. Wrap in ios_frame.jsx               │
│ 3. Call render-video.js (optional)     │
│ 4. Get MP4 + screenshots back          │
└─────────────┬──────────────────────────┘
              │
              ↓
┌────────────────────────────────────────┐
│ PREVIEW:                               │
│ • Screenshots in realistic iPhone      │
│ • MP4 video (if animated)              │
│ • Download buttons ready               │
│                                        │
│ RESULT: Professional, downloadable!    │
└────────────────────────────────────────┘
```

---

## Asset Requirements

### What Each Template Needs

```
iOS Prototype:
  ✓ Real images (preferably real app screenshots)
  ✓ Multiple screens
  ✓ Tap targets (buttons)
  ✓ State management (different views)
  → Gets: Clickable prototype + screenshots

Presentation:
  ✓ Slide content (text, images)
  ✓ Visual hierarchy (title, subtitle, body)
  ✓ Optional: animated transitions
  → Gets: HTML deck + editable PPTX

Animation:
  ✓ Timeline and scenes (when things appear)
  ✓ Objects to animate (text, shapes, images)
  ✓ Optional: background music
  ✓ Optional: sound effects
  → Gets: MP4 video + GIF

Infographic:
  ✓ Data (numbers, labels, categories)
  ✓ Visual structure (layout, hierarchy)
  ✓ Typography (fonts, sizes)
  → Gets: PDF + PNG (300dpi) + SVG

Brand Assets (Always):
  ✓ Logo (SVG preferred)
  ✓ Color palette (HEX codes)
  ✓ Product images (if applicable)
  ✓ UI screenshots (if app/web)
  → Gets: Branded designs (not generic)
```

---

## File Processing Chain

### When User Requests Video Export

```
HTML Design File
    ↓
1. VALIDATION (Is it valid HTML?)
    ↓
2. PLAYWRIGHT OPENS BROWSER
    - Loads HTML file
    - Waits for fonts ready
    - Records WebM video
    ↓
3. FFMPEG PROCESSES
    - Converts WebM → MP4
    - Applies frame rate (default 25fps)
    - Optional: interpolate to 60fps
    ↓
4. OPTIONAL: ADD MUSIC
    - Mix MP4 audio track
    - Fade in/out
    ↓
5. OPTIONAL: GENERATE GIF
    - Extract frames
    - Optimize palette
    - Create animated GIF
    ↓
OUTPUT
├─ design.mp4 (ready to download)
├─ design.gif (ready to share)
└─ design-60fps.mp4 (high quality)
```

---

## System Capabilities Summary

```
┌─────────────────────────────────────────────────┐
│          CURRENT CAPABILITIES                   │
├─────────────────────────────────────────────────┤
│ ✓ Generate HTML/CSS designs                     │
│ ✓ Display in browser                            │
│ ✓ Multi-turn conversation                       │
│ ✓ Design variations (via tweaks)                │
│                                                 │
│ ✗ Export to MP4 video                           │
│ ✗ Export to PPTX presentation                   │
│ ✗ Device frame wrapping                         │
│ ✗ Professional animation rendering              │
│ ✗ Brand asset integration                       │
│ ✗ Quality verification                          │
└─────────────────────────────────────────────────┘

                    ↓ (Connect to repo)

┌─────────────────────────────────────────────────┐
│          FUTURE CAPABILITIES                    │
├─────────────────────────────────────────────────┤
│ ✓ Generate HTML/CSS designs                     │
│ ✓ Display in browser                            │
│ ✓ Multi-turn conversation                       │
│ ✓ Design variations (via tweaks)                │
│ ✓ Export to MP4 video                           │
│ ✓ Export to PPTX presentation                   │
│ ✓ Device frame wrapping                         │
│ ✓ Professional animation rendering              │
│ ✓ Brand asset integration                       │
│ ✓ Quality verification (Playwright)             │
│ ✓ Infographic generation (print-ready)          │
│ ✓ Design review (5-dimension rating)            │
└─────────────────────────────────────────────────┘
```

---

## Decision Tree: Which Template to Use?

```
USER REQUEST?
    │
    ├─→ "Show me app screens"
    │   └─→ Use: c1-ios-prototype.html
    │       Output: Clickable iPhone mockup
    │
    ├─→ "Make me a presentation"
    │   └─→ Use: c2-slides-pptx.html
    │       Output: HTML slides + PPTX
    │
    ├─→ "Create animation/video"
    │   └─→ Use: c3-motion-design.html
    │       Output: MP4 + GIF
    │
    ├─→ "Show design options"
    │   └─→ Use: c4-tweaks.html
    │       Output: Switcher for variants
    │
    ├─→ "Design infographic"
    │   └─→ Use: c5-infographic.html
    │       Output: PDF + PNG + SVG
    │
    ├─→ "Review this design"
    │   └─→ Use: c6-expert-review.html
    │       Output: Radar chart + feedback
    │
    └─→ "I'm not sure..."
        └─→ Use: Fallback mode
            Show 3 style options, user picks
```

---

## Success Metrics (After Connection)

| Metric | Target |
|--------|--------|
| Template Pick Accuracy | 95%+ |
| Render Success Rate | 98%+ |
| MP4 Generation Time | <60 seconds |
| PPTX Export Success | 95%+ |
| User Download Rate | 80%+ |
| Design Quality Score | 8+/10 |
| Brand Asset Usage | 90%+ when available |

---

**This visual reference shows:**
- ✅ What each component does
- ✅ How they connect
- ✅ What outputs possible
- ✅ Decision tree for templates
- ✅ Current vs. future capability

Use this alongside the detailed analysis documents!
