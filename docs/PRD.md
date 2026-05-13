# PRD — ProtoAI Chat UI

**Product:** ProtoAI — Embedded AI Chat Companion  
**Version:** 3.0  
**Status:** Pre-development  
**Owner:** Accel Atoms

---

## 1. Overview

ProtoAI is an AI-powered chat widget for Accel Atoms. Interactive guide for founders — answers questions about the program, application process, philosophy.

Starts as a minimal input pill. Expands into full-screen chat. AI responses stream naturally.

**v3 changes:**
- Vercel AI SDK + ai-elements `Message` component for rendering
- Google Gemini Flash (free tier)
- Widget decoupled from backend via `apiEndpoint` prop
- Phase 2 plan: web component packaging after Phase 1 ships

---

## 2. Problem Statement

Founders visiting Accel Atoms have high-intent questions but don't know where to start. Static FAQ fails them. Live chat has ops cost. ProtoAI is always-on, instant, scoped to Atoms knowledge.

---

## 3. Goals

| Goal | Metric |
|---|---|
| Time-to-clarity for founders | First AI answer < 30s from page load |
| Increase application rate | Measurable uplift from chat-engaged users |
| Reduce support load | Fewer "what is Atoms?" emails |
| Embeddable anywhere (Phase 2) | Drop-in web component, no framework required |

---

## 4. Non-Goals (v1)

- No user auth (anonymous sessions only)
- No multi-language
- No persistent cross-device history
- No admin dashboard or analytics UI

---

## 5. User Stories

### 5.1 First-Time Visitor
> "As a founder, I want to quickly understand Atoms without reading long pages."

- Input pill visible on load
- Suggested chips on panel open
- AI responds within 3s, streams naturally
- Custom loading animation visible while waiting

### 5.2 Application Explorer
> "As a founder considering applying, I want to understand eligibility and timelines."

- ProtoAI answers process/deadline questions
- "Apply Now" CTA in header
- AI can direct to application form

### 5.3 Returning User
> "As a founder who chatted earlier, I want to continue without starting over."

- Session hydrated from `sessionStorage` on refresh
- "New Chat" clears history and resets

### 5.4 Mobile User
> "As a founder on my phone, I want the chat to work without frustration."

- Fully responsive
- Touch targets ≥ 44px
- Keyboard handling correct on iOS/Android

### 5.5 External Integrator (Phase 2)
> "As a developer, I want to embed ProtoAI on any website without a React setup."

- Single script tag + custom element
- `api-endpoint` attribute points to any compatible backend
- Works in plain HTML, Vue, Angular, etc.

---

## 6. Feature Requirements

### 6.1 Input Pill

| Priority | Feature |
|---|---|
| P0 | Visible on page load |
| P0 | Click → focus state, slight widen |
| P0 | Logo orb click → full panel |
| P0 | Submit → opens panel with message in flight |
| P1 | GSAP expand animation |
| P2 | Fixed bottom-center (desktop), full-width (mobile) |

### 6.2 Full Chat UI

| Priority | Feature |
|---|---|
| P0 | GSAP clipPath expand from pill |
| P0 | Intro + chips on empty state |
| P0 | Messages rendered via ai-elements `<Message>` |
| P0 | AI response streams token by token |
| P0 | Custom 3-dot TypingIndicator while `isThinking` |
| P0 | Streaming cursor on active AI message |
| P0 | Input at bottom, always visible |
| P0 | Auto-scroll to latest message |
| P1 | "New Chat" resets state |
| P1 | Session persists on refresh |
| P1 | Collapse to pill (Escape or X) |
| P2 | "Apply Now" CTA in header |

### 6.3 AI Behavior

| Priority | Feature |
|---|---|
| P0 | Responds to Accel Atoms questions |
| P0 | Suggested prompts: "What is Accel Atoms?", "What is Atom's core philosophy?", "Benefits of Atoms AI?" |
| P0 | Streams via Gemini Flash |
| P1 | Graceful fallback for out-of-scope questions |
| P2 | Link-aware responses (suggest Apply page) |

### 6.4 Session Management

| Priority | Feature |
|---|---|
| P0 | Persist to `sessionStorage` via `useProtoChat` |
| P0 | Hydrate on mount via `initialMessages` |
| P0 | "New Chat" clears ai-sdk + Redux + storage |
| P1 | Session expiry after 24h inactivity |

### 6.5 Backend / API

| Priority | Feature |
|---|---|
| P0 | Default backend: `POST /api/chat` (Next.js route) |
| P0 | `apiEndpoint` prop — widget points to any compatible API |
| P0 | Rate limiting: 10 req/min per session |
| P1 | 429 error surfaced inline in chat |

### 6.6 Phase 2 — Web Component

| Priority | Feature |
|---|---|
| P1 | Bundle as `<proto-ai>` custom element |
| P1 | `api-endpoint` HTML attribute |
| P1 | Works without React on host page |
| P2 | CDN-hosted distributable |

---

## 7. Out of Scope (v1)

- Voice input, file uploads
- Multi-session history
- Admin dashboard / analytics
- Custom knowledge base UI

---

## 8. Success Metrics

| Metric | Target |
|---|---|
| First AI response | < 3s p95 |
| Expand animation | 60fps |
| Session recovery on refresh | 100% |
| Mobile Lighthouse | ≥ 90 |
| Web component embed (Phase 2) | Works in plain HTML with one script tag |

---


## 9. Dependencies

- Google AI API key (free, `gemini-2.0-flash-exp`) — aistudio.google.com
- Vercel (hosting)
- Accel Atoms brand assets (logo orb, fonts)
- npm: `ai`, `@ai-sdk/google`, `ai-elements`, `gsap`, `framer-motion`, `@reduxjs/toolkit`, `nanoid`
