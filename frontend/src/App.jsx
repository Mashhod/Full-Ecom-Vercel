import logo from './logo.svg';
import './App.css';

import { GlobalContext } from './context/Context.js';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import api from './components/api.js';

// import { AddProduct } from './pages/add-product.jsx';
// import Loader from './component/loader.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Loader from './components/Loader';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { ProductProvider } from './context/ProductContext.js';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext.js';
import ToastContainer from './components/ToastContainer.jsx';
import { ToastProvider, useToast } from './context/ToastContext.js';

function AppContent() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { toasts, removeToast } = useToast();
  let  {state , dispatch} = useContext(GlobalContext);
  
  console.log('GlobalContext: ',GlobalContext);

 useEffect(() => {
    console.log('Current State:', state)
  }, [state])

console.log('state ', state);

useEffect(() => {
  const getUserData = async() => {
    try {
      let res = await api.get('/profile');
      // dispatch({type: "USER_LOGIN" , payload:{user: res.data?.user}})   
      
    } catch (error) {
      dispatch({type: "USER_LOGOUT" })   
      
    }

  }
  getUserData();
}, [])



const location = useLocation()

//   useEffect(() => {
//     // Jab bhi path change ho
//     dispatch({ type: 'IS_LOADING' })

//     // Simulate loading delay (or token recheck if needed)
//     const timeout = setTimeout(() => {
//       dispatch({ type: 'STOP_LOADING' }) // Custom action to stop loading
//     }, 5000) // you can reduce or increase as needed

//     return () => clearTimeout(timeout)
//   }, [location.pathname])


  
    useEffect(() => {
      setLoading(true)
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }, [location.pathname]);
  
    if (loading) {
      return <Loader />;
    }



  return (
    // <Router>
    <ProductProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">

        <Routes>
  {state.isLogin ? (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="*" element={<Navigate to={'/home'} />} />

      {/* Extra routes only for role 1 */}
      {state?.user?.user_role === 1 && (
        <>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
        </>
      )}
    </>
  ) : (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Login />} />
    <Route path="*" element={<Navigate to={'/login'} />} />
    </>
  )}
</Routes>



          
          {/* {state.isLogin ? (
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
              {/* Extra routes only for role 1 */}
              {/* {state?.user?.user_role === 1 && (
                <Routes>
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/add-category" element={<AddCategory />} />
                </Routes>
              )}
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Login />} />
            </Routes>
          )}  */}

        </main>
        <Footer />
        <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
      </CartProvider>
    </ProductProvider>
    // </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App


// import React from 'react'
// import CategoryPage from './component/check.jsx'
// import { Sidebar } from 'lucide-react'
// import SidebarFilters from './component/check'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import EiserSidebar from './component/check';


// const App = () => {
//   return (
//     <div>
//       <CategoryPage />
//     </div>
//   )
// }

// export default App