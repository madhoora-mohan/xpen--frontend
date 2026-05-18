const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export const formatRupee = (amount) => `₹ ${formatter.format(amount || 0)}`;
