# DESIGN.md — ProtoAI Chat UI

## Design Philosophy

ProtoAI is a focused, minimal AI chat interface embedded in the Accel Atoms ecosystem. The design language is **dark brutalist-minimal** — raw, purposeful, and typographically driven. Every interaction is intentional. Whitespace is generous. Motion is earned.

---

## Visual Identity

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#000000` | Page background |
| `--bg-surface` | `#111111` | Chat surface, input area |
| `--bg-elevated` | `#1A1A1A` | Input field, message bubbles |
| `--border` | `#2A2A2A` | Dividers, borders |
| `--text-primary` | `#FFFFFF` | Headings, user input |
| `--text-secondary` | `#888888` | Timestamps, placeholders |
| `--text-muted` | `#444444` | Disabled states |
| `--accent-gradient` | `linear-gradient(135deg, #FF6B35, #C94FBF, #4F8EBF)` | Logo orb, highlights |
| `--accent-solid` | `#FF6B35` | Send button active state |

### Typography

| Context | Font | Weight | Size |
|---|---|---|---|
| User messages | IBM Plex Mono | 400 | 14px |
| AI responses | IBM Plex Mono | 400 | 14px |
| Suggested questions | Poppins | 500 | 13px |
| UI labels, headers | Poppins | 600 | varies |
| Timestamps | IBM Plex Mono | 400 | 11px |

Line height: `1.7` for all prose. Letter spacing: `-0.01em` for Poppins headings.

---

## Layout

### Phase 1 — Collapsed Input State

```
┌─────────────────────────────────────────────┐
│                                             │
│    [Logo Orb]  [ Ask anything...      ] [→] │
│                                             │
└─────────────────────────────────────────────┘
```

- Input pill centered on page or fixed bottom-center
- Logo orb left of input — clicking it opens full chat UI directly
- Input click triggers **expand animation** (Phase 1 → 2)
- Width: `520px` collapsed, `680px` on focus
- Height: `56px` collapsed

### Phase 2 — Focused Input (mini expanded)

```
┌─────────────────────────────────────────────────┐
│  [Logo Orb]  [ Ask anything...            ] [→] │
└─────────────────────────────────────────────────┘
```

- Input pill widens (`520px → 680px`) and border brightens (`#2A2A2A → #3A3A3A`)
- **No chips shown** — clean expansion only
- Logo orb click skips directly to Phase 3 (full chat)
- Input submit also goes directly to Phase 3, carrying the typed value

### Phase 3 — Full Chat UI (Intro / Empty State)

Shown when chat panel opens and `messages.length === 0`.

```
┌──────────────────────────────────────────────┐
│  ProtoAI                        [+] [Apply]  │
├──────────────────────────────────────────────┤
│                                              │
│                                              │
│              [Logo Orb 72px]                 │
│                                              │
│     I am ProtoAI - Your atomic companion     │
│                                              │
│   I help you understand Atoms, clear your    │
│   questions, and guide you through the       │
│   application when you're ready.             │
│                                              │
│      Choose a prompt or ask me anything      │
│                                              │
│  [What is Accel Atoms?] [Philosophy?] [AI?]  │
│                                              │
│                                              │
├──────────────────────────────────────────────┤
│  [ Ask anything...                     ] [→] │
└──────────────────────────────────────────────┘
```

- Intro block centered vertically in available space
- Chips horizontally scrollable on mobile
- Submitting input → transitions to Phase 4

### Phase 4 — Active Conversation

Triggered when user submits first message. Intro block animates out (`opacity: 1 → 0`, `translateY: 0 → -16px`, `200ms`), replaced by message thread.

```
┌──────────────────────────────────────────────┐
│  ProtoAI                        [+] [Apply]  │
├──────────────────────────────────────────────┤
│                                              │
│                 ┌────────────────────────┐   │
│                 │  User's first message  │   │
│                 └────────────────────────┘   │
│                                              │
│  ┌──────────────────────┐                   │
│  │  ● ● ●  (thinking)   │                   │
│  └──────────────────────┘                   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  AI response streams in here with    │   │
│  │  typing cursor effect...█            │   │
│  └──────────────────────────────────────┘   │
│                                              │
│                 ┌────────────────────────┐   │
│                 │  Next user message     │   │
│                 └────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│  [ Ask anything...                     ] [→] │
└──────────────────────────────────────────────┘
```

- Intro state never returns (until "New Chat")
- Auto-scroll to bottom on each new message
- Input stays focused after send

---

## Animation Specifications

### Expand Animation (Collapsed → Full Screen)

- **Trigger:** Input click or logo orb click
- **Library:** GSAP + Motion (Framer Motion)
- **Behavior:** Container scales from center of input pill outward — expanding vertically to full viewport height, horizontally to full width
- **Easing:** `cubic-bezier(0.32, 0, 0.15, 1)` — fast start, smooth settle
- **Duration:** `480ms`
- **Sequence:**
  1. Input pill border glows (80ms)
  2. Background overlay fades in (120ms)
  3. Panel expands from pill origin — top and bottom simultaneously (480ms)
  4. Content (logo, title, chips) fades + slides up (200ms delay, 300ms duration)

### Collapse Animation (Full Screen → Collapsed)

- Reverse of expand
- Duration: `360ms`

### Thinking / Loading State

- Three dots pulse sequentially (not simultaneously)
- Each dot: `scale(0.6) → scale(1.0)` with `200ms` stagger
- Background: `#1A1A1A` bubble, left-aligned
- Duration per cycle: `900ms`, loops until response starts

### Typing Effect (AI Response)

- Characters rendered at `28ms` intervals (≈ 35 chars/sec)
- Not character-by-character — **word-chunk streaming** from API
- Each word chunk fades in with `opacity: 0 → 1` over `60ms`
- Blinking cursor `|` at end of stream, disappears when done
- No scroll jump — smooth auto-scroll to bottom with `behavior: smooth`

### Message Entry Animation

- User message: slides in from right, `translateX(24px) → 0`, `opacity: 0 → 1`, `200ms`
- AI message: slides in from left, same timing
- Easing: `ease-out`

### Suggested Chips (Phase 3 intro only)

- Appear as part of intro state content reveal (Phase 3 entry)
- Stagger reveal: each chip `translateY(8px) → 0`, `opacity: 0 → 1`
- Stagger delay: `60ms` per chip
- Hover: border color transitions to `#555`, background lifts to `#222`
- **Not shown in Phase 2** (focused pill)

### Intro Exit Animation (Phase 3 → Phase 4)

- Trigger: user submits first message
- Intro block: `opacity: 1 → 0`, `translateY: 0 → -16px`, `duration: 200ms`, `ease-out`
- Message thread fades in immediately after (`opacity: 0 → 1`, `100ms delay`, `200ms`)
- Transition is one fluid motion — intro out, messages in

---

## Component Specs

### Logo Orb

- Size: `72px` × `72px` (full chat), `40px` × `40px` (collapsed input)
- Background: radial gradient mesh (`#FF6B35 → #C94FBF → #4F8EBF`)
- Icon: 4-pointed star / compass rose, white stroke, `24px`
- Hover: subtle scale `1.0 → 1.05`, `200ms ease`
- Click (collapsed): opens full chat UI

### Input Field

- Background: `#1A1A1A`
- Border: `1px solid #2A2A2A`, focus `1px solid #3A3A3A`
- Border radius: `28px` (pill)
- Padding: `16px 24px`
- Font: IBM Plex Mono, 14px, `#FFFFFF`
- Placeholder: `#444444`
- Send button: arrow icon, activates when input non-empty

### Message Bubbles

- **User:** right-aligned, background `#1A1A1A`, border `1px solid #2A2A2A`, border-radius `16px 16px 4px 16px`, max-width `72%`
- **AI:** left-aligned, no background (transparent), no border, max-width `80%`
- Padding: `12px 16px`
- Font: IBM Plex Mono 14px

### Suggested Question Chips

- Border: `1px solid #2A2A2A`
- Background: transparent
- Border-radius: `999px` (pill)
- Font: Poppins 500, 13px
- Padding: `8px 16px`
- Hover border: `#555555`

### New Chat Button

- Top-right, `+` icon
- Ghost style: `1px solid #2A2A2A`, transparent bg
- Clears session, resets to empty chat welcome state

---

## Spacing System

| Token | Value |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `40px` |
| `--space-2xl` | `64px` |

Message gap: `24px` between message pairs. Section padding: `40px` horizontal on desktop, `20px` on mobile.

---

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | `< 640px` | Full-width input, smaller chips, single column |
| Tablet | `640–1024px` | Centered chat, max-width `640px` |
| Desktop | `> 1024px` | Max-width `720px` chat area, centered |

---

## Accessibility

- All interactive elements keyboard-navigable (`Tab`, `Enter`, `Escape` to close)
- `Escape` collapses full chat back to input pill
- ARIA roles: `role="log"` on chat container, `aria-live="polite"` on AI response
- Minimum contrast ratio `4.5:1` for all text
- Focus rings visible (not removed with `outline: none`)
- Reduced motion: animations off when `prefers-reduced-motion: reduce`

---

## Reference

- UI inspiration: [atoms.accel.com](https://atoms.accel.com) chatbot widget
- Logo style: gradient orb with star icon (see attached images)
- Animation reference: attached MP4 — note smooth expand from center, staggered chip reveal