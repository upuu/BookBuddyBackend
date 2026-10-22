# BookBuddy Frontend

React 18 + Vite web client for BookBuddy (CST8515 – Group 4, client: ReadMore Inc.).

Plain CSS, no TypeScript, no UI libraries, no router (state-based navigation in `App.jsx`).

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Structure

```
src/
  main.jsx          entry point
  App.jsx           app state + simple page navigation
  styles.css        theme (CSS variables) + global styles
  api.js            single place for all data access (mock for now)
  assets/           logo.png
  components/       Nav, Cover, Stars
  pages/            Onboarding, Discover, BookDetail, Lists
```

The Flask backend runs separately on http://localhost:5000 (not touched by this app yet).
