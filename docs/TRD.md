# TECHNICAL_REQUIREMENTS.md — ProtoAI Chat UI

**Version:** 3.0  
**Stack:** Next.js 14 · Tailwind CSS · GSAP · Framer Motion · Vercel AI SDK · ai-elements · Google Gemini Flash

---

## 1. Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js 14 (App Router) | 14.x |
| Styling | Tailwind CSS | 3.x |
| Animation (layout) | GSAP | 3.x |
| Animation (component) | Framer Motion | 11.x |
| AI SDK | Vercel AI SDK (`ai`) | 4.x |
| AI UI Components | `ai-elements` (`@ai-sdk/react` Message) | latest |
| AI Provider | `@ai-sdk/google` (Gemini Flash) | latest |
| State (session) | Redux Toolkit | 2.x |
| Language | TypeScript | 5.x |
| Package manager | npm | latest |
| Linting | ESLint + Prettier | — |
| Deployment | Vercel | — |

### Why ai-elements

`ai-elements` ships pre-built React components that integrate directly with Vercel AI SDK's message format. We use only the `Message` component — it handles:
- Rendering `role: "user"` and `role: "assistant"` messages from `useChat`
- Markdown rendering in AI responses (code blocks, bold, lists)
- Correct TypeScript types (no manual `Message` interface needed)

We do **not** use ai-elements for: input, attachments, file upload, or any other components. Those are custom-built per DESIGN.md.

### Two-phase delivery

| Phase | What | When |
|---|---|---|
| **Phase 1** | Next.js web app — full ProtoAI widget on atoms.accel.com | Now |
| **Phase 2** | Web component packaging — `<proto-ai>` custom element for embed anywhere | After Phase 1 ships |

Phase 1 is the only active scope. Phase 2 architecture is documented here so Phase 1 code is written to support extraction.

---

## 2. Project Structure

```
protoai/
├── app/
│   ├── layout.tsx              # Root layout, fonts, Redux provider
│   ├── page.tsx                # Home page — renders ChatWidget
│   └── api/
│       └── chat/
│           └── route.ts        # POST /api/chat — ai-sdk streamText endpoint
├── components/
│   ├── chat/
│   │   ├── ChatWidget.tsx      # Root — manages collapsed/expanded state + apiEndpoint prop
│   │   ├── InputPill.tsx       # Collapsed input with logo orb
│   │   ├── ChatPanel.tsx       # Full-screen chat UI
│   │   ├── MessageList.tsx     # Scrollable message feed
│   │   ├── MessageBubble.tsx   # Wraps ai-elements <Message> with ProtoAI styling
│   │   ├── TypingIndicator.tsx # Custom animated three-dot loader (Framer Motion)
│   │   ├── SuggestedChips.tsx  # Prompt suggestion pills
│   │   └── ChatInput.tsx       # Bottom input bar (wired to useChat)
│   └── ui/
│       ├── LogoOrb.tsx         # Gradient orb icon
│       └── SendButton.tsx      # Arrow send button
├── store/
│   ├── index.ts                # Redux store (session only)
│   └── sessionSlice.ts         # sessionId, persistence
├── hooks/
│   ├── useProtoChat.ts         # Wraps ai-sdk useChat + session sync + apiEndpoint
│   └── useAutoScroll.ts        # Smooth scroll-to-bottom on new messages
├── lib/
│   ├── google.ts               # Google AI provider config
│   └── constants.ts            # Model name, system prompt, chip labels, default API endpoint
├── styles/
│   └── globals.css             # CSS variables, base styles
├── types/
│   └── chat.ts                 # ChatWidget props, config types
└── public/
    └── fonts/                  # Self-hosted fallback fonts (optional)
```

**Phase 2 addition (not built yet, folder reserved):**
```
package/                        # Web component build output
├── proto-ai.js                 # Bundled custom element
└── proto-ai.css                # Bundled styles
```

---

## 3. API Design

### POST `/api/chat`

This is the **default** backend. The widget accepts an `apiEndpoint` prop — it can point here or to any external compatible endpoint.

**Request:**
```typescript
{
  messages: CoreMessage[];   // ai-sdk standard format
}
// x-session-id: string      // header for rate limiting
```

**Response:** ai-sdk data stream (`result.toDataStreamResponse()`)

**Implementation:**
```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "@/lib/constants";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const sessionId = req.headers.get("x-session-id") ?? "anonymous";
  if (!checkRateLimit(sessionId)) {
    return new Response(
      JSON.stringify({ error: "Too many messages. Please wait." }),
      { status: 429 }
    );
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

### External API compatibility

Any external endpoint that accepts the same request shape and returns an ai-sdk data stream is compatible. The widget is not locked to this backend.

---

## 4. Widget Props (ApiEndpoint decoupling)

`ChatWidget` accepts an optional `apiEndpoint` prop. Defaults to `/api/chat` (the Next.js backend). When packaged as web component, this becomes a required HTML attribute.

```typescript
// types/chat.ts
interface ChatWidgetProps {
  apiEndpoint?: string;   // default: "/api/chat"
  // Phase 2 — web component attributes:
  // systemPrompt?: string
  // theme?: "dark" | "light"
}
```

```typescript
// hooks/useProtoChat.ts
export function useProtoChat(apiEndpoint = "/api/chat") {
  const sessionId = useAppSelector(s => s.session.sessionId);

  const chat = useChat({
    api: apiEndpoint,
    headers: { "x-session-id": sessionId },
    initialMessages: loadFromStorage(),
    onError: (err) => console.error("Chat error:", err),
  });

  useEffect(() => {
    sessionStorage.setItem(
      "protoai_session",
      JSON.stringify({ messages: chat.messages, sessionId })
    );
  }, [chat.messages, sessionId]);

  return chat;
}
```

---

## 5. ai-elements Message Component Usage

```typescript
// components/chat/MessageBubble.tsx
import { Message } from "ai-elements";  // or @ai-sdk/react — confirm package name on install
import type { Message as AIMessage } from "ai";

interface MessageBubbleProps {
  message: AIMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn(
      "message-bubble",
      message.role === "user" ? "message-user" : "message-assistant",
      isStreaming && "message-streaming"
    )}>
      <Message message={message} />
    </div>
  );
}
```

**Custom styles override ai-elements defaults** to match DESIGN.md exactly:
- User: right-aligned, `#1A1A1A` bg, `1px solid #2A2A2A` border, `border-radius: 16px 16px 4px 16px`
- Assistant: left-aligned, no bg, no border
- Font: IBM Plex Mono 14px for both roles

ai-elements handles Markdown rendering inside the Message component. No additional markdown library needed.

---

## 6. State Architecture

### Redux (session only)
```typescript
// store/sessionSlice.ts
interface SessionState {
  sessionId: string;  // nanoid()
}
```

### ai-sdk useChat (in useProtoChat hook)
```typescript
const {
  messages,            // AIMessage[] from ai-sdk
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  reload,
  stop,
  setMessages,
  append,
} = useChat({ api: apiEndpoint, ... });
```

### Derived state (compute in components, never store)
```typescript
const showIntro   = messages.length === 0
const isThinking  = isLoading && messages.at(-1)?.role === "user"
const isStreaming  = isLoading && messages.at(-1)?.role === "assistant"
```

---

## 7. Session Persistence

- `useProtoChat` persists `messages` + `sessionId` to `sessionStorage` on every change
- `initialMessages: loadFromStorage()` hydrates `useChat` on mount
- `sessionStorage` auto-clears on tab close (intentional — session-scoped)
- "New Chat": `setMessages([])` + `dispatch(newSession())` + `sessionStorage.removeItem(...)`

---

## 8. Animation Implementation

### Panel expand/collapse — GSAP only

```typescript
// ChatWidget.tsx
gsap.fromTo(panelRef.current,
  { clipPath: "inset(50% 0 50% 0)", opacity: 0 },
  { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.48, ease: "power3.out" }
);
```

### Component animations — Framer Motion only

- Message entry: `translateX(±24px) → 0`, `opacity: 0 → 1`, `200ms ease-out`
- Intro exit: `translateY(0 → -16px)`, `opacity: 1 → 0`, `200ms ease-out`
- Chips stagger: `translateY(8px → 0)`, `opacity: 0 → 1`, `60ms` per chip
- TypingIndicator: scale `0.6 → 1 → 0.6`, `0.9s`, `200ms` stagger, loops

### Streaming cursor — CSS only

```css
.message-streaming::after {
  content: "|";
  animation: blink 0.8s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
```

---

## 9. Environment Variables

```env
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=AI...
NEXT_PUBLIC_APP_ENV=development
```

`GOOGLE_GENERATIVE_AI_API_KEY` server-side only. Never `NEXT_PUBLIC_`.

---

## 10. Dependencies

```bash
npm install ai @ai-sdk/google ai-elements gsap framer-motion @reduxjs/toolkit react-redux nanoid
```

---

## 11. Performance

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.2s |
| Expand animation | 60fps |
| Time to first AI token | < 1.5s |
| Lighthouse Performance | ≥ 90 |
| Bundle (initial JS) | < 120kb gzipped |

---

## 12. Error Handling

| Scenario | Behavior |
|---|---|
| API error | ai-sdk `error` state → inline error + `reload` button |
| Network offline | `navigator.onLine` check → toast |
| Rate limit (429) | ai-sdk `onError` → "Too many messages. Wait N seconds." |
| Stream abort | `stop()` → message marked partial |
| Invalid session | New sessionId, `setMessages([])` |

---

## 13. Phase 2 — Web Component (future, not now)

When Phase 1 ships, components will be extracted into a web component:

```html
<!-- Embed anywhere -->
<script src="https://cdn.../proto-ai.js"></script>
<proto-ai api-endpoint="https://your-backend.com/api/chat"></proto-ai>
```

**Build approach:**
- Bundle `ChatWidget` + all deps with Vite (custom elements build)
- Shadow DOM for style isolation
- `api-endpoint` HTML attribute maps to `apiEndpoint` prop
- Next.js backend stays as reference implementation; consumers bring their own

**What makes Phase 1 code extractable:**
- `ChatWidget` already accepts `apiEndpoint` prop
- No hardcoded `/api/chat` in components
- CSS variables in `:root` (easy to inject into shadow DOM)
- No Next.js-specific imports inside `components/` or `hooks/`

---

## 14. Git Conventions

```
feat(chat): add MessageBubble wrapping ai-elements Message component
feat(api): add streamText route with Gemini Flash and rate limiter
refactor(store): narrow Redux to session slice only
feat(hooks): add useProtoChat with apiEndpoint prop and storage hydration
feat(animation): add GSAP clipPath expand and Framer Motion message animations
```
