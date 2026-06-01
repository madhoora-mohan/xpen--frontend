import {
  breakfast,
  lunch,
  dinner,
  snacks,
  food,
  transport,
  rent,
  rentBills,
  outing,
  clothing,
  gadgets,
  gift,
  medical,
  household,
  sports,
  other,
  money,
  tag,
  trend,
  card,
  handOut,
  handIn,
  piggy,
  swap,
} from "../utils/Icons";

export const EXPENSE = [
  { id: "breakfast", label: "Breakfast", color: "#4285F4", icon: breakfast },
  { id: "lunch", label: "Lunch", color: "#FFE599", icon: lunch },
  { id: "dinner", label: "Dinner", color: "#0B5394", icon: dinner },
  { id: "snacks", label: "Snacks", color: "#93C47D", icon: snacks },
  { id: "groceries", label: "Groceries", color: "#C27BA0", icon: food },
  { id: "transport", label: "Transport", color: "#F6B26B", icon: transport },
  { id: "rent", label: "Rent", color: "#CC4125", icon: rent },
  { id: "utilities", label: "Utilities", color: "#E69138", icon: rentBills },
  { id: "outing", label: "Outing & Entertainment", color: "#D9D9D9", icon: outing },
  { id: "clothing", label: "Clothing", color: "#EAD1DC", icon: clothing },
  { id: "accessories", label: "Accessories & Gadgets", color: "#A4C2F4", icon: gadgets },
  { id: "gifts", label: "Gifts & Treats", color: "#FFD966", icon: gift },
  { id: "health", label: "Health", color: "#B3CEFB", icon: medical },
  { id: "household", label: "Household Items", color: "#B45F06", icon: household },
  { id: "sports", label: "Sports and Fitness", color: "#6AA84F", icon: sports },
  { id: "misc", label: "Miscellaneous", color: "#7ED1D7", icon: other },
];

export const INCOME = [
  { id: "salary", label: "Salary", color: "#38761D", icon: money },
  { id: "bonus", label: "Bonus", color: "#F6B26B", icon: trend },
  { id: "reimbursements", label: "Reimbursements", color: "#93C47D", icon: card },
  { id: "offers", label: "Cashback/offers", color: "#76A5AF", icon: tag },
  { id: "others", label: "Others", color: "#B7B7B7", icon: other },
];

export const TRANSFER = [
  { id: "lending_money", label: "Lending Money", color: "#CC0000", icon: handOut, defaultDirection: "out" },
  { id: "lent_money", label: "Lent Money", color: "#6FA8DC", icon: handIn, defaultDirection: "in" },
  { id: "investments", label: "Investments & Savings", color: "#38761D", icon: piggy, defaultDirection: "out" },
  { id: "type_conversion", label: "Type Conversion", color: "#999999", icon: swap, defaultDirection: "out" },
];

// Server-generated transfer category — not user-selectable but can appear in
// cycle data (e.g. the carry-over transfer created on opening a new cycle).
export const SPECIAL_TRANSFER = {
  carry_over_bank_balance: {
    id: "carry_over_bank_balance",
    label: "Carry-over",
    color: "#9FA8DA",
    icon: money,
  },
};

const indexBy = (list) => Object.fromEntries(list.map((c) => [c.id, c]));

const BY_TYPE = {
  income: indexBy(INCOME),
  expense: indexBy(EXPENSE),
  transfer: { ...indexBy(TRANSFER), ...SPECIAL_TRANSFER },
};

const FALLBACK = { color: "#888", icon: other, label: "Unknown" };

export const getCategory = (type, id) => BY_TYPE[type]?.[id] ?? FALLBACK;
