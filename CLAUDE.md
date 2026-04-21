# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

No test runner or linter is configured.

## Environment

The API route requires `GROQ_API_KEY` in `.env.local`.

## Architecture

This is a **Next.js 16 App Router** application. The app is a single-page emotional belief-reframing tool:

1. User picks an emotion via a cover-flow carousel (`CoverFlowPicker`)
2. User types the limiting belief behind that emotion (`BeliefForm`)
3. The app POSTs to `/api/insight` which streams a reframed insight from the Groq API (`qwen/qwen3-32b`)
4. The streamed response is displayed live (`InsightDisplay`) and can be saved to localStorage
5. Saved entries are browsable at `/history` (`HistoryList`)

**Data flow:** All persistence is client-side `localStorage` via `lib/storage.ts`. There is no database or server-side storage. The only server-side code is the Route Handler at `app/api/insight/route.ts`.

**Streaming:** The route handler wraps the Groq SDK stream in a raw `ReadableStream` and strips `<think>…</think>` blocks (chain-of-thought output from the model) before forwarding chunks to the client. The client reads the stream with the Web Streams `ReadableStream` reader.

**State machine:** `app/page.tsx` drives the UI with an `AppStep` union type (`idle | emotion-selected | submitting | streaming | complete`) defined in `types/index.ts`.

**Styling:** Tailwind CSS v4 with a dark deep-space background set inline on `<body>` in `layout.tsx`. Animations use Framer Motion.

**Emotion catalog:** The 15 supported emotions with their Tailwind color classes live in `lib/emotions.ts`.
