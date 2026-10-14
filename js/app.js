// ─────────────────────────────────────────────────────────
//  CREAME – Catalogue renderer & order modal
// ─────────────────────────────────────────────────────────

const WA_BASE = `https://wa.me/${CREAME_CONFIG.whatsappNumber}`;

const SIZE_IMG_KEY = {
  "1kg": "default", "500g": "default", "all": "default",
  "bento": "bento", "mini": "mini",
  "cupcake": "cupcake", "quarter": "slice", "piece": "slice",
};

function getImage(cakeName, sizeKey) {
  const key = cakeName.trim().toLowerCase();
  const map = CREAME_CONFIG.cakeImages[key];
  if (!map) return CREAME_CONFIG.fallbackImage;
  const imgKey = SIZE_IMG_KEY[sizeKey || "all"] || "default";
  return map[imgKey] || map["default"] || CREAME_CONFIG.fallbackImage;
}

function getDescription(cakeName) {
  return CREAME_CONFIG.cakeDescriptions[cakeName.trim().toLowerCase()]
    || "A delicious handcrafted cake made fresh to order.";
}

function hasPrice(s) {
  return (s.withoutIcing && s.withoutIcing !== "-") || (s.withIcing && s.withIcing !== "-");
}

function lowestPrice(cake) {
  for (const s of Object.values(cake.sizes)) {
    const p = (s.withoutIcing && s.withoutIcing !== "-") ? s.withoutIcing : s.withIcing;
    if (p && p !== "-" && p !== "Contact us") return p;
  }
  return null;
}

// ── Google Sheets CSV parser (optional live-update) ────────
function parseCSV(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const cells = [];
    let inQ = false, cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cells.push(cell.trim()); cell = ""; }
      else { cell += ch; }
    }
    cells.push(cell.trim());
    rows.push(cells);
  }
  return rows;
}

function buildCakeMapFromCSV(rows) {
  const cakes = {};
  const blocks = {};
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = rows[r][c].toLowerCase();
      if (cell.includes("1 kg cake prices"))   blocks["1kg"]     = { c, r: r + 2 };
      if (cell.includes("500 g cake prices"))  blocks["500g"]    = { c, r: r + 2 };
      if (cell.includes("bento cake prices"))  blocks["bento"]   = { c, r: r + 2 };
      if (cell.includes("mini cake prices"))   blocks["mini"]    = { c, r: r + 2 };
      if (cell.includes("cupcake prices"))     blocks["cupcake"] = { c, r: r + 2 };
      if (cell.includes("cake pieces prices")) blocks["slice"]   = { c, r: r + 3 };
    }
  }
  const sizeLabels = {
    "1kg": "1 kg", "500g": "500 g", "bento": "Bento",
    "mini": "Mini", "cupcake": "Cupcake",
    "quarter": "Quarter Slab", "piece": "1 Piece",
  };
  for (const [sizeKey, { c, r: dataStart }] of Object.entries(blocks)) {
    for (let r = dataStart; r < rows.length; r++) {
      const name = rows[r][c];
      if (!name) break;
      const key = name.trim().toLowerCase();
      if (!cakes[key]) cakes[key] = { name: name.trim(), sizes: {} };
      if (sizeKey === "slice") {
        cakes[key].sizes["quarter"] = { label: sizeLabels["quarter"], withoutIcing: rows[r][c+1]||"-", withIcing: rows[r][c+2]||"-" };
        cakes[key].sizes["piece"]   = { label: sizeLabels["piece"],   withoutIcing: rows[r][c+3]||"-", withIcing: rows[r][c+4]||"-" };
      } else {
        cakes[key].sizes[sizeKey] = { label: sizeLabels[sizeKey], withoutIcing: rows[r][c+1]||"-", withIcing: rows[r][c+2]||"-" };
      }
    }
  }
  return cakes;
}

// ── Catalogue rendering ────────────────────────────────────
let allCakes = {};
let activeSize = "all";
let searchQuery = "";

function renderCatalogueCards(sizeFilter) {
  const grid = document.getElementById("catalogueGrid");
  if (!grid) return;
  grid.innerHTML = "";
  let count = 0;

  for (const [key, cake] of Object.entries(allCakes)) {
    if (searchQuery && !cake.name.toLowerCase().includes(searchQuery)) continue;
    const sizesToShow = (sizeFilter === "all"
      ? Object.entries(cake.sizes)
      : sizeFilter === "slice"
        ? Object.entries(cake.sizes).filter(([k]) => k === "quarter" || k === "piece")
        : Object.entries(cake.sizes).filter(([k]) => k === sizeFilter)
    ).filter(([, s]) => hasPrice(s));
    if (sizesToShow.length === 0) continue;

    // Pick image matching the active filter
    const imgSizeKey = sizeFilter === "all" ? "all" : sizesToShow[0][0];
    const img  = getImage(cake.name, imgSizeKey);
    const desc = getDescription(cake.name);
    const from = (() => {
      for (const [, s] of sizesToShow) {
        const p = (s.withoutIcing && s.withoutIcing !== "-") ? s.withoutIcing : s.withIcing;
        if (p && p !== "-") return p;
      }
      return null;
    })();

    grid.innerHTML += `
      <div class="cake-card">
        <div class="cake-img-wrap">
          <img src="${img}" alt="${cake.name}" loading="lazy"
               onerror="this.src='${CREAME_CONFIG.fallbackImage}'" />
        </div>
        <div class="cake-body">
          <h3 class="cake-name">${cake.name}</h3>
          <p class="cake-desc">${desc}</p>
          ${from ? `<p class="from-price">From <strong>${from}</strong></p>` : ""}
          <button class="btn-customize" onclick="openOrderModal('${key}', '${sizeFilter === 'all' ? '' : sizeFilter}')">
            Customize &amp; Order
          </button>
        </div>
      </div>`;
    count++;
  }

  if (count === 0) {
    grid.innerHTML = `<p class="no-results">No cakes found for this size. <a href="catalogue.html">View all</a></p>`;
  }
}

// ── Order Modal ────────────────────────────────────────────
function openOrderModal(cakeKey, preSelectSize) {
  const cake = allCakes[cakeKey];
  if (!cake) return;

  const modal     = document.getElementById("orderModal");
  const sizes     = Object.entries(cake.sizes).filter(([, s]) => hasPrice(s));

  modal.dataset.cakeKey = cakeKey;
  document.getElementById("modalCakeName").textContent = cake.name;
  document.getElementById("modalCakeDesc").textContent = getDescription(cake.name);
  document.getElementById("modalNotes").value = "";
  document.getElementById("modalInscription").value = "";
  document.getElementById("modalQty").textContent = "1";
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const dateInput = document.getElementById("modalDate");
  dateInput.value = "";
  dateInput.min = minDate.toISOString().split("T")[0];
  document.querySelectorAll(".topping-sel").forEach(t => t.classList.remove("selected"));
  document.querySelectorAll(".receiving-opt").forEach((b, i) => b.classList.toggle("active", i === 0));

  // Determine which size to pre-select
  let initIdx = 0;
  if (preSelectSize) {
    if (preSelectSize === 'slice') {
      const qi = sizes.findIndex(([k]) => k === 'quarter');
      initIdx = Math.max(0, qi !== -1 ? qi : sizes.findIndex(([k]) => k === 'piece'));
    } else {
      initIdx = Math.max(0, sizes.findIndex(([k]) => k === preSelectSize));
    }
  }

  // Size buttons
  const sizeWrap = document.getElementById("modalSizes");
  sizeWrap.innerHTML = sizes.map(([k, s], i) => `
    <button class="size-opt${i === initIdx ? " active" : ""}"
            data-size-key="${k}" data-label="${s.label}"
            data-no-icing="${s.withoutIcing}" data-with-icing="${s.withIcing}"
            onclick="selectSize(this)">
      ${s.label}
    </button>`).join("");

  // Set initial icing + image from pre-selected size
  updateIcingPanel(sizes[initIdx][1]);
  updateModalImage(cakeKey, sizes[initIdx][0]);

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectSize(btn) {
  document.querySelectorAll(".size-opt").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  updateIcingPanel({ withoutIcing: btn.dataset.noIcing, withIcing: btn.dataset.withIcing });
  updateModalImage(document.getElementById("orderModal").dataset.cakeKey, btn.dataset.sizeKey);
}

function updateModalImage(cakeKey, sizeKey) {
  const imgEl  = document.getElementById("modalImg");
  const imgMap = CREAME_CONFIG.cakeImages[cakeKey];
  if (!imgMap) { imgEl.src = CREAME_CONFIG.fallbackImage; return; }
  const imgKey = SIZE_IMG_KEY[sizeKey] || "default";
  imgEl.src = imgMap[imgKey] || imgMap["default"] || CREAME_CONFIG.fallbackImage;
}

function updateIcingPanel(s) {
  const wrap    = document.getElementById("modalIcing");
  const hasNo   = s.withoutIcing && s.withoutIcing !== "-";
  const hasWith = s.withIcing    && s.withIcing    !== "-";

  wrap.innerHTML = [
    hasNo   && `<button class="icing-opt" data-icing="without" data-price="${s.withoutIcing}" onclick="selectIcing(this)">
                  <span class="icing-label">Without Icing</span>
                  <span class="icing-price">${s.withoutIcing}</span>
                </button>`,
    hasWith && `<button class="icing-opt" data-icing="with" data-price="${s.withIcing}" onclick="selectIcing(this)">
                  <span class="icing-label">With Icing</span>
                  <span class="icing-price">${s.withIcing}</span>
                </button>`,
  ].filter(Boolean).join("");

  // Default: activate the last option (with icing preferred)
  const opts = wrap.querySelectorAll(".icing-opt");
  if (opts.length) opts[opts.length - 1].classList.add("active");
}

function selectIcing(btn) {
  document.querySelectorAll(".icing-opt").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function selectReceiving(btn) {
  document.querySelectorAll(".receiving-opt").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function changeQty(delta) {
  const el = document.getElementById("modalQty");
  el.textContent = Math.max(1, parseInt(el.textContent) + delta);
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("open");
  document.body.style.overflow = "";
}

function sendWhatsAppOrder() {
  const cakeKey  = document.getElementById("orderModal").dataset.cakeKey;
  const cake     = allCakes[cakeKey];
  const sizeBtn  = document.querySelector(".size-opt.active");
  const icingBtn = document.querySelector(".icing-opt.active");
  const receivingBtn = document.querySelector(".receiving-opt.active");
  const notes       = document.getElementById("modalNotes").value.trim();
  const inscription = document.getElementById("modalInscription").value.trim();
  const qty         = parseInt(document.getElementById("modalQty").textContent) || 1;
  const dateVal     = document.getElementById("modalDate").value;

  const toppings = [...document.querySelectorAll(".topping-sel.selected")]
    .map(t => t.dataset.name).join(", ");

  const size      = sizeBtn      ? sizeBtn.dataset.label          : "—";
  const icing     = icingBtn     ? (icingBtn.dataset.icing === "with" ? "With Icing" : "Without Icing") : "—";
  const price     = icingBtn     ? icingBtn.dataset.price          : "—";
  const receiving = receivingBtn ? receivingBtn.dataset.method     : "—";

  let dateStr = "";
  if (dateVal) {
    const d = new Date(dateVal + "T00:00:00");
    dateStr = d.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }

  let msg = `Hi Creame! I'd like to place an order:\n\n`;
  msg += `*Cake:* ${cake.name}\n`;
  msg += `*Size:* ${size}\n`;
  if (qty > 1)       msg += `*Quantity:* ${qty}\n`;
  msg += `*Icing:* ${icing}\n`;
  if (toppings)      msg += `*Toppings:* ${toppings}\n`;
  if (inscription)   msg += `*Personalized Icing Wording:* ${inscription}\n`;
  msg += `*Receiving Method:* ${receiving}\n`;
  if (dateStr)       msg += `*Expected Date:* ${dateStr}\n`;
  if (notes)         msg += `*Notes:* ${notes}\n`;
  msg += `\n*Price:* ${price}${qty > 1 ? " x " + qty : ""}\n\nThank you!`;

  const a = document.createElement("a");
  a.href = `${WA_BASE}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function filterBySearch(query) {
  searchQuery = query.trim().toLowerCase();
  renderCatalogueCards(activeSize);
}

// ── Filter tabs ────────────────────────────────────────────
function initFilterTabs(defaultSize) {
  activeSize = defaultSize;
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach(tab => {
    if (tab.dataset.size === defaultSize) {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    }
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeSize = tab.dataset.size;
      renderCatalogueCards(activeSize);
    });
  });
}

// ── Toppings ───────────────────────────────────────────────
const TOPPING_IMGS = {
  "whipped cream": "images/Toppings/Whipped cream.jpg",
  "nutella":       "images/Toppings/Nutella.jpg",
  "oreo":          "images/Toppings/Oreo.jpg",
  "mixed fruit":   "images/Toppings/Mixed fruit.jpg",
  "green grapes":  "images/Toppings/Green grapes.jpg",
  "pineapple":     "images/Toppings/Pineapple.jpg",
  "coconut":       "images/Toppings/Coconut.jpg",
  "blueberry":     "images/Toppings/Blueberries.jpg",
  "blueberries":   "images/Toppings/Blueberries.jpg",
  "cherry":        "images/Toppings/Cherries.jpg",
  "cherries":      "images/Toppings/Cherries.jpg",
  "strawberry":    "images/Toppings/Strawberries.jpg",
  "strawberries":  "images/Toppings/Strawberries.jpg",
  "nuts":          "images/Toppings/Nuts.jpg",
};

function buildToppingsFromCSV(rows) {
  for (const row of rows) {
    const cell = (row[0] || "").trim();
    if (cell.toLowerCase().startsWith("toppings:")) {
      return cell.replace(/^toppings:\s*/i, "")
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
        .map(name => ({ name, img: TOPPING_IMGS[name.toLowerCase()] || `images/Toppings/${name}.jpg` }));
    }
  }
  return null;
}

function buildToppingsGrid() {
  const grid = document.getElementById("modalToppings");
  if (!grid) return;
  grid.innerHTML = CREAME_CONFIG.toppings.map(t => `
    <button class="topping-sel" data-name="${t.name}" onclick="toggleTopping(this)">
      <img src="${t.img}" alt="${t.name}" />
      <span>${t.name}</span>
    </button>`).join("");
}

function toggleTopping(btn) { btn.classList.toggle("selected"); }

function buildHomeToppings() {
  const grid = document.getElementById("toppingsGrid");
  if (!grid) return;
  grid.innerHTML = CREAME_CONFIG.toppings.map(t =>
    `<div class="topping-card"><img src="${t.img}" alt="${t.name}" /><span>${t.name}</span></div>`
  ).join("");
}

// ── WhatsApp link injection ────────────────────────────────
function injectWhatsAppLinks() {
  document.querySelectorAll("a[href*='94XXXXXXXXX']").forEach(el => {
    el.href = el.href.replace("94XXXXXXXXX", CREAME_CONFIG.whatsappNumber);
  });
}

// ── Main init ──────────────────────────────────────────────
async function loadCatalogueData(defaultSize = "all") {
  // Always start with hardcoded data so the site works immediately
  allCakes = CAKE_DATA;

  const loader    = document.getElementById("loader");
  const errorEl   = document.getElementById("fetchError");
  const filterBar = document.getElementById("filterBar");
  const catalogue = document.getElementById("catalogue");

  if (loader)    loader.style.display = "none";
  if (errorEl)   errorEl.style.display = "none";
  if (filterBar) filterBar.style.display = "block";
  if (catalogue) catalogue.style.display = "block";

  buildToppingsGrid();
  initFilterTabs(defaultSize);
  renderCatalogueCards(defaultSize);

  // Optionally try to fetch live data from Google Sheets
  const url = CREAME_CONFIG.googleSheetCSV;
  if (url && !url.includes("YOUR_SHEET_ID")) {
    try {
      const res = await fetch(url + "&t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const rows = parseCSV(await res.text());
        const liveCakes = buildCakeMapFromCSV(rows);
        if (Object.keys(liveCakes).length > 0) {
          // Merge: fill any sizes missing from live data using hardcoded fallback
          for (const [key, cake] of Object.entries(CAKE_DATA)) {
            if (liveCakes[key]) {
              for (const [sizeKey, sizeData] of Object.entries(cake.sizes)) {
                if (!liveCakes[key].sizes[sizeKey]) {
                  liveCakes[key].sizes[sizeKey] = sizeData;
                }
              }
            }
          }
          allCakes = liveCakes;
          renderCatalogueCards(activeSize || defaultSize);
        }
        const liveToppings = buildToppingsFromCSV(rows);
        if (liveToppings && liveToppings.length > 0) {
          CREAME_CONFIG.toppings = liveToppings;
          buildToppingsGrid();
        }
      }
    } catch (_) {
      // Silent fail — hardcoded data already displayed
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectWhatsAppLinks();
  buildHomeToppings();

  // Live toppings update for home page
  if (document.getElementById("toppingsGrid")) {
    const url = CREAME_CONFIG.googleSheetCSV;
    if (url && !url.includes("YOUR_SHEET_ID")) {
      fetch(url + "&t=" + Date.now(), { cache: "no-store" })
        .then(r => r.ok ? r.text() : null)
        .then(text => {
          if (!text) return;
          const liveToppings = buildToppingsFromCSV(parseCSV(text));
          if (liveToppings && liveToppings.length > 0) {
            CREAME_CONFIG.toppings = liveToppings;
            buildHomeToppings();
          }
        })
        .catch(() => {});
    }
  }

  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", e => { if (e.target === modal) closeOrderModal(); });
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeOrderModal(); });
});
