import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { GlobalContext } from '../context/Context';
import Cookies from 'js-cookie';
import api from './api';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  let {state, dispatch} = useContext(GlobalContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { success, error } = useToast();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // const handleLogout = () => {
  //   // setUser(null);
  //   navigate('/login');
  //   return (dispatch) => {
  //     // remove token from cookie
  //     // Cookies.remove("token"); 
  //     Cookies.remove("Token")
  
  //     // dispatch logout
  //     dispatch({ type: "USER_LOGOUT" });
  // };
  // }
  const Logout = async() => {
    try{
      const  res = await api.get(`/logout`, {
        withCredentials: true
      });

      if (res.status === 200){
        // alert("Logout Successfull");
        
        success('Logout successfully!');
        dispatch({type: "USER_LOGOUT" , payload: {user:{}, isLoading: false}})  
        localStorage.removeItem("Token") 
        // navigate('/login')
        window.location.href = '/login';
        //     setTimeout(() => {
          //   navigate('/login')
          // }, 1000)
      }
     

    }catch (error) {
      console.log("Error" , error)

    }
  }
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center space-x-2 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl no-underline font-bold text-gray-800">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
              Home
            </Link>
            <Link to="/shop" className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
              Shop
            </Link>
            <Link className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
              About
            </Link>
            <Link to="/contact" className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
              Contact
            </Link>

            {state?.user?.user_role === 1 ? (
              <>
                <Link to="/add-product" className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
                  Add Product
                </Link>
                <Link to="/add-category" className={`nav-link ${!state.isLogin ? "disabled" : ""}`}
>
                  Add Category
                </Link>
              </>
            ) : null}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Heart className="h-6 w-6" />
            </button>


            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </Link>

            {state.isLogin ? 
            (
              <>
            {/* user */}
            <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors">
                   <User className="h-6 w-6" /> 
                  <span className="hidden sm:block">{ state.user.firstName || state.user.first_name}</span> 
                </button>
              </>
            )
            : 
            <>
            </>
            }

            {/* User Menu */}
            {state.isLogin ? (
              <div className="relative">
                {/* <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors">
                   <User className="h-6 w-6" /> 
                  <span className="hidden sm:block">{state.user.firstName}</span> 
                </button> */}
                {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"> */}
                  {/* <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  > */}
                  <Link
                to="/login"
                onClick={Logout}
                className="btn-primary mr-0  no-underline hidden sm:inline-flex items-center space-x-2"
                   > <span>Logout</span> 
              </Link>
                  {/* </button> */}
                {/* </div> */}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary no-underline hidden sm:inline-flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}

                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {state?.user_role === 1 ? (
                <>
                  <Link
                    to="/add-product"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/add-category"
                className={`nav-link py-2 ${!state.isLogin ? "disabled" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Category
                  </Link>
                </>
              ) : null}
              {!state.user && (
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center justify-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
