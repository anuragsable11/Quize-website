<p align="center">
  <img src="assets/img/logo.svg" alt="Quizverse logo" width="96" height="96" />
</p>

# Quizverse

**A universe of trivia.** An interactive quiz website built with plain HTML, CSS and JavaScript. Questions come from the [Open Trivia Database](https://opentdb.com/).

## Features

- Landing page with a quick overview and a one-click start
- Sign up / log in, or play as a guest (accounts live in the browser's `localStorage`)
- Choose the number of questions, category, difficulty and time per question
- Timed questions with a countdown beep, instant right/wrong feedback and a final score
- Scorecard with every attempt, best/average score and an improvement chart
- Edit profile: change your username and profile photo (photos are resized before saving)
- Shared navigation bar on every page, with a light/dark theme toggle that's remembered

## Pages

| Page                | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `index.html`        | Landing page (opens first when deployed)                  |
| `quiz.html`         | Set up and play a quiz                                    |
| `login.html`        | Log in                                                    |
| `signup.html`       | Create an account                                         |
| `scorecard.html`    | Score history, stats and improvement chart                |
| `edit-profile.html` | Change username / profile photo                           |
| `users.html`        | Lists registered users (debug page, not linked from the app) |

## Project structure

```
Quize-website/
├── index.html, quiz.html, login.html, signup.html,
│   scorecard.html, edit-profile.html, users.html
└── assets/
    ├── img/
    │   ├── logo.svg              # Logo mark, also used as the favicon
    │   └── apple-touch-icon.png  # 180×180 home-screen icon for phones
    ├── css/
    │   ├── base.css          # Design tokens, dark mode, nav bar, cards, footer (every page)
    │   ├── landing.css
    │   ├── quiz.css
    │   ├── auth.css          # Login and sign-up pages
    │   ├── scorecard.css
    │   ├── edit-profile.css
    │   └── users.css
    └── js/
        ├── storage.js        # Shared localStorage helpers (every page, in <head>)
        ├── theme.js          # Light/dark theme (every page, in <head>)
        ├── nav.js            # Renders the shared navigation bar (every page)
        ├── particles.js      # Animated background (landing hero and quiz page)
        ├── landing.js
        ├── quiz.js           # Quiz logic: fetch questions, timer, scoring
        ├── login.js
        ├── signup.js
        ├── scorecard.js
        ├── edit-profile.js
        └── users.js
```

Every page loads Bootstrap, then `base.css`, then its own stylesheet; and `storage.js` + `theme.js` in the `<head>`, then `nav.js` + its own script at the end of `<body>`.

## Brand

- **Name:** Quizverse (one word, capital Q). In the wordmark, "verse" is set in the accent pink.
- **Tagline:** A universe of trivia.
- **Logo:** `assets/img/logo.svg`, a planet with an orbit ring and a question mark. It works on light, dark and gradient backgrounds, so don't put it on a coloured tile.
- **Font:** [Poppins](https://fonts.google.com/specimen/Poppins), weights 400–700.
- **Colours** (defined as CSS variables in `assets/css/base.css`):

| Role      | Hex       | Variable             |
| --------- | --------- | -------------------- |
| Primary   | `#1A237E` | `--brand-primary`    |
| Secondary | `#6A1B9A` | `--brand-secondary`  |
| Accent    | `#FF4081` | `--brand-accent`     |
| Highlight | `#FFD54F` | star in the logo     |

The site-wide gradient runs from primary to secondary (`--brand-gradient`).

## Running locally

No build step or install is needed.

- Open `index.html` directly in your browser, or
- Serve the folder with any static server, for example:

  ```bash
  npx serve .
  # or
  python -m http.server 8000
  ```

An internet connection is required: questions are fetched from opentdb.com, and Bootstrap, Font Awesome, Chart.js and the Poppins font load from CDNs. The trivia API allows one request every 5 seconds per IP address; the app shows a message if you start quizzes faster than that.

## Data storage

All data lives in the browser's `localStorage` under these keys:

| Key               | Contents                                                        |
| ----------------- | --------------------------------------------------------------- |
| `users`           | Registered accounts (name, email, password, profile image)      |
| `loggedInUser`    | Name of the logged-in user                                      |
| `loggedInEmail`   | Email of the logged-in user (used to match accounts and scores) |
| `loggedInProfile` | Profile image of the logged-in user                             |
| `scoreList`       | Every quiz result: name, email, score, category, difficulty, date |
| `theme`           | `"light"` or `"dark"` (defaults to your system setting)         |

Scores of guests are saved under the name `Guest` and shown on the scorecard when nobody is logged in.

This is a front-end demo only. Passwords are stored in plain text in the browser, so don't use real ones.
