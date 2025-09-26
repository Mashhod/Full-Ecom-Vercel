import React, { useState,  useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
// import { products } from '../data/products';
import api from '../components/api.js'
// import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  // const [selectedSize, setSelectedSize] = useState('');
  // const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  // const [isLoading, setIsLoading] = useState(true);

  // let products;

  const { products, loading} = useContext(ProductContext);
  const { addToCart } = useCart();


  console.log("products", products)
  console.log("product", product)

  // useEffect(() => {
    
  // try{
        
  //       let res = await api.get(`/products`);
  //       console.log("res" , res)
  //       setProducts(res.data.products);
  //       // products = res.data.products
  //     }catch (error) {
  //       console.log("Error", error)
  //     }
    // const foundProduct = products.find(p => p.product_id === parseInt(id));
    // setProduct(foundProduct);
  //   // setIsLoading(false);
  // }, [id, products]);

  // useEffect(() => {
  //   getProduct()
  // }, [id])

  
  // useEffect(() => {

  //   const getProduct = async() => {
  //     try{
        
  //       let res = await api.get(`/products`);
  //       console.log("res" , res)
  //       setProducts(res.data.products);
  //     }catch (error) {
  //       console.log("Error", error)
  //     }
  //   const foundProduct = products.find(p => p?.product_id === parseInt(id));
  //   setProduct(foundProduct);
  //   // console.log("product", foundProduct)

  //   }
  //   getProduct()

  // }, [id, products])


    useEffect(() => {
    const foundProduct = products.find(p => p.product_id === parseInt(id));
    setProduct(foundProduct);
    // setIsLoading(false);
  }, [id, products]);

  // useEffect(() => {
  //   if (product) {
  //     if (product.sizes.length > 0) {
  //       setSelectedSize(product.sizes[0]);
  //     }
  //     if (product.colors.length > 0) {
  //       setSelectedColor(product.colors[0]);
  //     }
  //   }
  // }, [product]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="loader"></div>
  //     </div>
  //   );
  // }
      console.log("...product", product)


  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      console.log('Added to cart:', {
        product,
        quantity
      });
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product?.images?.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product?.images?.length) % product?.images?.length);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/shop" className="hover:text-primary-600">Shop</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={`/shop?category=${product?.category_name}`} className="hover:text-primary-600 capitalize">
                {product?.category_name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product?.product_name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImage]}
                alt={product?.product_name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {product?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              {product?.original_price > product?.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(((product?.original_price - product?.price) / product?.original_price) * 100)}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product?.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product?.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product?.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.product_name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-700">{product.rating}</span>
                  <span className="text-gray-500 ml-1">({product.reviews} reviews)</span>
                </div>
                <span className="text-sm text-gray-500 capitalize">{product?.category_name}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${product?.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product?.original_price}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product?.product_description}</p>
            </div>

            {/* Size Selection */}
            {/* {product?.sizes?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Color Selection */}
            {/* {product?.colors?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30 day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {/* {product?.tags?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 