import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const Footer = () => {
  const {  categories } = useContext(ProductContext);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">ShopHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for quality products. We offer the best deals on fashion, sports, and electronics.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0,4).map((category, i) => {
                return(
                  <li key={i}>
                <Link to= {`/shop?category${category.category_id}`} className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                {category?.category_name}
                </Link>
              </li>
                )

              })}
              {/* <li>
                <Link to="/shop?category=mens" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sports" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electronics" className="text-gray-400 no-underline hover:text-white transition-colors text-sm">
                  Electronics
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 text-sm">123 Shopping St, City, Country</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 text-sm">+1 234 567 8900</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 text-sm">info@shophub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ShopHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Shipping Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 