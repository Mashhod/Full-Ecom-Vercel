import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Filter, X } from 'lucide-react';
// import { categories, products } from '../data/products';
import api from '../components/api';
import Loader from '../components/Loader';
import { ProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const { products, loading,  categories} = useContext(ProductContext);
  const { addToCart } = useCart();
  // const [products, setProducts] = useState([]);
  // const [searchParams, setSearchParams] = useSearchParams();

  // const[isLoading, setIsLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [categories, setCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [maxPrice, setMaxPrice] = useState(100000);
  // const [loading, setLoading] = useState(true);
  
  // Debug logs can be removed in production
  // console.log("products", products)
  // console.log("filteredProducts", filteredProducts)
  // console.log("Cat:", categories)
  // console.log("selected", selectedCategory)
  // console.log("filtered", ffiltered)

  // const searchQuery = searchParams.get('search') || '';
  // const categoryParam = searchParams.get('category') || '';

const [searchParams, setSearchParams] = useSearchParams();
const searchQuery = searchParams.get("search") || "";
const categoryParam = searchParams.get("category") || "";

const categoryId = categoryParam ? parseInt(categoryParam, 10) : null;

  console.log("CategoryParams:", categoryId)


  

//   const getProduct = async() => {
//     try{
      
//       let res = await api.get(`/products`);
//       console.log("res" , res)
//       setProducts(res?.data?.products);
//       setFiltered(res?.data?.products)
//     }catch (error) {
//       console.log("Error", error)
//     }

//   }
  
//   const getCategory =  async() => {
//     try{
//       let res = await api.get(`/categories`);
//       console.log("res", res)
//       setCategories(res.data.category_list);
      
      
//     }catch (error) {
//       console.log("Error", error)
      
//     }
    
//   }
//   useEffect(() => {

//   getProduct()
//   getCategory();


// }, [])


  // useEffect(() => {
  //     fetchData();

  //   }, [])

    // const fetchData = async() => {
    //   const [productRes, categoryRes] = await Promise.all([
    //     api.get('/products'),
    //     api.get('/categories'),
    //   ]);
    //   setIsLoading(false)
    //   console.log("Categories Response:", categoryRes.data); // <== ADD THIS
    //   console.log("products Response:", productRes.data); // <== ADD THIS
    //   setProducts(productRes.data.products);
    //   // setFiltered(productRes.data.products);
    //   setCategories(categoryRes.data.category_list);
    //   // setLoading(false)
      
    // //   setTimeout(() => {
    // //       setLoading(false); // Now stop loader after timeout
    // //     }, 100);
    // }

    

    useEffect(() => {
      
      let filtered = [...products];
      // setCategories(categories);
      // console.log("...products", filtered)
    
    

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product?.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.category_name.toLowerCase().includes(searchQuery.toLowerCase()) 
        // product?.category_id.includes(searchQuery)
      )
    }

    //  🔎 Filter by category (match number only)
    // if (selectedCategory || categoryId) {
    //   const categorry = Number(selectedCategory || categoryId);
    //   filtered = filtered.filter(
    //     (product) => Number(product?.category_id) === categorry
    //   );
    // }
    if (selectedCategory || categoryParam) {
      const category = selectedCategory || categoryParam;
    
      filtered = filtered.filter(
        (product) =>
          product?.category_id == category || // agar id match kare
          product?.category_name.toLowerCase() === category.toLowerCase() // ya name match kare
      );
    }
    

    // // Filter by category
    // if (selectedCategory || categoryParam) {
    //   const category = selectedCategory || categoryParam ;
    //   filtered = filtered.filter(product => product?.category_name === category || product?.category_id == categoryParam);
    // }
    // Note: If no category is selected, show all products (filtered remains as is)

    // Filter by price range
    filtered = filtered.filter(product => 
      product?.price >= priceRange[0] && product?.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.product_name.localeCompare(b.product_name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, categoryParam, categoryId, priceRange, sortBy, products, categories]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

//   const handleCategoryChange = (category) => {
//   setSelectedCategory(Number(category)); // string aaye to number bana do
// if (category) {
//       setSearchParams({ category: category.toString() });
//     } else {
//       setSearchParams({});
//     }
//   };


  


// // ✅ Shop page load hote hi URL wali category set karo
// useEffect(() => {
//   if (categoryId) {
//     setSelectedCategory(categoryId);
//   }
// }, [categoryId]);

// useEffect(() => {
//   let filtered = [...products];

//   // 🔎 Filter by search query
//   if (searchQuery) {
//     filtered = filtered.filter(
//       (product) =>
//         product?.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product?.category_name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }

//   // 🔎 Filter by category (match number only)
//   if (selectedCategory !== null) {
//     filtered = filtered.filter(
//       (product) => product?.category_id === selectedCategory
//     );
//   }

//   // 🔎 Filter by price range
//   filtered = filtered.filter(
//     (product) =>
//       product?.price >= priceRange[0] && product?.price <= priceRange[1]
//   );

//   // 🔎 Sort products
//   filtered.sort((a, b) => {
//     switch (sortBy) {
//       case "price-low":
//         return a.price - b.price;
//       case "price-high":
//         return b.price - a.price;
//       case "rating":
//         return b.rating - a.rating;
//       case "name":
//       default:
//         return a.product_name.localeCompare(b.product_name);
//     }
//   });

//   setFilteredProducts(filtered);
// }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

// // ✅ Category change manually (button/dropdown se)
// const handleCategoryChange = (category) => {
//   setSelectedCategory(Number(category)); // string aaye to number bana do
//   if (category) {
//     setSearchParams({ category: category.toString() });
//   } else {
//     setSearchParams({});
//   }
// };

const handleCategoryChange = (category) => {
  if (!category) {
    // Agar All Categories hai (null, empty string, ya undefined)
    setSelectedCategory(null);
    setSearchParams({}); // URL clean: /shop
    return;
  }

  // Agar tumhe pata hai ke category id number hai aur name string hai
  if (typeof category === "number") {
    setSelectedCategory(category); // id set karo
    setSearchParams({ category: category.toString() });
  } else {
    setSelectedCategory(category); // name set karo
    setSearchParams({ category });
  }
};





  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
    setSearchParams({});
  };

  const displayProducts = filteredProducts;

    if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        {/* <div className="loader mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ShopHub</h2>
        <p className="text-gray-600">Loading your shopping experience...</p> */}
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
  }


      // if (loading) {
      //   return <Loader />;
      // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            {searchQuery && `Search results for "${searchQuery}"`}
            {!searchQuery && `Showing ${displayProducts.length} products`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden"
                >
                  {isFilterOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
                </button>
              </div>

              <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category?.category_id}
                        onClick={() => handleCategoryChange(category?.category_name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category?.category_name || selectedCategory === category?.category_id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category?.category_name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <div key={product?.product_id} className="product-card group animate-fade-in">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      {product.images ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.product_name} 
                          className="product-image w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">No Image Found</p>
                        </div>
                      )}

                      {product.original_price && product.original_price > product?.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-soft animate-bounce-in">
                          {Math.round(((product.original_price - product?.price) / product.original_price) * 100)}% OFF
                        </div>
                      )}
                      <button 
                        onClick={() => addToCart(product)}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 
                                 transition-all duration-300 shadow-soft hover:shadow-medium transform hover:scale-110"
                      >
                        <ShoppingCart className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 capitalize  font-medium bg-gray-100 px-2 py-1 rounded-full">
                          {product?.category_name}
                        </span>
                        {product.rating && (
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1 font-medium">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 group-hover:text-primary-theme transition-colors duration-250 line-clamp-2">
                        {product?.product_name}
                      </h3>
                      <div className="flex items-center space-x-2 justify-around">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">${product?.price}</span>
                          {product.original_price && product.original_price > product?.price && (
                            <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                          )}
                        </div>
                        <Link
                          to={`/product/${product?.product_id}`}
                          className="text-primary-theme no-underline hover:text-primary-800 font-semibold text-xs 
                                   transition-colors duration-250 hover:scale-105 transform inline-block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 