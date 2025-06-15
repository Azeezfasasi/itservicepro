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
  const [category, setCategory] = useState(null);
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

  // Products Functions ===================================

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

  // Category Functions ===================================

  // Fetch all categories
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

  // Fetch category by ID
  const fetchCategoryById = async (id) => {
    setLoading(true);
    setError('');
    setCategory(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      setCategory(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching category:', err);
      setError(err.response?.data?.error || 'Failed to fetch category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch category by slug
  const fetchCategoryBySlug = async (slug) => {
    setLoading(true);
    setError('');
    setCategory(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/slug/${slug}`);
      setCategory(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching category by slug:', err);
      setError(err.response?.data?.error || 'Failed to fetch category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new category (admin only)
const createCategory = async (categoryData) => {
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    // Validate required fields
    if (!categoryData.name || categoryData.name.trim() === '') {
      const nameError = 'Category name is required';
      setError(nameError);
      setLoading(false);
      return null;
    }
    
    // Create a fresh FormData instance
    const formData = new FormData();
    
    // Explicitly add the required name field with trimming
    formData.append('name', categoryData.name.trim());
    
    // Add description if present
    if (categoryData.description) {
      formData.append('description', categoryData.description);
    }
    
    // Add parent if present and not empty
    if (categoryData.parent) {
      formData.append('parent', categoryData.parent);
    }
    
    // Add sortOrder
    if (categoryData.sortOrder !== undefined) {
      formData.append('sortOrder', categoryData.sortOrder.toString());
    }
    
    // Add isActive
    if (categoryData.isActive !== undefined) {
      formData.append('isActive', categoryData.isActive.toString());
    }
    
    // Add image if present
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    
    // Debug: Print form data entries
    console.log('Category data values:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
    }
    
    // Make the API request
    const response = await axios.post(`${API_BASE_URL}/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    setSuccess('Category created successfully!');
    
    // Refresh categories list
    await fetchCategories();
    
    return response.data;
  } catch (err) {
    console.error('Error creating category:', err);
    
    // Log more detailed error information
    if (err.response) {
      console.error('Error response data:', err.response.data);
      console.error('Error response status:', err.response.status);
      console.error('Error response headers:', err.response.headers);
    } else if (err.request) {
      console.error('Error request:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
    
    setError(err.response?.data?.error || 'Failed to create category');
    return null;
  } finally {
    setLoading(false);
  }
};

  // Update category (admin only)
  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Handle form data for multipart/form-data (for image upload)
      const formData = new FormData();
      
      // Add text fields
      Object.keys(categoryData).forEach(key => {
        if (key !== 'image' && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      
      // Add image if present
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Category updated successfully!');
      
      // Refresh categories list
      await fetchCategories();
      
      // If we're currently viewing this category, update the local state
      if (category && category._id === id) {
        setCategory(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.error || 'Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete category (admin only)
  const deleteCategory = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Category deleted successfully!');
      
      // Update categories list
      if (categories.length > 0) {
        setCategories(categories.filter(c => c._id !== id));
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.error || 'Failed to delete category');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get products by category
  const getProductsByCategory = async (categoryId, params = {}) => {
    setLoading(true);
    setError('');
    try {
      const queryParams = { 
        ...params,
        category: categoryId 
      };
      
      const response = await axios.get(`${API_BASE_URL}/products`, { 
        params: queryParams 
      });
      
      return response.data;
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err.response?.data?.error || 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get products by category slug
  const getProductsByCategorySlug = async (slug, params = {}) => {
    setLoading(true);
    setError('');
    try {
      // First get the category ID from the slug
      const categoryResponse = await axios.get(`${API_BASE_URL}/categories/slug/${slug}`);
      const categoryId = categoryResponse.data._id;
      
      // Then get products with that category
      return await getProductsByCategory(categoryId, params);
    } catch (err) {
      console.error('Error fetching products by category slug:', err);
      setError(err.response?.data?.error || 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions ===================================

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

  // Helper function to get category tree (for hierarchical display)
  const getCategoryTree = () => {
    const rootCategories = categories.filter(cat => !cat.parent);
    
    const buildTree = (parentId) => {
      return categories
        .filter(cat => cat.parent && cat.parent.toString() === parentId.toString())
        .map(cat => ({
          ...cat,
          children: buildTree(cat._id)
        }));
    };
    
    return rootCategories.map(cat => ({
      ...cat,
      children: buildTree(cat._id)
    }));
  };

  return (
    <ProductContext.Provider value={{
      // Products state
      products,
      featuredProducts,
      saleProducts,
      product,
      
      // Categories state
      categories,
      category,
      
      // UI state
      loading,
      error,
      success,
      totalProducts,
      totalPages,
      currentPage,
      
      // Product functions
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
      
      // Category functions
      fetchCategories,
      fetchCategoryById,
      fetchCategoryBySlug,
      createCategory,
      updateCategory,
      deleteCategory,
      getProductsByCategory,
      getProductsByCategorySlug,
      getCategoryTree,
      
      // Helper functions
      formatPrice,
      calculateSalePrice
    }}>
      {children}
    </ProductContext.Provider>
  );
};