// App wiring: filter controls, hash routing, and rendering.
// The whole site runs from static files with no network request:
// deals live in data.js, filtering in filters.js, markup in views.js.
(function () {
  var filters = defaultFilters();
  var root = document.getElementById("app");

  function readHash() {
    var h = window.location.hash || "#/";
    var m = h.match(/^#\/deal\/([a-z0-9-]+)$/);
    return m ? m[1] : null;
  }

  function render() {
    var id = readHash();
    if (id) {
      var deal = null;
      for (var i = 0; i < DEALS.length; i++) {
        if (DEALS[i].id === id) deal = DEALS[i];
      }
      if (deal) {
        root.innerHTML = dealDetail(deal);
        document.title = deal.product + " — Black Friday Deal Finder";
        window.scrollTo(0, 0);
        return;
      }
    }
    var list = applyFilters(DEALS, filters);
    var stats = finderStats(DEALS);
    root.innerHTML =
      statsBar(stats) +
      '<p class="count">' +
      list.length +
      " of " +
      DEALS.length +
      " deals shown</p>" +
      dealGrid(list);
    document.title = "Black Friday Deal Finder 2026 — real deals, honestly checked";
    var clear = document.getElementById("clear-filters");
    if (clear) {
      clear.addEventListener("click", function () {
        filters = defaultFilters();
        syncControls();
        render();
      });
    }
  }

  function syncControls() {
    document.getElementById("q").value = filters.query;
    document.getElementById("category").value = filters.category;
    document.getElementById("store").value = filters.store;
    document.getElementById("min-discount").value = String(filters.minDiscount);
    document.getElementById("verdict").value = filters.verdict;
    document.getElementById("sort").value = filters.sort;
  }

  function fillSelect(id, values) {
    var el = document.getElementById(id);
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      el.appendChild(o);
    });
  }

  function presetsFromUrl() {
    // Shareable filtered views: ?category=TVs&minDiscount=50&sort=saving
    // lets a link open the finder already filtered, and gives the
    // screenshots a real filtered state to show.
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) filters.query = q;
    var cat = params.get("category");
    if (cat && (cat === "All" || CATEGORIES.indexOf(cat) !== -1)) {
      filters.category = cat;
    }
    var store = params.get("store");
    if (store && (store === "All" || STORES.indexOf(store) !== -1)) {
      filters.store = store;
    }
    var min = parseInt(params.get("minDiscount") || "", 10);
    if (!isNaN(min) && min >= 0 && min <= 90) filters.minDiscount = min;
    var verdict = params.get("verdict");
    if (verdict && ["All", "real", "good", "fair", "weak"].indexOf(verdict) !== -1) {
      filters.verdict = verdict;
    }
    var sort = params.get("sort");
    if (sort && ["discount", "saving", "priceAsc", "priceDesc", "name"].indexOf(sort) !== -1) {
      filters.sort = sort;
    }
  }

  function init() {
    presetsFromUrl();
    fillSelect("category", ["All"].concat(CATEGORIES));
    fillSelect("store", ["All"].concat(STORES));
    document.getElementById("q").addEventListener("input", function (e) {
      filters.query = e.target.value;
      render();
    });
    document.getElementById("category").addEventListener("change", function (e) {
      filters.category = e.target.value;
      render();
    });
    document.getElementById("store").addEventListener("change", function (e) {
      filters.store = e.target.value;
      render();
    });
    document.getElementById("min-discount").addEventListener("change", function (e) {
      filters.minDiscount = parseInt(e.target.value, 10) || 0;
      render();
    });
    document.getElementById("verdict").addEventListener("change", function (e) {
      filters.verdict = e.target.value;
      render();
    });
    document.getElementById("sort").addEventListener("change", function (e) {
      filters.sort = e.target.value;
      render();
    });
    window.addEventListener("hashchange", render);
    syncControls();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
