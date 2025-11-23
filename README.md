# React Memory Card Game

A simple React memory card game built with Vite. Focuses on custom hooks, state management, testing, and CI/CD.

---

## Setup

1. Create project with Vite:

2. Clean unnecessary files.

3. Create `useGameLogic.js` to handle:

- Card shuffling
- Flipping and matching
- Score, moves, win detection

---

## Run the app

`npm run dev`

Open `http://localhost:5173`.

---

## Testing

Uses Vitest and `@testing-library/react`:

Tests cover:

- Hook initialization
- Card flipping
- Matching logic
- Preventing clicks while two cards are flipped

Wrap state updates in `act()` in tests. Practice recalling this step.

---

## CI/CD

GitHub Actions workflow runs on push:

- Checkout
- Install dependencies
- Run tests
- Build project

---

## Deployment

Deployed to Netlify:

- Public GitHub repo required for free plan
- Production URL: https://x-react-memory.netlify.app/

---
