<p align="center">
  <img src="public/logo.svg" alt="Quizverse logo" width="72" height="72" />
</p>

# Quizverse

**A universe of trivia.** Timed multiple-choice quizzes across 17 categories, with a scorecard that tracks your progress. Questions come from the [Open Trivia Database](https://opentdb.com/).

## Features

- Play as a guest, or sign up / log in to keep scores under your name
- Choose category, difficulty, number of questions (5–50) and time per question (10–60 s)
- Instant feedback after each question, and a full answer review at the end
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

## Getting started

Requires Node.js 20.19+ or 22.12+ (a Vite 8 requirement).

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check and build to dist/
npm run preview   # serve the production build locally
npm run lint      # lint with oxlint
```

## Project structure

```
Quize-website/
├── index.html                 # HTML shell: title, meta tags, favicon
├── public/                    # Static files copied as-is (logo.svg, apple-touch-icon.png)
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
│   │   ├── auth.ts            # Auth context and useAuth() hook
│   │   └── media.ts           # Photo resizing and the countdown tick sound
│   └── hooks/                 # Small shared hooks
├── components.json            # shadcn/ui configuration
├── vercel.json                # Build settings, SPA routing and redirects for old .html URLs
└── vite.config.ts
```

## Deployment

The site is deployed on [Vercel](https://vercel.com/). Pushing to `main` triggers a new deployment, and `vercel.json` tells Vercel to:

- build with `npm run build` and serve the `dist/` folder,
- send every URL to the app so client-side routes like `/quiz` work on refresh,
- permanently redirect the old static-site URLs (`/quiz.html`, `/login.html`, …) to the new routes.

## Data storage

There is no backend. All data lives in the browser's `localStorage`, under the same keys as the original static site, so existing accounts and scores keep working:

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

Questions are provided by the [Open Trivia Database](https://opentdb.com/) under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) licence.
