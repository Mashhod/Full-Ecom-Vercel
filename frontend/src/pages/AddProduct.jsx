import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import api from '../components/api';
import { ProductContext } from '../context/ProductContext';
import { GlobalContext } from '../context/Context';
import { useToast } from '../context/ToastContext';

const AddProduct = () => {
  // const navigate = useNavigate();
  const {  products, setProducts } = useContext(ProductContext);
  const { success, error } = useToast();
    // const [products, setProducts] = useState([]);
    const[categoryList , setCategoryList] = useState([]);
    const[productName, setProductName] = useState("");
    const[productPrice, setProductPrice] = useState("");
    const[originalPrice, setOriginalPrice] = useState("");
    const[productDescription, setProductDescription] = useState("");
    const[productCategory, setProductCategory] = useState("");
    const[productImages, setProductImages] = useState([]);
    // const[loading, setLoading] = useState(true);
    const [url, setUrl] = useState("");

  // const [formValues, setFormValues] = useState({
  //   product_name: '',
  //   product_description: '',
  //   product_price: '',
  //   category_id: '',
  //   product_image: '',
  // });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormValues((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setSubmitting(true);
  //   setErrorMessage('');
  //   try {
  //     const payload = {
  //       product_name: formValues.product_name.trim(),
  //       product_description: formValues.product_description.trim(),
  //       product_price: Number(formValues.product_price),
  //       category_id: formValues.category_id,
  //       product_image: formValues.product_image.trim(),
  //     };

  //     await api.post('/products', payload);
  //     if (typeof refreshProducts === 'function') {
  //       await refreshProducts();
  //     }
  //     navigate('/shop');
  //   } catch (error) {
  //     setErrorMessage(error?.response?.data?.message || 'Failed to add product.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  
  // 🌐 URL Add
 

  let {state} = useContext(GlobalContext);

  // setTimeout(() => {
  //  setLoading(false)
  // }, 1000)

   const getCategory =  async() => {
       try{
           let res = await api.get('/categories');
           setCategoryList(res.data.category_list);


       }catch (error) {
           console.log("Error", error)

       }

   }
   useEffect(() => {
       getCategory();
      //  refreshProducts(true); // background check

   } , [])

   const addProduct = async(e) => {
       e.preventDefault();
       setSubmitting(true);
       setErrorMessage('');
       try{
           // backend ko sirf url array bhejna hai
           const imagesForBackend = productImages.map(img => img.url);
           let response = await api.post(`/product`, {
               name: productName,
               price: productPrice,
               description: productDescription,
               category_id: productCategory,
               images: imagesForBackend,
               original_price: originalPrice
           });

           clearForm();
           success('Product added successfully!');
           console.log("response", response);
           console.log("imagesForBackend", imagesForBackend);
           


       }catch (err) {
           console.log("Error" , err);
           error(err?.response?.data?.message || 'Failed to add product. Please try again.');

       }finally {
        setSubmitting(false);

       }

   }
   

 
   const clearForm = () => {
       setProductName("");
       setProductPrice("");
       setOriginalPrice("")
       setProductDescription("");
       setProductImages("");
       setProductCategory("");

   }

 
 
 
  const handleAddUrl = () => {
    if (!url.trim()) return;

    const newImages = [
      ...productImages,
    { type: "url", url, preview: url }    
  ];

    if (newImages.length > 10) {
      alert("Aap maximum 10 images add kar sakte ho");
      return;
    }

    setProductImages(newImages);
    setUrl(""); // input clear
  };

  // ❌ Remove Image
  const handleRemove = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold text-gray-900">Add Product</h1>
            <Link to="/shop" className="text-primary-theme hover:text-primary-800 inline-flex items-center 
                                       transition-colors duration-250 hover:scale-105 transform">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Shop
            </Link>
          </div>

          <div className="form-container animate-fade-in">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-down">
                {errorMessage}
              </div>
            )}

            <form onSubmit={addProduct} className="space-y-8">
              <div className="animate-slide-up">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="form-input"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="form-label">Description</label>
                <textarea
                  name="product_description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows="4"
                  className="form-input resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div>
                  <label className="form-label">Original Price ($)</label>
                  <input
                    type="number"
                    name="original_price"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Selling Price ($)</label>
                  <input
                    type="number"
                    name="product_price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="form-input"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Category</label>
                  <select
                    name="category_id"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categoryList.map((eachCategory, i) => (
                      <option key={i} value={eachCategory?.category_id}>
                        {eachCategory?.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label className="form-label">Image URLs</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="product_image"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="form-input flex-1"
                  />
                  <button 
                    type='button' 
                    onClick={handleAddUrl}
                    className="btn-secondary px-6"
                  >
                    Add URL
                  </button>
                </div>

                {/* Preview */}
                {productImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Image Previews:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {Array.isArray(productImages) && productImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img 
                            src={img.preview} 
                            alt={`preview-${i}`} 
                            className="w-full h-24 object-cover rounded-xl shadow-soft"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                                     flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100
                                     transition-opacity duration-200 hover:bg-red-600 transform hover:scale-110"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center disabled:opacity-70 w-full sm:w-auto"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddProduct;

