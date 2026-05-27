import { EXPENSE, INCOME, TRANSFER, getCategory } from "../../config/categories";

// Which summary field + catalog backs each transaction type.
export const BY_CATEGORY_KEY = {
  expense: "expenseByCategory",
  income: "incomeByCategory",
  transfer: "transferByCategory",
};

export const CATALOG = { expense: EXPENSE, income: INCOME, transfer: TRANSFER };

export const TYPE_LABELS = {
  expense: "Expense",
  income: "Income",
  transfer: "Transfer (out)",
};

// Distinct colors for the per-cycle (month) grouping in the bar chart.
export const MONTH_PALETTE = [
  "#4F8DF4",
  "#E8836B",
  "#6AA84F",
  "#F6B26B",
  "#9FA8DA",
  "#C27BA0",
  "#76A5AF",
  "#FFD966",
  "#B45F06",
  "#7ED1D7",
  "#A4C2F4",
  "#D5A6BD",
];

// Gather the categories that actually appear (non-zero) across the summaries
// for a given type, ordered by the catalog then any extras (e.g. carry-over).
export function collectCategories(summaries, type) {
  const key = BY_CATEGORY_KEY[type];
  const present = new Set();
  summaries.forEach((s) => {
    const map = s?.[key] || {};
    Object.keys(map).forEach((catId) => {
      if (map[catId]) present.add(catId);
    });
  });

  const order = CATALOG[type].map((c) => c.id);
  const sorted = [...present].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return sorted.map((id) => {
    const cat = getCategory(type, id);
    return { id, label: cat.label, color: cat.color };
  });
}

// Sum a category's value across all summaries for a type.
export function sumByCategory(summaries, type) {
  const key = BY_CATEGORY_KEY[type];
  const totals = {};
  summaries.forEach((s) => {
    const map = s?.[key] || {};
    Object.entries(map).forEach(([catId, val]) => {
      totals[catId] = (totals[catId] || 0) + (val || 0);
    });
  });
  return totals;
}

export function categoryValue(summary, type, catId) {
  return summary?.[BY_CATEGORY_KEY[type]]?.[catId] || 0;
}
