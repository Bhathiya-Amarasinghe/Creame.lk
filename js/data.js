// ─────────────────────────────────────────────────────────
//  CREAME – Hardcoded cake data (always works offline / without Google Sheets)
//  Update prices here OR publish the Google Sheet to web in config.js
// ─────────────────────────────────────────────────────────

const CAKE_DATA = {
  "butter cake (normal cake)": {
    name: "Butter Cake (Normal Cake)",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 2,300",   withIcing: "LKR 2,850" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 2,000",   withIcing: "LKR 2,750" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 1,950",   withIcing: "LKR 2,500" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 500",     withIcing: "LKR 570" },
      "cupcake": { label: "Cupcake",        withoutIcing: "LKR 300",     withIcing: "LKR 350" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 1,850",   withIcing: "LKR 2,400" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 400",     withIcing: "LKR 470" },
    },
  },
  "ribbon cake": {
    name: "Ribbon Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 2,400",   withIcing: "LKR 2,950" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 2,200",   withIcing: "LKR 2,780" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 2,000",   withIcing: "LKR 2,550" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 550",     withIcing: "LKR 600" },
      "cupcake": { label: "Cupcake",        withoutIcing: "LKR 320",     withIcing: "LKR 360" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 1,900",   withIcing: "LKR 2,450" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 450",     withIcing: "LKR 500" },
    },
  },
  "chocolate cake": {
    name: "Chocolate Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 2,600",   withIcing: "LKR 3,000" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 2,300",   withIcing: "LKR 2,900" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 2,200",   withIcing: "LKR 2,600" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 570",     withIcing: "LKR 640" },
      "cupcake": { label: "Cupcake",        withoutIcing: "LKR 330",     withIcing: "LKR 370" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 2,100",   withIcing: "LKR 2,500" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 470",     withIcing: "LKR 540" },
    },
  },
  "tres leches": {
    name: "Tres Leches",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 3,750",   withIcing: "LKR 4,550" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 3,400",   withIcing: "LKR 3,750" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 3,350",   withIcing: "LKR 3,680" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 730",     withIcing: "LKR 780" },
      "cupcake": { label: "Cupcake",        withoutIcing: "LKR 420",     withIcing: "LKR 450" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 3,250",   withIcing: "LKR 3,550" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 630",     withIcing: "LKR 680" },
    },
  },
  "red velvet": {
    name: "Red Velvet",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 3,650",   withIcing: "LKR 4,450" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 3,200",   withIcing: "LKR 3,650" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 3,000",   withIcing: "LKR 3,550" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 720",     withIcing: "LKR 760" },
      "cupcake": { label: "Cupcake",        withoutIcing: "LKR 400",     withIcing: "LKR 430" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 3,000",   withIcing: "LKR 3,450" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 620",     withIcing: "LKR 660" },
    },
  },
  "cheesecake": {
    name: "Cheesecake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 4,600",   withIcing: "LKR 4,850" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 4,300",   withIcing: "LKR 4,550" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 4,000",   withIcing: "LKR 4,400" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 760",     withIcing: "LKR 800" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 3,900",   withIcing: "LKR 4,250" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 640",     withIcing: "LKR 700" },
    },
  },
  "chocolate fudge cake": {
    name: "Chocolate Fudge Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "-",            withIcing: "LKR 4,700" },
      "500g":    { label: "500 g",          withoutIcing: "-",            withIcing: "LKR 3,800" },
      "bento":   { label: "Bento",          withoutIcing: "-",            withIcing: "LKR 3,750" },
      "mini":    { label: "Mini",           withoutIcing: "-",            withIcing: "LKR 790" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "-",            withIcing: "LKR 3,650" },
      "piece":   { label: "1 Piece",        withoutIcing: "-",            withIcing: "LKR 690" },
    },
  },
  "pineapple upright cake": {
    name: "Pineapple Upright Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "LKR 3,450",   withIcing: "LKR 3,700" },
      "500g":    { label: "500 g",          withoutIcing: "LKR 2,850",   withIcing: "LKR 3,600" },
      "bento":   { label: "Bento",          withoutIcing: "LKR 2,400",   withIcing: "LKR 3,500" },
      "mini":    { label: "Mini",           withoutIcing: "LKR 560",     withIcing: "LKR 650" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "LKR 2,300",   withIcing: "LKR 3,400" },
      "piece":   { label: "1 Piece",        withoutIcing: "LKR 460",     withIcing: "LKR 550" },
    },
  },
  "pineapple gateau cake": {
    name: "Pineapple Gateau Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "-",            withIcing: "LKR 3,950" },
      "500g":    { label: "500 g",          withoutIcing: "-",            withIcing: "LKR 3,700" },
      "bento":   { label: "Bento",          withoutIcing: "-",            withIcing: "LKR 3,600" },
      "mini":    { label: "Mini",           withoutIcing: "-",            withIcing: "LKR 770" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "-",            withIcing: "LKR 3,500" },
      "piece":   { label: "1 Piece",        withoutIcing: "-",            withIcing: "LKR 670" },
    },
  },
  "lemon cake": {
    name: "Lemon Cake",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "-",            withIcing: "LKR 2,980" },
      "500g":    { label: "500 g",          withoutIcing: "-",            withIcing: "LKR 2,850" },
      "bento":   { label: "Bento",          withoutIcing: "-",            withIcing: "LKR 2,580" },
      "mini":    { label: "Mini",           withoutIcing: "-",            withIcing: "LKR 750" },
      "quarter": { label: "Quarter Slab",   withoutIcing: "-",            withIcing: "LKR 2,480" },
      "piece":   { label: "1 Piece",        withoutIcing: "-",            withIcing: "LKR 650" },
    },
  },
  "birthday cake": {
    name: "Birthday Cake (Custom)",
    sizes: {
      "1kg":     { label: "1 kg",          withoutIcing: "-",            withIcing: "Contact us" },
      "bento":   { label: "Bento",          withoutIcing: "-",            withIcing: "Contact us" },
    },
  },
};
