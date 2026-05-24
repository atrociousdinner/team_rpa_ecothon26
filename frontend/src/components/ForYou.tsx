import { useEffect, useState, useCallback } from 'react'
import { useAuthContext } from '../context/AuthContext'
import ProductsPage from './ProductsPage'
import { Link } from 'react-router-dom'

interface props {
  products: any, 
  setProducts: any
}

const ForYou: React.FC<props> = ({ products, setProducts }) => {
  const { user, loading } = useAuthContext()
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PRODUCTS_PER_PAGE = 50;

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    if (!user?.isLoggedIn) return;

    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(`/api/get-sample-products?page=${page}&limit=${PRODUCTS_PER_PAGE}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();

      // Check if response has the expected structure
      let processedProducts = [];
      
      if (data.products && Array.isArray(data.products)) {
        // New paginated response structure
        console.log('Received products:', data.products.length, 'hasMore:', data.hasMore); // Debug log
        const shuffle = (arr) => {
          const copy = [...arr];
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
          return copy;
        };

        // Sort and shuffle products by similarity (preserving original logic)
        const high = data.products.filter(p => p.similarity > 0.5);
        const medium = data.products.filter(p => p.similarity > 0.09 && p.similarity <= 0.5);
        const low = data.products.filter(p => p.similarity <= 0.09);

        const shuffledHigh = shuffle(high);
        const shuffledMedium = shuffle(medium);
        const shuffledLow = shuffle(low);
        processedProducts = [...shuffledHigh, ...shuffledMedium, ...shuffledLow];
        
        // Update hasMore from server response
        setHasMore(data.hasMore);
      } else if (Array.isArray(data)) {
        // Fallback for old response structure (direct array)
        const shuffle = (arr) => {
          const copy = [...arr];
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
          return copy;
        };

        const high = data.filter(p => p.similarity > 0.5);
        const medium = data.filter(p => p.similarity > 0.09 && p.similarity <= 0.5);
        const low = data.filter(p => p.similarity <= 0.09);

        const shuffledHigh = shuffle(high);
        const shuffledMedium = shuffle(medium);
        const shuffledLow = shuffle(low);
        processedProducts = [...shuffledHigh, ...shuffledMedium, ...shuffledLow];
        
        // For old structure, assume no more if less than requested
        setHasMore(processedProducts.length === PRODUCTS_PER_PAGE);
      }

      if (append) {
        setProducts(prev => [...prev, ...processedProducts]);
      } else {
        setProducts(processedProducts);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [user?.isLoggedIn]);

  // Initial load
  useEffect(() => {
    if (user?.isLoggedIn) {
      setCurrentPage(1);
      fetchProducts(1, false);
    }
  }, [user?.isLoggedIn, fetchProducts]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    console.log('loadMoreProducts called:', { currentPage, isLoadingMore, hasMore }); // Debug log
    
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      console.log('Loading page:', nextPage); // Debug log
      setCurrentPage(nextPage);
      fetchProducts(nextPage, true);
    }
  }, [currentPage, isLoadingMore, hasMore, fetchProducts]);

  // Reset pagination when user changes
  useEffect(() => {
    if (user?.isLoggedIn) {
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [user?.userId]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (user?.isLoggedIn) {
    return (
      <div className="text-white">
        {/*{user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
        name: {user.displayName}<br/>
        id: {user.userId}<br/>
        email: {user.email}<br/>
        gender: {user.gender}<br/>
        dob: {user.dob}<br/>
        joined: {user.createdAt}*/}
        <ProductsPage 
          products={products} 
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreProducts}
        />
      </div>
    )
  }
  
  return <div className="my-6 text-yellow-800 dark:text-amber-600 rounded-lg shadow-md
    py-2 px-3 bg-green-600/10 mx-8">Please <Link to={'/login'} className="text-green-600">Sign In</Link> to continue.</div>
}

export default ForYou 
