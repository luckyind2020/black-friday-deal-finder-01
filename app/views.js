// Rendering for the finder: the deal grid and the per-deal detail page.
// All markup is built from the deal data; nothing is hard-coded HTML.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dealCard(deal) {
  const pct = discountOf(deal);
  const v = verdictOf(deal);
  const save = savingOf(deal);
  const lowest = deal.lowest
    ? '<span class="tag lowest">Lowest tracked</span>'
    : "";
  return (
    '<article class="card" data-id="' +
    escapeHtml(deal.id) +
    '">' +
    '<div class="card-top"><span class="store">' +
    escapeHtml(deal.store) +
    "</span>" +
    '<span class="cat">' +
    escapeHtml(deal.category) +
    "</span></div>" +
    '<h3><a href="#/deal/' +
    escapeHtml(deal.id) +
    '">' +
    escapeHtml(deal.product) +
    "</a></h3>" +
    '<div class="prices"><span class="sale">' +
    money(deal.sale) +
    '</span><span class="usual">' +
    money(deal.usual) +
    '</span><span class="pct">-' +
    pct +
    "%</span></div>" +
    '<p class="save">You save <strong>' +
    money(save) +
    "</strong></p>" +
    '<p class="verdict verdict-' +
    v.key +
    '">' +
    v.label +
    " · " +
    escapeHtml(verdictHint(deal)) +
    "</p>" +
    '<div class="card-foot">' +
    lowest +
    '<a class="btn" href="' +
    escapeHtml(deal.url) +
    '" target="_blank" rel="noopener">View at ' +
    escapeHtml(deal.store) +
    " ↗</a>" +
    "</div>" +
    '<p class="checked">Price checked ' +
    CHECKED_ON +
    "</p>" +
    "</article>"
  );
}

function dealGrid(deals) {
  if (!deals.length) {
    return (
      '<div class="empty"><h2>No deals match those filters</h2>' +
      "<p>Try a different search, a lower minimum discount, or clear the filters.</p>" +
      '<button class="btn" id="clear-filters">Clear all filters</button></div>'
    );
  }
  return '<div class="grid">' + deals.map(dealCard).join("") + "</div>";
}

function dealDetail(deal) {
  const pct = discountOf(deal);
  const v = verdictOf(deal);
  const save = savingOf(deal);
  const lowest = deal.lowest
    ? '<p class="tag lowest big">★ Lowest price our sources have tracked for this product</p>'
    : "";
  return (
    '<div class="detail">' +
    '<p><a class="back" href="#/">← All deals</a></p>' +
    '<div class="detail-head"><span class="store">' +
    escapeHtml(deal.store) +
    '</span><span class="cat">' +
    escapeHtml(deal.category) +
    "</span></div>" +
    "<h2>" +
    escapeHtml(deal.product) +
    "</h2>" +
    '<div class="detail-prices"><div><span class="lbl">Black Friday price</span><span class="sale big">' +
    money(deal.sale) +
    '</span></div><div><span class="lbl">Usual price</span><span class="usual big">' +
    money(deal.usual) +
    '</span></div><div><span class="lbl">Discount</span><span class="pct big">-' +
    pct +
    '%</span></div><div><span class="lbl">You save</span><span class="save big">' +
    money(save) +
    "</span></div></div>" +
    '<p class="verdict verdict-' +
    v.key +
    ' big">' +
    v.label +
    " — " +
    escapeHtml(verdictHint(deal)) +
    "</p>" +
    lowest +
    '<p class="note">' +
    escapeHtml(deal.note) +
    "</p>" +
    '<p class="source">Price source: ' +
    escapeHtml(deal.source) +
    ". Checked " +
    CHECKED_ON +
    ". Prices move fast on Black Friday — the store's page is the final word.</p>" +
    '<p><a class="btn big" href="' +
    escapeHtml(deal.url) +
    '" target="_blank" rel="noopener">View this deal at ' +
    escapeHtml(deal.store) +
    " ↗</a></p>" +
    "</div>"
  );
}

function statsBar(stats) {
  return (
    '<div class="stats">' +
    '<div><strong>' +
    stats.count +
    "</strong><span>deals checked</span></div>" +
    "<div><strong>" +
    stats.avgDiscount +
    "%</strong><span>average discount</span></div>" +
    "<div><strong>" +
    money(stats.topSaving) +
    "</strong><span>biggest single saving</span></div>" +
    "<div><strong>" +
    stats.realDeals +
    "</strong><span>real deals (50%+ off)</span></div>" +
    "</div>"
  );
}
