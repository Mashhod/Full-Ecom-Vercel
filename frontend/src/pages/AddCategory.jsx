import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowLeft } from 'lucide-react';
import api from '../components/api';
import { useToast } from '../context/ToastContext';

const AddCategory = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  // const [formValues, setFormValues] = useState({
  //   category_name: '',
  //   category_description: '',
  //   image: '',
  // });
  const [categoryName, setCategoryName] = useState('');
  const [categoryDec, setCategoryDec] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
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
  //       category_name: formValues.category_name.trim(),
  //       category_description: formValues.category_description.trim(),
  //       image: formValues.image.trim(),
  //     };

  //     await api.post('/categories', payload);
  //     navigate('/home');
  //   } catch (error) {
  //     setErrorMessage(error?.response?.data?.message || 'Failed to add category.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const addCategory = async(e) => {
    e.preventDefault()
    setSubmitting(true);
    setErrorMessage('');

    try {
      let response = await api.post('/category', {
        name: categoryName,
        description: categoryDec,
        image: categoryImage
      })
      clearForm()
      success('Category added successfully!');
      console.log("Response", response)
      console.log("categoryImage", categoryImage)
    } catch (err) {
      console.log("Error", err)
      error(err?.response?.data?.message || 'Failed to add category. Please try again.');

    }finally {
      setSubmitting(false)
    }


  }
  const clearForm = () => {
    setCategoryName('')
    setCategoryDec('')
    setCategoryImage('')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold text-gray-900">Add Category</h1>
            <Link to="/home" className="text-primary-theme hover:text-primary-800 inline-flex items-center 
                                       transition-colors duration-250 hover:scale-105 transform">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
            </Link>
          </div>

          <div className="form-container animate-fade-in">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-down">
                {errorMessage}
              </div>
            )}

            <form onSubmit={addCategory} className="space-y-8">
              <div className="animate-slide-up">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="form-input"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="form-label">Description</label>
                <textarea
                  name="category_description"
                  value={categoryDec}
                  onChange={(e) => setCategoryDec(e.target.value)}
                  placeholder="Enter category description"
                  rows="4"
                  className="form-input resize-none"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                  required
                />
              </div>

              <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center disabled:opacity-70 w-full sm:w-auto"
                >
                  <FolderPlus className="h-5 w-5 mr-2" />
                  {submitting ? 'Adding Category...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};


export default AddCategory;