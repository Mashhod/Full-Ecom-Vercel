import { createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../components/api";
import { useLocation } from "react-router-dom";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  


//  useEffect(() => {
//     // LocalStorage check karo
//     // const localPro = localStorage.getItem("products");
//     // const localCat = localStorage.getItem("categories");
//     // const localTimestamp = localStorage.getItem("productsData_timestamp");

//     // if (localPro && localTimestamp && localCat) {
//     //   const age = Date.now() - parseInt(localTimestamp, 10);

//     //   if (age < 60 * 60 * 1000) {
//     //     // agar 1 ghante se kam purana hai
//     //     setProducts(JSON.parse(localPro));
//     //     setCategories(JSON.parse(localCat));
//     //     setLoading(false);
//     //     return;
//     //   }
//     // }

//     // agar data nahi hai ya purana hai to fresh API call
//     fetchProductsData();
//   }, []);  

// //  const fetchProductsData = async () => {
// //     try {
// //       setLoading(true);
// //       const resPro = await api.get("/products");
// //       const resCat = await api.get("/categories");
// //       const dataPro = resPro.data.products ;
// //       const dataCat = resCat.data.category_list;
      
// //        // 🟢 localStorage me pehle se data check karo
// //       let cachedPro = localStorage.getItem("products");
// //       let cachedCat = localStorage.getItem("categories");

// //       if (cachedPro && cachedCat) {
// //         let parsedPro = JSON.parse(cachedPro);
// //         // let parsedCat = JSON.parse(cachedCat);

// //         // agar backend aur local storage products alag hain → overwrite
// //         if (
// //           parsedPro?.length !== dataPro.length 
// //           // && parsedCat?.length !== dataCat.lenght  
// //           ||
// //           JSON.stringify(parsedPro) !== JSON.stringify(dataPro) 
// //           // && JSON.stringify(parsedCat) !== JSON.stringify(dataCat)
// //         ) {
// //           localStorage.setItem("products", JSON.stringify(dataPro));
// //           // localStorage.setItem("categories", JSON.stringify(dataCat));
// //         }
// //       } else {
// //         // agar localStorage empty hai → backend se set karo
// //         localStorage.setItem("products", JSON.stringify(dataPro));
// //         // localStorage.setItem("categories", JSON.stringify(dataCat));
// //         localStorage.setItem("productsData_timestamp", Date.now().toString());

// //       }

// //       // state update → UI refresh ho jayegi
// //       // setProducts(backendProducts);
      
// //       setProducts(dataPro);
// //       setCategories(dataCat);

// //       // localStorage me save karo
// //       // localStorage.setItem("products", JSON.stringify(dataPro));
// //       localStorage.setItem("categories", JSON.stringify(dataCat));
// //       // localStorage.setItem("productsData_timestamp", Date.now().toString());
// //     } catch (error) {
// //       console.error("Error fetching products:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const fetchProductsData = async () => {
//     try {
//       setLoading(true);
//       const resPro = await api.get("/products");
//       const resCat = await api.get("/categories");
//       const dataPro = resPro.data.products ;
//       const dataCat = resCat.data.category_list;
      
//       // 🟢 localStorage ko overwrite karo backend data ke sath
//       localStorage.setItem("products", JSON.stringify(dataPro));

//       // 🟢 state update karo → UI update ho jayega
//       setProducts(dataPro);
      
//       setCategories(dataCat);

//       // localStorage me save karo
//       // localStorage.setItem("products", JSON.stringify(dataPro));
//       localStorage.setItem("categories", JSON.stringify(dataCat));
//       // localStorage.setItem("productsData_timestamp", Date.now().toString());
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }

//      // 🟡 agar backend fail ho jaye to fallback localStorage
//       let cached = localStorage.getItem("products");
//       if (cached) {
//         setProducts(JSON.parse(cached));
//       }
//     }

// ----------- INITIAL LOAD -----------
useEffect(() => {
  const localPro = localStorage.getItem("products");
  const localCat = localStorage.getItem("categories");

  if (localPro && localCat) {
    // Pehle localStorage se UI load karao
    setProducts(JSON.parse(localPro));
    setCategories(JSON.parse(localCat));
    setLoading(false);
  }

  // Background me API call ek dafa hamesha chalni chahiye
  fetchProductsFromAPI();
}, [category]);


const location = useLocation();

useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get("category");

  if (categoryFromUrl) {
    setCategory(Number(categoryFromUrl)); // number me convert karna ho to
  }
}, [location.search]);


// ----------- API CALL FUNCTION -----------
const fetchProductsFromAPI = async () => {
  try {

    let url = "/products";
    if (category) {
      url += `?category=${category}`;
    }


    const resPro = await api.get(`${url}`);
    const resCat = await api.get("/categories");

    const dataPro = resPro.data.products;
    const dataCat = resCat.data.category_list;

    // LocalStorage update
    localStorage.setItem("products", JSON.stringify(dataPro));
    localStorage.setItem("categories", JSON.stringify(dataCat));

    // State update → UI update
    setProducts(dataPro);
    setCategories(dataCat);
  } catch (error) {
    console.error("API Error:", error);
  } finally {
    setLoading(false);
  }
};





  return (
    <ProductContext.Provider value={{ products, setProducts, loading, categories,  refreshProducts: fetchProductsFromAPI}}>
      {children}
    </ProductContext.Provider>
  );
};
