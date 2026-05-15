# EasyTalk AI

<p align="center">
  <img src="icons/logo.svg" width="96" height="96" alt="EasyTalk AI Icon">
</p>

<p align="center">
  <strong>Click any UI element. Copy an AI-ready component spec.</strong>
</p>

<p align="center">
  <a href="#installation">Install</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#features">Features</a> ·
  <a href="#faq">FAQ</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-141421?logo=googlechrome&logoColor=white" alt="Chrome">
  <img src="https://img.shields.io/badge/Manifest_V3-141421?logo=googlechrome&logoColor=white" alt="Manifest V3">
  <img src="https://img.shields.io/badge/license-MIT-141421" alt="MIT">
</p>

---

**EasyTalk AI** turns any webpage UI element into a structured, AI-readable component spec — CSS selectors, visual properties, layout context, spacing, animations, and more.

Just **click** an element. The extension captures everything an AI needs to understand, modify, or recreate that UI. Paste the output into ChatGPT, Claude, Cursor, or Codex.

> 点击网页上的任意 UI 元素，一键复制 AI 能理解的组件描述。粘贴到 ChatGPT、Claude、Cursor 或 Codex，AI 就能精准理解你要修改或复现的界面。

---

## Why This Exists

AI coding tools are powerful, but **describing UI precisely is painful**.

Without a tool like this, you have to:
- Manually copy CSS selectors and class names
- Describe layout and spacing in words
- Guess at colors, font sizes, and margins
- Explain the surrounding context

**EasyTalk AI eliminates the guesswork.** Click → copy → paste. That's it.

---

## Who It's For

- **Designers** — Capture UI specs to hand off to AI-powered development tools
- **Frontend developers** — Give Cursor, Claude Code, or Codex exact element context
- **AI coding users** — Stop describing UI in words. Let the extension do it.
- **Design system maintainers** — Extract component specs for documentation

---

## Features

### Three Modes for Three Workflows

| Mode | Trigger | Output | Best For |
|------|---------|--------|----------|
| **Click** 🎯 | Click any element | CSS selector + attributes + layout context + siblings | "Make this button more compact" |
| **Cmd+C** 📋 | Hover + press `Cmd+C` | Full design spec: visuals, layout, animations, keyframes | "Recreate this card in React" |
| **Shift+Click** ✨ | Click multiple elements, then `Enter` | Batch structured descriptions | "Explain this pricing section layout" |

### Output Formats

Choose your preferred format from the popup menu:

| Format | Best For |
|--------|----------|
| **YAML** | AI code editors (Cursor, Claude Code) |
| **JSON** | Programmatic processing |
| **Markdown** | Readable chat prompts |

### Technical Highlights

- **iframe support** — Works inside embedded frames
- **Smart selector engine** — Picks the most reliable selector (`id` → `data-testid` → `aria-label` → class → path)
- **Animation detection** — Detects framer-motion, GSAP, Lottie, AOS, and CSS keyframes
- **Works offline** — No API calls. Everything runs in your browser.
- **No build tools** — Pure JavaScript, CSS, HTML. Zero dependencies.

---

## Installation

> **Note:** EasyTalk AI is currently available via local installation. Chrome Web Store release coming soon.

1. **Open** `chrome://extensions/` in Chrome
2. **Enable** Developer Mode (toggle in top right corner)
3. **Click** "Load unpacked" and select this repository folder
4. The extension icon appears in your toolbar — ready to use

**Keyboard shortcut:** `Cmd+Shift+E` (Mac) / `Ctrl+Shift+E` (Windows/Linux)

---

## Usage

1. **Activate** the extension — click the toolbar icon or press `Cmd+Shift+E`
2. **Hover** over any UI element on the page — a blue overlay highlights it
3. **Choose your action:**
   - **Click** → copies a structured element description to your clipboard
   - **`Cmd+C`** → copies a full component spec (visuals, layout, animations)
   - **`Shift+Click`** → adds to multi-select; press `Enter` to copy all
4. **Paste** the output into ChatGPT, Claude, Cursor, Codex, or any AI tool
5. **Done.** The AI understands exactly which element you mean.

Press `Esc` to exit.

---

## Example Output

### Click Mode (YAML)

```yaml
Tag: button
Text: "Get Started"
CSS_Selector: "#cta-button"
ID: cta-button
Class: btn btn-primary
Size: 160x48
Attributes:
  type: "submit"
  aria-label: "Get started with free trial"
Parent: div #hero-section
Siblings:
  - a: "Learn more"
```

### Cmd+C Mode (Component Spec)

A full design spec is generated including:
- **Visual properties** — colors, typography, spacing, shadows, borders
- **Layout context** — parent container, flex direction, gap, sibling relationships
- **Interaction states** — hover, active, focus styles
- **Animations** — `@keyframes` rules, detected animation libraries
- **HTML structure** — Cleaned DOM skeleton of the component

Copy → paste into your AI tool. The AI has everything it needs.

---

## Privacy

- ✅ This extension **runs locally** in your browser
- ✅ It does **not** call external AI APIs
- ✅ It does **not** upload webpage content to any server
- ✅ Generated output stays in your clipboard — you decide where to paste it
- ❌ No analytics, no tracking, no data collection

---

## Permissions Explained

| Permission | Why |
|------------|-----|
| `activeTab` | Access the current webpage to read element properties |
| `scripting` + `all_frames` | Inject the inspector into the page and iframes |
| `clipboardWrite` | Copy the generated spec to your clipboard |
| `storage` | Save your format preference (YAML/JSON/Markdown) |
| `webNavigation` | Detect iframes across the page |

No network permissions are requested. This extension never sends data to a remote server.

---

## Roadmap

- [x] Core click / spec / multi-select modes
- [x] iframe support
- [x] Animation library detection
- [x] YAML / JSON / Markdown output
- [ ] Chrome Web Store release
- [ ] Demo GIF and screenshots
- [ ] Tailwind-friendly output mode
- [ ] React component prompt template
- [ ] Design token extraction
- [ ] Export prompt presets

---

## Contributing

Contributions are welcome! This project is pure JavaScript — no build tools needed.

1. Fork the repository
2. Create a feature branch
3. Test your changes on 5 core paths (Click / Cmd+C / Shift+Click / iframe / Popup)
4. Submit a pull request

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full technical overview.

---

## License

MIT
