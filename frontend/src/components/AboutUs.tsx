import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaUser, FaClock, FaHeart, FaLeaf, FaRecycle, FaGlobe, FaChevronDown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa'
import { MdShare, MdBookmark, MdNature, MdWarning } from 'react-icons/md'
import { useAuthContext } from '../context/AuthContext'
const EcoFriendlyBlog: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const navigate = useNavigate()
  const {user} = useAuthContext()
  useEffect(() => {
    setIsVisible(true)
    // Calculate reading time (average 200 words per minute)
    const wordCount = 1400 // Approximate word count of the blog
    setReadingTime(Math.ceil(wordCount / 200))
  }, [])

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const faqData = [
    {
      question: "What makes a product truly eco-friendly?",
      answer: "A truly eco-friendly product considers its entire lifecycle - from sustainable sourcing of materials, to energy-efficient manufacturing, minimal packaging, long durability, and end-of-life recyclability or biodegradability. It should also be produced by companies with transparent environmental practices and legitimate certifications like ENERGY STAR, FSC, or Cradle to Cradle."
    },
    {
      question: "Why are eco-friendly products often more expensive?",
      answer: "Eco-friendly products typically cost more due to sustainable materials being pricier, smaller production scales, ethical labor practices, and investment in cleaner technologies. However, they often provide better long-term value through durability, reduced health impacts, and lower environmental costs over time."
    },
    {
      question: "How can I identify greenwashing?",
      answer: "Watch for vague terms like 'natural' or 'eco-friendly' without specific backing, green packaging without substance, lack of third-party certifications, hidden trade-offs (like organic but heavily packaged products), and companies that make broad environmental claims without detailed sustainability reports."
    },
    {
      question: "What's the biggest challenge in finding eco-friendly alternatives?",
      answer: "The main challenges include overwhelming greenwashing in the market, limited availability in mainstream stores, higher upfront costs, difficulty verifying authenticity, lack of standardized labeling, and the time required to research each product thoroughly."
    },
    {
      question: "How does your platform solve these problems?",
      answer: "Our platform curates verified eco-friendly products, provides transparent sustainability ratings based on scientific data, offers price comparisons, connects users with local sustainable options, and eliminates greenwashing through rigorous verification processes. We make sustainable shopping simple and trustworthy."
    },
    {
      question: "Are eco-friendly products really more effective?",
      answer: "Quality varies, but many eco-friendly products perform as well as or better than conventional alternatives. They often use concentrated formulas, contain fewer harsh chemicals, and are designed for durability. The key is choosing products from reputable brands with proven track records."
    },
    {
      question: "How can I transition to eco-friendly products affordably?",
      answer: "Start with high-impact items you use frequently, buy in bulk when possible, look for sales and subscription discounts, consider DIY alternatives for some products, prioritize multi-purpose items, and replace products gradually as they run out rather than all at once."
    },
    {
      question: "What environmental impact do individual choices make?",
      answer: "Individual choices create collective market demand that drives systemic change. When millions choose eco-friendly products, it signals manufacturers to invest in sustainable alternatives, creates economies of scale that reduce prices, influences policy changes, and accelerates innovation in green technologies."
    },
    {
      question: "How do I know if a certification is legitimate?",
      answer: "Look for well-established certifications like ENERGY STAR, EPEAT, Forest Stewardship Council (FSC), USDA Organic, Green Seal, or Cradle to Cradle. Research the certifying body, check if they have transparent standards, and verify the certification number on the organization's official website."
    },
    {
      question: "What's the difference between biodegradable and compostable?",
      answer: "Biodegradable means the product will break down naturally over time, but doesn't specify how long or under what conditions. Compostable means it will break down into non-toxic components within a specific timeframe (usually 90-180 days) under proper composting conditions, leaving no harmful residue."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Blog Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <header className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Environmental Crisis
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              The Eco-Friendly Product Crisis: Why Sustainable Shopping Is Broken
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Exploring the systemic problems that make finding genuinely sustainable products nearly impossible for conscious consumers.
            </p>
          </div>

          {/* Blog Meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-8">
            <div className="flex items-center">
              <FaCalendarAlt className="h-4 w-4 mr-2" />
              <span>Published January 15, 2025</span>
            </div>
            <div className="flex items-center">
              <FaClock className="h-4 w-4 mr-2" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center">
              <FaUser className="h-4 w-4 mr-2" />
              <span>Environmental Research Team</span>
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">
              Despite growing environmental awareness, the market for truly eco-friendly products remains fundamentally broken.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Consumers today face an unprecedented challenge: navigating a marketplace flooded with products claiming environmental benefits while delivering little to no positive impact. The result is a system that not only fails to protect our planet but actively misleads those trying to make responsible choices.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              This crisis extends far beyond individual purchasing decisions—it represents a systemic failure that undermines global sustainability efforts and erodes consumer trust in environmental claims.
            </p>
          </section>

          {/* The Crisis Section */}
          <section className="mb-12">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-3" />
                The Scale of the Problem
              </h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Recent studies reveal the shocking extent of the eco-friendly product crisis:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-red-500 mb-2">73%</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Greenwashing Rate
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Of products labeled as "eco-friendly" fail to meet basic environmental standards, misleading consumers with false claims.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-orange-500 mb-2">45min</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Research Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Average time consumers spend researching each eco-friendly purchase, often ending up more confused than informed.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-purple-500 mb-2">3x</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Price Premium
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Higher cost for genuine eco-friendly products compared to conventional alternatives, creating accessibility barriers.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-blue-500 mb-2">68%</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Consumer Confusion
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Of environmentally conscious consumers report feeling overwhelmed and uncertain about their sustainable purchasing decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Root Causes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Root Causes of the Crisis
            </h2>

            <div className="space-y-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MdWarning className="h-5 w-5 text-yellow-500 mr-3" />
                  Regulatory Gaps
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The absence of standardized definitions and regulations for terms like "eco-friendly," "sustainable," and "green" allows companies to make unsubstantiated claims without consequences.
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>No universal standards for environmental claims</li>
                  <li>Weak enforcement of existing regulations</li>
                  <li>Inconsistent certification requirements across industries</li>
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaGlobe className="h-5 w-5 text-blue-500 mr-3" />
                  Market Incentives
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Current market structures reward appearance over substance, making superficial green marketing more profitable than genuine sustainability investments.
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Higher profits from greenwashing than genuine sustainability</li>
                  <li>Consumer willingness to pay premium for perceived eco-friendliness</li>
                  <li>Lack of transparency in supply chains</li>
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MdNature className="h-5 w-5 text-green-500 mr-3" />
                  Information Asymmetry
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The complexity of environmental impact assessment creates a knowledge gap that companies exploit while consumers struggle to make informed decisions.
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Complex lifecycle assessments beyond consumer understanding</li>
                  <li>Overwhelming and contradictory information sources</li>
                  <li>Technical jargon that obscures real environmental impact</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Impact Analysis */}
          <section className="mb-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaRecycle className="h-6 w-6 text-blue-500 mr-3" />
                The Broader Impact
              </h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              This crisis extends beyond individual frustration, creating systemic problems that undermine global sustainability efforts:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Environmental Consequences</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Consumers unknowingly purchase products with higher environmental impact than conventional alternatives, actually increasing their carbon footprint while believing they're helping the planet.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Economic Distortion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Market rewards flow to companies with the best marketing rather than the most sustainable practices, creating perverse incentives that discourage genuine innovation.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Inequality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  High prices for genuine eco-friendly products make sustainable living a luxury, creating environmental inequality where only wealthy consumers can afford to reduce their impact.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trust Erosion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Repeated exposure to greenwashing creates cynicism about environmental claims, potentially reducing overall participation in sustainability efforts.
                </p>
              </div>
            </div>
          </section>

          {/* Solution Framework */}
          <section className="mb-12">
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaLeaf className="h-6 w-6 text-green-500 mr-3" />
                A Path Forward
              </h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Addressing this crisis requires a comprehensive approach that combines technology, transparency, and consumer education:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Verification Systems</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Rigorous, science-based verification processes that cut through marketing claims to reveal actual environmental impact.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Transparency Tools</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Clear, accessible information about product lifecycle, supply chain practices, and comparative environmental impact.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Market Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Platforms that connect consumers with verified sustainable products while supporting fair pricing and accessibility.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Consumer Education</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Empowering consumers with knowledge and tools to make informed decisions without requiring extensive research.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          {
          !user.isLoggedIn &&
          <section className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make Sustainable Shopping Simple?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Join us in building a platform that cuts through greenwashing and makes genuine eco-friendly products accessible to everyone.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Join Our Mission
            </button>
          </section>
          }
        </div>

        {/* FAQ Section */}
        <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about eco-friendly products and sustainable shopping
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <FaChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Blog Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <FaHeart className="h-4 w-4 mr-2" />
                <span className="text-sm">Found this helpful?</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <MdShare className="h-4 w-4 mr-2" />
                <span className="text-sm">Share</span>
              </button>
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <MdBookmark className="h-4 w-4 mr-2" />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}

export default EcoFriendlyBlog
