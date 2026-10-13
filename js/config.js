// ─────────────────────────────────────────────────────────
//  CREAME CONFIGURATION  –  Edit these values as needed
// ─────────────────────────────────────────────────────────

const CREAME_CONFIG = {

  whatsappNumber: "94773174645",

  googleSheetCSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmuawVywltiTKT7A66WxRDtJIhl1WfW23OG32DYCBzLDjUhQv-tTj-4YRZaziZVhLm9uNoTa5NPNEi/pub?output=csv",

  // Per-size images for each cake.
  // Keys: default (1kg/500g), bento, mini, cupcake, slice
  // If a size key is missing, falls back to "default".
  cakeImages: {
    "butter cake (normal cake)": {
      default: "images/1 kg cakes/Buttercake.jpg",
      bento:   "images/Bento cakes/Buttercake.jpg",
      mini:    "images/Mini cakes/Buttercake.jpg",
      cupcake: "images/Cupcakes/Buttercake.jpg",
      slice:   "images/Cake slices/Buttercake.jpg",
    },
    "ribbon cake": {
      default: "images/1 kg cakes/Ribbon cake.jpg",
      bento:   "images/Bento cakes/Ribbon cake.jpg",
      mini:    "images/Mini cakes/Ribbon cake.jpg",
      cupcake: "images/Cupcakes/Ribbon cake.jpg",
      slice:   "images/Cake slices/Ribbon cake.jpg",
    },
    "chocolate cake": {
      default: "images/1 kg cakes/Chocolate cake.jpg",
      bento:   "images/Bento cakes/Chocolate cake.jpg",
      mini:    "images/Mini cakes/Chocolate cake.jpg",
      cupcake: "images/Cupcakes/Chocolate cake.jpg",
      slice:   "images/Cake slices/Chocolate cake.jpg",
    },
    "tres leches": {
      default: "images/1 kg cakes/Tres leches.jpg",
      bento:   "images/Bento cakes/Tres leches.jpg",
      mini:    "images/Mini cakes/Tres leches.jpg",
      cupcake: "images/Cupcakes/Tres leches.jpg",
      slice:   "images/Cake slices/Tres leches.jpg",
    },
    "red velvet": {
      default: "images/1 kg cakes/Red velvet cake.jpg",
      bento:   "images/Bento cakes/Red velvet cake.jpg",
      mini:    "images/Mini cakes/Red velvet.jpg",
      cupcake: "images/Cupcakes/Red velvet cake.jpg",
      slice:   "images/Cake slices/Red velvet.jpg",
    },
    "cheesecake": {
      default: "images/1 kg cakes/Cheesecake.jpg",
      bento:   "images/Bento cakes/Cheesecake.jpg",
      mini:    "images/Mini cakes/Cheesecake.jpg",
      slice:   "images/Cake slices/Cheesecake.jpg",
    },
    "chocolate fudge cake": {
      default: "images/1 kg cakes/Chocolate fudge cake.jpg",
      bento:   "images/Bento cakes/Chocolate fudge cake.jpg",
      mini:    "images/Mini cakes/Chocolate fudge cake.jpg",
      slice:   "images/Cake slices/Chocolate fudge cake.jpg",
    },
    "pineapple upright cake": {
      default: "images/1 kg cakes/Pineapple upright cake.jpg",
      bento:   "images/Bento cakes/Pineapple upright cake.jpg",
      mini:    "images/Mini cakes/Pineapple upright cake.jpg",
      slice:   "images/Cake slices/Pineapple upright cake.jpg",
    },
    "pineapple gateau cake": {
      default: "images/1 kg cakes/Pineapple gateau.jpg",
      bento:   "images/Bento cakes/Pineapple gateau cake.jpg",
      mini:    "images/Mini cakes/Pineapple gateau cake.jpg",
      slice:   "images/Cake slices/Pineapple gateau cake.jpg",
    },
    "lemon cake": {
      default: "images/1 kg cakes/Lemon cake.jpg",
      bento:   "images/Bento cakes/Lemon cake.jpg",
      mini:    "images/Mini cakes/Lemon cake.jpg",
      slice:   "images/Cake slices/Lemon cake.jpg",
    },
    "birthday cake": {
      default: "images/1 kg cakes/Birthday cake.jpg",
      bento:   "images/Bento cakes/Birthday cake.jpg",
    },
  },

  fallbackImage: "images/1 kg cakes/Buttercake.jpg",

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

  toppings: [
    { name: "Vanilla",      img: "images/Toppings/Whipped cream.jpg" },
    { name: "Nutella",      img: "images/Toppings/Nutella.jpg" },
    { name: "Oreo",         img: "images/Toppings/Oreo.jpg" },
    { name: "Mixed Fruit",  img: "images/Toppings/Mixed fruit.jpg" },
    { name: "Green Grapes", img: "images/Toppings/Green grapes.jpg" },
    { name: "Pineapple",    img: "images/Toppings/Pineapple.jpg" },
    { name: "Coconut",      img: "images/Toppings/Coconut.jpg" },
    { name: "Blueberry",    img: "images/Toppings/Blueberries.jpg" },
    { name: "Cherry",       img: "images/Toppings/Cherries.jpg" },
    { name: "Strawberry",   img: "images/Toppings/Strawberries.jpg" },
    { name: "Nuts",         img: "images/Toppings/Nuts.jpg" },
  ],
};
