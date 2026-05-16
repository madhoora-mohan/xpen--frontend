# Xpenz

A personal expense tracker built with React. Sign up, log your income and expenses, set a spending limit, and visualize where your money goes with charts and a transaction history.

## Features

- Sign up / log in
- Add and delete income entries
- Add and delete expense entries
- Set a spending limit
- Dashboard with charts (powered by Chart.js)
- Transaction history

## Tech stack

- React 18 (Create React App)
- React Router
- styled-components
- Chart.js / react-chartjs-2
- axios
- moment, react-datepicker
- EmailJS (optional, for email alerts)

## Prerequisites

- Node.js 18+ (or [Bun](https://bun.sh))
- A running backend that exposes the auth/user/expense API the app talks to

## Setup

1. Clone the repo and install dependencies:

   ```bash
   # with npm
   npm install

   # or with bun
   bun install
   ```

2. Create a `.env` file in the project root by copying the example:

   ```bash
   cp .env.example .env
   ```

   Then fill in the values to point at your backend:

   ```env
   REACT_APP_API_BASE_URL=https://your-backend.example.com/api/v1/
   REACT_APP_AUTH_URL=https://your-backend.example.com/api/auth
   REACT_APP_USERS_URL=https://your-backend.example.com/api/users
   REACT_APP_SMTP_TOKEN=your-smtpjs-secure-token
   REACT_APP_SMTP_FROM=alerts@example.com
   ```

## Running

Start the dev server:

```bash
npm start
```

The app runs at <http://localhost:3000>.

## Building for production

```bash
npm run build
```

The bundled output is written to `build/` and can be served by any static host.

## Running with Docker

A `Dockerfile` is included:

```bash
docker build -t xpenz .
docker run -p 3000:3000 xpenz
```

## Project structure

```
src/
  App.js
  Components/      # Login, Signup, Dashboard, Income, Expenses, Charts, etc.
  context/         # global state (globalContext.js)
  History/         # transaction history
  styles/
  utils/
  img/
public/            # static assets and index.html
```

## Scripts

- `npm start` — run the dev server
- `npm run build` — production build
- `npm test` — run tests
