import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    /* surfaces */
    --bg-deep: #0b0d10;
    --bg-app: rgb(26, 30, 35);
    --bg-surface: rgb(32, 38, 44);
    --bg-inset: rgb(45, 51, 58);
    --bg-inset-2: rgb(56, 62, 70);
    --bg-overlay: rgba(11, 13, 16, 0.78);

    /* lines */
    --line: rgba(255, 255, 255, 0.08);
    --line-strong: rgba(255, 255, 255, 0.14);
    --line-focus: rgba(255, 255, 255, 0.45);

    /* text */
    --fg: #ffffff;
    --fg-muted: rgba(255, 255, 255, 0.62);
    --fg-faint: rgba(255, 255, 255, 0.4);

    /* accents */
    --accent-income: #42AD00;
    --accent-expense: rgb(232, 60, 50);
    --accent-balance: #6fa8dc;
    --accent-lending: #ff8b8b;
    --accent-savings: #ffffff;
    --accent-warn: #f5a623;

    /* radii */
    --r-xs: 6px;
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 16px;
    --r-xl: 20px;
    --r-pill: 999px;

    /* spacing */
    --s-1: 4px;
    --s-2: 8px;
    --s-3: 12px;
    --s-4: 16px;
    --s-5: 20px;
    --s-6: 24px;
    --s-8: 32px;
    --s-10: 40px;

    /* shadows */
    --shadow-card: 0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 8px 24px rgba(0, 0, 0, 0.25);
    --shadow-pop: 0 12px 40px rgba(0, 0, 0, 0.55);

    /* layout */
    --nav-w: 256px;
    --topbar-h: 56px;

    /* legacy aliases (retained for any older component reference) */
    --primary-color: #ffffff;
    --color-green: #42AD00;
    --color-grey: rgba(255, 255, 255, 0.6);
    --color-accent: #000000;
    --color-delete: rgb(232, 60, 50);
  }

  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
    background: var(--bg-deep);
    color: var(--fg);
    font-size: 15px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  button, input, select, textarea {
    font-family: inherit;
    color: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--fg);
    margin: 0;
  }

  p {
    margin: 0;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .num {
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) opacity(0.6);
    cursor: pointer;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* dark theming for react-datepicker so it matches the new palette */
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    width: 100%;
  }
  .react-datepicker {
    font-family: inherit;
    background: var(--bg-inset);
    border: 1px solid var(--line-strong);
    color: var(--fg);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-pop);
  }
  .react-datepicker__header {
    background: var(--bg-inset-2);
    border-bottom: 1px solid var(--line);
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker-time__header {
    color: var(--fg);
  }
  .react-datepicker__day:hover {
    background: var(--bg-inset-2);
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: var(--accent-income);
    color: #0b0d10;
  }
  .react-datepicker__triangle {
    display: none;
  }

  .error {
    color: var(--accent-expense);
    font-weight: 600;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 899px) {
    .page-title, .page-sub {
      display: none;
    }
  }
`;
