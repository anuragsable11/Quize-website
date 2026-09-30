<p align="center">
  <img src="public/logo.svg" alt="Quizverse logo" width="72" height="72" />
</p>

# Quizverse

**A universe of trivia.** Timed multiple-choice quizzes across 17 categories, or on any topic you choose, with a scorecard that tracks your progress. Questions come from the [Open Trivia Database](https://opentdb.com/), or are written by AI through [Hugging Face](https://huggingface.co/docs/inference-providers).

## Features

- Play as a guest, or sign up / log in to keep scores under your name
- Choose category, difficulty, number of questions (5–50) and time per question (10–60 s)
- **AI quizzes on any topic:** type a topic ("Ancient Rome", "cricket", …) and the AI writes a fresh quiz of 5–20 questions
- Instant feedback after each question, and a full answer review at the end
- **Explain:** in the answer review, ask the AI why an answer is correct
- Keyboard shortcuts: <kbd>1</kbd>–<kbd>4</kbd> (or <kbd>A</kbd>–<kbd>D</kbd>) to choose, <kbd>Enter</kbd> to submit / continue
- Scorecard with quizzes played, average and best score, a score-history chart and every attempt
- Profile settings: change your name and photo (photos are cropped and resized before saving)
- Light and dark mode (follows your system setting by default), responsive down to phone width

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), built with [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components (Radix primitives)
- [React Router](https://reactrouter.com/) for pages, [Recharts](https://recharts.org/) (via shadcn charts) for the score history
- [lucide](https://lucide.dev/) icons, [Sonner](https://sonner.emilkowal.ski/) toasts, [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [Geist](https://vercel.com/font) font, self-hosted via Fontsource
- AI: [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers) (default model [`openai/gpt-oss-120b`](https://huggingface.co/openai/gpt-oss-120b)), called from [Vercel Functions](https://vercel.com/docs/functions) in `api/`

## Getting started

Requires Node.js 20.19+ or 22.12+ (a Vite 8 requirement).

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check and build to dist/
npm run preview   # serve the production build locally (without the AI features)
npm run lint      # lint with oxlint
```

### AI features

The AI features are for subscribers. There are no subscriptions yet, so for now they're locked: both are shown with a lock icon, and clicking them opens a "subscribe to unlock" dialog without calling the AI. To turn them on, set `AI_LOCKED` to `false` in `src/lib/ai.ts`.

When unlocked, the AI features need a Hugging Face access token. Everything else works without one.

1. Create a **fine-grained** token with the **Make calls to Inference Providers** permission at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
2. Put it in a `.env` file in the project root (see `.env.example`):

   ```bash
   HF_TOKEN=hf_...
   ```

3. Run `npm run dev`. The dev server runs the functions in `api/` and reads `.env`; editing `.env` takes effect without a restart.

The token is only used on the server. Don't rename it to `VITE_HF_TOKEN`: `VITE_` variables are bundled into the site where anyone can read them. To try a different model, set `HF_MODEL` to any chat model [served by Inference Providers](https://huggingface.co/models?inference_provider=all).

## Project structure

```
Quize-website/
├── index.html                 # HTML shell: title, meta tags, favicon
├── public/                    # Static files copied as-is (logo.svg, apple-touch-icon.png)
├── api/                       # Vercel Functions (server-side; they hold the Hugging Face token)
│   ├── generate.ts            #   POST /api/generate  writes an AI quiz on a topic
│   ├── explain.ts             #   POST /api/explain   explains why an answer is correct
│   └── _lib/hf.ts             #   Hugging Face client and shared helpers (not a function)
├── src/
│   ├── main.tsx               # Entry point: theme, auth and toast providers
│   ├── App.tsx                # Routes
│   ├── index.css              # Tailwind + shadcn theme (colours, radius, dark mode)
│   ├── pages/                 # One file per route
│   │   ├── home.tsx           #   /            landing page
│   │   ├── quiz.tsx           #   /quiz        quiz state machine (setup → questions → results)
│   │   ├── scorecard.tsx      #   /scorecard   stats, chart, attempts table
│   │   ├── profile.tsx        #   /profile     name and photo
│   │   ├── login.tsx          #   /login
│   │   ├── signup.tsx         #   /signup
│   │   └── not-found.tsx      #   any other URL
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (generated; update with `npx shadcn add`)
│   │   ├── layout/            # Site header, footer and page layout
│   │   ├── quiz/              # Quiz setup, question and results views
│   │   └── …                  # Logo, avatar, theme toggle, auth card/provider
│   ├── lib/
│   │   ├── storage.ts         # localStorage: accounts, session, scores
│   │   ├── trivia.ts          # Open Trivia DB client, categories, settings
│   │   ├── ai.ts              # Client for the AI endpoints in api/
│   │   ├── auth.ts            # Auth context and useAuth() hook
│   │   └── media.ts           # Photo resizing and the countdown tick sound
│   └── hooks/                 # Small shared hooks
├── components.json            # shadcn/ui configuration
├── .env.example               # Environment variables (copy to .env)
├── vercel.json                # Build settings, SPA routing and redirects for old .html URLs
└── vite.config.ts             # Also runs api/ in the dev server
```

## Deployment

The site is deployed on [Vercel](https://vercel.com/). Pushing to `main` triggers a new deployment, and `vercel.json` tells Vercel to:

- build with `npm run build` and serve the `dist/` folder,
- send every URL except `/api/…` to the app so client-side routes like `/quiz` work on refresh,
- permanently redirect the old static-site URLs (`/quiz.html`, `/login.html`, …) to the new routes.

Each file in `api/` is deployed as a serverless function. For the AI features to work in production, add `HF_TOKEN` (and optionally `HF_MODEL`) under **Project Settings → Environment Variables** in Vercel, then redeploy.

The AI endpoints are public, so anyone who finds them can spend your Hugging Face credits. They only accept quiz-shaped requests with length limits, not free-form prompts. Keep an eye on usage at [huggingface.co/settings/billing](https://huggingface.co/settings/billing).

## Data storage

There is no database. All data lives in the browser's `localStorage`, under the same keys as the original static site, so existing accounts and scores keep working:

| Key               | Contents                                                           |
| ----------------- | ------------------------------------------------------------------ |
| `users`           | Registered accounts (name, email, password, profile photo)         |
| `loggedInUser`    | Name of the logged-in user                                         |
| `loggedInEmail`   | Email of the logged-in user (used to match accounts and scores)    |
| `loggedInProfile` | Profile photo of the logged-in user                                |
| `scoreList`       | Every quiz result: name, email, score, category, difficulty, date |
| `theme`           | `"light"`, `"dark"` or `"system"`                                  |

Because everything is stored in the browser, accounts only exist on the device where they were created, and passwords are stored in plain text. Don't use a real password.

## Brand

- **Name:** Quizverse (one word, capital Q). **Tagline:** A universe of trivia.
- **Logo:** `public/logo.svg`, a "Q" drawn as an orbit ring with a satellite, on an indigo tile. In React use `<Logo />` or `<LogoMark />` from `src/components/logo.tsx`.
- **Font:** Geist.
- **Colours** (CSS variables in `src/index.css`; neutrals come from shadcn's neutral palette):

| Role    | Light                   | Dark                    | Variable      |
| ------- | ----------------------- | ----------------------- | ------------- |
| Primary | indigo-600 `#4F46E5`    | indigo-500 `#6366F1`    | `--primary`   |
| Success | emerald-600 `#059669`   | emerald-500 `#10B981`   | `--success`   |
| Error   | shadcn destructive red  | shadcn destructive red  | `--destructive` |

## Credits

Questions are provided by the [Open Trivia Database](https://opentdb.com/) under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) licence. AI quizzes and explanations are generated through [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers).
