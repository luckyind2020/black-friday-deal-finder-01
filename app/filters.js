// Filtering, sorting and the honest-deal verdict for the finder.
// The verdict is computed from the numbers alone, never written by hand:
// a big cut on a real list price is a real deal, a small cut is not,
// and the site says so even when the discount looks tempting.
function discountOf(deal) {
  if (!deal.usual || deal.usual <= 0) return 0;
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

function savingOf(deal) {
  return Math.max(0, deal.usual - deal.sale);
}

function verdictOf(deal) {
  const pct = discountOf(deal);
  if (pct >= 50) return { key: "real", label: "Real deal", rank: 3 };
  if (pct >= 30) return { key: "good", label: "Good deal", rank: 2 };
  if (pct >= 15) return { key: "fair", label: "Fair deal", rank: 1 };
  return { key: "weak", label: "Weak deal", rank: 0 };
}

function verdictHint(deal) {
  const pct = discountOf(deal);
  if (pct >= 50) return "Half price or better — a genuine Black Friday cut.";
  if (pct >= 30) return "A solid cut on a real list price.";
  if (pct >= 15) return "A real discount, but not a doorbuster.";
  return "Barely a cut — only worth it if you were buying it anyway.";
}

function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Default filter state: everything, sorted by biggest discount first.
function defaultFilters() {
  return {
    query: "",
    category: "All",
    store: "All",
    minDiscount: 0,
    verdict: "All",
    sort: "discount",
  };
}

function applyFilters(deals, f) {
  const q = f.query.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (discountOf(d) < f.minDiscount) return false;
    if (f.verdict !== "All" && verdictOf(d).key !== f.verdict) return false;
    if (q) {
      const hay = (d.product + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    discount: (a, b) => discountOf(b) - discountOf(a) || savingOf(b) - savingOf(a),
    saving: (a, b) => savingOf(b) - savingOf(a),
    priceAsc: (a, b) => a.sale - b.sale,
    priceDesc: (a, b) => b.sale - a.sale,
    name: (a, b) => a.product.localeCompare(b.product),
  };
  out.sort(by[f.sort] || by.discount);
  return out;
}

function finderStats(deals) {
  if (!deals.length) {
    return { count: 0, avgDiscount: 0, topSaving: 0, realDeals: 0 };
  }
  const totalPct = deals.reduce((s, d) => s + discountOf(d), 0);
  const topSaving = Math.max.apply(null, deals.map(savingOf));
  const realDeals = deals.filter((d) => verdictOf(d).key === "real").length;
  return {
    count: deals.length,
    avgDiscount: Math.round(totalPct / deals.length),
    topSaving: topSaving,
    realDeals: realDeals,
  };
}
