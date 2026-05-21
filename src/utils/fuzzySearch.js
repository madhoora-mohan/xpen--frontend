/**
 * Fuzzy match: every character in `query` must appear in `target`
 * in the same order, but not necessarily adjacent.
 * e.g. "gnb" matches "Gym bag" — case-insensitive.
 */
export function fuzzyMatch(query, target) {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = (target || "").toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}
