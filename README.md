# Xpenz

A personal finance tracker built with React. Log income, expenses, and transfers across categories inside budget **cycles**, and see everything roll up on a live dashboard.

## Features

- Email/password sign up and login
- **Cycles** — all data is scoped to a cycle (monthly period); the app is gated until a first cycle is created; widgets on the dashboard show cycle progress
- Income, Expense, and Transfer entries with category icons and color swatches
- Dashboard with summary cards (Total Income, Total Expense, Savings, Bank Balance) and a chart breakdown
- Transaction history per category with fuzzy search
- **Expense Pattern** — cross-cycle comparison charts and insights
- **Monthly Insights** — per-cycle spending breakdown
- Real-time updates via Server-Sent Events (changes made on another tab/device reflect immediately)
- PWA — installable on Android and iOS directly from the browser (no third-party app needed)
- Responsive layout with a collapsible left nav and floating action button on mobile

## Tech stack

- React 18 (Create React App), React Router 6, styled-components
- Chart.js / react-chartjs-2 for visualizations
- axios for API calls, moment for dates, react-datepicker for pickers
- Native `EventSource` for SSE live updates

## Requirements

- Node.js 24.x (see `engines` in `package.json`)
- [Bun](https://bun.sh) for install/build/run
- A running Xpenz backend exposing `/api/v1`, `/api/auth`, and `/api/users`

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a `.env` file in the project root:

   ```env
   REACT_APP_API_BASE_URL=https://your-backend/api/v1/
   REACT_APP_AUTH_URL=https://your-backend/api/auth
   REACT_APP_USERS_URL=https://your-backend/api/users
   ```

3. Start the dev server:

   ```bash
   bun start
   ```

   App runs at <http://localhost:3000>.

## Scripts

| Command         | What it does                               |
| --------------- | ------------------------------------------ |
| `bun start`     | Start the CRA dev server on port 3000      |
| `bun run build` | Production build into `build/`             |
| `bun test`      | Run the Jest / React Testing Library suite |

## Project layout

```
src/
  App.jsx                  Routes, SSE setup, top-level shell
  Components/
    Auth/                  Shared auth guards
    Dashboard/             Dashboard view + cycle widgets
    Cycles/                FirstCycleGate, StartNextCycle
    Income/                Income list + form
    Expenses/              Expense list + form
    Transfers/             Transfer list + form
    ExpensePattern/        Cross-cycle comparison charts and insights
    Insight/               Monthly breakdown insight
    Navigation/            Left nav (desktop) + drawer (mobile)
    Form/                  Shared entry form component
    Chart/                 Shared chart wrapper
    FAB/                   Global floating action button
    EmptyState/            Empty state illustrations
    Spinner/               Loading spinner
    ErrorBoundary/         Top-level error boundary
    Home.jsx               Landing / unauthenticated home
    Login/  Signup/        Auth screens
  context/
    AuthContext.js         Login state + session management
    globalContext.js       All API calls + shared data state
  config/
    categories.js          Income / expense categories, colors, icons
  utils/
    currency.js            Currency formatting
    dateFormat.js          Date helpers
    fuzzySearch.js         Client-side fuzzy search
    Icons.jsx              Icon map
    menuItems.js           Nav menu definitions
  styles/
    GlobalStyle.js         Global CSS reset + base styles
    Layouts.js             Shared styled-components layout primitives
docs/
  FUTURE_TODOS.md          Deferred feature notes
  JWT_AUTH_PLAN.md         Auth design notes
public/
  manifest.json            PWA manifest (name, icons, theme color)
  sw.js                    Service worker for PWA install support
```

## Deploying to Vercel

- Build command: `bun run build`
- Output directory: `build`
- Add every `REACT_APP_*` variable from `.env` to the project's Environment Variables
- `vercel.json` already rewrites all routes to `index.html` for client-side routing

## Installing as an app (PWA)

The app is a fully configured Progressive Web App. On Android, open it in Chrome and tap **"Add to Home Screen"** — it installs like a native app with no browser chrome.

To generate a signed APK for sideloading or Google Play, deploy the site to its live HTTPS URL and run it through [PWABuilder](https://pwabuilder.com).
