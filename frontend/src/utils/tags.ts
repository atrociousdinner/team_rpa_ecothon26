// ─── Auto-derived from backend tagGroups ─────────────────────────────────────
// Single source of truth: update tagGroups here and everything else follows.

type TagGroup = {
  tags: string[];
  polarity: "positive" | "negative";
  weight: number;
  category: string;
  confidence: "high" | "medium" | "low";
};

const tagGroups: TagGroup[] = [
  {
    tags: ["organic", "organically", "fairtrade", "ecocert", "biodynamic", "bio", "biologique", "biologico", "biologisch"],
    polarity: "positive", weight: 0.5, category: "certification", confidence: "high",
  },
  {
    tags: ["sustainable", "sustainably", "nongmo", "gmofree"],
    polarity: "positive", weight: 0.35, category: "certification", confidence: "medium",
  },
  {
    tags: ["fair", "trade", "natural", "naturally"],
    polarity: "positive", weight: 0.15, category: "weak-contextual", confidence: "low",
  },
  {
    tags: ["gmo", "gmos"],
    polarity: "negative", weight: 0.25, category: "ingredient-impact", confidence: "medium",
  },
  {
    tags: ["recyclable", "recycled", "biodegradable", "compostable"],
    polarity: "positive", weight: 0.45, category: "packaging", confidence: "high",
  },
  {
    tags: ["recycle", "recycling", "reuse", "how2recycle"],
    polarity: "positive", weight: 0.3, category: "packaging", confidence: "medium",
  },
  {
    tags: ["packaging", "package", "packaged", "pack", "packet", "foil"],
    polarity: "negative", weight: 0.15, category: "packaging", confidence: "low",
  },
  {
    tags: ["plastic", "plastics"],
    polarity: "negative", weight: 0.5, category: "packaging", confidence: "high",
  },
  {
    tags: ["paper", "paperboard", "glass", "aluminum", "aluminium", "carton", "container", "bottle", "bottled", "can", "cans"],
    polarity: "negative", weight: 0.2, category: "packaging", confidence: "medium",
  },
  {
    tags: ["beef", "veal", "pork", "bacon", "lamb"],
    polarity: "negative", weight: 0.5, category: "ingredient-impact", confidence: "high",
  },
  {
    tags: ["ham", "chicken", "turkey", "duck", "fish", "shellfish", "shrimp", "prawn", "salmon", "tuna", "swordfish", "anchovy", "sardine", "fishery", "seafood"],
    polarity: "negative", weight: 0.35, category: "ingredient-impact", confidence: "medium",
  },
  {
    tags: ["dairy", "milk", "cheese", "cream", "butter"],
    polarity: "negative", weight: 0.4, category: "ingredient-impact", confidence: "high",
  },
  {
    tags: ["whey", "egg", "eggs"],
    polarity: "negative", weight: 0.3, category: "ingredient-impact", confidence: "medium",
  },
  {
    tags: ["butteroil"],
    polarity: "negative", weight: 0.2, category: "ingredient-impact", confidence: "low",
  },
  {
    tags: ["farmraised", "grassfed", "cagefree", "freerange"],
    polarity: "positive", weight: 0.25, category: "ingredient-impact", confidence: "medium",
  },
  {
    tags: ["farm", "farming", "farmed", "farmer", "farmers", "wild", "fed"],
    polarity: "positive", weight: 0.1, category: "weak-contextual", confidence: "low",
  },
  {
    tags: ["palm", "palmolein", "palmate", "palmitate", "palmiste"],
    polarity: "negative", weight: 0.45, category: "ingredient-impact", confidence: "high",
  },
  {
    tags: ["vegan", "vegans", "vegetarian", "vegetarians", "plantbased"],
    polarity: "positive", weight: 0.45, category: "ingredient-impact", confidence: "high",
  },
  {
    tags: ["plant", "meatless", "dairyfree"],
    polarity: "positive", weight: 0.2, category: "ingredient-impact", confidence: "low",
  },
  {
    tags: ["local", "locally"],
    polarity: "positive", weight: 0.3, category: "product-category", confidence: "medium",
  },
  {
    tags: ["import", "imported"],
    polarity: "negative", weight: 0.15, category: "weak-contextual", confidence: "low",
  },
  {
    tags: ["fresh", "freshly"],
    polarity: "positive", weight: 0.3, category: "processing", confidence: "medium",
  },
  {
    tags: ["frozen", "dried", "dehydrated", "processed", "instant"],
    polarity: "negative", weight: 0.3, category: "processing", confidence: "medium",
  },
  {
    tags: ["freeze", "freezedried", "precooked", "reconstituted"],
    polarity: "negative", weight: 0.15, category: "processing", confidence: "low",
  },
  {
    tags: ["carbon"],
    polarity: "positive", weight: 0.45, category: "certification", confidence: "high",
  },
  {
    tags: ["eco", "environment", "environmental", "green"],
    polarity: "positive", weight: 0.25, category: "weak-contextual", confidence: "medium",
  },
  {
    tags: ["en:organic", "en:eu-organic", "usda"],
    polarity: "positive", weight: 0.5, category: "certification", confidence: "high",
  },
  {
    tags: ["en:green-dot", "dot", "vert"],
    polarity: "positive", weight: 0.25, category: "packaging", confidence: "medium",
  },
  {
    tags: ["plant-based"],
    polarity: "positive", weight: 0.45, category: "ingredient-impact", confidence: "high",
  },
  {
    tags: ["naturel", "water", "fruits", "vegetables", "agriculture", "tournesol", "colza"],
    polarity: "positive", weight: 0.2, category: "weak-contextual", confidence: "low",
  },
  {
    tags: ["plastique", "sachet", "acid", "acide", "citrique", "e330", "sodium", "arôme", "arômes", "additive", "canned", "cereals", "beverages", "gluten", "sucre", "sugary", "snacks", "huile", "farine", "diaries", "meats", "viande", "poudre", "cheeses", "glucose", "groceries", "sirop", "amidon", "verre", "lait", "desserts", "cacao", "potassium", "sauces", "alcoholic", "barquette", "jus", "chocolates"],
    polarity: "negative", weight: 0.25, category: "weak-contextual", confidence: "low",
  },
];

const titleCase = (tag: string): string =>
  tag.replace(/^en:/, "").replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, c => c.toUpperCase());

// All tags available for selection in the UI
export const displayTags: string[] = tagGroups.flatMap(g => g.tags);

// Tags with positive polarity
export const positiveTags: string[] = tagGroups
  .filter(g => g.polarity === "positive")
  .flatMap(g => g.tags);

// Tags with negative polarity
export const negativeTags: string[] = tagGroups
  .filter(g => g.polarity === "negative")
  .flatMap(g => g.tags);

// Human-readable display labels
export const tagDisplayMap: Record<string, string> = {
  ...Object.fromEntries(tagGroups.flatMap(g => g.tags.map(t => [t, titleCase(t)]))),
  // Overrides for special casing
  "en:green-dot": "Green Dot (Eco Symbol)",
  "en:eu-organic": "EU Organic Certified",
  "plant-based": "Plant Based",
  plantbased: "Plant Based",
  fairtrade: "Fair Trade",
  nongmo: "Non-GMO",
  gmofree: "GMO Free",
  how2recycle: "How2Recycle",
  farmraised: "Farm Raised",
  grassfed: "Grass Fed",
  cagefree: "Cage Free",
  freerange: "Free Range",
  dairyfree: "Dairy Free",
  freezedried: "Freeze Dried",
  gmo: "GMO",
  gmos: "GMOs",
  usda: "USDA Certified",
  bio: "Bio",
  biologique: "Biologique (FR Organic)",
  biologico: "Biologico (IT Organic)",
  biologisch: "Biologisch (DE Organic)",
  e330: "E330 (Citric Acid)",
  arôme: "Arôme (Flavouring)",
  arômes: "Arômes (Flavourings)",
};

// Tag weight info per tag (for UI hints)
export const tagMeta: Record<string, { polarity: "positive" | "negative"; weight: number; category: string; confidence: string }> =
  Object.fromEntries(
    tagGroups.flatMap(g =>
      g.tags.map(t => [t, { polarity: g.polarity, weight: g.weight, category: g.category, confidence: g.confidence }])
    )
  );

// Tags that don't have a meaningful quantity (kept for API compat)
export const tagsWithoutQuantity: string[] = displayTags;