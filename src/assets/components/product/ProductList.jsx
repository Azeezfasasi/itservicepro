import React, { useEffect, useState } from 'react';
import { useProduct } from '../../context-api/product-context/UseProduct';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const {
    products,
    loading,
    error,
    success,
    totalProducts,
    totalPages,
    // currentPage,
    fetchProducts,
    fetchCategories, 
    deleteProduct,
    formatPrice,
    calculateSalePrice
  } = useProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1); // Add this - define the page state variable

  useEffect(() => {
    loadProducts();
    // Fetch categories for filter dropdown
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortDirection]); // Change currentPage to page

  const loadProducts = async () => {
    const params = {
      page: page, // Use page instead of currentPage
      sort: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
      limit: 10
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filterCategory) {
      params.category = filterCategory;
    }

    await fetchProducts(params);
  };

  const loadCategories = async () => {
    const categoryData = await fetchCategories();
    setCategories(categoryData || []);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage); // Use setPage instead of setCurrentPage
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Rest of your component remains the same */}
      {/* Just update the image src to use import.meta.env.VITE_API_URL */}
      {/* Replace: */}
      {/* src={product.featuredImage.startsWith('http') 
              ? product.featuredImage 
              : `${process.env.REACT_APP_API_URL}${product.featuredImage}`} */}
      {/* With: */}
      {/* src={product.featuredImage.startsWith('http') 
              ? product.featuredImage 
              : `${import.meta.env.VITE_API_URL || ''}${product.featuredImage}`} */}
      
      {/* Uncomment and fix the image display section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Link 
          to="/app/addproduct" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
          {success}
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortField === 'price' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('countInStock')}
                >
                  <div className="flex items-center">
                    Stock
                    {sortField === 'countInStock' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded overflow-hidden">
                        {product.featuredImage ? (
                          <img 
                            src={product.featuredImage.startsWith('http') 
                              ? product.featuredImage 
                              : `${import.meta.env.VITE_API_URL || ''}${product.featuredImage}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.category && (
                        <div className="text-xs text-gray-500">{product.category.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.isOnSale ? (
                        <div>
                          <div className="text-sm line-through text-gray-500">{formatPrice(product.price)}</div>
                          <div className="text-sm font-medium text-red-600">
                            {formatPrice(calculateSalePrice(product.price, product.discountPercentage))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.countInStock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.countInStock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.countInStock > 0 ? product.countInStock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : product.status === 'draft' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/product/${product.slug}`} 
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FaEye size={18} />
                        </Link>
                        <Link 
                          to={`/app/editproduct/${product._id}`} 
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(page * 10, totalProducts)}
              </span>{' '}
              of <span className="font-medium">{totalProducts}</span> products
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => changePage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;