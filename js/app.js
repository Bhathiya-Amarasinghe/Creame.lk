// ─────────────────────────────────────────────────────────
//  CREAME – Catalogue loader, renderer & order modal
// ─────────────────────────────────────────────────────────

const WA_BASE = `https://wa.me/${CREAME_CONFIG.whatsappNumber}`;

// Map size key → image key in cakeImages
const SIZE_IMG_KEY = {
  "1kg": "default", "500g": "default", "all": "default",
  "bento": "bento", "mini": "mini",
  "cupcake": "cupcake", "quarter": "slice", "piece": "slice",
};

function getImage(cakeName, sizeKey = "all") {
  const key = cakeName.trim().toLowerCase();
  const map = CREAME_CONFIG.cakeImages[key];
  if (!map) return CREAME_CONFIG.fallbackImage;
  const imgKey = SIZE_IMG_KEY[sizeKey] || "default";
  return map[imgKey] || map.default || CREAME_CONFIG.fallbackImage;
}

function getDescription(cakeName) {
  return CREAME_CONFIG.cakeDescriptions[cakeName.trim().toLowerCase()]
    || "A delicious handcrafted cake made fresh to order.";
}

function lowestPrice(cake) {
  for (const s of Object.values(cake.sizes)) {
    const p = s.withoutIcing !== "-" ? s.withoutIcing : s.withIcing;
    if (p && p !== "-") return p;
  }
  return null;
}

// ── CSV Parser ─────────────────────────────────────────────
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

// ── Build cake data map ────────────────────────────────────
function buildCakeMap(rows) {
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
      if (cell.includes("cake pieces prices")) blocks["slice"]   = { c, r: r + 2 };
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
        cakes[key].sizes["quarter"] = {
          label: sizeLabels["quarter"],
          withoutIcing: rows[r][c + 1] || "-",
          withIcing:    rows[r][c + 2] || "-",
        };
        cakes[key].sizes["piece"] = {
          label: sizeLabels["piece"],
          withoutIcing: rows[r][c + 3] || "-",
          withIcing:    rows[r][c + 4] || "-",
        };
      } else {
        cakes[key].sizes[sizeKey] = {
          label: sizeLabels[sizeKey],
          withoutIcing: rows[r][c + 1] || "-",
          withIcing:    rows[r][c + 2] || "-",
        };
      }
    }
  }
  return cakes;
}

// ── Catalogue cards ────────────────────────────────────────
let allCakes = {};
let activeSize = "all";

function renderCatalogueCards(sizeFilter) {
  const grid = document.getElementById("catalogueGrid");
  if (!grid) return;
  grid.innerHTML = "";
  let count = 0;

  for (const [, cake] of Object.entries(allCakes)) {
    const sizesToShow = sizeFilter === "all"
      ? Object.entries(cake.sizes)
      : Object.entries(cake.sizes).filter(([k]) => k === sizeFilter);
    if (sizesToShow.length === 0) continue;

    // Image matches the active size filter
    const imgSizeKey = sizeFilter === "all" ? "all" : sizesToShow[0][0];
    const img  = getImage(cake.name, imgSizeKey);
    const desc = getDescription(cake.name);
    const from = lowestPrice(cake);
    const key  = cake.name.trim().toLowerCase();

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
          <button class="btn-customize" onclick="openOrderModal('${key}')">
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
function openOrderModal(cakeKey) {
  const cake = allCakes[cakeKey];
  if (!cake) return;

  const modal     = document.getElementById("orderModal");
  const sizes     = Object.entries(cake.sizes);
  const firstSize = sizes[0];

  // Reset state
  modal.dataset.cakeKey = cakeKey;
  document.getElementById("modalCakeName").textContent = cake.name;
  document.getElementById("modalCakeDesc").textContent = getDescription(cake.name);
  document.getElementById("modalNotes").value = "";
  document.querySelectorAll(".topping-sel").forEach(t => t.classList.remove("selected"));

  // Size options
  const sizeWrap = document.getElementById("modalSizes");
  sizeWrap.innerHTML = sizes.map(([k, s], i) => `
    <button class="size-opt ${i === 0 ? "active" : ""}"
            data-size-key="${k}" data-label="${s.label}"
            data-no-icing="${s.withoutIcing}" data-with-icing="${s.withIcing}"
            onclick="selectSize(this)">
      ${s.label}
    </button>`).join("");

  // Icing + price (from first size)
  updateIcingPanel(firstSize[0], firstSize[1]);

  // Modal image
  const imgKey = SIZE_IMG_KEY[firstSize[0]] || "default";
  const imgMap = CREAME_CONFIG.cakeImages[cakeKey];
  document.getElementById("modalImg").src = imgMap
    ? (imgMap[imgKey] || imgMap.default || CREAME_CONFIG.fallbackImage)
    : CREAME_CONFIG.fallbackImage;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectSize(btn) {
  document.querySelectorAll(".size-opt").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const sizeKey    = btn.dataset.sizeKey;
  const label      = btn.dataset.label;
  const noIcing    = btn.dataset.noIcing;
  const withIcing  = btn.dataset.withIcing;

  updateIcingPanel(sizeKey, { label, withoutIcing: noIcing, withIcing });

  // Update modal image
  const cakeKey = document.getElementById("orderModal").dataset.cakeKey;
  const imgMap  = CREAME_CONFIG.cakeImages[cakeKey];
  const imgKey  = SIZE_IMG_KEY[sizeKey] || "default";
  if (imgMap) {
    document.getElementById("modalImg").src = imgMap[imgKey] || imgMap.default || CREAME_CONFIG.fallbackImage;
  }
}

function updateIcingPanel(sizeKey, s) {
  const wrap = document.getElementById("modalIcing");
  const hasNo   = s.withoutIcing && s.withoutIcing !== "-";
  const hasWith = s.withIcing    && s.withIcing    !== "-";

  wrap.innerHTML = `
    ${hasNo ? `
      <button class="icing-opt ${!hasWith ? "active" : ""}" data-icing="without" data-price="${s.withoutIcing}" onclick="selectIcing(this)">
        <span class="icing-label">Without Icing</span>
        <span class="icing-price">${s.withoutIcing}</span>
      </button>` : ""}
    ${hasWith ? `
      <button class="icing-opt active" data-icing="with" data-price="${s.withIcing}" onclick="selectIcing(this)">
        <span class="icing-label">With Icing</span>
        <span class="icing-price">${s.withIcing}</span>
      </button>` : ""}`;

  // Keep only one active
  const opts = wrap.querySelectorAll(".icing-opt");
  if (opts.length > 0) {
    opts.forEach(o => o.classList.remove("active"));
    opts[opts.length - 1].classList.add("active");
  }
}

function selectIcing(btn) {
  document.querySelectorAll(".icing-opt").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
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
  const notes    = document.getElementById("modalNotes").value.trim();

  const selectedToppings = [...document.querySelectorAll(".topping-sel.selected")]
    .map(t => t.dataset.name);

  const sizeLabel  = sizeBtn  ? sizeBtn.dataset.label  : "—";
  const icingLabel = icingBtn ? (icingBtn.dataset.icing === "with" ? "With Icing" : "Without Icing") : "—";
  const price      = icingBtn ? icingBtn.dataset.price  : "—";

  let msg = `Hi Creamé! 🎂 I'd like to place an order:\n\n`;
  msg += `🍰 *Cake:* ${cake.name}\n`;
  msg += `📦 *Size:* ${sizeLabel}\n`;
  msg += `🧁 *Icing:* ${icingLabel}\n`;
  if (selectedToppings.length > 0) {
    msg += `🍓 *Toppings:* ${selectedToppings.join(", ")}\n`;
  }
  if (notes) {
    msg += `📝 *Notes:* ${notes}\n`;
  }
  msg += `\n💰 *Price:* ${price}\n\nThank you!`;

  window.open(`${WA_BASE}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ── Filter tabs ────────────────────────────────────────────
function initFilterTabs(defaultSize) {
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach(tab => {
    if (tab.dataset.size === defaultSize) {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeSize = defaultSize;
    }
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeSize = tab.dataset.size;
      renderCatalogueCards(activeSize);
    });
  });
}

// ── WhatsApp link injection ────────────────────────────────
function injectWhatsAppLinks() {
  document.querySelectorAll("a[href*='94XXXXXXXXX']").forEach(el => {
    el.href = el.href.replace("94XXXXXXXXX", CREAME_CONFIG.whatsappNumber);
  });
}

// ── Build toppings grid in modal ───────────────────────────
function buildToppingsGrid() {
  const grid = document.getElementById("modalToppings");
  if (!grid) return;
  grid.innerHTML = CREAME_CONFIG.toppings.map(t => `
    <button class="topping-sel" data-name="${t.name}" onclick="toggleTopping(this)">
      <img src="${t.img}" alt="${t.name}" />
      <span>${t.name}</span>
    </button>`).join("");
}

function toggleTopping(btn) {
  btn.classList.toggle("selected");
}

// ── Build toppings section on home page ───────────────────
function buildHomeToppings() {
  const grid = document.getElementById("toppingsGrid");
  if (!grid) return;
  CREAME_CONFIG.toppings.forEach(t => {
    grid.innerHTML += `<div class="topping-card"><img src="${t.img}" alt="${t.name}" /><span>${t.name}</span></div>`;
  });
}

// ── Main loader ────────────────────────────────────────────
async function loadCatalogueData(defaultSize = "all") {
  const loader    = document.getElementById("loader");
  const errorEl   = document.getElementById("fetchError");
  const filterBar = document.getElementById("filterBar");
  const catalogue = document.getElementById("catalogue");

  if (loader)    loader.style.display = "flex";
  if (errorEl)   errorEl.style.display = "none";
  if (filterBar) filterBar.style.display = "none";
  if (catalogue) catalogue.style.display = "none";

  try {
    const res = await fetch(CREAME_CONFIG.googleSheetCSV);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = parseCSV(await res.text());
    allCakes = buildCakeMap(rows);

    if (loader)    loader.style.display = "none";
    if (filterBar) filterBar.style.display = "block";
    if (catalogue) catalogue.style.display = "block";

    buildToppingsGrid();
    initFilterTabs(defaultSize);
    renderCatalogueCards(defaultSize);
  } catch (err) {
    console.error("Failed to load menu:", err);
    if (loader)  loader.style.display = "none";
    if (errorEl) errorEl.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectWhatsAppLinks();
  buildHomeToppings();

  // Close modal on backdrop click
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeOrderModal();
    });
  }

  // Close modal on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeOrderModal();
  });
});
