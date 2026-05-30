# AI Chatbot — Design Spec
**Date:** 2026-05-28  
**Status:** Approved for implementation

---

## 1. Vision

### Now (this sprint)
An AI chat panel — powered by Claude Haiku — embedded as a centrepiece on the landing page and on all 5 guide pages. Users ask questions in plain English instead of reading. The chat is free to use; the wizard (€15) stays as the primary conversion CTA.

### Future (documented, not in scope now)
- **Wizard integration:** Conversational PDF generation — the AI asks the questions, user answers naturally, AI fills the form. No wizard steps, just a conversation that ends with a downloaded PDF.
- **Behördengänge platform:** Extend the same AI assistant to cover all German bureaucracy: Steuerliche Erfassung, Abmeldung, Elterngeld, Aufenthaltsgenehmigung, Rundfunkbeitrag, Gewerbeanmeldung. ReadyExpat becomes the AI guide for all of German bureaucratic life, not just Anmeldung.

---

## 2. Architecture

### API Route: `app/api/chat/route.ts`
- **Method:** POST
- **Body:** `{ messages: Array<{ role: "user" | "assistant", content: string }> }`
- **Returns:** Streamed text response (SSE / `ReadableStream`)
- **Model:** `claude-haiku-4-5` (fast, cheap, sufficient for FAQ-level answers)
- **Prompt caching:** System prompt marked with `cache_control: { type: "ephemeral" }` — cached for 5 minutes on Anthropic's side, ~80% cost reduction on repeat traffic
- **Rate limiting:** In-memory Map — 20 requests per IP per hour. Returns 429 with friendly message if exceeded.
- **No auth required** — free feature, no login

### System Prompt (built as a constant in the route)
Extracted plain-text knowledge base (~4,000 tokens) covering:
- All 20 FAQ Q&As (verbatim answers)
- Key facts from all 5 guides: deadlines, document requirements, appointment tips, Wohnungsgeberbestätigung rules, online registration eligibility
- Legal facts: §17 BMG (14-day rule, €1,000 fine), §19 BMG (landlord obligation)
- Product context: what ReadyExpat does, what it costs, privacy model

Ends with a soft CTA instruction:  
*"If the user seems ready to fill their form, mention they can use ReadyExpat at the top of the page. Never be pushy. One mention per conversation."*

### New env var
`ANTHROPIC_API_KEY` — added to `.env.local.example` and Vercel

---

## 3. UI Components

### `AmeldeChat` component (`app/components/AmeldeChat.tsx`)
Self-contained client component. Props:
- `context?: string` — which guide page is active (e.g. `"wohnungsgeberbestaetigung"`), used to prime the first message
- `compact?: boolean` — guide sidebar variant vs full landing page variant

State:
- `messages: Message[]` — conversation history, initialised with AI greeting
- `input: string` — current input value
- `loading: boolean` — streaming in progress
- `error: string | null`

Behaviour:
- Sends full message history to `/api/chat` on each submit
- Streams the response token by token into the last assistant message
- Capped at 10 turns (20 messages) — shows "Start a new conversation" link after cap
- Suggested question chips shown until user sends first message, then hidden
- `Enter` submits, `Shift+Enter` newline

### Landing page placement
New section between the stats strip and the guides section in `LandingPage.tsx`:
- Heading: "Got a question? Just ask."
- Subheading: "Instant answers about registration deadlines, documents, appointments — no reading required."
- Full-width `<AmeldeChat />` (max-width 640px, centred)
- "Powered by Claude AI" badge

### Guide page placement
Each of the 5 guide pages gets a prominent section at the **bottom of the main content** (above the FAQ accordion), titled "Still have a question?":
- `<AmeldeChat context="<guide-name>" compact />` 
- The `context` prop primes the greeting: *"I can see you're reading about [topic]. What would you like to know?"*

---

## 4. Streaming

Use the Anthropic SDK's streaming API:
```typescript
const stream = await anthropic.messages.stream({ ... });
// pipe through ReadableStream to the client
```
Client reads chunks via `fetch` + `response.body.getReader()`. Each chunk appends to the last assistant message in state. This gives the ChatGPT-style token-by-token feel.

---

## 5. Rate Limiting

```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
// 20 req / IP / hour, checked before hitting Anthropic API
```
On 429: return `{ error: "Too many questions! Come back in an hour." }`  
Friendly message shown inline in the chat bubble.

---

## 6. Cost

| Scenario | Per session | 1,000 sessions/month |
|---|---|---|
| Without caching | ~$0.006 | ~$6 |
| With prompt caching | ~$0.002 | ~$2 |

At 1 extra conversion per month from a user whose question got answered = €15 revenue vs ~$2 cost. ROI is immediate.

---

## 7. Files Changed / Created

| File | Action |
|---|---|
| `app/api/chat/route.ts` | **Create** — streaming chat API |
| `app/components/AmeldeChat.tsx` | **Create** — reusable chat component |
| `app/components/LandingPage.tsx` | **Edit** — add chat section between stats and guides |
| `app/what-is-anmeldung/page.tsx` | **Edit** — add `<AmeldeChat context="what-is-anmeldung" />` |
| `app/anmeldung-documents/page.tsx` | **Edit** — add chat section |
| `app/anmeldung-online-non-eu/page.tsx` | **Edit** — add chat section |
| `app/wohnungsgeberbestaetigung/page.tsx` | **Edit** — add chat section |
| `app/burgeramt-berlin-appointment/page.tsx` | **Edit** — add chat section |
| `.env.local.example` | **Edit** — add `ANTHROPIC_API_KEY` |
| `CLAUDE.md` | **Edit** — document new chatbot architecture |

---

## 8. Out of Scope (this sprint)

- Wizard integration (future vision)
- Conversation persistence across page reloads
- Admin analytics on chat queries
- Multilingual support
- Mobile-specific chat UI (full-screen modal)
