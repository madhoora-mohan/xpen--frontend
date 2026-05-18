# Xpenz

A personal finance tracker built with React. Log income, expenses, and transfers across categories, set a spending limit, and see everything roll up on a dashboard.

## Features

- Email/password sign up and login
- Income, Expense, and Transfer entries with category icons and color swatches
- Dashboard with charts and summary cards: Total Income, Total Expense, Savings, Outstanding Lending, Bank Balance
- Transaction history per category
- Configurable spending limit with email alerts via SMTP.js
- Responsive layout with a collapsible left nav on mobile

## Tech stack

- React 18 (Create React App), React Router 6, styled-components
- Chart.js / react-chartjs-2 for visualizations
- axios for the backend API, moment for dates, react-datepicker for pickers
- @emailjs/browser + SMTP.js for spending-limit alerts

## Requirements

- Node.js 24.x (see `engines` in `package.json`)
- [Bun](https://bun.sh) for install/build scripts
- A running Xpenz backend exposing the `/api/v1`, `/api/auth`, and `/api/users` routes

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Copy `.env.example` to `.env` and fill in your backend + SMTP details:

   ```env
   REACT_APP_API_BASE_URL=https://your-backend/api/v1/
   REACT_APP_AUTH_URL=https://your-backend/api/auth
   REACT_APP_USERS_URL=https://your-backend/api/users
   REACT_APP_SMTP_TOKEN=your-smtpjs-secure-token
   REACT_APP_SMTP_FROM=alerts@example.com
   ```

3. Start the dev server:

   ```bash
   bun start
   ```

   App runs at <http://localhost:3000>.

## Scripts

| Command          | What it does                                |
| ---------------- | ------------------------------------------- |
| `bun start`      | Start the CRA dev server on port 3000       |
| `bun run build`  | Production build into `build/`              |
| `bun test`       | Run the Jest / React Testing Library suite  |

## Project layout

```
src/
  App.jsx              Routes + top-level layout
  Components/          Dashboard, Income, Expenses, Transfers, Navigation, etc.
  context/             AuthContext (login state) and globalContext (API + data)
  config/categories.js Income / expense categories and colors
  utils/               Currency, date, icon, and menu helpers
  styles/              Shared styled-components layout
docs/                  Design notes (JWT auth plan, future TODOs)
```

## Deploying to Vercel

- Build command: `bun run build`
- Output directory: `build`
- Add every `REACT_APP_*` variable from `.env` to the project's Environment Variables.
