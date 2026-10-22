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

## Accessibility notes (Step 7 audit)

Target: **WCAG 2.1 AA**.

- **Text contrast:** every text pairing passes 4.5:1 (body navy/white 14.9:1, muted 6.4:1, blue links/buttons 6.05:1, navy/yellow chips 11.1:1, gold stars 6.25:1, all book-cover pairs 6.05–11.3:1).
- **Focus:** global 3px focus-visible ring (5.5–6:1 against page backgrounds); inputs additionally switch to a blue border on focus.
- **Touch targets:** all interactive controls are ≥44px (primary/buy buttons 48px).
- **Semantics:** `lang="en"`, one h1 per page, no heading-level skips, `nav`/`main` landmarks, real `<button>`/`<a>`/`<select>` elements everywhere, `aria-pressed` on toggle chips, `aria-current="page"` in nav, `aria-label`s that include book titles on Move to/Remove/cover buttons, `role="status"` loading messages, `aria-describedby` on the Post review button, decorative covers `aria-hidden`.
- **Reflow/responsive:** nav wraps on narrow screens; book-detail columns stack below 800px; the card grid collapses 4→1 columns.
- **Known, accepted deviation:** input borders use the spec'd token `--field #8FA9B8` — measured 2.46:1 vs white and 2.24:1 vs sky, below the 3:1 of WCAG 1.4.11. Decision (Varun, Step 7 review): keep the theme token as designed; this note documents it for the Milestone 3 accessibility report. Inputs stay identifiable through their bold labels, placeholder text, and blue focus border.
- **State contrast:** selected chips carry a 2px navy border alongside the yellow fill so the selected state clears 3:1.
