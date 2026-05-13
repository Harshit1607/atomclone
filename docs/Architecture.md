# ARCHITECTURE.md — ProtoAI Chat UI

**Version:** 3.0  
**Last updated:** May 2026

---

## 1. System Overview

ProtoAI is a Next.js web app (Phase 1) designed for extraction into a web component (Phase 2). Browser handles UI state, animation, session persistence. Server handles LLM proxying. Widget is decoupled from backend via `apiEndpoint` prop.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │  React UI    │◄──►│   useChat    │◄──►│  Session  │  │
│  │  ChatWidget  │    │  (ai-sdk)    │    │  Storage  │  │
│  └──────┬───────┘    └──────────────┘    └───────────┘  │
│         │                    ▲                          │
│         │            ┌───────┴──────┐                   │
│         │            │ Redux Store  │                   │
│         │            │ (sessionId)  │                   │
│         │            └──────────────┘                   │
│         │ fetch → apiEndpoint (prop)                    │
│         ▼                                               │
│  ┌──────────────────────────────────┐                   │
│  │  /api/chat (default)             │                   │
│  │  OR any external endpoint        │                   │
│  └──────────────┬───────────────────┘                   │
└─────────────────┼─────────────────────────────────────┘
                  │ HTTPS streaming
                  ▼
         ┌──────────────────┐
         │  Google AI API   │  (gemini-2.0-flash-exp)
         └──────────────────┘
```

---

## 2. Two-Phase Delivery

### Phase 1 — Next.js web app (active)

Full ProtoAI widget deployed on atoms.accel.com as a Next.js page. `ChatWidget` rendered in `app/page.tsx`. Backend at `app/api/chat/route.ts`.

### Phase 2 — Web component (future)

`ChatWidget` + all dependencies bundled as `<proto-ai>` custom element via Vite. Deployed to CDN. Any website embeds it with one script tag and an `api-endpoint` attribute.

**Phase 1 code must be written to support Phase 2 extraction:**
- `ChatWidget` accepts `apiEndpoint` prop (no hardcoded paths in components)
- No Next.js-specific imports inside `components/` or `hooks/`
- CSS via variables (portable to shadow DOM)
- All state self-contained in component tree (no global singletons)

---

## 3. Component Architecture

```
ChatWidget (root — owns isExpanded, receives apiEndpoint prop)
├── InputPill (Phase 1 + 2 — collapsed state)
│   ├── LogoOrb (click → expand to Phase 3)
│   ├── TextInput (wired to useChat input/handleInputChange)
│   └── SendButton (wired to handleSubmit → opens panel)
│
└── ChatPanel (Phase 3 + 4 — full-screen)
    ├── ChatHeader
    │   ├── LogoOrb (small)
    │   ├── NewChatButton → setMessages([]) + newSession()
    │   └── ApplyButton
    ├── EmptyState (messages.length === 0)
    │   ├── LogoOrb (large, 72px)
    │   ├── IntroText
    │   └── SuggestedChips → append({ role: "user", content })
    ├── MessageList (scrollable)
    │   ├── MessageBubble[] → wraps ai-elements <Message>
    │   └── TypingIndicator (shown when isThinking)
    └── ChatInput
        ├── TextInput
        └── SendButton
```

---

## 4. MessageBubble + ai-elements

`MessageBubble` wraps `ai-elements` `<Message>` component. ai-elements handles:
- Correct rendering of `useChat` message objects (no manual mapping)
- Markdown in AI responses (code blocks, bold, etc.)
- TypeScript types aligned with ai-sdk

`MessageBubble` adds ProtoAI-specific styling:
- Layout (left/right alignment by role)
- Background, border, border-radius from DESIGN.md
- `message-streaming` class for cursor CSS
- Framer Motion entry animation wrapper

```
MessageBubble
└── <motion.div> (Framer Motion slide-in)
    └── <div className="message-[user|assistant] [message-streaming]">
        └── <Message message={msg} />   ← ai-elements
```

---

## 5. Data Flow

### User sends a message

```
User types → ChatInput.handleInputChange → useChat.input
User submits → ChatInput.handleSubmit
  → useChat adds user message to messages[]
  → POST apiEndpoint { messages } (ai-sdk format, with x-session-id header)
    → streamText(gemini-2.0-flash-exp) on server
  → ai-sdk streams tokens → appends to last assistant message
  → MessageList re-renders → MessageBubble → ai-elements <Message> updates
  → isLoading = false when stream ends
  → useEffect persists messages to sessionStorage
```

### Chip click

```
SuggestedChip clicked
  → append({ role: "user", content: chip.label })
  → same flow as manual submit
```

### Page refresh

```
App mounts
  → useProtoChat reads sessionStorage → loadFromStorage()
  → useChat initialMessages = saved messages
  → MessageList renders previous conversation
```

### New chat

```
NewChatButton clicked
  → setMessages([])           ← ai-sdk: clear messages array
  → dispatch(newSession())    ← Redux: new nanoid sessionId
  → sessionStorage.removeItem(SESSION_KEY)
  → ChatPanel shows EmptyState
```

---

## 6. API Layer

### Default: `POST /api/chat` (Next.js route handler)

```typescript
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "@/lib/constants";

export async function POST(req: Request) {
  const sessionId = req.headers.get("x-session-id") ?? "anonymous";
  if (!checkRateLimit(sessionId)) {
    return new Response(JSON.stringify({ error: "Too many messages." }), { status: 429 });
  }
  const { messages } = await req.json();
  const result = await streamText({
    model: google("gemini-2.0-flash-exp"),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1000,
  });
  return result.toDataStreamResponse();
}
```

### External endpoint (Phase 2 / custom deployments)

Any endpoint that:
1. Accepts `POST` with `{ messages: CoreMessage[] }` body
2. Returns ai-sdk data stream (`Content-Type: text/plain; charset=utf-8` with ai-sdk protocol)

Widget passes `x-session-id` header for rate limiting. External endpoints can ignore it.

---

## 7. State Ownership

| State | Owner | Never in |
|---|---|---|
| `messages[]` | ai-sdk `useChat` | Redux |
| `isLoading` | ai-sdk `useChat` | Redux |
| `error` | ai-sdk `useChat` | Redux |
| `input` | ai-sdk `useChat` | Redux |
| `sessionId` | Redux `sessionSlice` | useChat |
| `isExpanded` | Local React state in `ChatWidget` | Redux or useChat |

**Derived state (compute, never store):**
```typescript
const showIntro   = messages.length === 0
const isThinking  = isLoading && messages.at(-1)?.role === "user"
const isStreaming  = isLoading && messages.at(-1)?.role === "assistant"
```

---

## 8. Animation Architecture

| Library | Scope | Why |
|---|---|---|
| GSAP | Panel expand/collapse only | Best GPU-composited clipPath timeline |
| Framer Motion | Everything inside panel | Declarative, React-native |

No overlap. GSAP touches only `panelRef`. Framer Motion touches only component internals.

```typescript
// Expand (ChatWidget.tsx)
gsap.fromTo(panelRef.current,
  { clipPath: "inset(50% 0 50% 0)", opacity: 0 },
  { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.48, ease: "power3.out" }
);
```

---

## 9. Security

| Concern | Mitigation |
|---|---|
| API key exposure | `GOOGLE_GENERATIVE_AI_API_KEY` server-only, never `NEXT_PUBLIC_` |
| Prompt injection | `system` separate from `messages` in ai-sdk; user cannot override |
| Rate limiting | In-memory per-session (10 req/min) via `x-session-id` header |
| XSS | ai-elements renders markdown safely; no `dangerouslySetInnerHTML` |
| Session hijacking | sessionId ephemeral, anonymous, no auth |

---

## 10. Implementation Order

```
Step 1  — Scaffold: Next.js + TS + Tailwind + ESLint + folder structure
Step 2  — Types + constants: ChatWidgetProps, chip labels, system prompt, CSS variables
Step 3  — Redux session slice + sessionStorage middleware
Step 4  — Static UI Phase 1 + 2: InputPill, LogoOrb, SendButton
Step 5  — Static UI Phase 3 + 4: ChatPanel, MessageList, MessageBubble (ai-elements), TypingIndicator, SuggestedChips, ChatInput
Step 6  — Phase state machine: ChatWidget (isExpanded + apiEndpoint prop)
Step 7  — useProtoChat: useChat + apiEndpoint + sessionStorage hydration
Step 8  — Wire ai-sdk: ChatInput → handleSubmit, Chips → append, NewChat → setMessages([])
Step 9  — Custom loading UI: TypingIndicator (Framer Motion) + streaming cursor (CSS)
Step 10 — Animations: GSAP expand + Framer Motion messages/chips/intro
Step 11 — API route: streamText + Gemini + rate limiter
Step 12 — Session persistence testing
Step 13 — Polish: mobile, a11y, Lighthouse
Step 14 — Cleanup + README
```

---

## 11. Future: Web Component Packaging (Phase 2)

```
ChatWidget (React) → Vite custom elements build → proto-ai.js
                                                 → proto-ai.css
```

```html
<script src="https://cdn.accel.com/proto-ai.js"></script>
<proto-ai api-endpoint="https://your-api.com/api/chat"></proto-ai>
```

**HTML attributes → React props mapping:**
```typescript
// package/proto-ai.ts (Phase 2)
class ProtoAIElement extends HTMLElement {
  connectedCallback() {
    const apiEndpoint = this.getAttribute("api-endpoint") ?? "/api/chat";
    ReactDOM.createRoot(this.shadowRoot!).render(
      <ChatWidget apiEndpoint={apiEndpoint} />
    );
  }
}
customElements.define("proto-ai", ProtoAIElement);
```

**Next.js backend stays** as reference implementation. Consumers bring their own compatible endpoint or use the hosted one.

---

## 12. Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `app/` | Next.js routing, layout, API route |
| `components/chat/` | All chat UI (no Next.js imports) |
| `components/ui/` | Atomic reusable pieces (LogoOrb, SendButton) |
| `store/` | Redux session slice only |
| `hooks/` | useProtoChat, useAutoScroll |
| `lib/` | Google AI config, constants, rate limiter |
| `types/` | ChatWidgetProps, config types |
| `styles/` | CSS variables, global resets |
| `package/` | Phase 2 web component build output (reserved) |
