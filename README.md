# Xpenz

A personal finance tracker built with React. Track income, expenses, and transfers with category-based breakdowns and a dashboard summary.

## Features

- Sign up / log in
- Income, Expense, and Transfer tabs
- Category-based entries with color swatches
- Dashboard with charts and summary cards (Total Income, Total Expense, Savings, Outstanding Lending, Bank Balance)
- Transaction history
- Spending limit

## Tech stack

- React 18 (Create React App), React Router, styled-components
- Chart.js / react-chartjs-2
- axios, moment, react-datepicker

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create `.env` from the example and point it at your backend:

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

## Build

```bash
bun run build
```

## Docker

```bash
docker build -t xpenz .
docker run -p 3000:3000 xpenz
```
