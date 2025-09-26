import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../components/api';
import Cookies from "js-cookie"; // ya react-cookie
import { GlobalContext } from '../context/Context';

const stripePromise = loadStripe("pk_test_51S9884Fv5W6KJgRuWygm8yyp9ec16loUOiugghzoh0JPiuK5VAgMMooWfmqIdapegP3HMfcYT43wo9RK0BEZSxTU00cTJnK8UK");


const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
console.log("CartItems", cartItems)
console.log("getCartTotal", getCartTotal)

const [loading, setLoading] = useState(false);

let {state} = useContext(GlobalContext)

let baseUrl = state.baseURL
console.log("baseUrl", baseUrl)





// const handleCheckout = async () => {
//   const res = await fetch("http://localhost:5004/api/v1/create-checkout-session", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ items: cartItems }),
//   });

//   const data = await res.json();
//   console.log("✅ Stripe Session (frontend):", data);

//   const stripe = await stripePromise;
//   const { error } = await stripe.redirectToCheckout({
//     sessionId: data.id, // ✅ session id backend se
//   });

//   if (error) {
//     console.error("Stripe redirect error:", error);
//   }
// };

const handleCheckout = async () => {
  try {
    // Token uthao localStorage ya Cookies se
    // const token = localStorage.getItem("Token") || Cookies.get("Token");
    // console.log("🔑 CART Token (frontend):", token);

    // const bodyData = {
    //   items: cartItems.map(item => ({
    //     product_id: item.product_id,
    //     name: item.product_name,
    //     price: item.price,
    //     quantity: item.quantity,
    //   })),
    // };
    // console.log("🛒 CART Items (frontend):", bodyData);
    const response = await fetch(`${baseUrl}/create-checkout-session`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({items: cartItems}),
    });

    // console.log("📤 Request Headers (frontend):", {
    //   "Content-Type": "application/json",
    //   "Authorization": `Bearer ${token}`,
    // });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Checkout error response (frontend):", err);
      throw new Error(err.message || "Request failed");
    }
    console.log("Checkout Respose", response)
    const session = await response.json();
    console.log("✅ Stripe Session (frontend):", session);

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (err) {
    console.error("⚠️ Checkout error (frontend):", err.message);
  }
};



  if (cartItems.length === 0) {

    



    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Link to="/shop" className="text-primary-600 no-underline hover:text-primary-700 inline-flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" /> Continue Shopping
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="btn-primary no-underline inline-flex items-center"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/shop" className="text-primary-600 no-underline hover:text-primary-700 inline-flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.product_name}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {item.category_name}
                        </p>
                        <p className="text-lg font-semibold text-primary-600">
                          ${item.price}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={handleCheckout} className="w-full btn-primary">
                  Proceed to Checkout
                </button>
                
                <Link
                  to="/shop"
                  className="w-full btn-secondary no-underline text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
