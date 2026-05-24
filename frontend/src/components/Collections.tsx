import { useState, useEffect } from 'react';
import { Heart, Clock, X, Filter, Menu } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CollectionsPage = () => {
  const { user } = useAuthContext();
  
  const [collections, setCollections] = useState({
    favorites: [],
    reviewLater: [],
    notInterested: []
  });
  const [activeCollection, setActiveCollection] = useState('favorites');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collections data
  useEffect(() => {
    const fetchCollections = async () => {      
      setIsLoading(true);
      setError(null);
      try {
        // Fixed API endpoint mapping - ensure consistency
        const [favoritesRes, reviewLaterRes, notInterestedRes] = await Promise.all([
          fetch('/api/favorites'),
          fetch('/api/review-later'),
          fetch('/api/not-interested') 
        ]);

        if (!favoritesRes.ok || !reviewLaterRes.ok || !notInterestedRes.ok) {
          // More specific error handling
          const errorDetails = await Promise.all([
            favoritesRes.ok ? null : favoritesRes.text().catch(() => 'Unknown error'),
            reviewLaterRes.ok ? null : reviewLaterRes.text().catch(() => 'Unknown error'),
            notInterestedRes.ok ? null : notInterestedRes.text().catch(() => 'Unknown error')
          ]);
          
          console.error('API Errors:', {
            favorites: errorDetails[0],
            reviewLater: errorDetails[1],
            notInterested: errorDetails[2]
          });
          
          throw new Error('Failed to fetch collections from server');
        }

        const [favoritesData, reviewLaterData, notInterestedData] = await Promise.all([
          favoritesRes.json(),
          reviewLaterRes.json(),
          notInterestedRes.json()
        ]);

        // Ensure data is always an array and handle the response structure
        const processData = (data) => {
          if (Array.isArray(data)) return data;
          if (data && typeof data === 'object' && Array.isArray(data.products)) return data.products;
          if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
          return [];
        };

        const processedCollections = {
          favorites: processData(favoritesData),
          reviewLater: processData(reviewLaterData),
          notInterested: processData(notInterestedData)
        };

        setCollections(processedCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        setCollections({
          favorites: [],
          reviewLater: [],
          notInterested: []
        });
      } finally {
        setIsLoading(false);
      }
    };

      fetchCollections();
  }, [user?.isLoggedin]);

  // Remove product from collection (only from current active collection)
  const removeProduct = async (productId, collectionName) => {
    try {
      // Fixed endpoint mapping - ensure consistency
      const endpointMap = {
        'reviewLater': 'review-later',
        'notInterested': 'not-interested', // Make sure this matches exactly
        'favorites': 'favorites'
      };
      
      const endpoint = `/api/${endpointMap[collectionName]}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        setCollections(prev => ({
          ...prev,
          [collectionName]: prev[collectionName].filter(p => p.product_id !== productId)
        }));
      } else {
        console.error('Failed to remove product:', await response.text());
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Add product to collection
const addToCollection = async (productId, fromCollection, toCollection) => {
  try {
    const product = collections[fromCollection]?.find(p => p.product_id === productId);
    if (!product) {
      console.error('Product not found in source collection');
      return;
    }

    const existsInTarget = collections[toCollection]?.some(p => p.product_id === productId);
    if (existsInTarget) {
      console.log('Product already exists in target collection');
      return;
    }

    const endpointMap = {
      'reviewLater': 'review-later',
      'notInterested': 'not-interested',
      'favorites': 'favorites'
    };

    const addEndpoint = `/api/${endpointMap[toCollection]}`;
    const addResponse = await fetch(addEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId })
    });

    if (addResponse.ok) {
      setCollections(prev => ({
        ...prev,
        [toCollection]: [...(prev[toCollection] || []), product]
      }));

      // If adding to Not Interested, remove from Favorites and Review Later
          if (toCollection === 'notInterested') {
            const otherCollections = ['favorites', 'reviewLater'];
            for (const col of otherCollections) {
              if (collections[col]?.some(p => p.product_id === productId)) {
                await removeProduct(productId, col);
              }
            }
          }
    } else {
      const errorText = await addResponse.text();
      console.error('Failed to add product to collection:', errorText);
    }
  } catch (error) {
    console.error('Error adding product to collection:', error);
  }
};


  // Export function to be used from other components
  const addProductToCollection = async (productData, collectionName) => {
    try {
      // Check if product already exists in target collection
      const existsInTarget = collections[collectionName]?.some(p => p.product_id === productData.product_id);
      if (existsInTarget) {
        console.log('Product already exists in target collection');
        return { success: false, message: 'Product already in collection' };
      }

      // Fixed endpoint mapping - ensure consistency
      const endpointMap = {
        'reviewLater': 'review-later',
        'notInterested': 'not-interested', // Make sure this matches exactly
        'favorites': 'favorites'
      };

      const endpoint = `/api/${endpointMap[collectionName]}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: productData.product_id,
          productData: productData // Send full product data in case backend needs it
        })
      });

      if (response.ok) {
        // Update UI to add product to target collection
        setCollections(prev => ({
          ...prev,
          [collectionName]: [...(prev[collectionName] || []), productData]
        }));
        return { success: true, message: 'Product added to collection' };
      } else {
        const errorText = await response.text();
        console.error('Failed to add product to collection:', errorText);
        return { success: false, message: 'Failed to add product' };
      }
    } catch (error) {
      console.error('Error adding product to collection:', error);
      return { success: false, message: 'Network error' };
    }
  };

  // Make the function available globally for other components
  useEffect(() => {
    window.addToCollectionFromExternalPage = addProductToCollection;
    return () => {
      delete window.addToCollectionFromExternalPage;
    };
  }, [collections]);

  const collectionConfig = {
    favorites: {
      title: 'Favorites',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      count: collections.favorites?.length || 0
    },
    reviewLater: {
      title: 'Review Later',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      count: collections.reviewLater?.length || 0
    },
    notInterested: {
      title: 'Not Interested',
      icon: X,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      count: collections.notInterested?.length || 0
    }
  };

  const ProductCard = ({ product, collectionName }) => {
    
    
    // Fallback image URL
    const fallbackImageUrl = "https://res.cloudinary.com/dvtipjp4u/image/upload/v1753449675/logo_qwx4aj.png";
    
    // Check if product exists in other collections - with null safety
    const isInFavorites = collections.favorites?.some(p => p.product_id === product.product_id) || false;
    const isInReviewLater = collections.reviewLater?.some(p => p.product_id === product.product_id) || false;
    const isInNotInterested = collections.notInterested?.some(p => p.product_id === product.product_id) || false;
    
return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row">
      {/* Product Image - Clickable */}
      <Link to={`/product/${product.product_id}`} state={{ product }} className="w-full md:w-48 h-48 md:h-40 flex-shrink-0 group">
        <img 
          src={product.image_url || fallbackImageUrl} 
          alt={product.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = fallbackImageUrl;
          }}
        />
      </Link>
      
      {/* Product Info */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        <div>
          {/* Clickable Title and Description */}
          <Link to={`/product/${product.product_id}`} state={{ product }} className="block hover:opacity-80 transition-opacity">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {product.name || 'Unnamed Product'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {product.description || 'No description available'}
            </p>
          </Link>
        </div>
        
        {/* Action Buttons - NOT wrapped in Link */}
        <div className="flex gap-2 flex-wrap">
          {/* Add to Favorites Button */}
          {collectionName !== 'notInterested' &&
          <>
          {collectionName !== 'favorites' && !isInFavorites && (
            <button
              onClick={() => addToCollection(product.product_id, collectionName, 'favorites')}
              className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-700/50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Heart className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              <span className="hidden sm:inline">Add to </span>Favorites
            </button>
          )}
          {collectionName !== 'favorites' && isInFavorites && (
            <div className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-800/50 dark:text-red-500 text-red-700 rounded-lg">
              <Heart className="w-3 md:w-4 h-3 md:h-4 mr-1 fill-current" />
              <span className="hidden sm:inline">In </span>Favorites
            </div>
          )}

          {/* Add to Review Later Button */}
          {collectionName !== 'reviewLater' && !isInReviewLater && (
            <button
              onClick={() => addToCollection(product.product_id, collectionName, 'reviewLater')}
              className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:hover:bg-blue-700/50 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Clock className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Review Later
            </button>
          )}
          {collectionName !== 'reviewLater' && isInReviewLater && (
            <div className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-800/50 dark:text-blue-500 text-blue-700 rounded-lg">
              <Clock className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              <span className="hidden sm:inline">In </span>Review Later
            </div>
          )}
          </>
        }

          {/* Add to Not Interested Button */}
          {collectionName !== 'notInterested' && !isInNotInterested && (
            <button
              onClick={() => addToCollection(product.product_id, collectionName, 'notInterested')}
              className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-gray-50 text-gray-600 dark:bg-gray-800/60 dark:hover:bg-gray-700/50 rounded-lg dark:text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Not Interested
            </button>
          )}

          {/* Remove from Current Collection Button */}
          <button
            onClick={() => removeProduct(product.product_id, collectionName)}
            className="flex items-center px-2 md:px-3 py-2 text-xs md:text-sm bg-red-50 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <X className="w-3 md:w-4 h-3 md:h-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
  };

  const activeConfig = collectionConfig[activeCollection];
  const currentProducts = collections[activeCollection] || [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-green-500 text-3xl md:text-4xl lg:text-5xl font-bold mb-2.5">
            My Collections
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
            Organize your sustainable product discoveries
          </p>
        </div>

        {/* Mobile Collection Tabs - Show on small screens */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {Object.entries(collectionConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeCollection === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveCollection(key)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive 
                      ? `${config.bgColor} ${config.color}` 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">{config.title}</span>
                  <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {config.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 md:gap-6">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className={`hidden md:block ${sidebarOpen ? 'w-64 lg:w-80' : 'w-20'} transition-all duration-300 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-6 overflow-hidden">
              {/* Sidebar Toggle */}
              <div className={`flex items-center ${sidebarOpen ? 'justify-between p-4 lg:p-6 pb-4' : 'justify-center p-4'}`}>
                {sidebarOpen && (
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                    Collections
                  </h2>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Collection Items */}
              <div className={`${sidebarOpen ? 'px-4 lg:px-6 pb-4 lg:pb-6 space-y-2' : 'px-2 pb-4 space-y-3'}`}>
                {Object.entries(collectionConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = activeCollection === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCollection(key)}
                      className={`w-full flex items-center rounded-lg transition-colors ${
                        sidebarOpen 
                          ? 'p-3' 
                          : 'p-3 justify-center'
                      } ${
                        isActive 
                          ? `${config.bgColor} ${config.color}` 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      title={sidebarOpen ? '' : config.title}
                    >
                      <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''} flex-shrink-0`} />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left font-medium text-sm lg:text-base">
                            {config.title}
                          </span>
                          <span className="text-xs lg:text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                            {config.count}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Collection Header - Hidden on mobile since we have tabs */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 mb-4 lg:mb-6">
              <div className="flex items-center">
                <activeConfig.icon className={`w-5 lg:w-6 h-5 lg:h-6 ${activeConfig.color} mr-3`} />
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {activeConfig.title}
                </h2>
                <span className="ml-auto text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                  {currentProducts?.length || 0} items
                </span>
              </div>
            </div>

            {/* Mobile Collection Header */}
            <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center">
                <activeConfig.icon className={`w-5 h-5 ${activeConfig.color} mr-3`} />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeConfig.title}
                </h2>
                <span className="ml-auto text-gray-500 dark:text-gray-400 text-sm">
                  {currentProducts?.length || 0} {currentProducts?.length ==1 ? `item` : `items`}
                </span>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 lg:h-96 text-gray-600 dark:text-gray-400">
                <div className="w-8 lg:w-10 h-8 lg:h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm lg:text-base">Loading your collections...</p>
              </div>
            ) : (
              <>
                {currentProducts && currentProducts.length > 0 ? (
                  <div className="space-y-4">
                    {currentProducts.map((product, index) => (
                      <ProductCard 
                        key={product.product_id || `product-${index}`} 
                        product={product} 
                        collectionName={activeCollection}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 lg:p-12 text-center">
                    <activeConfig.icon className={`w-12 lg:w-16 h-12 lg:h-16 ${activeConfig.color} mx-auto mb-4 opacity-50`} />
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No items in {activeConfig.title.toLowerCase()}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                      Start exploring products to build your collection!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
