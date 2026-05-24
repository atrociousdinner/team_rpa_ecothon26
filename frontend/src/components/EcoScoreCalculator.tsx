import { useState } from "react";
import ScoreColor from "../utils/ScoreColor";
import { positiveTags, tagDisplayMap, displayTags, tagsWithoutQuantity } from "../utils/tags";

const formatTag = (tag: string) => {
  return tagDisplayMap[tag] || tag.replace(/^en:/, "").replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const EcoScoreCalculator = () => {
  type tag = {
    name: string,
    value: any
  }

  const [productName, setProductName] = useState("");
  const [productTag, setProductTag] = useState("")
  const [showTags, setShowTags] = useState(false)
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const [ecoScore, setEcoScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) 
      {
        return prev.filter((t) => t !== tag)
      }
      else
      {
        if(productTag)
        {
          setShowTags(() => false)
        }
        setProductTag("")
        return [...prev, tag]
      }
    });
  };

  const getEcoScore = async () => {
    if (selectedTags.length === 0) return;

    setLoading(true);
    setEcoScore(null);

    try {
      const response = await fetch("/api/get_eco_score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: selectedTags
        }),
      });

      const data = await response.json();
      setEcoScore(data.ecoScore);
    } catch (error) {
      console.error("Error fetching eco score:", error);
      setEcoScore(null);
    } finally {
      setLoading(false);
    }
  };

  function clearInput() {
    setProductName(() => "")
    setProductTag(() => "")
    setSelectedTags(() => [])
    setEcoScore(() => null)
  }


  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">🌿 Eco Score Calculator</h1>

      <div className="mb-6 space-y-2">
        <label className="block text-base font-medium">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value)
          }}
          placeholder="e.g., Organic Juice"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="mb-6 space-y-2">
        <label className="block text-base font-medium">Product Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={productTag}
            onChange={(e) => {
              setProductTag(e.target.value)
              e.target.value ? setShowTags(() => true) : setShowTags(() => false)  
            }}
            placeholder="e.g., Sugar"
            className={`
              w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 transition
              ${displayTags
                .filter(tag => !selectedTags.map(tag => tag.name).includes(tag))
                .filter(tag => tagDisplayMap[tag].toLowerCase().includes(productTag.toLowerCase()))
                .length ?
                "focus:ring-blue-500" : "focus:ring-red-500"
              }
            `}
          />
          <button
            onClick = {() => setShowTags((prev) => !prev)}
            className="px-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl"
          >
            {showTags ?
            (<svg width="24" height="24" viewBox="0 0 24 24" className="fill-none stroke-3 stroke-gray-400 dark:stroke-gray-500">
              <path d="m18 15-6-6-6 6"/>
            </svg>)
            :
            (<svg width="24" height="24" viewBox="0 0 24 24" className="fill-none stroke-3 stroke-gray-400 dark:stroke-gray-500">
              <path d="m6 9 6 6 6-6"/>
            </svg>)
            }
          </button> 
        </div>
      </div>

      {displayTags
        .filter(tag => !selectedTags.map(tag => tag.name).includes(tag))
        .filter(tag => tagDisplayMap[tag].toLowerCase().includes(productTag.toLowerCase()))
        .length > 0 
      &&
      showTags
      &&
      <div className="mb-6">
        <h2 className="text-base font-medium mb-3">Select Tags</h2>
        <div className="flex flex-wrap gap-2">

          {displayTags
            .filter(tag => !selectedTags.map(tag => tag.name).includes(tag))
            .filter(tag => tagDisplayMap[tag].toLowerCase().includes(productTag.toLowerCase()))
            .map((tag) => {
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag({ name: tag, value: null })}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <span>{formatTag(tag)}</span>
                </button>
            );
          })}

        </div>
      </div>}
      
      {selectedTags.length > 0 &&
      <div className="mb-6">
        {/* <h1 className="text-md mb-3">For accuracy, specify tag contribution in terms of percentage if available:</h1> */}
        <div className="flex flex-col gap-4">
            {selectedTags.map((tag, i) => {
             
              const isPositive = positiveTags.includes(tag.name)

              return (
              <div key={i} className="flex items-center gap-4">
                <button
                  onClick={() => toggleTag(tag)}
                  className={`flex justify-center items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer
                    ${isPositive
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"}`}
                >
                  <span>
                    {formatTag(tag.name)}
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none stroke-2 stroke-white">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button> 

                  {/*{tagsWithoutQuantity.includes(tagDisplayMap[tag.name]) ||
                <div className="ml-auto">
                  {tag.value === null && 
                  <button
                    className="ml-auto text-sm px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer hover:shadow-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
                    onClick={() => setSelectedTags(prev => prev.map(p => p === tag? { ...p, value: 100 } : p))}
                  >
                    Add Percentage
                  </button>}

                  {tag.value === null || 
                  <div className="flex gap-4 ml-auto">
                    <input
                      className="ml-auto max-w-12 text-sm px-3 py-1.5 rounded-full transition-all duration-150 hover:shadow-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
                      type = "text"
                      min = {0}
                      max = {100}
                      value = {tag.value}
                      onChange = {(e) => setSelectedTags(prev => prev.map(p => p === tag? { ...p, value: Number(e.target.value) } : p))}
                    />
                    <button
                      className="ml-auto text-sm px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer hover:shadow-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
                      onClick={() => setSelectedTags(prev => prev.map(p => p === tag? { ...p, value: null } : p))}
                    >
                      Remove Percentage
                    </button>
                  </div>}
                </div>}*/}

              </div>)
            })}
        </div>
      </div>
      }

      <div className="mt-8 flex gap-4 justify-center items-center">
        {(productName.length > 0 || productTag.length > 0 || selectedTags.length > 0 || ecoScore !== null) &&
        <div className="text-center">
          <button
            onClick={() => clearInput()}
            disabled={loading || (productName.length === 0 && productTag.length === 0 && selectedTags.length === 0 && ecoScore === null)}
            className="bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow hover:bg-red-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>}

        <div className="text-center">
          <button
            onClick={getEcoScore}
            disabled={loading || selectedTags.length === 0}
            className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Calculating..." : "Get Eco Score"}
          </button>
        </div>
      </div>

      {ecoScore !== null && (
        <div className={`mt-10 text-center text-white dark:text-gray-200 border-2 rounded-xl p-6`}
        style={{ 
            backgroundColor: ScoreColor(ecoScore, 0.6), 
            borderColor: ScoreColor(ecoScore)
          }}
        >
          <p className="text-lg font-semibold mb-1">Eco Score</p>
          <p className="text-5xl font-bold">{ecoScore} / 100</p>
        </div>
      )}
    </div>
  );
};

export default EcoScoreCalculator;
