import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Heart, Clock, X } from 'lucide-react'
import ScoreColor from '../../utils/ScoreColor'
const ProductCard = ({ product, initialFavorited = false, initialReviewLater = false, initialNotInterested = false }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isReviewLater, setIsReviewLater] = useState(initialReviewLater)
  const [isNotInterested, setIsNotInterested] = useState(initialNotInterested)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [isLoadingReviewLater, setIsLoadingReviewLater] = useState(false)
  const [isLoadingNotInterested, setIsLoadingNotInterested] = useState(false)
  
  // useEffect(()=>{
  //   const getCharacteristics = async () => {
  //     try{
  //       const response = await fetch(`/api/check-characteristics?productId=${product.product_id}`)
  //       const data = await response.json()
  //       setIsReviewLater(data.reviewLater)
  //       setIsFavorited(data.favorites)
  //     }
  //     catch(err){
  //       console.error(err)
  //     }
  //   } 
  //   getCharacteristics()
  // },[])
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

  // Fallback image URL for when product images fail to load
  const fallbackImageUrl = "https://res.cloudinary.com/dvtipjp4u/image/upload/v1753449675/logo_qwx4aj.png";

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

  const addToReviewLater = async (productId:string) => {
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

  const removeFromReviewLater = async (productId:string):Promise<void> => {
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

  const addToNotInterested = async (productId:string):Promise<void> => {
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
  const handleReviewLater = async (e:React.MouseEvent):Promise<void> => {
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
      }
    } catch (error) {
      console.error('Failed to update not interested status:', error)
    } finally {
      setIsLoadingNotInterested(false)
    }
  }

  return (
    <Link to={`/product/${product.product_id}`}  state={{ product }}  className="block group">
      <div className=" bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        {/* Product Image Container */}
        <div className="relative group h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img 
            src={product.image_url || fallbackImageUrl} 
            alt={product.name || 'Product image'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {e.target.src = fallbackImageUrl}}
          />
          
          {/* Eco Score Badge */}
          <div 
            className="absolute top-3 left-3 text-white px-2.5 py-1.5 rounded-lg font-bold text-sm shadow-md backdrop-blur-sm"
            style={{ backgroundColor: ScoreColor(product.ecoscore || product.eco_score) }}
          >
            {formatEcoScore(product.ecoscore/10 || product.eco_score/10)}/10
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 hidden group-hover:flex flex-col gap-2">
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              disabled={isLoadingFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFavorited 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isLoadingFavorite ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              )}
            </button>

            {/* Review Later Button */}
            <button
              onClick={handleReviewLater}
              disabled={isLoadingReviewLater}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isReviewLater 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-500 shadow-md'
              }`}
              title={isReviewLater ? 'Remove from review later' : 'Add to review later'}
            >
              {isLoadingReviewLater ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </button>

            {/* Not Interested Button */}
            <button
              onClick={handleNotInterestedClick}
              disabled={isLoadingNotInterested}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isNotInterested 
                  ? 'bg-gray-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-500 shadow-md'
              }`}
              title={isNotInterested ? 'Remove from not interested' : 'Mark as not interested'}
            >
              {isLoadingNotInterested ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">
            {product.brand || product.brands || 'Unknown Brand'}
          </div>
          
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight line-clamp-2">
            {product.name || product.product_name || 'Product Name Not Available'}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {product.description || 'No description available for this product.'}
          </p>

          {/* Footer - Category and Action Indicators */}
          <div className="mt-auto flex items-center justify-between">
            {/* <span className="inline-block bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">
              {product.category || 'Uncategorized'}
            </span> */}
            
            {/* Action Indicators */}
            <div className="flex items-center gap-2">
              {isFavorited && (
                <div className="flex items-center gap-1 text-red-500">
                  <Heart className="fill-current" size={18} />
                </div>
              )}
              {isReviewLater && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Clock size={18} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
