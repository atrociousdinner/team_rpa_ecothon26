import { useState, useRef, useEffect } from "react";
import { positiveTags, tagDisplayMap, displayTags, tagMeta } from "../utils/tags";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tag = { name: string; value: any };

type AppliedTag = {
  tag: string;
  label: string;
  polarity: "positive" | "negative";
  weight: number;
  appliedWeight: number;
  category: string;
  confidence: string;
  confidenceScore: number;
};

type Explanation = {
  baseline: number;
  positiveScore: number;
  negativeScore: number;
  netSignal: number;
  appliedTags: AppliedTag[];
};

type ScoreProfile = { ecoScore: number; explanation: Explanation };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTag = (tag: string) =>
  tagDisplayMap[tag] ?? tag.replace(/^en:/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const scoreGrade = (s: number) =>
  s >= 80 ? "A" : s >= 65 ? "B" : s >= 50 ? "C" : s >= 35 ? "D" : "E";

const gradeColor = (g: string) =>
  ({ A: "#1a9e5c", B: "#5cb85c", C: "#f0ad4e", D: "#e07030", E: "#d9534f" }[g] ?? "#888");

const gradeBg = (g: string) =>
  ({ A: "#edfaf3", B: "#f0f9f0", C: "#fef9ed", D: "#fdf2eb", E: "#fdf0f0" }[g] ?? "#f5f5f5");

const CATEGORY_ICONS: Record<string, string> = {
  certification: "🏅",
  packaging: "📦",
  processing: "⚙️",
  "ingredient-impact": "🌱",
  "product-category": "🏷️",
  "weak-contextual": "💬",
};

// ─── Component ────────────────────────────────────────────────────────────────

const EcoScoreCalculator = () => {
  const [productName, setProductName] = useState("");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [scoreProfile, setScoreProfile] = useState<ScoreProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedNames = selectedTags.map(t => t.name);

  const filteredTags = displayTags
    .filter(t => !selectedNames.includes(t))
    .filter(t => {
      const label = (tagDisplayMap[t] ?? t).toLowerCase();
      const q = query.toLowerCase();
      return label.includes(q) || t.toLowerCase().includes(q);
    });

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev =>
      prev.some(t => t.name === tag.name)
        ? prev.filter(t => t.name !== tag.name)
        : [...prev, tag]
    );
  };

  const removeTag = (name: string) =>
    setSelectedTags(prev => prev.filter(t => t.name !== name));

  const getEcoScore = async () => {
    if (!selectedTags.length) return;
    setLoading(true);
    setScoreProfile(null);
    setShowBreakdown(false);
    try {
      const res = await fetch("/api/get_eco_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: selectedTags }),
      });
      const data: ScoreProfile = await res.json();
      setScoreProfile(data);
      setTimeout(() => setShowBreakdown(true), 200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setProductName("");
    setQuery("");
    setSelectedTags([]);
    setScoreProfile(null);
    setShowBreakdown(false);
    setActiveCategory("all");
  };

  const isDirty = productName || query || selectedTags.length || scoreProfile;
  const ecoScore = scoreProfile?.ecoScore ?? null;
  const explanation = scoreProfile?.explanation ?? null;
  const grade = ecoScore !== null ? scoreGrade(ecoScore) : null;

  const appliedByCategory = explanation?.appliedTags.reduce<Record<string, AppliedTag[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {}) ?? {};

  const allCategories = Object.keys(appliedByCategory);
  const filteredApplied =
    activeCategory === "all"
      ? explanation?.appliedTags ?? []
      : appliedByCategory[activeCategory] ?? [];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }} className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-5 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="text-2xl">🌿</span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Eco Score Calculator
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estimate the environmental impact of a food product by its tags
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* ── Product Name ── */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder="e.g. Oatly Oat Milk"
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        {/* ── Tag Search ── */}
        <div className="space-y-2" ref={dropdownRef}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Product Tags
            </label>
            <span className="text-xs text-gray-400 dark:text-gray-600">
              {displayTags.length} tags available
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search — organic, vegan, plastic, beef…"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>

            {/* Dropdown */}
            {showDropdown && filteredTags.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                  {filteredTags.slice(0, 80).map(tag => {
                    const meta = tagMeta[tag];
                    const isPos = meta?.polarity === "positive";
                    return (
                      <button
                        key={tag}
                        onMouseDown={e => {
                          e.preventDefault();
                          toggleTag({ name: tag, value: null });
                          setQuery("");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left border-b border-gray-50 dark:border-gray-800 last:border-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center text-sm">{CATEGORY_ICONS[meta?.category ?? ""] ?? "🏷️"}</span>
                          <div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{formatTag(tag)}</span>
                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 capitalize">
                              {meta?.category?.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPos ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"}`}>
                          {isPos ? "+" : "−"}{meta?.weight ?? ""}
                        </span>
                      </button>
                    );
                  })}
                  {filteredTags.length > 80 && (
                    <div className="px-4 py-2.5 text-xs text-gray-400 text-center bg-gray-50 dark:bg-gray-800">
                      Showing 80 of {filteredTags.length} — type to narrow results
                    </div>
                  )}
                </div>
              </div>
            )}

            {showDropdown && query && filteredTags.length === 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3 text-sm text-gray-400">
                No tags match "{query}"
              </div>
            )}
          </div>

          {/* Selected tag pills */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedTags.map(tag => {
                const isPos = positiveTags.includes(tag.name);
                return (
                  <span
                    key={tag.name}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition
                      ${isPos
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                        : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                      }`}
                  >
                    <span className="opacity-70">{isPos ? "✓" : "✗"}</span>
                    {formatTag(tag.name)}
                    <button
                      onClick={() => removeTag(tag.name)}
                      className="opacity-50 hover:opacity-100 transition ml-0.5"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
          {isDirty && (
            <button
              onClick={clearAll}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Clear
            </button>
          )}
          <button
            onClick={getEcoScore}
            disabled={loading || selectedTags.length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Calculating…
              </span>
            ) : (
              `Calculate Eco Score${selectedTags.length > 0 ? ` · ${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""}` : ""}`
            )}
          </button>
        </div>

        {/* ── Score Result ── */}
        {ecoScore !== null && explanation && grade && (
          <div className="space-y-4">

            {/* Score card */}
            <div
              className="rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: gradeColor(grade), background: gradeBg(grade) }}
            >
              <div className="px-6 py-5 flex items-center gap-5">
                {/* Grade badge */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow"
                  style={{ background: gradeColor(grade) }}
                >
                  <span className="text-4xl font-black text-white leading-none">{grade}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: gradeColor(grade) }}>
                    Eco Score
                  </p>
                  {productName && (
                    <p className="text-sm font-semibold text-gray-700 truncate mb-1">{productName}</p>
                  )}
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-gray-900 leading-none">{ecoScore}</span>
                    <span className="text-lg text-gray-400 mb-1">/ 100</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 space-y-1">
                  <div className="text-xs font-bold text-green-700">+{explanation.positiveScore} pos</div>
                  <div className="text-xs font-bold text-red-600">−{explanation.negativeScore} neg</div>
                  <div className="text-xs text-gray-500">net {explanation.netSignal >= 0 ? "+" : ""}{explanation.netSignal}</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="px-6 pb-5">
                <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${ecoScore}%`, background: gradeColor(grade) }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: gradeColor(grade), opacity: 0.7 }}>
                  <span>0</span><span>50</span><span>100</span>
                </div>
              </div>
            </div>

            {/* ── Breakdown panel ── */}
            {explanation.appliedTags.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

                {/* Toggle header */}
                <button
                  onClick={() => setShowBreakdown(p => !p)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Tag Breakdown</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {explanation.appliedTags.length} tag{explanation.appliedTags.length > 1 ? "s" : ""} recognized
                    </span>
                  </div>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-gray-400 transition-transform duration-200 ${showBreakdown ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {showBreakdown && (
                  <>
                    {/* Category filter */}
                    {allCategories.length > 1 && (
                      <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                        {["all", ...allCategories].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-none text-xs font-semibold px-3 py-1.5 rounded-full border transition whitespace-nowrap
                              ${activeCategory === cat
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                              }`}
                          >
                            {cat === "all"
                              ? `All (${explanation.appliedTags.length})`
                              : `${CATEGORY_ICONS[cat] ?? ""} ${cat.replace("-", " ")} (${appliedByCategory[cat]?.length ?? 0})`
                            }
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tag rows */}
                    <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
                      {filteredApplied.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3">
                          <span className="text-base w-5 text-center flex-shrink-0">{CATEGORY_ICONS[t.category] ?? "🏷️"}</span>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{t.label}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                              {t.category.replace("-", " ")} · {t.confidence} confidence
                            </p>
                          </div>

                          {/* Mini bar */}
                          <div className="w-20 flex-shrink-0">
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (t.appliedWeight / 0.5) * 100)}%`,
                                  background: t.polarity === "positive" ? "#1a9e5c" : "#d9534f",
                                }}
                              />
                            </div>
                          </div>

                          <span className={`text-xs font-bold w-12 text-right flex-shrink-0 ${t.polarity === "positive" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {t.polarity === "positive" ? "+" : "−"}{t.appliedWeight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoScoreCalculator;