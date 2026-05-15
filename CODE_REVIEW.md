# Code Review — xpen Frontend

Reviewed on: 2026-05-15  
Scope: All source files under `src/`

---

## Summary

The app is a personal finance tracker built with React, styled-components, axios, and Chart.js. It is broadly functional but contains **two critical security issues that must be fixed before the app is used by anyone**, several bugs that cause crashes or infinite loops under normal use, and a number of maintainability problems.

Issues are grouped by severity: **Critical → High → Medium → Low**.

---

## Critical

### 1. Hardcoded third-party secret token in source code

**File:** `src/Components/Expenses/ExpenseForm.js:43–45`

```js
window.Email.send({
  SecureToken: "8d1d2a07-af18-472b-a490-3cd0d83c0978",
  From: "madhooramohan.s2003@gmail.com",
  ...
})
```

**Why it is bad:**  
This token authenticates your app with the SMTP.js email service. It is now embedded permanently in git history and visible to anyone who clones the repository or views the built JS bundle. An attacker can send unlimited emails charged to your account, or use it to send phishing emails appearing to come from you. The developer's personal email address is also exposed as PII.

**How to fix:**  
Move email sending to a backend endpoint. The frontend calls `POST /api/send-alert` and the server holds the secret. Alternatively, if a backend route is not feasible, store the token in a `.env` file as `REACT_APP_SMTP_TOKEN`, add `.env` to `.gitignore`, and access it via `process.env.REACT_APP_SMTP_TOKEN` — but note that `REACT_APP_` variables are still embedded in the built bundle, so they are not fully secret. A backend endpoint is the only truly safe solution.

---

### 2. Hardcoded production API URL in source code (three separate locations)

**Files:**  
- `src/context/globalContext.js:4`  
- `src/Components/Login/index.jsx:16`  
- `src/Components/Signup/index.jsx:23`  
- `src/Components/Navigation/Navigation.js:26,35`

```js
const BASE_URL = "https://xpens.onrender.com/api/v1/";
const url = "https://xpens.onrender.com/api/auth";
```

**Why it is bad:**  
The URL is repeated in four places. Changing the backend URL (e.g. moving to a different host, adding a staging environment, or running locally) requires hunting down every occurrence and risks missing one. It also means a developer who clones the repo and runs it locally will hit the production database by default.

**How to fix:**  
Create a `.env` file at the project root:

```
REACT_APP_API_BASE_URL=https://xpens.onrender.com/api/v1/
REACT_APP_AUTH_URL=https://xpens.onrender.com/api
```

Reference them as `process.env.REACT_APP_API_BASE_URL`. A `.env.local` or `.env.development` can point to localhost for local development, and `.env.production` to the live URL. Add `.env` (but not `.env.example`) to `.gitignore`.

---

## High

### 3. Two `useEffect` hooks with no dependency array — infinite API request loop

**File:** `src/Components/Navigation/Navigation.js:24–43`

```js
useEffect(() => {
  axios.get("https://xpens.onrender.com/api/v1/" + `get-incomes/${emailid}`)
    .then((res) => { setSheetData(res.data); });
}); // ← no [] dependency array

useEffect(() => {
  axios.get("https://xpens.onrender.com/api/v1/" + `get-expenses/${emailid}`)
    .then((res) => { setSheetData({ ...sheetData.concat(res.data) }); });
}); // ← no [] dependency array
```

**Why it is bad:**  
A `useEffect` with no second argument runs after *every single render*. The first effect calls `setSheetData`, which causes a re-render. That re-render triggers both effects again, which call `setSheetData` again, causing another re-render, and so on forever. This fires hundreds of API calls per second, hammering the backend and eventually crashing the browser tab.

**How to fix:**  
Add an empty dependency array `[]` to run only once on mount:

```js
useEffect(() => {
  axios.get(`${BASE_URL}get-incomes/${emailid}`).then((res) => {
    setSheetData(res.data);
  });
}, [emailid]);
```

The second effect also has a secondary bug (see item 4 below).

---

### 4. `sheetData.concat()` called when `sheetData` is `null` — runtime crash

**File:** `src/Components/Navigation/Navigation.js:38`

```js
const [sheetData, setSheetData] = useState(null);
// ...
setSheetData({ ...sheetData.concat(res.data) }); // sheetData is null!
```

**Why it is bad:**  
`sheetData` is initialised to `null`. `null.concat(...)` throws `TypeError: sheetData.concat is not a function`, crashing the navigation bar on load. Even if the first effect ran first and set `sheetData` to the income array, there is no guarantee of ordering because both effects are asynchronous.

**How to fix:**  
Initialise `sheetData` to an empty array, collect both responses, and merge them after both settle:

```js
const [sheetData, setSheetData] = useState([]);

useEffect(() => {
  Promise.all([
    axios.get(`${BASE_URL}get-incomes/${emailid}`),
    axios.get(`${BASE_URL}get-expenses/${emailid}`),
  ]).then(([incomeRes, expenseRes]) => {
    setSheetData([...incomeRes.data, ...expenseRes.data]);
  });
}, [emailid]);
```

---

### 5. `Math.min` / `Math.max` with spread on empty arrays — crash and wrong display

**File:** `src/Components/Dashboard/Dashboard.js:75–83`

```js
<p>₹{Math.min(...incomes.map((item) => item.amount))}</p>
<p>₹{Math.max(...incomes.map((item) => item.amount))}</p>
<p>₹{Math.min(...expenses.map((item) => item.amount))}</p>
<p>₹{Math.max(...expenses.map((item) => item.amount))}</p>
```

**Why it is bad:**  
When `incomes` or `expenses` is an empty array (new user, or data still loading), this spreads an empty list into `Math.min()`, which returns `Infinity`, and `Math.max()`, which returns `-Infinity`. Those values are displayed to the user. On very large datasets, spreading thousands of values onto the call stack can also cause a "Maximum call stack size exceeded" crash.

**How to fix:**  
Guard with a length check and use `Math.min`/`Math.max` with `reduce` or a conditional:

```js
const minIncome = incomes.length ? Math.min(...incomes.map(i => i.amount)) : 0;
const maxIncome = incomes.length ? Math.max(...incomes.map(i => i.amount)) : 0;
```

---

### 6. `err.response.data.message` accessed without null check — crash on network failure

**File:** `src/context/globalContext.js:23,53`

```js
.catch((err) => {
  setError(err.response.data.message); // err.response may be undefined
});
```

**Why it is bad:**  
When the backend is unreachable (no internet, server down, CORS error), `err.response` is `undefined`. Accessing `.data.message` on it throws another error inside the catch handler, which propagates silently and leaves the user with a frozen form and no error message.

**How to fix:**  
```js
.catch((err) => {
  setError(err.response?.data?.message ?? "Something went wrong. Please try again.");
});
```

---

### 7. `handleExport` mutates state objects directly

**File:** `src/Components/Navigation/Navigation.js:52–58`

```js
const handleExport = () => {
  let data = Object.values(sheetData);
  data.forEach((d) => {
    delete d.email;   // mutates the original object in sheetData
    delete d.__v;
    delete d.createdAt;
    delete d.updatedAt;
  });
```

**Why it is bad:**  
`Object.values()` returns references to the same objects stored in `sheetData`. Calling `delete d.email` removes the `email` field from the object that is also referenced by the component's state. After exporting, every transaction displayed in the UI will be missing its email field. React may not re-render because the state reference did not change, leaving the UI in a corrupted state.

**How to fix:**  
Make shallow copies of each object before deleting fields:

```js
const handleExport = () => {
  const data = sheetData.map(({ email, __v, createdAt, updatedAt, ...rest }) => rest);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "MySheet");
  XLSX.writeFile(wb, `${username} Data ${Date()}.xlsx`);
};
```

---

## Medium

### 8. `setError` called in the component render body — potential infinite re-render

**File:** `src/Components/Balance/Limit.js:56–58`

```js
// This runs during every render, outside any hook or event handler:
if (inputState.limit < 0) {
  setError("Limit must be a positive number!");
}
```

**Why it is bad:**  
Calling `setError` in the component body (not inside a `useEffect` or event handler) means that every time the component renders, if `limit < 0`, React updates state, which triggers another render, which calls `setError` again. This is an infinite render loop. React will eventually throw an error but the UI will freeze first.

**How to fix:**  
Move validation inside `handleSubmit`:

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  if (parseInt(inputState.limit, 10) <= 0) {
    setError("Limit must be a positive number!");
    return;
  }
  // ... rest of submit logic
};
```

---

### 9. Misleading variable names throughout `globalContext.js`

**File:** `src/context/globalContext.js:49,70–73,87`

```js
// Function is for adding EXPENSES, parameter is named 'income':
const addExpense = async (income) => { ... }

// Function calculates EXPENSES, local variable is named 'totalIncome':
const totalExpenses = () => {
  let totalIncome = 0;
  expenses.forEach((income) => {   // 'income' iterating over expenses
    totalIncome = totalIncome + income.amount;
  });
  return totalIncome;
};

// Same in expCat:
expenses.forEach((income) => { ... })
```

**Why it is bad:**  
Any developer reading this code (including the original author six months later) will be confused about whether a function deals with incomes or expenses. The variable names are actively lying about what the code does. This is a maintenance hazard — it makes it easy to accidentally use the wrong variable when modifying logic.

**How to fix:**  
Rename parameters and local variables to match what they actually represent:

```js
const addExpense = async (expense) => { ... }

const totalExpenses = () => {
  let total = 0;
  expenses.forEach((expense) => {
    total += expense.amount;
  });
  return total;
};
```

---

### 10. `console.log` statements left in production code

**Files:**
- `src/Components/Login/index.jsx:19` — `console.log(res)`
- `src/Components/Signup/index.jsx:26` — `console.log(res.message)`

**Why it is bad:**  
Logging the raw API response object in Login means the JWT token (`res.data`) and user email/username are printed to the browser console. Any browser extension, browser history, or screenshot that captures the console will leak authentication credentials.

**How to fix:**  
Delete both `console.log` calls. The many `// console.log(...)` comments throughout the codebase should also be removed — they add visual noise and suggest code that was debugged but never cleaned up.

---

### 11. `window.location = "/"` used instead of React Router's `navigate`

**File:** `src/Components/Login/index.jsx:23`

```js
window.location = "/";
```

**Why it is bad:**  
This does a full browser page reload, throwing away all React state, re-downloading the entire bundle, and triggering a flash of the loading screen. The `navigate` hook from React Router is the correct tool — it performs a client-side navigation instantly with no reload, and it integrates with the router's history stack so the back button works correctly.

**How to fix:**  
```js
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
// ...
navigate("/");
```

---

### 12. `getLimit()` called on every keystroke in the expense form

**File:** `src/Components/Expenses/ExpenseForm.js:28`

```js
const handleInput = (name) => (e) => {
  setInputState({ ...inputState, [name]: e.target.value });
  setError("");
  getLimit(); // makes an HTTP GET on every keypress
};
```

**Why it is bad:**  
Every character the user types in any field of the expense form fires an HTTP request to `GET /api/v1/get-limit/:email`. Typing a 10-character title fires 10 GET requests. This is unnecessary network load and will cause rate-limit errors with backends that enforce them.

**How to fix:**  
Call `getLimit()` once in a `useEffect` on mount:

```js
useEffect(() => {
  getLimit();
}, []);
```

---

### 13. `type="Number"` (capital N) on amount input — invalid HTML attribute value

**File:** `src/Components/Expenses/ExpenseForm.js:81`

```jsx
<input type="Number" ... />
```

**Why it is bad:**  
HTML attribute values are case-sensitive. `type="Number"` is not a valid input type; the browser falls back to `type="text"`, meaning the field accepts any string, not just numbers. Users can type letters into the amount field. The income form uses the correct lowercase `type="number"`, which is inconsistent.

**How to fix:**  
Change `type="Number"` to `type="number"`.

---

### 14. Missing closing parenthesis in `bg` prop on Button components

**Files:** `src/Components/Form/Form.js:116`, `src/Components/Expenses/ExpenseForm.js:141`, `src/Components/Balance/Limit.js:91`

```jsx
bg={"var(--color-accent"}   // missing closing )
```

**Why it is bad:**  
The CSS variable reference is malformed — it is missing its closing `)`. This means `background` is set to the literal broken string `var(--color-accent` and the button renders without a background colour.

**How to fix:**  
```jsx
bg={"var(--color-accent)"}
```

---

### 15. No loading state during API calls — stale or missing UI feedback

**Files:** `globalContext.js`, `Dashboard.js`, `Income.js`, `Expenses.js`

`getIncomes`, `getExpenses`, and `getLimit` make async network calls but there is no loading indicator and no guard against rendering before data arrives. `Dashboard.js` and the list pages render immediately with empty arrays, so the "Min/Max income" display shows `Infinity`/`-Infinity` for a moment (or crashes, per item 5), and charts render with no data.

**How to fix:**  
Add a loading flag to the context:

```js
const [loading, setLoading] = useState(false);

const getIncomes = async () => {
  setLoading(true);
  const response = await axios.get(`${BASE_URL}get-incomes/${emailid}`);
  setIncomes(response.data);
  setLoading(false);
};
```

Conditionally render a spinner or skeleton in components while `loading` is true.

---

### 16. Savings limit check uses wrong comparison direction in `handleSubmit`

**File:** `src/Components/Balance/Limit.js:34–38`

```js
if (totalBalance() < limit) {
  setError("Your Savings are dropping below your set Limit!!");
}
```

**Why it is bad:**  
This check compares the *current* balance against the *new* limit the user just typed. The error fires when the current balance is already below the new limit — but then `updateLimit` is called anyway (lines 45–50), so the limit is saved despite the warning. The user can dismiss the error and the new limit is set regardless. The intent seems to be to warn the user that their current balance is already below what they want to set, but the error message says "dropping below" (implying it's worsening), which is misleading. The condition and the response need to be clarified.

---

### 17. `transactionHistory()` hard-coded to return only 3 items with no explanation

**File:** `src/context/globalContext.js:185`

```js
return history.slice(0, 3);
```

**Why it is bad:**  
The magic number `3` is unexplained. If someone changes the UI to show 5 recent transactions, they have to know to look in `globalContext.js` and change this number. It should be a named constant or a parameter.

---

## Low

### 18. Entirely duplicate styled component between `Form.js` and `ExpenseForm.js`

**Files:** `src/Components/Form/Form.js:123–203`, `src/Components/Expenses/ExpenseForm.js:148–228`

The two `FormStyled` / `ExpenseFormStyled` components are **identical** — same CSS, same property names, same values.

**Why it is bad:**  
Any style change (e.g. fixing a bug, adjusting spacing) must be made in two files. If one file is updated and the other is not, the two forms look different.

**How to fix:**  
Extract to a shared file, e.g. `src/Components/Form/SharedFormStyled.js`, and import it in both components.

---

### 19. `expCat` and `incCat` are verbose if-else chains; should be lookup maps

**File:** `src/context/globalContext.js:78–157`

Both functions use 8-branch if-else chains to accumulate amounts per category.

**Why it is bad:**  
Adding a new category requires writing a new variable declaration, a new else-if branch, and adding the variable to the return array — and doing it in two places. The position in the returned array is implicit (position 0 = education, etc.), which is fragile.

**How to fix:**  

```js
const expCat = () => {
  const totals = { education: 0, groceries: 0, health: 0, subscriptions: 0,
                   takeaways: 0, shopping: 0, travelling: 0, other: 0 };
  expenses.forEach(({ category, amount }) => {
    if (category in totals) totals[category] += amount;
  });
  return Object.values(totals);
};
```

---

### 20. Wrong icon for "travelling" expense category

**File:** `src/Components/IncomeItem/IncomeItem.js:74`

```js
case "travelling":
  return freelance; // globe/world icon, but this is the freelance icon
```

**Why it is bad:**  
The `freelance` icon is a globe icon that was repurposed. The icon is semantically incorrect for travelling and shares its visual representation with the "freelancing" income category, confusing users who see the same icon for two different categories.

**How to fix:**  
Add a dedicated travel icon (e.g. a plane or car) to `Icons.js` and use it here.

---

### 21. `xlsx` installed from a non-npm CDN URL

**File:** `package.json:29`

```json
"xlsx": "https://cdn.sheetjs.com/xlsx-0.19.1/xlsx-0.19.1.tgz"
```

**Why it is bad:**  
Installing packages via direct CDN URLs bypasses npm's integrity checking. If the CDN is compromised or the URL is changed to point to malicious code, your users run that code. The SheetJS package was removed from npm due to a license dispute; the CDN URL is controlled by a third party and can serve any code without npm audit being able to flag it.

**How to fix:**  
Either lock the package to a specific verified release using the tarball's checksum in your lockfile (which `npm install` manages if you commit `package-lock.json`), or evaluate whether the export feature justifies this dependency — a simple CSV export would eliminate the dependency entirely.

---

### 22. `net` package listed as a frontend dependency

**File:** `package.json:17`

```json
"net": "^1.0.2"
```

**Why it is bad:**  
`net` is a Node.js built-in module for TCP networking. It has no meaning in a browser context. The `net` package on npm is a stub/shim that prints a deprecation warning. It adds dead weight to the bundle and signals confusion between browser and Node.js code.

**How to fix:**  
Remove it from `package.json`.

---

### 23. `smtpjs` package is effectively abandoned

**File:** `package.json:27`

```json
"smtpjs": "^0.0.1"
```

The package is version `0.0.1` and has not been updated in years. The actual usage is via `window.Email.send()` which relies on a global injected by a CDN script tag (not via this npm package), making the npm dependency meaningless.

**How to fix:**  
Remove `smtpjs` from `package.json`. If the email feature is moved to the backend (as recommended in item 1), neither the npm package nor the CDN script is needed.

---

### 24. `LeftNav.jsx` imported and styled but never used

**Files:** `src/App.js:13`, `src/Components/Navigation/LeftNav.jsx`

```js
// import LeftNav from "./Components/Navigation/LeftNav";
```

The import is commented out, `LeftNav.jsx` is never rendered, and `StyledLeftNav` in `App.js` duplicates what `LeftNav.jsx` was meant to do.

**How to fix:**  
Delete `LeftNav.jsx`. The hamburger menu is already implemented inline via `StyledLeftNav` in `App.js`. Keeping a dead file causes confusion about whether it should be used.

---

### 25. Extensive commented-out code throughout the codebase

Commented-out `console.log` calls, unused variables, disabled attributes, and dead JSX appear in every file:

- `globalContext.js` lines 13–14, 31, 61, 163, 171–172, 205
- `Dashboard.js` lines 20–21, 28–32, 322–326
- `Navigation.js` lines 11, 44–48, 59
- `Form.js` lines 25, 100–102
- `Limit.js` lines 12, 29, 41–44
- `ExpenseForm.js` lines 29, 34–35
- `IncomeItem.js` lines 82, 132–133

**Why it is bad:**  
Commented-out code makes it harder to read the actual logic, raises questions about whether it will be needed again, and bloats files. Version control exists to preserve old code — if it is deleted, `git log` can recover it.

**How to fix:**  
Delete all commented-out code. Keep the repository's history as the archive.

---

### 26. Dockerfile sets `WORKDIR /` — root of the container filesystem

**File:** `Dockerfile:4`

```dockerfile
WORKDIR /
COPY . ./
```

**Why it is bad:**  
Setting the working directory to `/` means application files are copied directly into the container's root filesystem, mixing with system directories like `/bin`, `/etc`, and `/lib`. This is a container hygiene and potential security risk.

**How to fix:**  
```dockerfile
WORKDIR /app
COPY . .
```

---

### 27. Dockerfile runs `npm start` (development server) for production

**File:** `Dockerfile:14`

```dockerfile
RUN npm run build
CMD [ "npm", "start" ]
```

`npm run build` creates a production build in `/build`, but `npm start` starts the Create React App *development* server, which serves from `src/`, not from the built `build/` directory. The production build is never actually served.

**How to fix:**  
Serve the static build using a lightweight server:

```dockerfile
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
```

Or use a multi-stage build with nginx.

---

### 28. `stocks` income category icon uses the `users` icon — wrong mapping

**File:** `src/Components/IncomeItem/IncomeItem.js:44–45`

```js
case "stocks":
  return users;  // a person/group icon, not a stock/chart icon
```

The stocks category shows the `users` icon (a person silhouette), which has no semantic connection to stocks. This appears to be a leftover from copy-paste.

---

### 29. Inconsistent file extensions (`.js` vs `.jsx`)

Components containing JSX use both `.js` and `.jsx` interchangeably:

- `.jsx`: `Home.jsx`, `Login/index.jsx`, `Signup/index.jsx`, `LeftNav.jsx`, `PieChart.jsx`, `ExpenseBar.jsx`, `IncomeBar.jsx`
- `.js` with JSX: `Navigation.js`, `Dashboard.js`, `Income.js`, `Expenses.js`, `Form.js`, `ExpenseForm.js`, `Limit.js`

**How to fix:**  
Pick one convention (`.jsx` for files containing JSX is the more expressive choice) and apply it consistently. The functional difference is nil in CRA, but consistency helps tooling (linters, editor plugins) and communicates intent to readers.

---

### 30. No form input validation beyond HTML `required`

**Files:** `Form.js`, `ExpenseForm.js`, `Signup/index.jsx`

Fields like `amount` have no frontend validation to prevent zero or negative values, `title` has no length limit, and `date` can be left empty (it defaults to `""`, not a `Date` object, when typed manually).

**How to fix:**  
Add validation in the `handleSubmit` before calling the API:

```js
if (!title.trim()) return setError("Title is required.");
if (!amount || Number(amount) <= 0) return setError("Amount must be greater than zero.");
if (!date) return setError("Date is required.");
if (!category) return setError("Category is required.");
```

For more complex validation, a library like Zod or Yup integrates well with React forms.

---

## Architecture Notes (Not Defects, But Worth Considering)

**Authentication model:**  
The current approach stores a JWT token in `localStorage`. This is readable by any JavaScript on the page, making it vulnerable to XSS. A more secure pattern is to have the backend set the token in an `httpOnly` cookie (not readable by JavaScript) and have the frontend omit the `Authorization` header entirely. The backend sets and reads the cookie. This is a larger architectural change and requires backend cooperation.

**State management via `emailid` from `localStorage`:**  
Every API call in `globalContext.js` fetches `emailid` from `localStorage` at module load time (line 16, outside any function). If the value changes (e.g. after login/logout without a full page reload), the stale email is used for all subsequent API calls. Move `const emailid = localStorage.getItem("email")` inside each function, or better, derive it from the authenticated user state.

**No React error boundary:**  
If any chart component or data fetching throws an uncaught error, the entire app unmounts and the user sees a blank white screen with no message. Wrapping major sections in `<ErrorBoundary>` components gives users a fallback UI and keeps the rest of the app functional.

**No tests:**  
The testing dependencies (`@testing-library/react`, `@testing-library/jest-dom`) are installed but there are zero test files. The most valuable tests to add first would be for `globalContext.js` functions (`totalIncome`, `totalExpenses`, `expCat`) since they contain logic bugs (see items 8, 9) and are pure functions that are easy to unit test.

---

## Quick-Fix Priority Order

| # | File | Fix |
|---|------|-----|
| 1 | `ExpenseForm.js:43` | Remove hardcoded SMTP secret token |
| 2 | `globalContext.js:4`, `Login:16`, `Signup:23`, `Navigation:26,35` | Replace all hardcoded URLs with env variable |
| 3 | `Navigation.js:24,33` | Add `[]` dependency arrays to both `useEffect` hooks |
| 4 | `Navigation.js:19,38` | Initialise `sheetData` to `[]`, fix `.concat` usage |
| 5 | `Navigation.js:52–58` | Stop mutating state objects in `handleExport` |
| 6 | `Dashboard.js:75–83` | Guard `Math.min`/`Math.max` against empty arrays |
| 7 | `globalContext.js:23,53` | Add null checks on `err.response` in catch blocks |
| 8 | `Limit.js:56–58` | Move `setError` call into `handleSubmit`, not render body |
| 9 | `globalContext.js` | Rename `income` parameters in expense functions |
| 10 | `ExpenseForm.js:81` | Fix `type="Number"` → `type="number"` |
| 11 | `Form.js:116`, `ExpenseForm.js:141`, `Limit.js:91` | Fix `var(--color-accent` → `var(--color-accent)` |
| 12 | `Login/index.jsx:19`, `Signup/index.jsx:26` | Remove `console.log` calls |
| 13 | `Login/index.jsx:23` | Replace `window.location = "/"` with `navigate("/")` |
| 14 | `ExpenseForm.js:28` | Move `getLimit()` out of input handler, into `useEffect` |
| 15 | `Dockerfile` | Fix `WORKDIR /` → `WORKDIR /app`; serve built output not dev server |
