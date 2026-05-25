import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Heart, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';
import ScoreColor from "../../utils/ScoreColor"
// Custom Popup Component
function Popup({ isOpen, onClose, type = 'success', title, message }) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds for success messages
      if (type === 'success') {
        const timer = setTimeout(() => {
          onClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, onClose, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 m-4 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${
            type === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {type === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Action Button for error messages */}
        {type === 'error' && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(0);
  const analyticsSentRef = useRef(false);
  const location = useLocation();
  const product = location.state?.product;
  const isFirstRender = useRef(true);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const navigate = useNavigate();
  const ratingRef = useRef(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReviewLater, setIsReviewLater] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  
  // Loading states for buttons
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingReviewLater, setIsLoadingReviewLater] = useState(false);
  const [isLoadingNotInterested, setIsLoadingNotInterested] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [averageRating,setAverageRating] = useState<number>(0)

  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Function to show popup
  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Function to close popup
  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // Fallback image URL
  const fallbackImageUrl = "https://res.cloudinary.com/dvtipjp4u/image/upload/v1753449675/logo_qwx4aj.png";

  const formatEcoScore = (score) => {
    if (score == null || score == undefined || isNaN(Number(score)))
      return 'N/A';
    return Number(score).toFixed(1)
  }

  const getEcoScoreColor = (score) => {
    if (!score || score < 0) return '#9ca3af'; // Gray for invalid scores
    if (score >= 9) return '#22c55e'; // Green
    if (score >= 7) return '#84cc16'; // Light green
    if (score >= 5) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  function increaseCount() {
    setCount((count) => count + 1);
  }

  useEffect(()=>{
    const getCharacteristics = async () => {
      try{
        const response = await fetch(`/api/check-characteristics?productId=${product.product_id}`)
        const data = await response.json()
        setIsReviewLater(data.reviewLater)
        setIsFavorited(data.favorites)
      }
      catch(err){
        console.error(err)
      }
    } 
    if (product?.product_id) {
      getCharacteristics()
    }
  },[])

  // API functions for favorites
  const addToFavorites = async (productId) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to favorites')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  const removeFromFavorites = async (productId) => {
    try {
      const response = await fetch(`/api/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from favorites')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // API functions for review later
  const addToReviewLater = async (productId) => {
    try {
      const response = await fetch(`/api/review-later`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to review later')
      }
      
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const removeFromReviewLater = async (productId) => {
    try {
      const response = await fetch(`/api/review-later`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from review later')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error removing from review later:', error)
      throw error
    }
  }

  // API function for not interested
  const addToNotInterested = async (productId) => {
    try {
      const response = await fetch(`/api/not-interested`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to not interested')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error adding into not interested:', error)
      throw error
    }
  }

  // Button handlers
  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoadingFavorite) return
    
    setIsLoadingFavorite(true)
    
    try {
      if (isFavorited) {
        await removeFromFavorites(product.product_id)
        setIsFavorited(false)
      } else {
        await addToFavorites(product.product_id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handleReviewLater = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoadingReviewLater) return
    
    setIsLoadingReviewLater(true) 
    try {
      if (isReviewLater) {
        await removeFromReviewLater(product.product_id)
        setIsReviewLater(false)
      } else {
        await addToReviewLater(product.product_id)
        setIsReviewLater(true)
      }
    } catch (error) {
      console.error('Failed to update review later status:', error)
    } finally {
      setIsLoadingReviewLater(false)
    } 
  }

  const handleNotInterestedClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoadingNotInterested) return
    
    setIsLoadingNotInterested(true)
    
    try {
      if (!isNotInterested) {
        await addToNotInterested(product.product_id)
        setIsNotInterested(true)
        // Navigate to home after marking as not interested
        navigate("/home")
      }
    } catch (error) {
      console.error('Failed to update not interested status:', error)
    } finally {
      setIsLoadingNotInterested(false)
    }
  }

  // Send analytics data to server (for viewed action on unmount)
  const sendViewedAnalytics = async () => {
    // Prevent duplicate calls
    if (analyticsSentRef.current || !startTimeRef.current || !id) {
      return;
    }

    try {
      const endTime = Date.now();
      const duration = (endTime - startTimeRef.current) / 1000;
      
      // Only send if duration is meaningful (at least 1 second)
      if (duration >= 1) {
        console.log('Sending analytics:', { id, duration });
        analyticsSentRef.current = true; // Mark as sent before the API call
        
        const response = await fetch(`/api/duration/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            duration: duration
          }),
        });
        
        if (!response.ok) {
          console.error(`Failed to send viewed analytics: ${response.status} ${response.statusText}`);
        } else {
          console.log('Analytics sent successfully');
        }
      } else {
        console.log('Duration too short, not sending analytics');
      }
    } catch (error) {
      console.error("Error sending viewed analytics:", error);
    }
  };

  
  useEffect(()=>{
    const getAverageRating = async ():Promise<void> => {
      try{
        const response = await fetch(`/api/average-rating?productId=${product.product_id}`)
        const data = await response.json()
        setAverageRating(data.averageRating)
      }
      catch(err){
        console.error(err)
      }
    }
    getAverageRating()
  },[popup.isOpen])

  // Store rating on server
  const storeRating = async (ratingValue) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating: ratingValue
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to store rating');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error storing rating", error);
      throw error;
    }
  };

  // Initialize timer and setup cleanup - FIXED VERSION
  useEffect(() => {
    if (!id) return;
    
    console.log('Setting up analytics for product:', id);
    
    // Reset analytics flag for new product
    analyticsSentRef.current = false;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(increaseCount, 1000);
    
    // Cleanup function - send viewed analytics when component unmounts or id changes
    return () => {
      clearInterval(intervalRef.current);
      
      // Send analytics immediately on cleanup
      if (!analyticsSentRef.current && startTimeRef.current && id) {
        const endTime = Date.now();
        const duration = (endTime - startTimeRef.current) / 1000;
        
        if (duration >= 1) {
          console.log('Sending analytics on cleanup:', { id, duration });
          analyticsSentRef.current = true;
            fetch(`/api/duration/${id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ duration }),
              keepalive: true // Keep request alive even if page is closing
            }).catch(console.error);
        }
      }
    };
  }, [id]); // Only depend on id

  // Additional cleanup on window beforeunload (page refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendViewedAnalytics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id]);

  // Sync rating state with ref
  useEffect(() => {
    ratingRef.current = rating;
  }, [rating]);

  // Fetch existing rating on component mount
  useEffect(() => {
    if (!id) return;
    
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/product/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.rating) {
            setRating(data.rating);
          }
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };
    
    fetchRating();
  }, [id]);

  // Handle rating submission (without redirect)
  const handleSubmit = async () => {
    if (!rating) {
      showPopup('error', 'Rating Required', 'Please select a rating before submitting');
      return;
    }
    
    setIsSubmittingRating(true);
    
    try {
      await storeRating(rating);
      showPopup('success', 'Success!', 'Rating submitted successfully!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      showPopup('error', 'Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Popup */}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image Section */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={product.image_url || fallbackImageUrl}
                    alt={product.name || 'Product image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {e.target.src = fallbackImageUrl}}
                  />
                </div>
                
                {/* Eco Score Badge on Image */}
                <div 
                  className="absolute top-4 left-4 text-white px-3 py-2 rounded-lg font-bold text-lg shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: ScoreColor(product.ecoscore || product.eco_score) }}
                >
                  Eco Score: {formatEcoScore((product.ecoscore || product.eco_score)/10)}/10
                </div>

                {/* Action Buttons on Image */}
                <div className="absolute group-hover:flex hidden top-4 right-4 flex-col gap-3">
                  {/* Favorite Button */}
                  <button
                    onClick={handleFavoriteClick}
                    disabled={isLoadingFavorite}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFavorited 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
                    }`}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isLoadingFavorite ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    )}
                  </button>

                  {/* Review Later Button */}
                  <button
                    onClick={handleReviewLater}
                    disabled={isLoadingReviewLater}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isReviewLater 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-blue-500 shadow-md'
                    }`}
                    title={isReviewLater ? 'Remove from review later' : 'Add to review later'}
                  >
                    {isLoadingReviewLater ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </button>

                  {/* Not Interested Button */}
                  <button
                    onClick={handleNotInterestedClick}
                    disabled={isLoadingNotInterested}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isNotInterested 
                        ? 'bg-gray-500 text-white shadow-lg' 
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-gray-500 shadow-md'
                    }`}
                    title={isNotInterested ? 'Marked as not interested' : 'Mark as not interested'}
                  >
                    {isLoadingNotInterested ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Brand */}
              <div className="text-blue-600 dark:text-blue-400 text-sm font-medium uppercase tracking-wide">
                {product.brand || product.brands || 'Unknown Brand'}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name || product.product_name || 'Product Name Not Available'}
              </h1>

              {/* Eco Score Section */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Eco Score:</span>
                  <div 
                    className="px-3 py-1 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: ScoreColor(product.ecoscore || product.eco_score) }}
                  >
                    {formatEcoScore((product.ecoscore || product.eco_score)/10)}/10
                  </div>
                </div>
              </div>

              {/* Action Status Indicators */}
              <div className="flex items-center gap-4">
                {isFavorited && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <Heart className="fill-current w-4 h-4" />
                    <span className="text-sm font-medium">Favorited</span>
                  </div>
                )}
                {isReviewLater && (
                  <div className="flex items-center gap-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Review Later</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {
                  [...Array(5)].map((_,index) => {
                    const fill = averageRating-index-1 
                    let fillPercent=0
                    if(fill>=0){
                      fillPercent=100
                    }else if(fill<0 && fill>-1){
                      fillPercent = 100-Math.abs(fill)*100
                    }
                    const colorFill = `inset(0 ${100-fillPercent}% 0 0)`
                    return (
                      <div className="relative">

                        <FaStar className="absolute text-gray-300" size={18} />
                        <FaStar style = {{clipPath:colorFill}} color={"#fbbf24"} size={18}/>
                        
                      </div>
                    )
                  }) 
                }
              </div>
              {/* Product Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Category */}
              {/* <div className="space-y-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Category:</span>
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-200 dark:border-green-700 ml-2">
                  {product.category || 'Uncategorized'}
                </span>
              </div> */}

              {/* Rating Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate this Product</h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((star, idx) => {
                    const ratingValue = idx + 1;
                    return (
                      <label key={idx} className="cursor-pointer">
                        <FaStar
                          className="transition-colors duration-200 hover:scale-110"
                          color={ratingValue <= (hover || rating) ? "#fbbf24" : "#d1d5db"}
                          size={32}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        />
                        <input
                          type="radio"
                          name="rating"
                          className="hidden"
                          value={ratingValue}
                          onChange={() => {
                            setRating(ratingValue);
                          }}
                        />
                      </label>
                    );
                  })}
                  {rating && (
                    <span className="ml-3 text-gray-600 dark:text-gray-400 text-sm">
                      {rating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || isSubmittingRating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {isSubmittingRating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Rate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
