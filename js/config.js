// ─────────────────────────────────────────────────────────
//  CREAME CONFIGURATION  –  Edit these values as needed
// ─────────────────────────────────────────────────────────

const CREAME_CONFIG = {

  // WhatsApp number in international format without + or spaces
  // Example Sri Lanka: 94771234567
  whatsappNumber: "94XXXXXXXXX",

  // WhatsApp default message (shown pre-filled when customer taps Order)
  whatsappMessage: "Hi! I'd like to place a cake order. 🎂",

  // ── Google Sheets CSV URL ──────────────────────────────
  // HOW TO SET UP:
  //  1. Open your Google Sheet
  //  2. File → Share → Publish to web
  //  3. Choose "Sheet1" and "Comma-separated values (.csv)"
  //  4. Click Publish and copy the URL
  //  5. Paste it below
  googleSheetCSV: "https://docs.google.com/spreadsheets/d/12OyI-FI0gGY2lQn12NJAVI_xHFQM9LyVWOEF_hgQnn8/export?format=csv&gid=0",

  // ── Cake Images ───────────────────────────────────────
  // Map each cake name (lowercase, trimmed) to an image path.
  // Add new cakes here when you upload new images to the server.
  cakeImages: {
    "butter cake (normal cake)":     "images/1 kg cakes/Buttercake.jpg",
    "ribbon cake":                   "images/1 kg cakes/Ribbon cake.jpg",
    "chocolate cake":                "images/1 kg cakes/Chocolate cake.jpg",
    "tres leches":                   "images/1 kg cakes/Tres leches.jpg",
    "red velvet":                    "images/1 kg cakes/Red velvet cake.jpg",
    "cheesecake":                    "images/1 kg cakes/Cheesecake.jpg",
    "chocolate fudge cake":          "images/1 kg cakes/Chocolate fudge cake.jpg",
    "pineapple upright cake":        "images/1 kg cakes/Pineapple upright cake.jpg",
    "pineapple gateau cake":         "images/1 kg cakes/Pineapple gateau.jpg",
    "lemon cake":                    "images/1 kg cakes/Lemon cake.jpg",
    "birthday cake":                 "images/1 kg cakes/Birthday cake.jpg",
  },

  // Fallback image when no image is found for a cake
  fallbackImage: "images/1 kg cakes/Buttercake.jpg",

  // ── Cake Descriptions ─────────────────────────────────
  // Descriptions shown on each cake card. Update freely.
  cakeDescriptions: {
    "butter cake (normal cake)":  "A soft, fluffy vanilla cake topped with smooth, creamy frosting.",
    "ribbon cake":                "A delightful, colorful layered cake with beautiful pink and green colour combination.",
    "chocolate cake":             "A moist, rich chocolate cake with smooth chocolate frosting.",
    "tres leches":                "A soft, milky sponge cake topped with creamy frosting and fruity pieces.",
    "red velvet":                 "A soft, velvety red cake layered with delicious cream cheese frosting.",
    "cheesecake":                 "A smooth, creamy cheesecake with a buttery biscuit base.",
    "chocolate fudge cake":       "A rich, decadent chocolate cake filled and covered with thick chocolate ganache.",
    "pineapple upright cake":     "A golden, buttery cake topped with caramelized pineapple rings and cherries.",
    "pineapple gateau cake":      "A light sponge cake layered with fluffy cream and sweet pineapple pieces.",
    "lemon cake":                 "A refreshing lemon-flavored cake with creamy frosting and a delicate citrus touch.",
    "birthday cake":              "A beautifully decorated cake with smooth frosting and festive birthday details.",
  },
};
