import {React, useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
// import { categories, products } from '../data/products';
import api from '../components/api'
import { ProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Home = () => {

const { products, categories} = useContext(ProductContext);
const { addToCart } = useCart();

  // const [featuredProducts, setFeaturedProducts] = useState();
  // const [products, setProducts] = useState([]);
  // const [categories, setCategories] = useState([]);

console.log("productsHome", products);
console.log("categoriesHome", categories)
  // let products;
  // let categories;

  //   useEffect(() => {
  //   fetchData();
    
  // }, [])

  // const fetchData = async() => {
  //   const [productRes, categoryRes] = await Promise.all([
  //     api.get('/products'),
  //     api.get('/categories'),
  //   // console.log("productres", productRes.data.products)

      
      
  //   ]);
  //   // setProducts(productRes?.data?.products);
  //   // setCategories(categoryRes?.data?.category_list);
  //   // setFeaturedProducts(productRes?.data?.product)
  //   products = productRes?.data?.products;
  //   categories = categoryRes?.data?.category_list;
  //   console.log("productres", productRes.data.products)
  // }

  
  // useEffect(() => {

  //   const getProduct = async() => {
  //     try{
        
  //       let res = await api.get(`/products`);
  //       console.log("res" , res)
  //       console.log("getProduct", res?.data?.products)
  //       setProducts(res.data.products);
  //     }catch (error) {
  //       console.log("Error", error)
  //     }

  //   }
  //   getProduct()

  // }, [])


  //     const getCategory =  async() => {
  //       try{
  //           let res = await api.get('/categories');
  //           setCategories(res.data.category_list);
  //           console.log("getCategory", res?.data?.category_list)


  //       }catch (error) {
  //           console.log("Error", error)

  //       }

  //   }
  //   useEffect(() => {
  //       getCategory();
  //   } , [])

  
  const featuredProducts = products.slice(0, 6);
      // console.log("products", products)
    


  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Amazing
                <span className="block text-yellow-300">Products</span>
              </h1>
              <p className="text-xl text-gray-100">
                Shop the latest trends in fashion, sports, and electronics. 
                Quality products at unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="bg-white no-underline text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 no-underline border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <div key={product?.product_id} className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={product?.images[0]}
                          alt={product?.product_name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <p className="text-sm font-medium text-gray-800 mt-2">{product?.product_name}</p>
                        <p className="text-primary-600 font-bold">${product?.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category?.category_id}
                to={`/shop?category=${category?.category_name}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={category.category_image}
                    alt={category?.category_name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category?.category_name}</h3>
                    <p className="text-gray-200 text-sm">{category?.category_description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked products that our customers love
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product?.product_id} className="card group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={product?.images[0]}
                    alt={product?.product_name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.original_price > product?.price && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((product.original_price - product?.price) / product.original_price) * 100)}% OFF
                    </div>
                  )}
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 capitalize">{product?.category_name}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {product?.product_name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">${product?.price}</span>
                      {product.originalPrice > product?.price && (
                        <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                      )}
                    </div>
                    <Link
                      to={`/product/${product?.product_id}`}
                      className="text-primary-600 no-underline hover:text-primary-700 font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="btn-primary no-underline inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">30-day money-back guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 