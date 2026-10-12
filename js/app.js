// ─────────────────────────────────────────────────────────
//  CREAME – Catalogue data loader & renderer
// ─────────────────────────────────────────────────────────

const WA_BASE = `https://wa.me/${CREAME_CONFIG.whatsappNumber}`;

function waLink(cakeName, size, icing) {
  const icingLabel = icing === "with" ? "with icing" : "without icing";
  const msg = encodeURIComponent(
    `Hi Creamé! I'd like to order:\n🎂 *${cakeName}* (${size}, ${icingLabel})\n\nPlease let me know the availability and delivery details. Thank you!`
  );
  return `${WA_BASE}?text=${msg}`;
}

function getImage(cakeName) {
  const key = cakeName.trim().toLowerCase();
  return CREAME_CONFIG.cakeImages[key] || CREAME_CONFIG.fallbackImage;
}

function getDescription(cakeName) {
  const key = cakeName.trim().toLowerCase();
  return CREAME_CONFIG.cakeDescriptions[key] || "A delicious handcrafted cake made fresh to order.";
}

// ── CSV Parser ────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    const cells = [];
    let inQuote = false, cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cells.push(cell.trim()); cell = ""; }
      else { cell += ch; }
    }
    cells.push(cell.trim());
    rows.push(cells);
  }
  return rows;
}

// ── Data Model ────────────────────────────────────────────
// sizes: { "1kg": {withoutIcing, withIcing}, "500g": {...}, ... }
function buildCakeMap(rows) {
  const cakes = {};

  // Find header rows for each size block by looking for "Cake type" header cells
  // Layout: 1kg (cols 0-2), 500g (cols 4-6), Bento (cols 8-10)
  //         Mini (cols 0-2), Cupcake (cols 4-6), Cake pieces (cols 8-12)
  // We find block starts by scanning for "1 kg cake prices", "500 g cake prices", etc.

  let blocks = {}; // label → { colStart, sizeKey }

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const cell = row[c].toLowerCase();
      if (cell.includes("1 kg cake prices"))    blocks["1kg"]     = { colStart: c, dataStart: r + 2 };
      if (cell.includes("500 g cake prices"))   blocks["500g"]    = { colStart: c, dataStart: r + 2 };
      if (cell.includes("bento cake prices"))   blocks["bento"]   = { colStart: c, dataStart: r + 2 };
      if (cell.includes("mini cake prices"))    blocks["mini"]    = { colStart: c, dataStart: r + 2 };
      if (cell.includes("cupcake prices"))      blocks["cupcake"] = { colStart: c, dataStart: r + 2 };
      if (cell.includes("cake pieces prices"))  blocks["slice"]   = { colStart: c, dataStart: r + 2 };
    }
  }

  // For each block read rows until we hit an empty cake name cell
  const sizeLabels = {
    "1kg":     "1 kg",
    "500g":    "500 g",
    "bento":   "Bento",
    "mini":    "Mini",
    "cupcake": "Cupcake",
    "slice":   "Cake Slice",
  };

  for (const [sizeKey, block] of Object.entries(blocks)) {
    const { colStart, dataStart } = block;
    for (let r = dataStart; r < rows.length; r++) {
      const row = rows[r];
      const name = row[colStart];
      if (!name || name === "") break;

      const key = name.trim().toLowerCase();
      if (!cakes[key]) {
        cakes[key] = { name: name.trim(), sizes: {} };
      }

      if (sizeKey === "slice") {
        // Cake pieces: Quarter (cols +1,+2) and 1 piece (cols +3,+4)
        // Row after header has: Without icing, With icing, Without icing, With icing
        const quarterNoIcing = row[colStart + 1] || "-";
        const quarterIcing   = row[colStart + 2] || "-";
        const pieceNoIcing   = row[colStart + 3] || "-";
        const pieceIcing     = row[colStart + 4] || "-";
        cakes[key].sizes["quarter"] = {
          label: "Quarter Slab",
          withoutIcing: quarterNoIcing,
          withIcing: quarterIcing,
        };
        cakes[key].sizes["piece"] = {
          label: "1 Piece",
          withoutIcing: pieceNoIcing,
          withIcing: pieceIcing,
        };
      } else {
        const withoutIcing = row[colStart + 1] || "-";
        const withIcing    = row[colStart + 2] || "-";
        cakes[key].sizes[sizeKey] = {
          label: sizeLabels[sizeKey],
          withoutIcing,
          withIcing,
        };
      }
    }
  }

  return cakes;
}

// ── Render ────────────────────────────────────────────────
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

    const img = getImage(cake.name);
    const desc = getDescription(cake.name);

    const priceRows = sizesToShow.map(([sizeKey, s]) => {
      const noIcingCell = s.withoutIcing && s.withoutIcing !== "-"
        ? `<a href="${waLink(cake.name, s.label, "without")}" target="_blank" class="price-link">
             <span class="price-amount">${s.withoutIcing}</span>
             <span class="price-tag">No Icing</span>
           </a>`
        : `<span class="price-na">–</span>`;

      const withIcingCell = s.withIcing && s.withIcing !== "-"
        ? `<a href="${waLink(cake.name, s.label, "with")}" target="_blank" class="price-link price-link--icing">
             <span class="price-amount">${s.withIcing}</span>
             <span class="price-tag">With Icing</span>
           </a>`
        : `<span class="price-na">–</span>`;

      return `
        <div class="price-row">
          <span class="size-badge">${s.label}</span>
          <div class="price-options">
            ${noIcingCell}
            ${withIcingCell}
          </div>
        </div>`;
    }).join("");

    grid.innerHTML += `
      <div class="cake-card">
        <div class="cake-img-wrap">
          <img src="${img}" alt="${cake.name}" loading="lazy" onerror="this.src='${CREAME_CONFIG.fallbackImage}'" />
          <div class="cake-img-overlay">
            <a href="${waLink(cake.name, "your preferred size", "with")}" target="_blank" class="btn-order-overlay">Order Now</a>
          </div>
        </div>
        <div class="cake-body">
          <h3 class="cake-name">${cake.name}</h3>
          <p class="cake-desc">${desc}</p>
          <div class="cake-prices">
            ${priceRows}
          </div>
          <p class="price-note">* Tap a price to order via WhatsApp</p>
        </div>
      </div>`;
    count++;
  }

  if (count === 0) {
    grid.innerHTML = `<p class="no-results">No cakes found for this size. <a href="catalogue.html">View all</a></p>`;
  }
}

// ── Filter tabs ───────────────────────────────────────────
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

// ── WhatsApp number injection ─────────────────────────────
function injectWhatsAppLinks() {
  document.querySelectorAll("[id$='WA'], .btn-whatsapp").forEach(el => {
    if (el.tagName === "A" && el.href.includes("94XXXXXXXXX")) {
      el.href = el.href.replace("94XXXXXXXXX", CREAME_CONFIG.whatsappNumber);
    }
  });
}

// ── Main loader ───────────────────────────────────────────
async function loadCatalogueData(defaultSize = "all") {
  const loader     = document.getElementById("loader");
  const errorEl    = document.getElementById("fetchError");
  const filterBar  = document.getElementById("filterBar");
  const catalogue  = document.getElementById("catalogue");

  if (loader)    loader.style.display = "flex";
  if (errorEl)   errorEl.style.display = "none";
  if (filterBar) filterBar.style.display = "none";
  if (catalogue) catalogue.style.display = "none";

  try {
    const res = await fetch(CREAME_CONFIG.googleSheetCSV);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const rows = parseCSV(text);
    allCakes = buildCakeMap(rows);

    if (loader)    loader.style.display = "none";
    if (filterBar) filterBar.style.display = "block";
    if (catalogue) catalogue.style.display = "block";

    initFilterTabs(defaultSize);
    renderCatalogueCards(defaultSize);
    injectWhatsAppLinks();
  } catch (err) {
    console.error("Failed to load menu:", err);
    if (loader)  loader.style.display = "none";
    if (errorEl) errorEl.style.display = "block";
  }
}

// Inject WhatsApp links on every page
document.addEventListener("DOMContentLoaded", () => {
  injectWhatsAppLinks();
});
