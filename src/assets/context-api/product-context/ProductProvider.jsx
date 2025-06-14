import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ProductContext } from '../product-context/ProductContext';
import { API_BASE_URL } from '../../../config/api';
import { UserContext } from '../user-context/UserContext';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useContext(UserContext);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch all products with optional filtering, sorting, and pagination
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      setProducts(response.data.data);
      setTotalProducts(response.data.totalProducts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      return response.data;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (id) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.error || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single product by slug
  const fetchProductBySlug = async (slug) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/slug/${slug}`);
      setProduct(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.error || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async (limit = 8) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/products/featured`, { params: { limit } });
      setFeaturedProducts(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.response?.data?.error || 'Failed to fetch featured products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch sale products
  const fetchSaleProducts = async (limit = 8) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/products/sale`, { params: { limit } });
      setSaleProducts(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching sale products:', err);
      setError(err.response?.data?.error || 'Failed to fetch sale products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new product (admin only)
  const createProduct = async (productData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Handle form data for multipart/form-data (for image uploads)
      const formData = new FormData();
      
      // Add all text and number fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      // Add images if present
      if (productData.images) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }
      
      const response = await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Product created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.error || 'Failed to create product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product (admin only)
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Handle form data for multipart/form-data (for image uploads)
      const formData = new FormData();
      
      // Add all text and number fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      // Add new images if present
      if (productData.images) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }
      
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Product updated successfully!');
      
      // If we're currently viewing this product, update the local state
      if (product && product._id === id) {
        setProduct(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.error || 'Failed to update product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product (admin only)
  const deleteProduct = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Product deleted successfully!');
      
      // Update products list if we have it
      if (products.length > 0) {
        setProducts(products.filter(p => p._id !== id));
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.error || 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product image (admin only)
  const deleteProductImage = async (productId, imageIndex) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}/images/${imageIndex}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Image deleted successfully!');
      
      // If we're currently viewing this product, update the local state
      if (product && product._id === productId) {
        setProduct(response.data.product);
      }
      
      return response.data.product;
    } catch (err) {
      console.error('Error deleting product image:', err);
      setError(err.response?.data?.error || 'Failed to delete product image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Set featured image (admin only)
  const setFeaturedImage = async (productId, imageIndex) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${productId}/featured-image`,
        { imageIndex },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Featured image updated successfully!');
      
      // If we're currently viewing this product, update the local state
      if (product && product._id === productId) {
        setProduct(response.data.product);
      }
      
      return response.data.product;
    } catch (err) {
      console.error('Error setting featured image:', err);
      setError(err.response?.data?.error || 'Failed to set featured image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update product inventory (admin only)
  const updateInventory = async (productId, quantity) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${productId}/inventory`,
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Inventory updated successfully!');
      
      // If we're currently viewing this product, update the local state
      if (product && product._id === productId) {
        setProduct(response.data.product);
      }
      
      return response.data.product;
    } catch (err) {
      console.error('Error updating inventory:', err);
      setError(err.response?.data?.error || 'Failed to update inventory');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Bulk update product statuses (admin only)
  const bulkUpdateStatus = async (productIds, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/bulk/status`,
        { productIds, status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccess(`${productIds.length} products updated to ${status}!`);
      
      // Refresh the products list if we have it
      if (products.length > 0) {
        await fetchProducts();
      }
      
      return response.data;
    } catch (err) {
      console.error('Error bulk updating products:', err);
      setError(err.response?.data?.error || 'Failed to update products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a product review
  const addProductReview = async (productId, reviewData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/${productId}/reviews`,
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Review added successfully!');
      
      // If we're currently viewing this product, update the local state
      if (product && product._id === productId) {
        setProduct(response.data.product);
      }
      
      return response.data.product;
    } catch (err) {
      console.error('Error adding review:', err);
      setError(err.response?.data?.error || 'Failed to add review');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories (for product management)
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.error || 'Failed to fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Helper function to calculate sale price
  const calculateSalePrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    return price * (1 - discountPercentage / 100);
  };

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      saleProducts,
      product,
      categories,
      loading,
      error,
      success,
      totalProducts,
      totalPages,
      currentPage,
      fetchProducts,
      fetchProductById,
      fetchProductBySlug,
      fetchFeaturedProducts,
      fetchSaleProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      deleteProductImage,
      setFeaturedImage,
      updateInventory,
      bulkUpdateStatus,
      addProductReview,
      fetchCategories,
      formatPrice,
      calculateSalePrice
    }}>
      {children}
    </ProductContext.Provider>
  );
};