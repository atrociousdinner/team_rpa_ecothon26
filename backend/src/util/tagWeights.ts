export type TagWeightCategory =
  | "certification"
  | "packaging"
  | "processing"
  | "ingredient-impact"
  | "product-category"
  | "weak-contextual";

export type TagWeightConfidence = "high" | "medium" | "low";

export type TagWeightJustification = {
  label: string;
  polarity: "positive" | "negative";
  weight: number;
  category: TagWeightCategory;
  confidence: TagWeightConfidence;
  confidenceScore: number;
};

type TagGroup = {
  tags: string[];
  polarity: "positive" | "negative";
  weight: number;
  category: TagWeightCategory;
  confidence: TagWeightConfidence;
};

export const weightBandJustifications = {
  strong: "0.45-0.50: strong signal with clear sustainability impact or recognized certification.",
  medium: "0.30-0.44: meaningful signal, but the impact depends on product context.",
  weak: "0.10-0.29: weak or contextual signal that should only slightly adjust the score.",
  minimal: "0.01-0.09: very weak signal with limited direct eco-score relevance.",
};

export const confidenceScoreMap: Record<TagWeightConfidence, number> = {
  high: 1,
  medium: 0.7,
  low: 0.4,
};

const tagGroups: TagGroup[] = [
  {
    tags: [
      "organic",
      "organically",
      "fairtrade",
      "ecocert",
      "biodynamic",
      "bio",
      "biologique",
      "biologico",
      "biologisch",
    ],
    polarity: "positive",
    weight: 0.5,
    category: "certification",
    confidence: "high",
  },
  {
    tags: ["sustainable", "sustainably", "nongmo", "gmofree"],
    polarity: "positive",
    weight: 0.35,
    category: "certification",
    confidence: "medium",
  },
  {
    tags: ["fair", "trade", "natural", "naturally"],
    polarity: "positive",
    weight: 0.15,
    category: "weak-contextual",
    confidence: "low",
  },
  {
    tags: ["gmo", "gmos"],
    polarity: "negative",
    weight: 0.25,
    category: "ingredient-impact",
    confidence: "medium",
  },
  {
    tags: ["recyclable", "recycled", "biodegradable", "compostable"],
    polarity: "positive",
    weight: 0.45,
    category: "packaging",
    confidence: "high",
  },
  {
    tags: ["recycle", "recycling", "reuse", "how2recycle"],
    polarity: "positive",
    weight: 0.3,
    category: "packaging",
    confidence: "medium",
  },
  {
    tags: ["packaging", "package", "packaged", "pack", "packet", "foil"],
    polarity: "negative",
    weight: 0.15,
    category: "packaging",
    confidence: "low",
  },
  {
    tags: ["plastic", "plastics"],
    polarity: "negative",
    weight: 0.5,
    category: "packaging",
    confidence: "high",
  },
  {
    tags: ["paper", "paperboard", "glass", "aluminum", "aluminium", "carton", "container", "bottle", "bottled", "can", "cans"],
    polarity: "negative",
    weight: 0.2,
    category: "packaging",
    confidence: "medium",
  },
  {
    tags: ["beef", "veal", "pork", "bacon", "lamb"],
    polarity: "negative",
    weight: 0.5,
    category: "ingredient-impact",
    confidence: "high",
  },
  {
    tags: [
      "ham",
      "chicken",
      "turkey",
      "duck",
      "fish",
      "shellfish",
      "shrimp",
      "prawn",
      "salmon",
      "tuna",
      "swordfish",
      "anchovy",
      "sardine",
      "fishery",
      "seafood",
    ],
    polarity: "negative",
    weight: 0.35,
    category: "ingredient-impact",
    confidence: "medium",
  },
  {
    tags: ["dairy", "milk", "cheese", "cream", "butter"],
    polarity: "negative",
    weight: 0.4,
    category: "ingredient-impact",
    confidence: "high",
  },
  {
    tags: ["whey", "egg", "eggs"],
    polarity: "negative",
    weight: 0.3,
    category: "ingredient-impact",
    confidence: "medium",
  },
  {
    tags: ["butteroil"],
    polarity: "negative",
    weight: 0.2,
    category: "ingredient-impact",
    confidence: "low",
  },
  {
    tags: ["farmraised", "grassfed", "cagefree", "freerange"],
    polarity: "positive",
    weight: 0.25,
    category: "ingredient-impact",
    confidence: "medium",
  },
  {
    tags: ["farm", "farming", "farmed", "farmer", "farmers", "wild", "fed"],
    polarity: "positive",
    weight: 0.1,
    category: "weak-contextual",
    confidence: "low",
  },
  {
    tags: ["palm", "palmolein", "palmate", "palmitate", "palmiste"],
    polarity: "negative",
    weight: 0.45,
    category: "ingredient-impact",
    confidence: "high",
  },
  {
    tags: ["vegan", "vegans", "vegetarian", "vegetarians", "plantbased"],
    polarity: "positive",
    weight: 0.45,
    category: "ingredient-impact",
    confidence: "high",
  },
  {
    tags: ["plant", "meatless", "dairyfree"],
    polarity: "positive",
    weight: 0.2,
    category: "ingredient-impact",
    confidence: "low",
  },
  {
    tags: ["local", "locally"],
    polarity: "positive",
    weight: 0.3,
    category: "product-category",
    confidence: "medium",
  },
  {
    tags: ["import", "imported"],
    polarity: "negative",
    weight: 0.15,
    category: "weak-contextual",
    confidence: "low",
  },
  {
    tags: ["fresh", "freshly"],
    polarity: "positive",
    weight: 0.3,
    category: "processing",
    confidence: "medium",
  },
  {
    tags: ["frozen", "dried", "dehydrated", "processed", "instant"],
    polarity: "negative",
    weight: 0.3,
    category: "processing",
    confidence: "medium",
  },
  {
    tags: ["freeze", "freezedried", "precooked", "reconstituted"],
    polarity: "negative",
    weight: 0.15,
    category: "processing",
    confidence: "low",
  },
  {
    tags: ["carbon"],
    polarity: "positive",
    weight: 0.45,
    category: "certification",
    confidence: "high",
  },
  {
    tags: ["eco", "environment", "environmental", "green"],
    polarity: "positive",
    weight: 0.25,
    category: "weak-contextual",
    confidence: "medium",
  },

  // Legacy Open Food Facts aliases still seen in existing product data.
  {
    tags: ["en:organic", "en:eu-organic", "usda"],
    polarity: "positive",
    weight: 0.5,
    category: "certification",
    confidence: "high",
  },
  {
    tags: ["en:green-dot", "dot", "vert"],
    polarity: "positive",
    weight: 0.25,
    category: "packaging",
    confidence: "medium",
  },
  {
    tags: ["plant-based"],
    polarity: "positive",
    weight: 0.45,
    category: "ingredient-impact",
    confidence: "high",
  },
  {
    tags: ["naturel", "water", "fruits", "vegetables", "agriculture", "tournesol", "colza"],
    polarity: "positive",
    weight: 0.2,
    category: "weak-contextual",
    confidence: "low",
  },
  {
    tags: [
      "plastique",
      "sachet",
      "acid",
      "acide",
      "citrique",
      "e330",
      "sodium",
      "arôme",
      "arômes",
      "additive",
      "canned",
      "cereals",
      "beverages",
      "gluten",
      "sucre",
      "sugary",
      "snacks",
      "huile",
      "farine",
      "diaries",
      "meats",
      "viande",
      "poudre",
      "cheeses",
      "glucose",
      "groceries",
      "sirop",
      "amidon",
      "verre",
      "lait",
      "desserts",
      "cacao",
      "potassium",
      "sauces",
      "alcoholic",
      "barquette",
      "jus",
      "chocolates",
    ],
    polarity: "negative",
    weight: 0.25,
    category: "weak-contextual",
    confidence: "low",
  },
];

const titleCase = (tag: string): string =>
  tag
    .replace(/^en:/, "")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, char => char.toUpperCase());

const buildWeightMap = (polarity: "positive" | "negative"): Record<string, number> =>
  Object.fromEntries(
    tagGroups
      .filter(group => group.polarity === polarity)
      .flatMap(group => group.tags.map(tag => [tag, group.weight]))
  );

const buildTagDisplayMap = (): Record<string, string> =>
  Object.fromEntries(tagGroups.flatMap(group => group.tags.map(tag => [tag, titleCase(tag)])));

const buildTagClassificationMap = (): Record<string, Pick<TagWeightJustification, "category" | "confidence">> =>
  Object.fromEntries(
    tagGroups.flatMap(group =>
      group.tags.map(tag => [
        tag,
        {
          category: group.category,
          confidence: group.confidence,
        },
      ])
    )
  );

export const positiveTagWeights: Record<string, number> = buildWeightMap("positive");
export const negativeTagWeights: Record<string, number> = buildWeightMap("negative");
export const tagDisplayMap: Record<string, string> = {
  ...buildTagDisplayMap(),
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
};

const tagWeightClassificationMap = buildTagClassificationMap();

export const getTagWeightJustification = (tagName: string): TagWeightJustification | null => {
  const positiveWeight = positiveTagWeights[tagName];
  const negativeWeight = negativeTagWeights[tagName];
  const weight = positiveWeight ?? negativeWeight;

  if (!weight) return null;

  const fallbackCategory: TagWeightCategory = weight >= 0.3 ? "product-category" : "weak-contextual";
  const metadata = tagWeightClassificationMap[tagName] || {
    category: fallbackCategory,
    confidence: "low" as TagWeightConfidence,
  };

  return {
    label: tagDisplayMap[tagName] || titleCase(tagName),
    polarity: positiveWeight ? "positive" : "negative",
    weight,
    confidenceScore: confidenceScoreMap[metadata.confidence],
    ...metadata,
  };
};
