import React, { useState, useEffect } from "react";
import BarcodeScanner from "./subcomponents/BarcodeScanner";
import PromptInput from "./subcomponents/PromptInput";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/height.css";
import "../css/grow.css";
import ProductsPage from "./ProductsPage";

const SearchProduct: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user.isLoggedIn) {
      navigate("/");
    }
  }, [loading]);

  // type product = {
  //   code: string;
  //   product_name: string;
  //   clean_tags: string;
  //   description: string;
  //   brands: string;
  //   image_url: string;
  //   eco_score: string;
  // };

  const [searchStatus, setSearchStatus] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [method, setMethod] = useState<string>("prompt");
  const [products, setProducts] = useState([]);

  type option = {
    label: string;
    method: string;
    icon: React.ReactElement;
  };

  const options: option[] = [
    {
      label: "Input Prompt",
      method: "prompt",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-2 stroke-current"
        >
          <path d="m7 11 2-2-2-2" />
          <path d="M11 13h4" />
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      label: "Scan Barcode",
      method: "barcode",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-2 stroke-current"
        >
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <path d="M8 7v10" />
          <path d="M12 7v10" />
          <path d="M17 7v10" />
        </svg>
      ),
    },
  ];

  type Input = {
    type?: string;
    data?: string;
  };

  const handleSubmit = async (type: string, data: string) => {
    setLoadingProducts(() => true);

    const input: Input = {
      type: type,
      data: data,
    };

    try {
      const response = await fetch("/api/search-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error searching products: ", data);
      } else {
        // console.log("Response: ", data);
        setProducts(() => data.products);
        setLoadingProducts(() => false);
        setSearchStatus(() => true);
      }
    } catch (error) {
      console.error("Error searching products: ", error);
    }
  };

  return (
    <>
      {user.isLoggedIn &&
        (loadingProducts ? (
          <div className="flex justify-center items-center gap-3 w-full height-below-navbar">
            {[1, 2, 3].map((x, i) => (
              <div
                key={i}
                className={`w-3 h-10 bg-green-600 rounded-full bar-grow-${x}`}
              />
            ))}
          </div>
        ) : searchStatus ? (
          <div className="flex flex-col items-center">
              <ProductsPage products={products.map((p:any) => { return {...p, product_id: p.code}})} isLoading={false}/>
              <button
                onClick={() => setSearchStatus(() => false)}
                className="mb-10 bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow hover:bg-red-700 transition cursor-pointer" 
              >
                Back 
              </button>
          </div>
        ) : (
          <div className="flex-col mx-4 my-8">
            <div className="flex my-4 max-w-2xl mx-auto shadow-lg rounded-full">
              {options.map((o, index) => (
                <button
                  key={index}
                  className={`flex gap-4 w-full py-4 items-center justify-center text-sm font-medium transition-all duration-300
              ${o.method === method ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"}
              ${index === 0 ? "rounded-l-full" : "rounded-r-full"}`}
                  onClick={() => setMethod(o.method)}
                >
                  {o.icon}
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
            {method === "barcode" ? (
              <BarcodeScanner onScan={handleSubmit} />
            ) : (
              <PromptInput onSubmit={handleSubmit} />
            )}
          </div>
        ))}
    </>
  );
};

export default SearchProduct;
