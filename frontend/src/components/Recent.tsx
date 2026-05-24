import { useState, useEffect } from "react";
import ProductsPage from './ProductsPage'

interface props {
  products: any, 
  setProducts: any
}

const Recent: React.FC<props> = ({ products, setProducts }) => {

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async() => {
    try {
      const response = await fetch(`/api/get-recent-products`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const { recommendations } = await response.json()

      setProducts(() => recommendations)
      setIsLoading(() => false)
    }
    catch(err) {
      console.error("Error fetching recent products: ", err)
    }
  }
  
  useEffect(() => {
    if(products.length === 0)
    {
      fetchData() 
    }
    else
    {
      setIsLoading(() => false)
    }
  }, [])

  return (
    <>
      <ProductsPage products={products.map((p:any) => { return {...p, product_id: p.code}})} isLoading={isLoading}/>
    </>
  );
}

export default Recent 
