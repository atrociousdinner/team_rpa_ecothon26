import { useEffect, useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import ForYou from "./ForYou"
import Trending from "./Trending"
import Recent from "./Recent"

const Home = () => {
  const { user, loading } = useAuthContext()
  const [selection, setSelection] = useState('For You')
  const [forYouProducts, setForYouProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    if(!loading) {
      if(user.isLoggedIn)
      {
        setSelection('For You')  
      }
      else
      {
        setSelection('Trending')  
      }
    }
  }, [user, loading])

  return (
    <>
      {user.isLoggedIn &&
      <div className="flex mt-10 mb-4 max-w-2xl mx-auto shadow-lg rounded-full">
        {["For You", "Trending", "Recent"].map((s, i) =>
          <button
            className={`
              w-full mx-auto py-4 items-center justify-center text-md font-medium transition-all duration-300
              ${selection===s? "bg-green-600 text-white" : "border-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"}
              ${i === 0 ? "rounded-l-full" : ""}
              ${i === 2 ? "rounded-r-full" : ""}
            `}
            onClick={() => setSelection(() => s)}
          >
            {s}
          </button>
        )}
      </div>}

      {selection==="Trending"?
        <Trending products={trendingProducts} setProducts={setTrendingProducts}/>
        :
        <>
          {selection==="Recent"?
            <Recent products={recentProducts} setProducts={setRecentProducts}/>
            :
            <ForYou products={forYouProducts} setProducts={setForYouProducts}/>
          }
        </>
      }
    </>
  );
}

export default Home
