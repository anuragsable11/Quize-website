# Quize-website

An interactive quiz web app built with plain HTML, CSS and JavaScript. Questions come from the [Open Trivia Database](https://opentdb.com/).

## Features

- Sign up / log in, or play as a guest (accounts live in the browser's `localStorage`)
- Choose the number of questions, category, difficulty and time per question
- Timed questions with a countdown beep, instant right/wrong feedback and a final score
- Scorecard with every attempt, best/average score and an improvement chart
- Edit profile: change your username and profile photo (photos are resized before saving)
- Light/dark theme toggle and an animated particle background

## Project structure

```
Quize-website/
├── index.html          # Quiz page (start screen, questions, results)
├── login.html          # Log in
├── signup.html         # Create an account
├── scorecard.html      # Score history and improvement chart
├── edit-profile.html   # Change username / profile photo
├── users.html          # Lists registered users (debug page, not linked from the app)
└── assets/
    ├── css/
    │   ├── styles.css        # Quiz page styles
    │   ├── auth.css          # Login and sign-up pages
    │   ├── scorecard.css
    │   ├── edit-profile.css
    │   └── users.css
    └── js/
        ├── storage.js        # Shared localStorage helpers (loaded on every page)
        ├── quiz.js           # Quiz logic: fetch questions, timer, scoring
        ├── theme.js          # Light/dark theme toggle
        ├── particles.js      # Animated background
        ├── login.js
        ├── signup.js
        ├── scorecard.js
        ├── edit-profile.js
        └── users.js
```

Each page loads `assets/js/storage.js` first, then its own script.

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
| `theme`           | `"light"` or `"dark"`                                           |

Scores of guests are saved under the name `Guest` and shown on the scorecard when nobody is logged in.

This is a front-end demo only. Passwords are stored in plain text in the browser, so don't use real ones.
